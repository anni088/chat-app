import { useEffect, useState } from 'react';
import { socket } from '../socket';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import UserList from './UserList';

export default function ChatRoom({ username, room }) {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [typingUser, setTypingUser] = useState(null);

  useEffect(() => {
    function onHistory(history) {
      setMessages(history);
    }
    function onChatMessage(msg) {
      setMessages((prev) => [...prev, msg]);
    }
    function onUserList(list) {
      setUsers(list);
    }
    function onTyping({ username: who, isTyping }) {
      setTypingUser(isTyping ? who : null);
    }

    socket.on('history', onHistory);
    socket.on('chat-message', onChatMessage);
    socket.on('user-list', onUserList);
    socket.on('typing', onTyping);

    return () => {
      socket.off('history', onHistory);
      socket.off('chat-message', onChatMessage);
      socket.off('user-list', onUserList);
      socket.off('typing', onTyping);
    };
  }, []);

  return (
    <div className="chat-room">
      <UserList users={users} />
      <div className="chat-main">
        <h2># {room}</h2>
        <MessageList messages={messages} currentUser={username} />
        {typingUser && <div className="typing-indicator">{typingUser} is typing...</div>}
        <MessageInput />
      </div>
    </div>
  );
}