import { useState } from 'react';

export default function JoinForm({ onJoin }) {
    const [username, setUsername] = useState('');
    const [room, setRoom] = useState('general');

    const handleSubmit = (e) => {
        e.preventDefault();
        if(!username.trim()) return;
        onJoin({ username: username.trim(), room: room.trim() || 'general' });
    };

    return (
        <form onSubmit={handleSubmit} className='join-form'>
            <h2>Join Chat</h2>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                maxLength={24}
                required
            />
            <input
                type="text"
                placeholder="Room (default: general)"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                maxLength={32}
            />
            <button type="submit">Join</button>
        </form>
    )
}