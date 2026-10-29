import { useState } from 'react';
import './App.css';
import { AuthProvider, useAuth } from './AuthContext';
import JoinForm from './components/JoinForm';
import ChatRoom from './components/ChatRoom';
import Login from './components/Login';

function Main() {
  const { user, loading } = useAuth();
  const [room, setRoom] = useState(null);

  if (loading) return <div className="app">Loading...</div>;
  if (!user) return <div className="app"><Login /></div>;

  return (
    <div className="app">
      {room
        ? <ChatRoom room={room} onLeave={() => setRoom(null)} />
        : <JoinForm onJoin={setRoom} />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Main />
    </AuthProvider>
  );
}