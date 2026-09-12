const express = require("express");
const http = require('http');
const cors = require('cors');
const connectDB = require('./config/db');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const { log } = require("console");
const User = require("./models/User");
const Message = require("./models/Message");

require('dotenv').config();

const app = express();

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);

const allowedOrigins = [
  'http://localhost:5173',
  process.env.CLIENT_URL,
];
const io = new Server(server, {
    cors: {
            origin: allowedOrigins,
            methods: ['GET', 'POST'],
        },
});

const PORT = process.env.PORT;

io.on('connection', (socket) => {
    console.log('User connected: ', socket.id);

    socket.on('join', async ({ username, room = 'general'}) => {
        try {
            username = username.trim().slice(0, 24);
            socket.data.username = username;
            socket.data.room = room;

            socket.join(room);

            // Upsert user as online
            await User.findOneAndUpdate(
                { username },
                { username, socketId: socket.id, isOnline: true },
                { upsert: true } //if user exist update it, if not create it
            );

            const history  = await Message.find({ room })
            .sort({ createdAt: 1 }) //sort : oldest to newest
            .limit(50);
            socket.emit('history', history);

            //Broadcast updated online users list
            const onlineUsers = await User.find({ isOnline: true }).select('username');
            io.to(room).emit('user-list', onlineUsers.map(u => u.username));

            socket.to(room).emit('user-joined', { username });
        } catch (error) {
            console.error('Join error: ', error);
        }
    });

    socket.on('chat-message', async (text) => {
        try {
            const { username, room } = socket.data;
            if(!username || !room) return;
            text = text.trim().slice(0, 1000);
            if(!text) return;
            
            const message = await Message.create({ room, username, text });
            io.to(room).emit('chat-message', message);
        } catch (error) {
            console.error('Message Error', error);
        }
    });

    socket.on('typing', (isTyping) => {
        const { username, room } = socket.data;
        if( !username || !room) return;

        socket.to(room).emit('typing', { username, isTyping: !!isTyping });
    });
    
    socket.on('disconnect', async () => {
        try {
            const { username, room } = socket.data;
            if(!username) return;

            await User.findOneAndUpdate({ username, socketId: socket.id }, { isOnline: false, socketId: null });

            if(room) {
                const onlineUsers = await User.find({ isOnline: true }).select('username');
                io.to(room).emit('user-list', onlineUsers.map(u => u.username));
                socket.to(room).emit('user-list', {username });
            }
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