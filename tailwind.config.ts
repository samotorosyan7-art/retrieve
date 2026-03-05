import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#FFFFFF",
                foreground: "#171717",
                primary: {
                    DEFAULT: "#005CB9", // Clio Action Blue
                    foreground: "#ffffff",
                    hover: "#004791",
                },
                secondary: {
                    DEFAULT: "#F4F6F8", // Slate Grey Backgrounds
                    foreground: "#2D2E2E",
                },
                neutral: {
                    DEFAULT: "#64748b",
                    foreground: "#f1f5f9",
                },
                text: "#2D2E2E", // Deep Charcoal
            },
            fontFamily: {
                sans: ["Arial", "Helvetica", "sans-serif"],
            },
            borderRadius: {
                lg: "0.5rem",   // 8px
                xl: "0.75rem",  // 12px
                "2xl": "1rem",  // 16px
                "3xl": "1.5rem", // 24px
            },
            boxShadow: {
                soft: "0 10px 40px -10px rgba(0, 0, 0, 0.05)",
                medium: "0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)",
                elevated: "0 20px 40px -5px rgba(0, 0, 0, 0.08), 0 10px 20px -5px rgba(0, 0, 0, 0.04)",
            },
        },
    },
    plugins: [require("@tailwindcss/typography")],
};
export default config;
