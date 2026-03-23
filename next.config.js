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
    async rewrites() {
        return [
            {
                source: "/api/pdf/:path*",
                destination: "https://wp.retrieve.am/wp-content/uploads/:path*",
            },
        ];
    },
};

module.exports = nextConfig;
