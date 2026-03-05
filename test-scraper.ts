import { getTestimonials, getClientLogos } from "./src/lib/wordpress";

async function run() {
    console.log("Fetching Testimonials...");
    const testimonials = await getTestimonials();
    console.log("Testimonials:", testimonials);

    console.log("Fetching Client Logos...");
    const logos = await getClientLogos();
    console.log("Client Logos:", logos);
}

run();
