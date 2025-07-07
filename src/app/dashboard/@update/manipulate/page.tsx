"use client";

import { useState } from "react";
import { getAuthToken, getRefreshToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import secureLocalStorage from "react-secure-storage";

type UpdateCarType = {
    id: string;
    make: string;
    model: string;
    year: number;
    price: number;
};

export default function UpdateFunction() {
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [carData, setCarData] = useState<any>(null);
    
    const [formData, setFormData] = useState<UpdateCarType>({
        id: "",
        make: "",
        model: "",
        year: 2024,
        price: 0,
    });

    const refreshAccessToken = async () => {
        setRefreshing(true);
        setError("");
        setMessage("");

        try {
            const refreshToken = getRefreshToken();
            if (!refreshToken) throw new Error("No refresh token found");

            const response = await fetch("/api/refresh", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refreshToken }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to refresh token");

            const newToken = data.token || data.access_token;
            if (!newToken) throw new Error("No new access token received");

            secureLocalStorage.setItem("authToken", newToken);
            if (data.refreshToken || data.refresh_token) {
                secureLocalStorage.setItem("refreshToken", data.refreshToken || data.refresh_token);
            }

            setMessage("Token refreshed successfully!");
        } catch (error) {
            setError(error instanceof Error ? error.message : "Failed to refresh token");
        } finally {
            setRefreshing(false);
        }
    };

    const updateCar = async () => {
        if (!formData.id) throw new Error("Car ID is required");

        let token = getAuthToken();
        if (!token) throw new Error("No access token found");

        let response = await fetch(`https://car-nextjs-api.cheatdev.online/cars/${formData.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
        });

        if (response.status === 401) {
            await refreshAccessToken();
            token = getAuthToken();
            if (!token) throw new Error("No token after refresh");
            
            response = await fetch(`https://car-nextjs-api.cheatdev.online/cars/${formData.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });
        }

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to update car");
        }

        return await response.json();
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError("");
        setMessage("");

        try {
            const result = await updateCar();
            setMessage("Car updated successfully!");
            setCarData(result);
        } catch (error) {
            setError(error instanceof Error ? error.message : "Failed to update car");
        } finally {
            setLoading(false);
        }
    };

    const checkTokenStatus = () => {
        const accessToken = getAuthToken();
        const refreshToken = getRefreshToken();
        alert(
            `Access Token: ${accessToken ? "✅ Available" : "❌ Missing"}\n` +
            `Refresh Token: ${refreshToken ? "✅ Available" : "❌ Missing"}`
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
            <div className="container mx-auto p-6">
                <div className="max-w-md mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-block p-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4">
                            <div className="bg-white px-6 py-2 rounded-xl">
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Update Car
                                </h1>
                            </div>
                        </div>
                    </div>

                    {/* Simple Form */}
                    <div className="bg-white/80 backdrop-blur-sm border border-blue-200 shadow-xl rounded-2xl p-6 mb-6">
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Car ID *"
                                value={formData.id}
                                onChange={(e) => setFormData({...formData, id: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            
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
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="space-y-3 mb-6">
                        <Button
                            onClick={handleSubmit}
                            disabled={loading || !formData.id}
                            className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                        >
                            {loading ? "Updating..." : "🔄 Update Car"}
                        </Button>

                        <Button
                            onClick={refreshAccessToken}
                            disabled={refreshing}
                            variant="outline"
                            className="w-full h-11 bg-white/60 backdrop-blur-sm border-2 border-blue-200 hover:bg-blue-50 hover:border-blue-300 text-blue-700 font-medium rounded-xl shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50"
                        >
                            {refreshing ? "Refreshing..." : "🔄 Refresh Token"}
                        </Button>

                        <Button
                            onClick={checkTokenStatus}
                            variant="secondary"
                            size="sm"
                            className="w-full h-10 bg-white/60 backdrop-blur-sm border border-gray-200 hover:bg-white/80 text-gray-700 font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                        >
                            Check Token Status
                        </Button>
                    </div>

                    {/* Messages */}
                    {error && (
                        <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 text-red-700 rounded-xl mb-4 shadow-sm backdrop-blur-sm">
                            <div className="flex items-center gap-2">
                                <span className="text-red-500 font-bold">!</span>
                                <span className="font-medium">{error}</span>
                            </div>
                        </div>
                    )}

                    {message && (
                        <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-700 rounded-xl mb-4 shadow-sm backdrop-blur-sm">
                            <div className="flex items-center gap-2">
                                <span className="text-green-500 font-bold">✓</span>
                                <span className="font-medium">{message}</span>
                            </div>
                        </div>
                    )}

                    {/* Result */}
                    {carData && (
                        <div className="bg-white/80 backdrop-blur-sm border border-blue-200 shadow-xl rounded-2xl p-6">
                            <h3 className="font-semibold text-blue-600 mb-3">✓ Updated Successfully</h3>
                            <div className="bg-blue-50/50 backdrop-blur-sm rounded-xl p-4 max-h-64 overflow-y-auto">
                                <pre className="text-sm text-gray-700 font-mono whitespace-pre-wrap">
                                    {JSON.stringify(carData, null, 2)}
                                </pre>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}