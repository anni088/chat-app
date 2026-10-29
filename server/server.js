const express = require("express");
const http = require('http');
const cors = require('cors');
const connectDB = require('./config/db');
const { Server } = require('socket.io');
const User = require("./models/User");
const Message = require("./models/Message");
const authRoutes = require('./routes/auth');
const { verifyToken } = require("./middleware/auth");

require('dotenv').config();

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is not set');
  process.exit(1);
}


const app = express();
app.set('trust proxy', 1);

const allowedOrigins = [
  'http://localhost:5173',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth', authRoutes);

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
            origin: allowedOrigins,
            methods: ['GET', 'POST'],
        },
});

const PORT = process.env.PORT;

// --- Socket authentication: runs before any connection is accepted ---
io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if(!token) return next(new Error('Authentication required'));

    try {
        const { id, username, role } = verifyToken(token);
        socket.data.user = { id, username, role };
        next(); 
    } catch (err) {
        next(new Error('Invalid or Expired token'));
    }
});

async function emitUserList(room) {
    const sockets = await io.in(room).fetchSockets();
    const names = [...new Set(sockets.map((s) => s.data.user.username))];
    io.to(room).emit('user-list', names);
}

io.on('connection', (socket) => {
    const { username, role } = socket.data.user;
    console.log('User connected: ', username, socket.id);

    socket.on('join', async ({ room } = {}) => {
        try {
            room = String(room || 'general').trim().slice(0, 32) || 'general';

            const prev = socket.data.room;
            if(prev && prev !== room) {
                socket.leave(prev);
                socket.io(prev).emit('user-left', { username });
                await emitUserList(prev);
            }

            socket.data.room = room;
            socket.join(room);

            const history  = await Message.find({ room })
            .sort({ createdAt: 1 }) //sort : oldest to newest
            .limit(50);
            socket.emit('history', history);

            await emitUserList(room);
            socket.to(room).emit('user-joined', { username });
        } catch (error) {
            console.error('Join error: ', error);
        }
    });

    socket.on('chat-message', async (text) => {
        try {
    console.log(socket.data);

            const { room } = socket.data;
            if(!room || typeof text !== 'string') return;

    console.log("msgInput handle submit2");

            text = text.trim().slice(0, 1000);
            if(!text) return;
            
            const message = await Message.create({ room, username, text });
            io.to(room).emit('chat-message', message);
        } catch (error) {
            console.error('Message Error', error);
        }
    });

    // AUTHORIZATION: owner or admin only
    socket.on('delete-message', async (messageId) => {
        try {
            const msg = await Message.findById(messageId);
            if(!msg) return;
            if(msg.username !== username && role !== 'admin') return;

            await msg.deleteOne();
            io.to(msg.room).emit('message-deleted', String(msg.id));
        } catch (err) {
            console.error('Delete error:', err);
        }
    });

    socket.on('typing', (isTyping) => {
        const { room } = socket.data;
        if(!room) return;

        socket.to(room).emit('typing', { username, isTyping: !!isTyping });
    });
    
    socket.on('disconnect', async () => {
        try {
            const { room } = socket.data;
            if(!room) return;

            socket.to(room).emit('user-list', { username });
            await emitUserList(room);

            console.log('User disconnected: ', socket.id);
        } catch (error) {
            console.error('Disconnet Error: ', error);
        }
    });
    
});

const startServer = async () => {
    try {
        await connectDB();

        server.listen(PORT, ()=>{
        console.log(`Server is running on port ${PORT}`);
    });
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

startServer();