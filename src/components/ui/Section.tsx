
import * as React from "react";
import { cn } from "@/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
    container?: boolean;
    background?: "white" | "gray" | "dark" | "blue";
}

const Section = React.forwardRef<HTMLElement, SectionProps>(
    ({ className, container = true, background = "white", children, ...props }, ref) => {
        const bgStyles = {
            white: "bg-white",
            gray: "bg-gray-50",
            dark: "bg-gray-900 text-white",
            blue: "bg-primary text-white",
        };

        return (
            <section
                ref={ref}
                className={cn("py-20", bgStyles[background], className)}
                {...props}
            >
                {container ? (
                    <div className="container mx-auto px-4 md:px-8">{children}</div>
                ) : (
                    children
                )}
            </section>
        );
    }
);
Section.displayName = "Section";

export { Section };
