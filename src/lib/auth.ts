"use client";

import secureLocalStorage from "react-secure-storage";
import { UpdateCarType } from "@/lib/types";

interface LoginData {
    email: string;
    password: string;
}

interface LoginResponse {
    message: string;
    user: unknown;
    token?: string;
    access_token?: string;
    refreshToken?: string;
    refresh_token?: string;
}

// ========== LOGIN ==========
export const loginUser = async (loginData: LoginData): Promise<LoginResponse> => {
    try {
        const response = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(loginData),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Login failed");
        }

        console.log("=== LOGIN RESPONSE ===", data);

        const token = data.token || data.access_token;
        const refresh = data.refreshToken || data.refresh_token;

        if (token) {
            secureLocalStorage.setItem("authToken", token);
            console.log("Stored access token");
        }

        if (refresh) {
            secureLocalStorage.setItem("refreshToken", refresh);
            console.log("Stored refresh token");
        }

        secureLocalStorage.setItem("user", JSON.stringify(data.user || null));
        return data;

    } catch (error) {
        console.error("Login error:", error);
        throw error;
    }
};

// ========== GETTERS ==========
export const getAuthToken = (): string | null => {
    const keys = [
        "authToken",
        "@secure.s.authToken",
        "token",
        "access_token",
    ];

    for (const key of keys) {
        const val = secureLocalStorage.getItem(key);
        if (typeof val === "string") return val;
    }
    return null;
};

export const getRefreshToken = (): string | null => {
    const keys = [
        "refreshToken",
        "refresh_token",
        "@secure.s.refreshToken"
    ];

    for (const key of keys) {
        const val = secureLocalStorage.getItem(key);
        if (typeof val === "string") return val;
    }
    return null;
};

export const getUser = (): unknown | null => {
    try {
        const user = secureLocalStorage.getItem("user") as string | null;
        return user ? JSON.parse(user) : null;
    } catch {
        return null;
    }
};

export const isAuthenticated = (): boolean => {
    return !!getAuthToken();
};

// ========== LOGOUT ==========
export const logout = (): void => {
    const keysToRemove = [
        "authToken", "@secure.s.authToken",
        "refreshToken", "@secure.s.refreshToken",
        "token", "access_token",
        "refresh_token", "user", "@secure.s.user"
    ];

    keysToRemove.forEach(key => {
        try {
            secureLocalStorage.removeItem(key);
        } catch (e) {
            console.warn(`Failed to remove key ${key}:`, e);
        }
    });

    window.location.href = "/login";
};

// ========== REFRESH TOKEN ==========
export const refreshAccessToken = async (): Promise<string> => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) throw new Error("No refresh token available");

    const response = await fetch("/api/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to refresh token");
    }

    const newToken = data.token || data.access_token;
    const newRefresh = data.refreshToken || data.refresh_token;

    if (!newToken) throw new Error("No access token returned");

    secureLocalStorage.setItem("authToken", newToken);
    if (newRefresh) secureLocalStorage.setItem("refreshToken", newRefresh);

    console.log("Access token refreshed");

    return newToken;
};

// ========== UPDATE CAR ==========
export const updateCar = async (carData: UpdateCarType): Promise<unknown> => {
    if (!carData.id) throw new Error("Car ID is required for update");

    const tryUpdate = async (token: string): Promise<Response> => {
        return fetch(`https://car-nextjs-api.cheatdev.online/cars/${carData.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(carData),
        });
    };

    try {
        let token = getAuthToken();
        if (!token) throw new Error("No access token found");

        let response = await tryUpdate(token);

        if (response.status === 401) {
            console.warn("Access token expired. Attempting to refresh...");
            token = await refreshAccessToken();
            response = await tryUpdate(token);
        }

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message || "Failed to update car");
        }

        const updatedCar = await response.json();
        console.log("Car updated successfully:", updatedCar);
        return updatedCar;

    } catch (err) {
        console.error("Update car error:", err);
        throw err;
    }
};
