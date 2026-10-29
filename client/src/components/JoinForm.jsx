import { useState } from 'react';
import { useAuth } from '../AuthContext';

export default function JoinForm({ onJoin }) {
    const { user, logout } = useAuth();
    const [room, setRoom] = useState('general');

    const handleSubmit = (e) => {
        e.preventDefault();
        onJoin(room.trim() || 'general');
    };

    return (
        <form onSubmit={handleSubmit} className='join-form'>
            <h2>Hi, {user.username}</h2>
            <input
                type="text"
                placeholder="Room (default: general)"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                maxLength={32}
            />
            <button type="submit">Join Room</button>
            <button type="button" className="link-btn" onClick={logout}>Log out</button>
        </form>
    )
}