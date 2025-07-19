import React, { useState } from 'react';
import { BarChart2, LoaderCircle } from 'lucide-react';
import { useAuth } from './AuthContext';

const SignupPage = ({ onSwitchToLogin }) => {
    const [name, setName] = useState('');
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
            
            const response = await fetch(`${API_BASE_URL}/api/users/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    password
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Registration successful
                console.log('Registration successful:', data);
                
                // The backend returns: { token, name, email, avatar, id }
                // Log the user in automatically after successful registration
                login({
                    name: data.name,
                    email: data.email,
                    avatar: data.avatar,
                    id: data.id
                }, data.token);
                
                // User is now logged in and will be redirected by your app
                
            } else {
                // Registration failed
                setError(data.message || 'Registration failed. Please try again.');
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
                    <p className="text-gray-500">Create your account to start learning.</p>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-lg">
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input 
                                id="name" 
                                type="text" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                required 
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" 
                                placeholder="Alex Doe" 
                            />
                        </div>
                        <div>
                            <label htmlFor="email-signup" className="block text-sm font-medium text-gray-700">Email Address</label>
                            <input 
                                id="email-signup" 
                                type="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" 
                                placeholder="you@example.com" 
                            />
                        </div>
                        <div>
                            <label htmlFor="password-signup" className="block text-sm font-medium text-gray-700">Password</label>
                            <input 
                                id="password-signup" 
                                type="password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" 
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
                                {isLoading ? <LoaderCircle className="animate-spin" /> : 'Create Account'}
                            </button>
                        </div>
                    </div>
                </div>
                <p className="mt-6 text-center text-sm text-gray-500">
                    Already have an account?{' '}
                    <button 
                        onClick={onSwitchToLogin} 
                        className="font-medium text-orange-600 hover:text-orange-500"
                    >
                        Log in
                    </button>
                </p>
            </div>
        </div>
    );
};

export default SignupPage;