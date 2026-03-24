/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "wp.retrieve.am",
            },
            {
                protocol: "https",
                hostname: "www.retrieve.am",
            },
            {
                protocol: "https",
                hostname: "retrieve.am",
            },
        ],
    },
    async headers() {
        return [
            {
                // Apply to all routes
                source: "/(.*)",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "no-store, no-cache, must-revalidate, proxy-revalidate",
                    },
                    {
                        key: "Pragma",
                        value: "no-cache",
                    },
                    {
                        key: "Expires",
                        value: "0",
                    },
                ],
            },
        ];
    },
};

module.exports = nextConfig;
