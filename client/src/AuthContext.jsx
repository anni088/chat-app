import { createContext, useContext, useEffect, useState } from "react";
import { api } from "./api";
import { socket } from "./socket";


const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // On load, validate any stored token
    useEffect(() => {
        if(!localStorage.getItem('token')) {
            setLoading(false);
            return;
        }

        api('/api/auth/me')
        .then(({user}) => setUser(user))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false));
    }, []);   

    const authenticates = async (path, username, password) => {
        const data = await api(`/api/auth/${path}`, { method: 'POST', body: { username, password } });
        localStorage.setItem('token', data.token);
        setUser(data.user);
    };

    const login = (u, p) => authenticates('login', u, p);
    const register = (u, p) => authenticates('register', u, p);

    const logout = () => {
        socket.disconnect();
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );

}