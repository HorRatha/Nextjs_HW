import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { refreshToken } = await req.json();

        console.log('=== REFRESH TOKEN API Debug 😎===');
        console.log('Refresh token received:', refreshToken ? 'Found' : 'Missing');

        // if no refreshToken
        if (!refreshToken) {
            return NextResponse.json(
                { message: 'Refresh token is required' },
                { status: 400 }
            );
        }

        // Call the external API to refresh the token
        const response = await fetch(`https://car-nextjs-api.cheatdev.online/refresh-token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ refresh_token: refreshToken })
        });

        const data = await response.json();
        console.log('External refresh API response:', data);

        // response
        if (!response.ok) {
            return NextResponse.json(
                {
                    message: data.message || 'Failed to refresh token',
                    error: data.error || 'Token refresh failed'
                },
                { status: response.status }
            );
        }

        // Return the new tokens (happy happy)
        return NextResponse.json({
            message: 'Token refreshed successfully',
            token: data.access_token || data.token,
            refreshToken: data.refresh_token || data.refreshToken
        });

    } catch (error) {
        console.error('Refresh token API error:', error);
        // error response from api occured
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}