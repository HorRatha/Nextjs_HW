'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { loginUser } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async () => {
        setLoading(true);
        setError('');

        try {
            await loginUser({ email, password });
            router.push('/cars'); // Redirect to products page
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed');
            console.error('Login error:', err);
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
                                Welcome Back
                            </h1>
                            <p className="text-white/80 text-sm">Sign in to your account</p>
                        </div>

                        {/* Form */}
                        <div className="space-y-6 mb-8">
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
                            
                            {/* Gradient Button */}
                            <Button 
                                onClick={handleLogin} 
                                disabled={loading} 
                                className="w-full h-12 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-semibold rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl border-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                        Signing in...
                                    </div>
                                ) : (
                                    'Sign In'
                                )}
                            </Button>
                        </div>

                        {/* Forgot password link */}
                        <div className="mb-6">
                            <a 
                                href="/forgot-password" 
                                className="text-sm text-transparent bg-gradient-to-r from-purple-300 to-cyan-300 bg-clip-text hover:from-purple-200 hover:to-cyan-200 font-medium transition-all duration-200 hover:underline"
                            >
                                Forgot your password?
                            </a>
                        </div>

                        {/* Signup link */}
                        <p className="text-sm text-white/80 mb-6">
                            Don't have an account?{' '}
                            <a 
                                href="/signup" 
                                className="text-transparent bg-gradient-to-r from-purple-300 to-cyan-300 bg-clip-text hover:from-purple-200 hover:to-cyan-200 font-semibold transition-all duration-200 hover:underline"
                            >
                                Sign up here
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

                    {/* Social login section (optional) */}
                    <div className="mt-8 text-center">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/20"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-gradient-to-r from-purple-900 to-blue-900 text-white/60">
                                    Or continue with
                                </span>
                            </div>
                        </div>
                        
                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <button className="w-full inline-flex justify-center py-3 px-4 border border-white/20 rounded-xl shadow-sm bg-white/5 backdrop-blur-sm text-sm font-medium text-white hover:bg-white/10 transition-all duration-200">
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                </svg>
                                <span className="ml-2">Google</span>
                            </button>
                            
                            <button className="w-full inline-flex justify-center py-3 px-4 border border-white/20 rounded-xl shadow-sm bg-white/5 backdrop-blur-sm text-sm font-medium text-white hover:bg-white/10 transition-all duration-200">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                                </svg>
                                <span className="ml-2">Twitter</span>
                            </button>
                        </div>
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