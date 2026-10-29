const express = require('express');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');
const User = require('../models/User');
const { signToken, requireAuth } = require('../middleware/auth');

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,                       // 10 *failed* attempts per IP
  skipSuccessfulRequests: true,  // successful logins don't count
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many failed attempts, try again in a few minutes' },
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,                       // 10 signups per IP per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many accounts created, try again later' },
});

const publicUser = (u) => ({ id: u._id, username: u.username, role: u.role });

router.post('/register', registerLimiter, async (req, res) => {
    try {
        const { username, password } = req.body;

        if(typeof username !== 'string' || typeof password !== 'string') {
            return res.status(400).json({ error: 'Username and password required'});
        }
        if(!/^[a-zA-Z0-9_]{3,24}$/.test(username.trim())) {
            return res.status(400).json({ error: 'Username must be 3-24 chars: letters, numbers, underscore' });
        }
        if(password.length < 8 || password.length > 72) {
            return res.status(400).json({ error: 'Password must be 8-72 characters' });
        }

        const hash = await bcrypt.hash(password, 12);
        const user = await User.create({ username: username.trim(), password: hash });

        res.status(201).json({ token: signToken(user), user: publicUser(user) });

      } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    });

    router.post('/login', loginLimiter, async (req, res) => {
        try {
            const { username, password } = req.body;
            if(typeof username !== 'string' || typeof password !== 'string') {
              return res.status(400).json({ error: 'Username and password required'});
            }

            const user = await User.findOne({ username: username.trim() }).select('+password');
            const ok = user && (await bcrypt.compare(password, user.password));
            if(!ok) return res.status(401).json({ error: 'Invalid username or password' });

            res.json({ token:signToken(user), user: publicUser(user) });
            
        } catch (err) {
            console.error('Login error:', err);
            res.status(500).json({ error: 'Server error' });
        }
    });


    // Lets the client validate a stored token on page load
    router.get('/me', requireAuth, async (req, res) => {
        const user = await User.findById(req.user.id);
        if(!user) return res.status(401).json({ error: "User no longer exist" });
        res.json({ user: publicUser(user) });
    });

    module.exports = router;