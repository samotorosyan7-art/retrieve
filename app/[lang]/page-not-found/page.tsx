import { notFound } from "next/navigation";

// Target of the middleware rewrite for URLs without a locale prefix
export default function PageNotFound() {
    notFound();
}
