"use client"

import { useState } from "react";
import { getAuthToken, getRefreshToken, logout } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import secureLocalStorage from "react-secure-storage";

type CreateCarType = {
    make: string;
    model: string;
    year: number;
    price: number;
    color: string;
};

export default function CreateFunction() {
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [carData, setCarData] = useState<any>(null);

    const [formData, setFormData] = useState<CreateCarType>({
        make: "",
        model: "",
        year: 2024,
        price: 0,
        color: "",
    });

    const refreshAccessToken = async () => {
        setRefreshing(true);
        setError('');
        setMessage('');

        try {
            const refreshToken = getRefreshToken();
            if (!refreshToken) throw new Error('No refresh token found');

            const response = await fetch('/api/refresh', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refreshToken })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to refresh token');
            }

            const data = await response.json();
            const newToken = data.token || data.access_token;
            
            if (!newToken) throw new Error('No new access token received');

            secureLocalStorage.setItem("authToken", newToken);
            if (data.refreshToken || data.refresh_token) {
                secureLocalStorage.setItem("refreshToken", data.refreshToken || data.refresh_token);
            }

            setMessage('Access token refreshed successfully!');
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to refresh token');
        } finally {
            setRefreshing(false);
        }
    };

    const logOutAccessToken = async () => {
        try {
            logout();
            setMessage('Logged out successfully!');
        } catch (error) {
            setError('Failed to logout');
        }
    };

    const createCar = async () => {
        const access_token = getAuthToken();
        if (!access_token) throw new Error('No access token found');

        const response = await fetch(`https://car-nextjs-api.cheatdev.online/cars`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            if (response.status === 401) {
                throw new Error('Access token expired. Please refresh your token.');
            }
            throw new Error(errorData.message || 'Failed to create car');
        }

        return await response.json();
    };

    const handleCreateCar = async () => {
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const result = await createCar();
            setMessage('Car created successfully!');
            setCarData(result.data || result);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to create car');
        } finally {
            setLoading(false);
        }
    };

    const checkTokenStatus = () => {
        const accessToken = getAuthToken();
        const refreshToken = getRefreshToken();
        alert(`Access Token: ${accessToken ? 'Available' : 'Missing'}\nRefresh Token: ${refreshToken ? 'Available' : 'Missing'}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            <div className="container mx-auto p-6">
                <div className="max-w-md mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-block p-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4">
                            <div className="bg-white px-6 py-2 rounded-xl">
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Create Car
                                </h1>
                            </div>
                        </div>
                    </div>

                    {/* Simple Form */}
                    <div className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl rounded-2xl p-6 mb-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full -translate-y-8 translate-x-8"></div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-blue-500 rounded-full"></div>
                                <h3 className="font-semibold text-gray-800">Car Details</h3>
                            </div>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <input
                                        type="text"
                                        placeholder="Make"
                                        value={formData.make}
                                        onChange={(e) => setFormData({...formData, make: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Model"
                                        value={formData.model}
                                        onChange={(e) => setFormData({...formData, model: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <input
                                        type="number"
                                        placeholder="Year"
                                        value={formData.year}
                                        onChange={(e) => setFormData({...formData, year: parseInt(e.target.value) || 2024})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Price"
                                        value={formData.price}
                                        onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <input
                                    type="text"
                                    placeholder="Color"
                                    value={formData.color}
                                    onChange={(e) => setFormData({...formData, color: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="space-y-3 mb-6">
                        <Button
                            onClick={handleCreateCar}
                            disabled={loading || !formData.make || !formData.model}
                            className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                        >
                            {loading ? "Creating Car..." : "Create Car Now"}
                        </Button>

                        <Button
                            onClick={refreshAccessToken}
                            disabled={refreshing}
                            variant="outline"
                            className="w-full h-12 bg-white/70 backdrop-blur-sm border-2 border-gradient-to-r from-orange-200 to-amber-200 hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50 text-gray-700 font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                        >
                            {refreshing ? "Refreshing Token..." : "🔄 Refresh Access Token"}
                        </Button>

                        <Button
                            onClick={checkTokenStatus}
                            variant="secondary"
                            size="sm"
                            className="w-full h-10 bg-white/60 backdrop-blur-sm border border-gray-200 hover:bg-white/80 text-gray-700 font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                        >
                            Check Token Status
                        </Button>

                        <Button
                            onClick={logOutAccessToken}
                            variant="secondary"
                            size="sm"
                            className="w-full h-10 bg-gradient-to-r from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100 border border-red-200 text-red-700 font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                        >
                            Logout
                        </Button>
                    </div>

                    {/* Error Alert */}
                    {error && (
                        <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 text-red-700 rounded-xl mb-4 shadow-sm backdrop-blur-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">!</span>
                                </div>
                                <span className="font-medium">{error}</span>
                            </div>
                        </div>
                    )}

                    {/* Success Alert */}
                    {message && (
                        <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-700 rounded-xl mb-4 shadow-sm backdrop-blur-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">✓</span>
                                </div>
                                <span className="font-medium">{message}</span>
                            </div>
                        </div>
                    )}

                    {/* Result */}
                    {carData && (
                        <div className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl rounded-2xl p-6 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full -translate-y-4 -translate-x-4"></div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"></div>
                                    <h3 className="font-semibold text-gray-800">Created Car Details</h3>
                                </div>
                                <div className="bg-gray-50/50 backdrop-blur-sm rounded-xl p-4">
                                    <pre className="text-sm text-left overflow-auto max-h-48 text-gray-700 font-mono">
                                        {JSON.stringify(carData, null, 2)}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}