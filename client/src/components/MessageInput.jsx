import { useState, useRef } from 'react';
import { socket } from '../socket';

export default function MessageInput() {
  const [text, setText] = useState('');
  const typingTimeout = useRef(null);

  const handleChange = (e) => {
    setText(e.target.value);
    socket.emit('typing', true);

    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit('typing', false);
    }, 1000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    socket.emit('chat-message', text.trim());
    setText('');
    socket.emit('typing', false);
  };

  return (
    <form onSubmit={handleSubmit} className="message-input">
      <input
        type="text"
        value={text}
        onChange={handleChange}
        placeholder="Type a message..."
        maxLength={1000}
      />
      <button type="submit">Send</button>
    </form>
  );
}