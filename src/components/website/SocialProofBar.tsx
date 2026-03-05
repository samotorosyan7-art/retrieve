export default function SocialProofBar() {
    // Grayscale trust bar logos
    const partners = [
        "International Chamber of Commerce",
        "AmCham Armenia",
        "Global Legal Insights",
        "Legal 500",
        "Chambers & Partners"
    ];

    return (
        <div className="w-full bg-white border-y border-gray-100 py-10 relative z-20 overflow-hidden">
            <div className="container mx-auto px-4 md:px-8">
                <p className="text-center text-sm font-semibold text-gray-400 uppercase tracking-widest mb-8">
                    Trusted By & Recognized In
                </p>

                <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 md:gap-x-20 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                    {partners.map((partner, idx) => (
                        <div key={idx} className="flex items-center justify-center text-gray-900 font-bold text-lg md:text-xl tracking-tight opacity-80 hover:opacity-100 transition-opacity whitespace-nowrap">
                            {partner}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
