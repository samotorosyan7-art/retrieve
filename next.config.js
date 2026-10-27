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
        // wp.retrieve.am's anti-bot captcha blocks local image fetches, so in dev images go through production's optimizer.
        ...(process.env.NODE_ENV === "development" && { loader: "custom", loaderFile: "./src/lib/dev-image-loader.ts" }),
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
    // Armenian moved from /am/ to /hy/ (ISO 639-1 code; "am" is Amharic). Old URLs 308 to their /hy/ equivalent.
    async redirects() {
        return [
            { source: "/am", destination: "/hy", permanent: true },
            { source: "/am/:path*", destination: "/hy/:path*", permanent: true },
            { source: "/legal-updates/am/:file*", destination: "/legal-updates/hy/:file*", permanent: true },
            { source: "/sitemap/am.xml", destination: "/sitemap/hy.xml", permanent: true },
        ];
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
