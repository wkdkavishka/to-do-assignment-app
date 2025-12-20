// components/navbar/conditionalNavbarComp.tsx
"use client";

import { usePathname } from "next/navigation";
import { navbarAndFooterDisabledRoutes } from "@/data/site-data";
import { NavigationComp } from "../navbar/NavigationComp";

export const ConditionalNavbar = () => {
	const pathname = usePathname();

	// Don't show navbar on paper route
	if (navbarAndFooterDisabledRoutes.includes(pathname)) {
		return null;
	}

	return (
		<>
			<NavigationComp />
		</>
	);
};
