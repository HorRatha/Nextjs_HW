"use client"

import { useState} from "react";
import { getAuthToken, getRefreshToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import secureLocalStorage from "react-secure-storage";

type DeleteCarType = {
    id?: string
    make: string,
    model: string,
    year: number,
    price: number,
    mileage: number,
    description: string,
    color: string,
    fuel_type: string,
    transmission: string,
    image: string
}

const sampleCarData: DeleteCarType = {
    // Default sample data - will be overridden by fetched data
    id: "",
    make: "Unknown",
    model: "Unknown",
    year: 2024,
    price: 0,
    mileage: 0,
    description: "Car details will be loaded",
    color: "Unknown",
    fuel_type: "Unknown",
    transmission: "Unknown",
    image: ""
};

export default function DeleteFunction(){
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [checking, setChecking] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [carData, setCarData] = useState<DeleteCarType | null>(null);
    const [carId, setCarId] = useState('');
    const [fetchedCar, setFetchedCar] = useState<DeleteCarType | null>(null);

    // this is for refresh for expired token 😎😎😎😎
    const refreshAccessToken = async () => {
        setRefreshing(true);
        setError('');
        setMessage('');

        try {
            const refreshToken = getRefreshToken();
            console.log("Refresh token:", refreshToken ? "Found" : "Missing");

            if (!refreshToken) {
                throw new Error('No refresh token found. Please login again.');
            }

            // Call your refresh token API (server-side)
            const response = await fetch('/api/refresh', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ refreshToken })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to refresh token');
            }

            const data = await response.json();
            console.log('Token refresh response:', data);

            // Store the new access token
            if (data.token || data.access_token) {
                const newToken = data.token || data.access_token;
                secureLocalStorage.setItem("authToken", newToken);
                console.log('New access token stored successfully');
                setMessage('Access token refreshed successfully!');
            } else {
                throw new Error('No new access token received');
            }

            // Update refresh token if provided
            if (data.refreshToken || data.refresh_token) {
                const newRefreshToken = data.refreshToken || data.refresh_token;
                secureLocalStorage.setItem("refreshToken", newRefreshToken);
            }

        } catch (error) {
            console.error('Token refresh error:', error);
            setError(error instanceof Error ? error.message : 'Failed to refresh token');
        } finally {
            setRefreshing(false);
        }
    };

    // Fetch car details by ID
    const fetchCarById = async (id: string) => {
        const access_token = getAuthToken();
        console.log("The access_token", access_token ? "Found" : "Missing");

        if (!access_token) {
            throw new Error('No access token found. Please login or refresh your token.');
        }

        const response = await fetch(`https://car-nextjs-api.cheatdev.online/cars/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();

            // If token expired, suggest refresh
            if (response.status === 401) {
                throw new Error('Access token expired. Please refresh your token.');
            }

            throw new Error(errorData.message || 'Failed to fetch car details');
        }

        const data = await response.json();
        return data;
    };

    // Handle check car function
    const handleCheckCar = async () => {
        if (!carId.trim()) {
            setError('Please enter a car ID');
            return;
        }

        setChecking(true);
        setError('');
        setMessage('');
        setFetchedCar(null);

        try {
            const result = await fetchCarById(carId.trim());
            setFetchedCar(result);
            setMessage('Car found successfully!');
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to fetch car');
            console.error('Error fetching car:', error);
        } finally {
            setChecking(false);
        }
    };

    // handle delete function 😎
    const deleteCar = async (id: string) => {
        const access_token = getAuthToken();
        console.log("The access_token", access_token ? "Found" : "Missing");

        if (!access_token) {
            throw new Error('No access token found. Please login or refresh your token.');
        }

        const response = await fetch(`https://car-nextjs-api.cheatdev.online/cars/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();

            // If token expired, suggest refresh
            if (response.status === 401) {
                throw new Error('Access token expired. Please refresh your token.');
            }

            throw new Error(errorData.message || 'Failed to delete car');
        }

        const data = await response.json();
        return data;
    };

    // handle submission delete the car
    const handleDeleteCar = async () => {
        if (!fetchedCar?.id) {
            setError('Please check the car first before deleting');
            return;
        }

        setLoading(true);
        setError('');
        setMessage('');

        try {
            const result = await deleteCar(fetchedCar.id);
            setCarData(result);
            setFetchedCar(null); // Clear the fetched car since it's deleted
            setCarId(''); // Clear the input
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to delete car');
            console.error('Error deleting car:', error);
        } finally {
            setLoading(false);
        }
    };

    // Check current token status make sure the token is available or not
    const checkTokenStatus = () => {
        const accessToken = getAuthToken();
        const refreshToken = getRefreshToken();

        console.log('=== TOKEN STATUS 😎 ===');
        console.log('Access Token:', accessToken ? 'Available' : 'Missing');
        console.log('Refresh Token:', refreshToken ? 'Available' : 'Missing');

        alert(`Access Token: ${accessToken ? 'Available' : 'Missing'}\nRefresh Token: ${refreshToken ? 'Available' : 'Missing'}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-pink-100">
            <div className="container mx-auto p-6">
                <div className="max-w-md mx-auto">
                    {/* Modern Header with Gradient */}
                    <div className="text-center mb-8">
                        <div className="inline-block p-1 bg-gradient-to-r from-red-500 to-orange-600 rounded-2xl mb-4">
                            <div className="bg-white px-6 py-2 rounded-xl">
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                                    Delete Car
                                </h1>
                            </div>
                        </div>
                    </div>

                    {/* Car ID Input Section */}
                    <div className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-xl rounded-2xl p-6 mb-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Enter Car ID
                                </label>
                                <input
                                    type="text"
                                    value={carId}
                                    onChange={(e) => setCarId(e.target.value)}
                                    placeholder="e.g., c718704d-366b-441c-94e7-d6864636ddcc"
                                    className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                                />
                            </div>
                            <Button
                                onClick={handleCheckCar}
                                disabled={checking || !carId.trim()}
                                className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                            >
                                {checking ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Checking Car...
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <span>🔍</span>
                                        Check Car
                                    </div>
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Modern Car Preview Card - Warning Style */}
                    {fetchedCar && (
                        <div className="bg-white/80 backdrop-blur-sm border border-red-200 shadow-xl rounded-2xl p-6 mb-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-400/10 to-orange-400/10 rounded-full -translate-y-8 translate-x-8"></div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-full animate-pulse"></div>
                                    <h3 className="font-semibold text-gray-800">Car to be deleted</h3>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-mono text-gray-600 bg-gray-50 rounded-lg px-3 py-1">
                                        ID: {fetchedCar.id}
                                    </p>
                                    <p className="text-lg font-medium text-gray-900">
                                        {fetchedCar.year} {fetchedCar.make} {fetchedCar.model}
                                    </p>
                                    <p className="text-xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                                        ${fetchedCar.price.toLocaleString()}
                                    </p>
                                    <p className="text-gray-600">Color: {fetchedCar.color}</p>
                                    <p className="text-gray-600">Mileage: {fetchedCar.mileage.toLocaleString()} miles</p>
                                    <p className="text-gray-600">Fuel: {fetchedCar.fuel_type}</p>
                                    <p className="text-gray-600">Transmission: {fetchedCar.transmission}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Modern Button Group */}
                    <div className="space-y-3 mb-6">
                        <Button
                            onClick={handleDeleteCar}
                            disabled={loading || !fetchedCar}
                            className="w-full h-12 bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Deleting Car...
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <span>🗑️</span>
                                    Delete Car Now
                                </div>
                            )}
                        </Button>

                        <Button
                            onClick={refreshAccessToken}
                            disabled={refreshing}
                            className="w-full h-10 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50"
                        >
                            {refreshing ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Refreshing...
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <span>🔄</span>
                                    Refresh Token
                                </div>
                            )}
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

                    {/* Modern Error Alert */}
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

                    {/* Modern Success Alert */}
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

                    {/* Modern Success Card */}
                    {carData && (
                        <div className="bg-white/80 backdrop-blur-sm border border-green-200 shadow-xl rounded-2xl p-6 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-green-400/10 to-emerald-400/10 rounded-full -translate-y-4 -translate-x-4"></div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                                        <span className="text-white text-xs font-bold">✓</span>
                                    </div>
                                    <h3 className="font-semibold text-green-500">Car Deleted Successfully</h3>
                                </div>
                                <div className="bg-green-50/50 backdrop-blur-sm rounded-xl p-4">
                                    <p className="text-green-700 font-medium">
                                        The car has been permanently removed from the system.
                                    </p>
                                    <p className="text-green-600 text-sm mt-2">
                                        You can now search for another car to delete.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}