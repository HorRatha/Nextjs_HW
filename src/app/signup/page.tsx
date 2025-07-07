'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import secureLocalStorage from 'react-secure-storage';
import { useRouter } from 'next/navigation';
import { SignupData, LoginResponse } from '@/lib/types';

const signupUser = async (signupData: SignupData): Promise<LoginResponse> => {
    try {
        if (signupData.password !== signupData.confirmed_password) {
            throw new Error('Passwords do not match');
        }

        const response = await fetch('/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(signupData),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Signup failed');
        }

        console.log('=== SIGNUP RESPONSE DEBUG 😎😎 ===');
        console.log('Full response data:', data);
        console.log('data.token:', data.token);
        console.log('data.access_token:', data.access_token);
        console.log('data.refreshToken:', data.refreshToken);
        console.log('data.refresh_token:', data.refresh_token);
        console.log('Available keys:', Object.keys(data));

        const possibleTokenFields = ['token', 'access_token', 'accessToken', 'authToken'];
        const actualTokenField = possibleTokenFields.find(field => data[field]);

        console.log('Detected token field:', actualTokenField);
        if (actualTokenField) {
            console.log('Token value:', data[actualTokenField]);
        } else {
            console.log('Token value: undefined');
        }

        if (actualTokenField && data[actualTokenField]) {
            secureLocalStorage.setItem('authToken', data[actualTokenField]);
            console.log('Token stored successfully');
        } else {
            console.error('No token found in response');
        }

        secureLocalStorage.setItem('user', JSON.stringify(data.user || null));

        const refreshToken = data.refreshToken || data.refresh_token;
        if (refreshToken) {
            secureLocalStorage.setItem('refreshToken', refreshToken);
        }

        return data;
    } catch (error) {
        console.error('Signup error:', error);
        throw error;
    }
};

export default function SignupPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmedPassword, setConfirmedPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSignup = async () => {
        setLoading(true);
        setError('');

        try {
            await signupUser({ username, email, password, confirmed_password: confirmedPassword });
            router.push('/login'); // Redirect to login after signup
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Signup failed');
            console.error('Signup error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-0 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
            </div>

            {/* Glass morphism overlay */}
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>

            <div className="container mx-auto p-6 relative z-10 flex items-center justify-center min-h-screen">
                <div className="max-w-md w-full">
                    {/* Glass card */}
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-8 text-center">
                        {/* Header with gradient text */}
                        <div className="mb-8">
                            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
                                Create Account
                            </h1>
                            <p className="text-white/80 text-sm">Join us and start your journey</p>
                        </div>

                        {/* Form */}
                        <div className="space-y-6 mb-8">
                            <div className="relative">
                                <Input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Username"
                                    disabled={loading}
                                    className="bg-white/5 border-white/20 text-white placeholder-white/60 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 backdrop-blur-sm rounded-xl h-12 px-4"
                                />
                            </div>
                            <div className="relative">
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email"
                                    disabled={loading}
                                    className="bg-white/5 border-white/20 text-white placeholder-white/60 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 backdrop-blur-sm rounded-xl h-12 px-4"
                                />
                            </div>
                            <div className="relative">
                                <Input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                    disabled={loading}
                                    className="bg-white/5 border-white/20 text-white placeholder-white/60 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 backdrop-blur-sm rounded-xl h-12 px-4"
                                />
                            </div>
                            <div className="relative">
                                <Input
                                    type="password"
                                    value={confirmedPassword}
                                    onChange={(e) => setConfirmedPassword(e.target.value)}
                                    placeholder="Confirm Password"
                                    disabled={loading}
                                    className="bg-white/5 border-white/20 text-white placeholder-white/60 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 backdrop-blur-sm rounded-xl h-12 px-4"
                                />
                            </div>
                            
                            {/* Gradient Button */}
                            <Button 
                                onClick={handleSignup} 
                                disabled={loading} 
                                className="w-full h-12 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-semibold rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl border-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                        Creating Account...
                                    </div>
                                ) : (
                                    'Create Account'
                                )}
                            </Button>
                        </div>

                        {/* Login link */}
                        <p className="text-sm text-white/80 mb-6">
                            Already have an account?{' '}
                            <a 
                                href="/login" 
                                className="text-transparent bg-gradient-to-r from-purple-300 to-cyan-300 bg-clip-text hover:from-purple-200 hover:to-cyan-200 font-semibold transition-all duration-200 hover:underline"
                            >
                                Sign in here
                            </a>
                        </p>

                        {/* Error message */}
                        {error && (
                            <div className="p-4 bg-red-500/20 border border-red-500/30 text-red-200 rounded-xl backdrop-blur-sm animate-in fade-in-0 slide-in-from-top-2 duration-300">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                    {error}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Decorative elements */}
                    <div className="flex justify-center mt-8 space-x-2">
                        <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full animate-pulse animation-delay-1000"></div>
                        <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full animate-pulse animation-delay-2000"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}