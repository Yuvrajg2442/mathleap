import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the context
const AuthContext = createContext(null);

// Create the provider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check for existing auth data on app load
    useEffect(() => {
        const savedToken = localStorage.getItem('authToken');
        const savedUser = localStorage.getItem('userData');
        
        if (savedToken && savedUser) {
            try {
                const parsedUser = JSON.parse(savedUser);
                setToken(savedToken);
                setUser(parsedUser);
            } catch (error) {
                console.error('Error parsing saved user data:', error);
                // Clear corrupted data
                localStorage.removeItem('authToken');
                localStorage.removeItem('userData');
            }
        }
        setIsLoading(false);
    }, []);

    const login = (userData, authToken) => {
        console.log('Logging in user:', userData);
        
        // Update state
        setUser(userData);
        setToken(authToken);
        
        // Store in localStorage for persistence
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('userData', JSON.stringify(userData));
    };

    const logout = () => {
        console.log('Logging out user');
        
        // Clear state
        setUser(null);
        setToken(null);
        
        // Clear localStorage
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
    };

    const isAuthenticated = !!token && !!user;

    // Function to get headers for API calls
    const getAuthHeaders = () => {
        return {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        };
    };

    const value = {
        user,
        token,
        isAuthenticated,
        isLoading,
        login,
        logout,
        getAuthHeaders
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the auth context easily in other components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};