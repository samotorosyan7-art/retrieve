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
};

module.exports = nextConfig;
