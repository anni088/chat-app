import { useState } from 'react';
import { socket } from './socket';
import JoinForm from './components/JoinForm';
import ChatRoom from './components/ChatRoom';

import './App.css';

export default function App() {
  const [joined, setJoined] = useState(false);
  const [identity, setIdentity] = useState({ username: '', room: '' });

  const handleJoin = ({ username, room }) => {
    socket.connect();
    socket.emit('join', { username, room });
    setIdentity({ username, room });
    setJoined(true);
  };

  return (
    <div className="app">
      {joined ? (
        <ChatRoom username={identity.username} room={identity.room} />
      ) : (
        <JoinForm onJoin={handleJoin} />
      )}
    </div>
  );
}