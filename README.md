# 💬 Real-Time Chat Application

A real-time chat application built using the MERN stack technologies and Socket.IO. It allows users to communicate instantly through a responsive interface with real-time message delivery and online user status.

## 🚀 Features

* 🔐 User authentication
* 💬 Real-time messaging using Socket.IO
* 👥 Online user status
* ⌨️ Typing indicators
* 📨 Message storage using MongoDB
* ⚡ Real-time communication between connected users
* ⚛️ Responsive React frontend
* 🔌 Client-server communication using REST APIs and WebSockets

## 🛠️ Tech Stack

**Frontend**

* React.js
* Vite
* CSS

**Backend**

* Node.js
* Express.js
* Socket.IO

**Database**

* MongoDB
* Mongoose

**Tools**

* Git
* GitHub
* VS Code
* Postman

## 📁 Project Structure

```text
chat-app/
├── client/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/
│   ├── models/
│   ├── routes/
│   ├── index.js
│   └── package.json
│
└── README.md
```

> Note: Update the project structure above to match your actual folders and files.

## ⚙️ Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/anni088/chat-app.git
cd chat-app
```

### 2. Install backend dependencies

Open a terminal:

```bash
cd server
npm install
```

### 3. Configure environment variables

Create a `.env` file inside the `server` directory.

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
```

Replace the example values with your actual configuration.

**Important:** Never commit your `.env` file or expose your database credentials and JWT secret.

### 4. Start the backend server

From the `server` directory, run:

```bash
npm run dev
```

If your project does not have a `dev` script, use:

```bash
node index.js
```

### 5. Install frontend dependencies

Open another terminal:

```bash
cd client
npm install
```

### 6. Start the frontend

```bash
npm run dev
```

Open the local URL displayed in your terminal, usually:

```text
http://localhost:5173
```

## 🔄 How It Works

1. Users authenticate with the application.
2. The React frontend communicates with the Express backend.
3. The backend handles authentication and database operations.
4. Socket.IO establishes a real-time connection between clients and the server.
5. Messages and relevant chat events are delivered to connected users.
6. MongoDB stores user and message data.

## 🔮 Future Improvements

* Group chat functionality
* Message read receipts
* Image and file sharing
* Message search
* Notifications for new messages
* Improved mobile responsiveness

## 🌐 Live Demo
Try the application: https://chat-app-ten-rho-55.vercel.app/

## 📂 GitHub Repository
Source code: https://github.com/anni088/chat-app

GitHub: [@anni088](https://github.com/anni088)

---

⭐ If you find this project useful, consider giving it a star!
