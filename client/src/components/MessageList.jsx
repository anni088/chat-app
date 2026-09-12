import { useEffect, useRef } from "react";

export default function MessageList({ messages, currentUser }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="message-list">
      {messages.map((msg) => (
        <div
          key={msg._id || msg.tempId}
          className={`message ${msg.username === currentUser ? "own" : ""}`}
        >
          {
            msg.username === currentUser ? '' : <span className="msg-user">{msg.username}</span>
          }
          <span className="msg-text">{msg.text}</span>
          <span className="msg-time">
            {new Date(msg.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
