import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    compiler: {
        styledComponents: true,
    },
    eslint: {
        ignoreDuringBuilds: true
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'avatar.vercel.sh',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'car-nextjs-api.cheatdev.online',
                pathname: '/uploads/**',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                pathname: '/uploads/**',
            }
        ]
    }
};

export default nextConfig;