import React, { useState } from 'react';
import { BarChart2, LoaderCircle } from 'lucide-react';
import { useAuth } from './AuthContext';

const LoginPage = ({ onSwitchToSignup }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // Replace with your actual backend URL
            const API_BASE_URL = process.env.REACT_APP_API_URL;
            
            const response = await fetch(`${API_BASE_URL}/api/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Login successful
                console.log('Login successful:', data);
                
                // The backend returns: { token, name, email, avatar, id }
                // Log the user in with the returned data
                login({
                    name: data.name,
                    email: data.email,
                    avatar: data.avatar,
                    id: data.id
                }, data.token);
                
                // User is now logged in and will be redirected by your app
                
            } else {
                // Login failed
                setError(data.message || 'Login failed. Please try again.');
            }
        } catch (error) {
            console.error('Network error:', error);
            setError('Network error. Please check your connection and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                        <BarChart2 className="h-10 w-10 text-orange-600"/>
                        <h1 className="text-4xl font-bold text-gray-800">MathLeap</h1>
                    </div>
                    <p className="text-gray-500">Welcome back! Please log in to your account.</p>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-lg">
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                                placeholder="you@example.com"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                                placeholder="••••••••"
                            />
                        </div>

                        {error && <p className="text-sm text-red-600">{error}</p>}

                        <div>
                            <button
                                type="submit"
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
                            >
                                {isLoading ? <LoaderCircle className="animate-spin" /> : 'Log In'}
                            </button>
                        </div>
                    </div>
                </div>
                <p className="mt-6 text-center text-sm text-gray-500">
                    Don't have an account?{' '}
                    <button onClick={onSwitchToSignup} className="font-medium text-orange-600 hover:text-orange-500">
                        Sign up
                    </button>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;