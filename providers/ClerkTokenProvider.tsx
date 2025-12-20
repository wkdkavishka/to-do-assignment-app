"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";

/**
 * ClerkTokenProvider
 * Sets up the global window.__getClerkToken function for API calls
 * This must be a client component and should be placed high in the component tree
 */
export default function ClerkTokenProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const { getToken } = useAuth();

	// Set up the global token getter as soon as possible
	useEffect(() => {
		if (typeof window !== "undefined") {
			(window as any).__getClerkToken = getToken;
			console.log("[ClerkTokenProvider] Token getter function set up");
		}

		return () => {
			// Clean up on unmount
			if (typeof window !== "undefined") {
				delete (window as any).__getClerkToken;
			}
		};
	}, [getToken]);

	return <>{children}</>;
}
