'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-400/5 rounded-full blur-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center space-y-8 max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="space-y-6">
          <div className="inline-block">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent leading-tight">
              Welcome to
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                DreCar
              </span>
            </h1>
          </div>
          
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Discover premium vehicles, create stunning listings, and manage your automotive journey with our cutting-edge platform.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 my-12">
          <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
              <span className="text-white text-xl">🚗</span>
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Browse Cars</h3>
            <p className="text-sm text-slate-600">Explore our extensive collection of premium vehicles</p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
              <span className="text-white text-xl">📝</span>
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Create Listings</h3>
            <p className="text-sm text-slate-600">List your vehicle with our intuitive tools</p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
              <span className="text-white text-xl">⚡</span>
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Manage Account</h3>
            <p className="text-sm text-slate-600">Control your listings and profile settings</p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="pt-8">
          <Button 
            asChild 
            className="h-14 px-8 text-lg font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Link href="/cars" className="flex items-center gap-2">
              <span>Explore Cars</span>
              <span className="text-xl">🚀</span>
            </Link>
          </Button>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-8 pt-12 border-t border-white/20">
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              1000+
            </div>
            <div className="text-sm text-slate-600 mt-1">Cars Listed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              500+
            </div>
            <div className="text-sm text-slate-600 mt-1">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              24/7
            </div>
            <div className="text-sm text-slate-600 mt-1">Support</div>
          </div>
        </div>
      </div>
    </div>
  );
}