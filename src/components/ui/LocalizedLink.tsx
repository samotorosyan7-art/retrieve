"use client";

import React from "react";
import NextLink from "next/link";
import { useParams } from "next/navigation";
import { ComponentProps } from "react";

export default function LocalizedLink({ href, ...props }: ComponentProps<typeof NextLink>) {
    const params = useParams();
    const lang = (params?.lang as string) || "en";

    let localizedHref = href;
    if (typeof href === "string" && href.startsWith("/") && !href.startsWith(`/${lang}`)) {
        localizedHref = `/${lang}${href === "/" ? "" : href}`;
    }

    return <NextLink href={localizedHref} {...props} />;
}
