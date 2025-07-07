'use client';

import { Button } from '@/components/ui/button';
import { isAuthenticated, logout } from '@/lib/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AuthNav() {
    const router = useRouter();
    const isAuth = isAuthenticated();

    const handleLogout = () => {
        try {
            logout();
            console.log('Logout successful');
            router.push('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <div className="flex gap-4 items-center">
            {isAuth ? (
                <>
                    <Button 
                        asChild 
                        variant="outline"
                        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        <Link href="/dashboard/manipulate">Dashboard</Link>
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleLogout}
                        className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border-0"
                    >
                        Logout
                    </Button>
                </>
            ) : (
                <>
                    <Button 
                        asChild 
                        variant="outline"
                        className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-0 hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        <Link href="/login">Login</Link>
                    </Button>
                    <Button 
                        asChild 
                        variant="outline"
                        className="bg-gradient-to-r from-violet-500 to-indigo-600 text-white border-0 hover:from-violet-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        <Link href="/signup">Sign Up</Link>
                    </Button>
                </>
            )}
        </div>
    );
}