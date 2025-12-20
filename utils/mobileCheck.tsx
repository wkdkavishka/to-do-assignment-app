"use client";

import { useEffect, useState } from "react";

export function useIsMobile() {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkIfMobile = () => {
			// setIsMobile(window.innerWidth < 768); // 768px is typically the breakpoint for tablets
			setIsMobile(window.innerWidth < 500); // 768px is typically the breakpoint for tablets
		};

		// Initial check
		checkIfMobile();

		// Add event listener for window resize
		window.addEventListener("resize", checkIfMobile);

		// Clean up
		return () => window.removeEventListener("resize", checkIfMobile);
	}, []);

	return isMobile;
}
