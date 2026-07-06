/** @type {import('next').NextConfig} */
const nextConfig = {
    // Legal update PDFs are listed at request time via fs.readdir(public/legal-updates/<lang>).
    // Without this, Vercel's function bundler can exclude that dir since it's only referenced dynamically.
    experimental: {
        outputFileTracingIncludes: {
            "/[lang]/legal-updates": ["./public/legal-updates/**/*"],
            "/[lang]/legal-updates/page": ["./public/legal-updates/**/*"],
        },
    },
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
