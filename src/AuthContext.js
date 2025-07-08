import React, { createContext, useState, useContext } from 'react';

// Create the context
const AuthContext = createContext(null);

// Create the provider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Could be an object with user details
    const [token, setToken] = useState(null); // The JWT

    // In a real app, you'd check localStorage or cookies here to see if the user is already logged in.

    const login = (userData, authToken) => {
        setUser(userData);
        setToken(authToken);
        // In a real app, you'd store the token in localStorage/sessionStorage or a cookie
        // localStorage.setItem('authToken', authToken);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        // localStorage.removeItem('authToken');
    };

    const isAuthenticated = !!token;

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the auth context easily in other components
export const useAuth = () => {
    return useContext(AuthContext);
};
