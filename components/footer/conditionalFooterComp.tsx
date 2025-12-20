// components/footer/conditionalFooterComp.tsx
"use client";

import { usePathname } from "next/navigation";
import { navbarAndFooterDisabledRoutes } from "@/data/site-data";
import { Footer } from "./footerComp";

export const ConditionalFooter = () => {
	const pathname = usePathname();

	// Don't show footer on paper route
	if (navbarAndFooterDisabledRoutes.includes(pathname)) {
		return null;
	}

	return (
		<div className="relative bottom-0 z-40">
			<Footer />
		</div>
	);
};
