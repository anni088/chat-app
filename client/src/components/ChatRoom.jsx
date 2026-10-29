import { useEffect, useState } from 'react';
import { socket } from '../socket';
import { useAuth } from '../AuthContext';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import UserList from './UserList';

export default function ChatRoom({ room, onLeave }) {
  const { user, logout } = useAuth();
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [typingUser, setTypingUser] = useState(null);
  const [connError, setConnError] = useState('');

  useEffect(() => {
    const join = () => {
      setConnError('');
      socket.emit('join', { room });
    };
    const onHistory = (history) => setMessages(history);
    const onChatMessage = (msg) => setMessages((prev) => [...prev, msg]);
    const onDeleted = (id) => setMessages((prev) => prev.filter((m) => m._id !== id));
    const onUserList = (list) => setUsers(list);
    const onTyping = ({ username, isTyping }) => setTypingUser(isTyping ? username : null);
    const onConnectError = (err) => {
      if (/token|authentication/i.test(err.message)) logout(); // expired/invalid token
      else setConnError('Connection problem, retrying...');
    };

    socket.on('connect', join);
    socket.on('connect_error', onConnectError);
    socket.on('history', onHistory);
    socket.on('chat-message', onChatMessage);
    socket.on('message-deleted', onDeleted);
    socket.on('user-list', onUserList);
    socket.on('typing', onTyping);

    if (socket.connected) {
      join();
    } else {
      socket.auth = { token: localStorage.getItem('token') };
      socket.connect();
    }

    return () => {
      socket.off('connect', join);
      socket.off('connect_error', onConnectError);
      socket.off('history', onHistory);
      socket.off('chat-message', onChatMessage);
      socket.off('message-deleted', onDeleted);
      socket.off('user-list', onUserList);
      socket.off('typing', onTyping);
    };
  }, [room, logout]);

  const handleLeave = () => {
    socket.disconnect();
    onLeave();
  };

  return (
    <div className="chat-room">
      <UserList users={users} />
      <div className="chat-main">
        <div className="chat-header">
          <h2># {room}</h2>
          <div className="chat-actions">
            <span>{user.username}{user.role === 'admin' && ' (admin)'}</span>
            <button onClick={handleLeave}>Leave</button>
            <button onClick={logout}>Log out</button>
          </div>
        </div>
        {connError && <div className="form-error">{connError}</div>}
        <MessageList
          messages={messages}
          currentUser={user}
          onDelete={(id) => socket.emit('delete-message', id)}
        />
        {typingUser && <div className="typing-indicator">{typingUser} is typing...</div>}
        <MessageInput />
      </div>
    </div>
  );
}