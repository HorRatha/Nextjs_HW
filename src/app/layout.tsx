import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import AuthNav from '@/components/AuthNav';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Car Listings App',
    description: 'A Next.js app for car listings',
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body className={inter.className}>
        {/* Modern Navigation Bar */}
        <nav className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/50 backdrop-blur-lg sticky top-0 z-50 shadow-lg">
            <div className="container mx-auto px-6 py-4">
                <div className="flex justify-between items-center">
                    {/* Left Side - Home */}
                    <div className="flex items-center space-x-8">
                        <Link 
                            href="/" 
                            className="text-white font-bold text-xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent hover:from-blue-300 hover:to-purple-300 transition-all duration-300 transform hover:scale-105"
                        >
                            🚗 DreCar
                        </Link>
                    </div>

                    {/* Right Side - Navigation Links & Auth */}
                    <div className="flex items-center space-x-6">
                        <Link 
                            href="/cars" 
                            className="relative text-slate-300 hover:text-white font-medium transition-all duration-300 group"
                        >
                            Cars
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                        
                        {/* Auth Navigation Component */}
                        <div className="border-l border-slate-600 pl-6">
                            <AuthNav />
                        </div>
                    </div>
                </div>
            </div>
        </nav>
        
        {/* Main Content */}
        <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            {children}
        </main>
        </body>
        </html>
    );
}