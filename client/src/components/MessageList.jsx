import { useEffect, useRef } from "react";

export default function MessageList({ messages, currentUser, onDelete }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
     <div className="message-list">
      {messages.map((msg) => {
        const own = msg.username === currentUser.username;
        const canDelete = own || currentUser.role === 'admin';
        return (
          <div key={msg._id} className={`message ${own ? 'own' : ''}`}>
            <span className="msg-user">{msg.username}</span>
            <span className="msg-text">{msg.text}</span>
            <span className="msg-time">
              {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            {canDelete && (
              <button className="delete-btn" onClick={() => onDelete(msg._id)} title="Delete">✕</button>
            )}
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
