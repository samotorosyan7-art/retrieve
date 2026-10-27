// Dev only (see next.config.js): wp.retrieve.am's anti-bot captcha blocks both the local image optimizer
// and the browser's direct requests, so remote images are resized by the production site's optimizer.
export default function devImageLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
    if (src.startsWith("/")) return `${src}?w=${width}`;
    return `https://www.retrieve.am/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality || 75}`;
}
