import React, { useState, useEffect, useRef, createContext, useContext, useCallback } from 'react';
import { Home, BookOpen, Video, CheckSquare, Award, Menu, X, Bell, ChevronDown, Clock, Target, TrendingUp, Star, MessageSquare, Users, Book, BarChart2, Sparkles, LoaderCircle, Send, BrainCircuit, ListTodo, RefreshCw, LogOut } from 'lucide-react';

// --- 1. API CONFIGURATION ---
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000/api';

const apiRequest = async (endpoint, options = {}) => {
    const token = localStorage.getItem('authToken');
    console.log(`🌐 API Request to ${endpoint}`, { method: options.method || 'GET' });
    
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        },
        ...options,
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        const data = await response.json();
        
        if (!response.ok) {
            console.error('❌ API Error:', data);
            throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
        }
        
        console.log(`✅ API Response from ${endpoint}:`, data);
        return data;
    } catch (error) {
        console.error(`❌ API Request failed for ${endpoint}:`, error);
        throw error;
    }
};

// --- 2. AUTHENTICATION CONTEXT ---
const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('authToken'));
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const savedToken = localStorage.getItem('authToken');
            if (savedToken) {
                try {
                    const userData = await apiRequest('/auth/me');
                    setUser(userData);
                    setToken(savedToken);
                } catch (error) {
                    console.error('Auth check failed:', error);
                    localStorage.removeItem('authToken');
                    setToken(null);
                    setUser(null);
                }
            }
            setIsLoading(false);
        };
        checkAuth();
    }, []);

    const login = useCallback((userData, authToken) => {
        //console.log('🔑 Login attempt:', { name: userData.name, email: userData.email });
        setUser(userData);
        setToken(authToken);
        localStorage.setItem('authToken', authToken);
        console.log('✅ Login successful');
    }, []);

    const logout = useCallback(() => {
        console.log('👋 Logging out user:', user?.name);
        setUser(null);
        setToken(null);
        localStorage.removeItem('authToken');
        console.log('✅ Logout successful');
    }, [user]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoaderCircle className="h-8 w-8 animate-spin text-orange-600" />
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

const useAuth = () => useContext(AuthContext);

// --- 3. REAL LOGIN & SIGNUP PAGES ---

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
        console.log('🔑 Attempting login for:', email);

        try {
            const response = await apiRequest('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            });

            const { user, token } = response;
            //console.log('✅ Login API response successful:');
            login(user, token);
        } catch (error) {
            console.error('❌ Login error:', error);
            setError(error.message || 'Login failed. Please check your credentials.');
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
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email Address
                            </label>
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
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
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
                                disabled={isLoading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
                            >
                                {isLoading ? <LoaderCircle className="animate-spin" /> : 'Log In'}
                            </button>
                        </div>
                    </form>
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

const SignupPage = ({ onSwitchToLogin }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        console.log('📝 Attempting registration for:', formData.email);

        if (formData.password !== formData.confirmPassword) {
            console.log('❌ Password mismatch');
            setError('Passwords do not match');
            setIsLoading(false);
            return;
        }

        try {
            const response = await apiRequest('/auth/register', {
                method: 'POST',
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const { user, token } = response;
            //console.log('✅ Registration successful:', { name: user.name, email: user.email });
            login(user, token);
        } catch (error) {
            console.error('❌ Registration error:', error);
            setError(error.message || 'Registration failed. Please try again.');
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
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Full Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                                placeholder="Alex Doe"
                            />
                        </div>
                        <div>
                            <label htmlFor="email-signup" className="block text-sm font-medium text-gray-700">
                                Email Address
                            </label>
                            <input
                                id="email-signup"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                                placeholder="you@example.com"
                            />
                        </div>
                        <div>
                            <label htmlFor="password-signup" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                id="password-signup"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                                placeholder="••••••••"
                            />
                        </div>
                        <div>
                            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                                Confirm Password
                            </label>
                            <input
                                id="confirm-password"
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                                placeholder="••••••••"
                            />
                        </div>
                        {error && <p className="text-sm text-red-600">{error}</p>}
                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
                            >
                                {isLoading ? <LoaderCircle className="animate-spin" /> : 'Create Account'}
                            </button>
                        </div>
                    </form>
                </div>
                <p className="mt-6 text-center text-sm text-gray-500">
                    Already have an account?{' '}
                    <button onClick={onSwitchToLogin} className="font-medium text-orange-600 hover:text-orange-500">
                        Log in
                    </button>
                </p>
            </div>
        </div>
    );
};

// --- MOCK DATA (will be replaced by API calls) ---
const nextTask = { type: 'Live Class', title: 'Algebra II: Quadratic Equations', time: '11:00 AM', teacher: 'Ms. Davis' };
const upcomingTasksData = [{ id: 1, title: 'Geometry Worksheet 3', subject: 'Geometry', type: 'Worksheet', dueDate: 'Today', breakable: false }, { id: 2, title: 'Calculus Quiz 1', subject: 'Calculus', type: 'Quiz', dueDate: 'Tomorrow', breakable: false }, { id: 3, title: 'Trigonometry Final Project', subject: 'Trigonometry', type: 'Project', dueDate: '3 days', breakable: true }];
const progress = { completion: 65, courses: [{ name: 'Algebra II', value: 80 }, { name: 'Geometry', value: 60 }, { name: 'Calculus', value: 45 }] };
const achievements = [{ id: 1, name: 'Algebra Ace', icon: Star, color: 'text-yellow-500' }, { id: 2, name: 'Geometry Genius', icon: Award, color: 'text-blue-500' }, { id: 3, name: 'Perfect Score', icon: Target, color: 'text-green-500' }, { id: 4, name: '5-Day Streak', icon: TrendingUp, color: 'text-orange-500' }];
const worksheet = { title: 'Geometry Worksheet 3', questions: [{ id: 1, text: 'What is the sum of the angles in a triangle?', type: 'mcq', options: ['90°', '180°', '270°', '360°'], answer: '180°', concept: 'Triangle Angle Sum Theorem' }, { id: 2, text: 'Calculate the area of a circle with a radius of 5 units. (Use π ≈ 3.14)', type: 'input', answer: '78.5', concept: 'Area of a Circle' }, { id: 3, text: 'If two lines are parallel, what can be said about their slopes?', type: 'text', answer: 'They are equal', concept: 'Slopes of Parallel Lines' }] };

// --- HELPER & UI COMPONENTS ---
const Modal = ({ isOpen, onClose, title, icon: Icon, children }) => { if (!isOpen) return null; return (<div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}><div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all scale-95 hover:scale-100" onClick={e => e.stopPropagation()}><div className="flex justify-between items-center p-4 border-b"><h3 className="text-xl font-bold text-gray-800 flex items-center gap-3">{Icon && <Icon className="h-6 w-6 text-orange-500" />}{title}</h3><button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100"><X className="h-6 w-6 text-gray-600" /></button></div><div className="p-6 max-h-[70vh] overflow-y-auto">{children}</div></div></div>); };
const DonutChart = ({ percentage, size = 120 }) => { const strokeWidth = 10; const radius = (size - strokeWidth) / 2; const circumference = 2 * Math.PI * radius; const offset = circumference - (percentage / 100) * circumference; return (<div className="relative flex items-center justify-center" style={{ width: size, height: size }}><svg width={size} height={size} className="transform -rotate-90"><circle cx={size / 2} cy={size / 2} r={radius} strokeWidth={strokeWidth} className="text-gray-200" fill="transparent" stroke="currentColor" /><circle cx={size / 2} cy={size / 2} r={radius} strokeWidth={strokeWidth} className="text-orange-500" fill="transparent" stroke="currentColor" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" /></svg><span className="absolute text-2xl font-bold text-gray-700">{percentage}%</span></div>); };

// --- MAIN APP PAGES ---
const Dashboard = () => {
    const { user } = useAuth();
    const [isPlanModalOpen, setPlanModalOpen] = useState(false);
    const [studyPlan, setStudyPlan] = useState('');
    const [isLoadingPlan, setIsLoadingPlan] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [isLoadingTasks, setIsLoadingTasks] = useState(true);

    useEffect(() => {
        setIsLoadingTasks(true);
        setTimeout(() => { setTasks(upcomingTasksData); setIsLoadingTasks(false); }, 1500);
    }, []);

    const generateStudyPlan = async () => { setIsLoadingPlan(true); setStudyPlan(''); setPlanModalOpen(true); const prompt = `I am a student using an e-learning platform for math. Please act as an encouraging study coach. Based on my current situation, create a personalized 1-hour study plan for me. Be positive and break the plan into actionable chunks with time estimates. My upcoming tasks are:\n${tasks.map(t => `- ${t.title} (Subject: ${t.subject}, Due: ${t.dueDate})`).join('\n')}\n\nMy current progress in my courses is:\n${progress.courses.map(c => `- ${c.name}: ${c.value}%`).join('\n')}\n\nGenerate the study plan now.`; try { let chatHistory = [{ role: "user", parts: [{ text: prompt }] }]; const payload = { contents: chatHistory }; const apiKey = ""; const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`; const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }); if (!response.ok) { throw new Error(`API call failed with status: ${response.status}`); } const result = await response.json(); if (result.candidates && result.candidates.length > 0 && result.candidates[0].content.parts.length > 0) { setStudyPlan(result.candidates[0].content.parts[0].text); } else { throw new Error("No content received from API."); } } catch (error) { console.error("Error generating study plan:", error); setStudyPlan("Sorry, I couldn't create a plan right now. Please check your connection and try again."); } finally { setIsLoadingPlan(false); } };
    
    return (<><div className="space-y-6"><div className="bg-white p-6 rounded-xl shadow-sm"><div className="flex flex-col sm:flex-row justify-between items-start sm:items-center"><div><h1 className="text-2xl md:text-3xl font-bold text-gray-800">Welcome back, {user.name}! 👋</h1><p className="text-gray-500 mt-1">Ready to solve some problems today?</p></div><button onClick={generateStudyPlan} disabled={isLoadingPlan || isLoadingTasks} className="mt-4 sm:mt-0 flex items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold py-3 px-5 rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">{isLoadingPlan ? (<><LoaderCircle className="animate-spin h-5 w-5 mr-2" /><span>Creating Plan...</span></>) : (<><Sparkles className="h-5 w-5 mr-2" /><span>✨ Plan My Study Session</span></>)}</button></div></div><div className="grid grid-cols-1 lg:grid-cols-3 gap-6"><div className="lg:col-span-2 space-y-6"><div className="bg-orange-500 text-white p-6 rounded-xl shadow-lg"><div className="flex justify-between items-start"><div><p className="text-sm font-semibold uppercase tracking-wider text-orange-200">What's Next</p><h2 className="text-xl font-bold mt-1">{nextTask.title}</h2><p className="text-orange-100 mt-1 flex items-center"><Clock className="h-4 w-4 mr-2" />{nextTask.time} with {nextTask.teacher}</p></div><div className="bg-white/20 p-3 rounded-full"><Video className="h-6 w-6" /></div></div><button className="mt-4 w-full md:w-auto bg-white text-orange-600 font-bold py-3 px-6 rounded-lg hover:bg-orange-50 transition-transform transform hover:scale-105">Join Live Class</button></div><div><h3 className="text-xl font-bold text-gray-800 mb-4">Upcoming Tasks</h3>{isLoadingTasks ? (<div className="space-y-3">{[...Array(3)].map((_, i) => (<div key={i} className="bg-white p-4 rounded-xl shadow-sm animate-pulse"><div className="flex items-center justify-between"><div className="flex items-center space-x-4"><div className="p-3 rounded-full bg-gray-200 h-12 w-12"></div><div><div className="h-4 bg-gray-200 rounded w-48 mb-2"></div><div className="h-3 bg-gray-200 rounded w-32"></div></div></div><div className="h-4 bg-gray-200 rounded w-24"></div></div></div>))}</div>) : (<div className="space-y-3">{tasks.map(task => (<div key={task.id} className="bg-white p-4 rounded-xl shadow-sm flex items-center justify-between hover:shadow-md transition-shadow"><div className="flex items-center space-x-4"><div className="p-3 rounded-full bg-gray-100">{task.type === 'Worksheet' && <BookOpen className="h-5 w-5 text-gray-600" />}{task.type === 'Quiz' && <CheckSquare className="h-5 w-5 text-gray-600" />}{task.type === 'Project' && <Book className="h-5 w-5 text-gray-600" />}</div><div><p className="font-semibold text-gray-800">{task.title}</p><p className="text-sm text-gray-500">{task.subject}</p></div></div><div className="text-right"><p className="text-sm font-semibold text-gray-700">Due: {task.dueDate}</p><button onClick={() => {/* handle start task */}} className="text-sm font-bold text-orange-600 hover:underline">Start Now</button></div></div>))}</div>)}</div></div><div className="space-y-6"><div className="bg-white p-6 rounded-xl shadow-sm"><h3 className="text-xl font-bold text-gray-800 mb-4">My Progress</h3><div className="flex flex-col items-center"><DonutChart percentage={progress.completion} /><p className="mt-3 font-semibold text-gray-600">Overall Completion</p></div><div className="mt-4 space-y-2">{progress.courses.map(course => (<div key={course.name}><div className="flex justify-between text-sm font-medium text-gray-600"><span>{course.name}</span><span>{course.value}%</span></div><div className="w-full bg-gray-200 rounded-full h-2 mt-1"><div className="bg-orange-500 h-2 rounded-full" style={{ width: `${course.value}%` }}></div></div></div>))}</div></div><div className="bg-white p-6 rounded-xl shadow-sm"><h3 className="text-xl font-bold text-gray-800 mb-4">Recent Achievements</h3><div className="grid grid-cols-2 gap-4">{achievements.slice(0, 4).map(ach => (<div key={ach.id} className="flex flex-col items-center text-center p-2 bg-gray-50 rounded-lg"><ach.icon className={`h-8 w-8 ${ach.color}`} /><p className="text-xs font-semibold text-gray-600 mt-1">{ach.name}</p></div>))}</div></div></div></div></div><Modal isOpen={isPlanModalOpen} onClose={() => setPlanModalOpen(false)} title="Your Personalized Study Plan" icon={Sparkles}>{isLoadingPlan ? (<div className="flex flex-col items-center justify-center h-48"><LoaderCircle className="h-12 w-12 animate-spin text-orange-600" /><p className="mt-4 text-gray-600">Generating your plan...</p></div>) : (<div className="text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">{studyPlan}</div>)}</Modal></>);
};
const LiveClass = () => { const { user } = useAuth(); return (<div className="flex flex-col lg:flex-row h-full gap-6"><div className="flex-grow bg-black rounded-xl flex items-center justify-center text-white relative overflow-hidden shadow-lg"><div className="text-center"><Video className="h-16 w-16 mx-auto text-gray-500" /><p className="mt-4 text-xl font-semibold">Live Class Stream</p><p className="text-gray-400">The teacher's video or shared screen will appear here.</p><div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-4 bg-gray-800/50 backdrop-blur-sm p-3 rounded-full"><button className="p-3 bg-orange-600 rounded-full text-white hover:bg-orange-500 transition"><Users className="h-5 w-5"/></button><button className="p-3 bg-white/20 rounded-full text-white hover:bg-white/30 transition"><Star className="h-5 w-5"/></button><button className="p-3 bg-red-600 rounded-full text-white hover:bg-red-500 transition">Leave</button></div></div></div><div className="w-full lg:w-80 xl:w-96 flex-shrink-0 bg-white rounded-xl shadow-sm p-4 flex flex-col"><div className="flex-shrink-0 border-b pb-2 mb-2"><h2 className="text-lg font-bold text-gray-800">{nextTask.title}</h2><p className="text-sm text-gray-500">with {nextTask.teacher}</p></div><div className="flex-grow overflow-y-auto space-y-4 pr-2"><div className="flex items-start space-x-3"><img src={`https://placehold.co/40x40/F5A623/FFFFFF?text=T`} alt="Teacher" className="h-10 w-10 rounded-full" /><div><p className="font-bold text-sm text-yellow-600">Ms. Davis <span className="text-gray-400 font-normal text-xs ml-1">11:02 AM</span></p><div className="bg-gray-100 p-3 rounded-lg mt-1 text-sm text-gray-700">Welcome everyone! Today we're diving into quadratic equations.</div></div></div><div className="flex items-start space-x-3"><img src={`https://placehold.co/40x40/7ED321/FFFFFF?text=S`} alt="Student" className="h-10 w-10 rounded-full" /><div><p className="font-bold text-sm text-green-600">Sarah <span className="text-gray-400 font-normal text-xs ml-1">11:03 AM</span></p><div className="bg-gray-100 p-3 rounded-lg mt-1 text-sm text-gray-700">Excited for this!</div></div></div><div className="flex items-start space-x-3"><img src={user.avatar} alt="User" className="h-10 w-10 rounded-full" /><div><p className="font-bold text-sm text-orange-600">You <span className="text-gray-400 font-normal text-xs ml-1">11:04 AM</span></p><div className="bg-orange-50 p-3 rounded-lg mt-1 text-sm text-orange-800">Good morning!</div></div></div></div><div className="flex-shrink-0 pt-4 mt-auto"><div className="relative"><input type="text" placeholder="Type your message..." className="w-full bg-gray-100 border-transparent rounded-full py-3 pl-4 pr-12 focus:ring-orange-500 focus:border-orange-500" /><button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-orange-600 text-white rounded-full hover:bg-orange-500 transition"><MessageSquare className="h-5 w-5" /></button></div></div></div></div>);};
const Worksheet = () => { const [answers, setAnswers] = useState({}); const [feedback, setFeedback] = useState({}); const [modalContent, setModalContent] = useState({ title: '', content: '', icon: null }); const [isModalOpen, setIsModalOpen] = useState(false); const [isLoading, setIsLoading] = useState(false); const handleAnswerChange = (qId, value) => { setAnswers(prev => ({ ...prev, [qId]: value })); }; const checkAnswer = (q) => { const isCorrect = answers[q.id]?.toLowerCase().trim() === q.answer.toLowerCase().trim(); setFeedback(prev => ({...prev, [q.id]: isCorrect ? 'correct' : 'incorrect'})); }; const callGemini = async (prompt, jsonSchema = null) => { setIsLoading(true); setIsModalOpen(true); try { let chatHistory = [{ role: "user", parts: [{ text: prompt }] }]; const payload = { contents: chatHistory }; if (jsonSchema) { payload.generationConfig = { responseMimeType: "application/json", responseSchema: jsonSchema }; } const apiKey = ""; const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`; const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }); if (!response.ok) throw new Error("API call failed."); const result = await response.json(); return result.candidates[0].content.parts[0].text; } catch (error) { console.error("Error calling Gemini:", error); return "Sorry, I couldn't generate a response right now. Please try again."; } finally { setIsLoading(false); } }; const explainConcept = async (question) => { setModalContent({ title: `Concept: ${question.concept}`, content: '', icon: BrainCircuit }); const prompt = `I am a student working on a math problem. Please explain the concept of "${question.concept}" clearly and concisely. The question is: "${question.text}". Use markdown for formatting.`; const explanation = await callGemini(prompt); setModalContent(prev => ({ ...prev, content: explanation })); }; const generateSimilarProblem = async (question) => { setModalContent({ title: 'Practice Problem', content: '', icon: RefreshCw }); const prompt = `Based on the math question "${question.text}", generate a new, similar problem. Provide the new problem and its answer.`; const schema = { type: "OBJECT", properties: { problem: { type: "STRING" }, answer: { type: "STRING" } }, required: ["problem", "answer"] }; const responseText = await callGemini(prompt, schema); try { const responseJson = JSON.parse(responseText); const content = `**New Problem:**\n${responseJson.problem}\n\n**Answer:**\n${responseJson.answer}`; setModalContent(prev => ({ ...prev, content })); } catch (e) { setModalContent(prev => ({ ...prev, content: "Failed to parse the generated problem. Please try again." })); } }; return (<><div className="space-y-6 max-w-4xl mx-auto"><div className="text-center"><h1 className="text-3xl font-bold text-gray-800">{worksheet.title}</h1><p className="text-gray-500 mt-1">Complete all questions to finish the worksheet.</p></div><div className="bg-white p-6 rounded-xl shadow-sm space-y-8">{worksheet.questions.map((q, index) => (<div key={q.id} className="border-b pb-8 last:border-b-0 last:pb-0"><p className="font-bold text-lg text-gray-800 mb-4">Question {index + 1}: {q.text}</p>{q.type === 'mcq' && (<div className="space-y-3">{q.options.map(option => (<label key={option} className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition ${answers[q.id] === option ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}`}><input type="radio" name={`q-${q.id}`} value={option} onChange={(e) => handleAnswerChange(q.id, e.target.value)} className="h-4 w-4 text-orange-600 focus:ring-orange-500" /><span className="ml-3 text-gray-700">{option}</span></label>))}</div>)}{q.type === 'input' && (<input type="text" placeholder="Your answer..." value={answers[q.id] || ''} onChange={(e) => handleAnswerChange(q.id, e.target.value)} className="w-full md:w-1/2 p-3 border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500" />)}{q.type === 'text' && (<textarea placeholder="Type your explanation..." value={answers[q.id] || ''} onChange={(e) => handleAnswerChange(q.id, e.target.value)} rows="3" className="w-full p-3 border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"></textarea>)}<div className="mt-4 flex items-center flex-wrap gap-2"><button onClick={() => checkAnswer(q)} className="bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition text-sm">Check Answer</button><button onClick={() => explainConcept(q)} className="flex items-center gap-2 bg-blue-100 text-blue-800 font-semibold py-2 px-4 rounded-lg hover:bg-blue-200 transition text-sm"><BrainCircuit className="h-4 w-4"/> Teach Me This</button><button onClick={() => generateSimilarProblem(q)} className="flex items-center gap-2 bg-green-100 text-green-800 font-semibold py-2 px-4 rounded-lg hover:bg-green-200 transition text-sm"><RefreshCw className="h-4 w-4"/> More Practice</button></div>{feedback[q.id] === 'correct' && <div className="mt-3 p-3 bg-green-50 text-green-700 rounded-lg">Correct! Great job.</div>}{feedback[q.id] === 'incorrect' && <div className="mt-3 p-3 bg-red-50 text-red-700 rounded-lg">Not quite. Try again, or use the AI tools for help!</div>}</div>))}</div><div className="flex justify-center"><button className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-500 transition-transform transform hover:scale-105 shadow-lg">Submit Worksheet</button></div></div><Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalContent.title} icon={modalContent.icon}>{isLoading ? (<div className="flex flex-col items-center justify-center h-48"><LoaderCircle className="h-12 w-12 animate-spin text-orange-600" /><p className="mt-4 text-gray-600">AI is thinking...</p></div>) : (<div className="text-gray-700 whitespace-pre-wrap font-sans leading-relaxed" dangerouslySetInnerHTML={{ __html: modalContent.content.replace(/\n/g, '<br />') }}></div>)}</Modal></>);};
const Tasks = () => { const [activeTab, setActiveTab] = useState('tasks'); const [modalContent, setModalContent] = useState({ title: '', content: '', icon: null }); const [isModalOpen, setIsModalOpen] = useState(false); const [isLoading, setIsLoading] = useState(false); const breakDownTask = async (task) => { setModalContent({ title: `Plan for: ${task.title}`, content: '', icon: ListTodo }); setIsLoading(true); setIsModalOpen(true); const prompt = `I'm a student with a large task: "${task.title}" in my ${task.subject} course. Act as a study coach and break this down into a series of smaller, manageable sub-tasks. Present this as a checklist.`; try { let chatHistory = [{ role: "user", parts: [{ text: prompt }] }]; const payload = { contents: chatHistory }; const apiKey = ""; const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`; const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }); if (!response.ok) throw new Error("API call failed."); const result = await response.json(); const breakdown = result.candidates[0].content.parts[0].text; setModalContent(prev => ({ ...prev, content: breakdown })); } catch (error) { console.error("Error breaking down task:", error); setModalContent(prev => ({ ...prev, content: "Could not generate a task breakdown right now." })); } finally { setIsLoading(false); } }; return (<><div className="space-y-6"><h1 className="text-3xl font-bold text-gray-800">Tasks & Progress</h1><div className="border-b border-gray-200"><nav className="-mb-px flex space-x-6"><button onClick={() => setActiveTab('tasks')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'tasks' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>All Tasks</button><button onClick={() => setActiveTab('grades')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'grades' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Grades</button><button onClick={() => setActiveTab('achievements')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'achievements' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Achievements</button></nav></div><div className="bg-white p-6 rounded-xl shadow-sm">{activeTab === 'tasks' && (<div className="grid grid-cols-1 md:grid-cols-3 gap-6">{['To Do', 'In Progress', 'Completed'].map(status => (<div key={status}><h3 className="font-bold text-gray-700 mb-4">{status}</h3><div className="space-y-4 bg-gray-50 p-4 rounded-lg h-full">{status === 'To Do' && upcomingTasksData.map(t => (<div key={t.id} className="bg-white p-3 rounded-md shadow-sm"><p>{t.title}</p>{t.breakable && <button onClick={() => breakDownTask(t)} className="text-xs font-semibold text-purple-700 mt-2 flex items-center gap-1 hover:text-purple-900"><ListTodo className="h-3 w-3"/> Break Down Task</button>}</div>))}{status === 'In Progress' && <div className="bg-white p-3 rounded-md shadow-sm">Algebra Final Project</div>}{status === 'Completed' && <div className="bg-white p-3 rounded-md shadow-sm opacity-60">Geometry Worksheet 2</div>}</div></div>))}</div>)}{activeTab === 'grades' && (<div><h3 className="font-bold text-lg text-gray-800 mb-4">Your Grades</h3><div className="overflow-x-auto"><table className="min-w-full divide-y divide-gray-200"><thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignment</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th></tr></thead><tbody className="bg-white divide-y divide-gray-200"><tr><td className="px-6 py-4">Geometry Worksheet 2</td><td className="px-6 py-4 font-semibold text-green-600">95%</td><td className="px-6 py-4">July 5, 2025</td></tr><tr><td className="px-6 py-4">Algebra Quiz 5</td><td className="px-6 py-4 font-semibold text-orange-600">82%</td><td className="px-6 py-4">July 2, 2025</td></tr><tr><td className="px-6 py-4">Trigonometry Test</td><td className="px-6 py-4 font-semibold text-red-600">68%</td><td className="px-6 py-4">June 28, 2025</td></tr></tbody></table></div></div>)}{activeTab === 'achievements' && (<div><h3 className="font-bold text-lg text-gray-800 mb-4">Your Trophy Case</h3><div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">{achievements.map(ach => (<div key={ach.id} className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-lg hover:border-orange-300 transition-all"><ach.icon className={`h-12 w-12 ${ach.color}`} /><p className="text-sm font-bold text-gray-700 mt-2">{ach.name}</p></div>))}</div></div>)}</div></div><Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalContent.title} icon={modalContent.icon}>{isLoading ? (<div className="flex flex-col items-center justify-center h-48"><LoaderCircle className="h-12 w-12 animate-spin text-orange-600" /><p className="mt-4 text-gray-600">AI is thinking...</p></div>) : (<div className="text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">{modalContent.content}</div>)}</Modal></>);};
const AITutor = () => { const { user } = useAuth(); const [messages, setMessages] = useState([{ sender: 'ai', text: "Hello! I'm your AI Math Tutor. Ask me anything about your math problems, concepts, or homework!" }]); const [input, setInput] = useState(''); const [isLoading, setIsLoading] = useState(false); const messagesEndRef = useRef(null); const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }; useEffect(scrollToBottom, [messages]); const handleSend = async () => { if (input.trim() === '' || isLoading) return; const userMessage = { sender: 'user', text: input }; setMessages(prev => [...prev, userMessage]); setInput(''); setIsLoading(true); const prompt = `You are a friendly and encouraging math tutor. A student has asked the following question: "${input}". Explain the concept clearly and help them understand it. If it's a problem, guide them through the steps to solve it without just giving the answer. Use markdown for formatting like bolding, lists, and code blocks for equations.`; try { let chatHistory = [{ role: "user", parts: [{ text: prompt }] }]; const payload = { contents: chatHistory }; const apiKey = ""; const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`; const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }); if (!response.ok) throw new Error("API call failed."); const result = await response.json(); const aiText = result.candidates[0].content.parts[0].text; setMessages(prev => [...prev, { sender: 'ai', text: aiText }]); } catch (error) { console.error("Error with AI Tutor:", error); setMessages(prev => [...prev, { sender: 'ai', text: "I'm having a little trouble connecting right now. Please try again in a moment." }]); } finally { setIsLoading(false); } }; return (<div className="flex flex-col h-full max-w-4xl mx-auto bg-white rounded-2xl shadow-lg"><div className="p-4 border-b"><h1 className="text-2xl font-bold text-gray-800 text-center flex items-center justify-center gap-2"><MessageSquare className="text-orange-500"/> AI Math Tutor</h1></div><div className="flex-grow p-4 overflow-y-auto space-y-6">{messages.map((msg, index) => (<div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>{msg.sender === 'ai' && <img src={`https://placehold.co/40x40/10B981/FFFFFF?text=AI`} alt="AI Avatar" className="h-10 w-10 rounded-full" />}<div className={`max-w-md p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-orange-500 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}><p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p></div>{msg.sender === 'user' && <img src={user.avatar} alt="User Avatar" className="h-10 w-10 rounded-full" />}</div>))}{isLoading && (<div className="flex items-start gap-3"><img src={`https://placehold.co/40x40/10B981/FFFFFF?text=AI`} alt="AI Avatar" className="h-10 w-10 rounded-full" /><div className="max-w-md p-3 rounded-2xl bg-gray-100 text-gray-800 rounded-bl-none flex items-center"><LoaderCircle className="h-5 w-5 animate-spin text-gray-500" /></div></div>)}<div ref={messagesEndRef} /></div><div className="p-4 border-t bg-gray-50 rounded-b-2xl"><div className="relative"><input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} placeholder="Ask a math question..." className="w-full p-3 pr-12 border-gray-300 rounded-full focus:ring-2 focus:ring-orange-400 focus:border-transparent" disabled={isLoading} /><button onClick={handleSend} disabled={isLoading} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-orange-600 text-white rounded-full hover:bg-orange-500 disabled:bg-orange-300 transition"><Send className="h-5 w-5" /></button></div></div></div>);};

// --- Main App Structure ---
const MainApp = () => {
  const { user, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  
  // Move validation to useEffect
  useEffect(() => {
    if (!user || !user.avatar) {
      logout();
    }
  }, [user, logout]);

  // Guard clause
  if (!user || !user.avatar) {
    return null; // Return null instead of AuthFlow to avoid render loop
  }

  const pages = { dashboard: <Dashboard />, ai_tutor: <AITutor />, live_class: <LiveClass />, worksheet: <Worksheet />, tasks: <Tasks /> };
  const NavItem = ({ page, icon: Icon, label }) => (<button onClick={() => { setCurrentPage(page); setSidebarOpen(false); }} className={`flex items-center w-full text-left px-4 py-3 rounded-lg transition-colors ${ currentPage === page ? 'bg-orange-600 text-white font-bold shadow-lg' : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600' }`}><Icon className="h-5 w-5 mr-4" /><span>{label}</span></button>);
  const MobileNavItem = ({ page, icon: Icon, label }) => (<button onClick={() => setCurrentPage(page)} className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors ${ currentPage === page ? 'text-orange-600' : 'text-gray-500 hover:text-orange-600' }`}><Icon className="h-5 w-5 mb-1" /><span className="text-xs font-medium">{label}</span></button>);
  
  return (<div className="bg-gray-50 min-h-screen font-sans text-gray-900"><aside className={`fixed top-0 left-0 z-40 w-64 h-screen bg-white shadow-lg transition-transform md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}><div className="p-6"><div className="flex items-center space-x-2"><BarChart2 className="h-8 w-8 text-orange-600"/><h1 className="text-2xl font-bold text-gray-800">MathLeap</h1></div></div><nav className="px-4 space-y-2"><NavItem page="dashboard" icon={Home} label="Dashboard" /><NavItem page="ai_tutor" icon={MessageSquare} label="AI Tutor" /><NavItem page="live_class" icon={Video} label="Live Class" /><NavItem page="worksheet" icon={BookOpen} label="Worksheet" /><NavItem page="tasks" icon={CheckSquare} label="Tasks & Grades" /></nav><div className="absolute bottom-4 px-4 w-full"><button onClick={logout} className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 font-semibold py-3 rounded-lg text-sm hover:bg-red-100 hover:text-red-700 transition-colors"><LogOut className="h-4 w-4"/> Logout</button></div></aside><div className="md:ml-64 transition-all duration-300"><header className="sticky top-0 bg-white/80 backdrop-blur-lg z-30 border-b border-gray-200"><div className="flex items-center justify-between h-16 px-4 md:px-8"><button onClick={() => setSidebarOpen(!isSidebarOpen)} className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-full">{isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}</button><div className="hidden md:block"><h2 className="text-xl font-bold capitalize text-gray-800">{currentPage.replace(/_/g, ' ')}</h2></div><div className="flex items-center space-x-4"><button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"><Bell className="h-6 w-6" /></button><div className="flex items-center space-x-2"><img src={user.avatar} alt="User Avatar" className="h-10 w-10 rounded-full border-2 border-orange-500" /><div className="hidden sm:block"><p className="font-semibold text-sm">{user.name}</p><p className="text-xs text-gray-500">Student</p></div><ChevronDown className="h-5 w-5 text-gray-400 hidden sm:block"/></div></div></div></header><main className="p-4 md:p-8 pb-24 md:pb-8"><div className="h-[calc(100vh-10rem)]">{pages[currentPage]}</div></main></div><nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-t-lg grid grid-cols-5 z-40"><MobileNavItem page="dashboard" icon={Home} label="Home" /><MobileNavItem page="ai_tutor" icon={MessageSquare} label="Tutor" /><MobileNavItem page="live_class" icon={Video} label="Class" /><MobileNavItem page="worksheet" icon={BookOpen} label="Work" /><MobileNavItem page="tasks" icon={CheckSquare} label="Tasks" /></nav>{isSidebarOpen && <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/40 z-30 md:hidden"></div>}</div>);
};

const AuthFlow = () => {
    const [isLoginView, setIsLoginView] = useState(true);
    return isLoginView ? <LoginPage onSwitchToSignup={() => setIsLoginView(false)} /> : <SignupPage onSwitchToLogin={() => setIsLoginView(true)} />;
};

export default function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

const AppContent = () => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <MainApp /> : <AuthFlow />;
};
