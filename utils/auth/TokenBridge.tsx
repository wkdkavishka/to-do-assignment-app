"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";

/**
 * TokenBridge component
 * Bridges the React-based Clerk auth with non-React API utility functions
 * by exposing the token getter on the window object.
 */
export const TokenBridge = () => {
	const { getToken } = useAuth();

	useEffect(() => {
		// Expose the token getter to the window object
		(window as any).__getClerkToken = getToken;

		// Cleanup
		return () => {
			delete (window as any).__getClerkToken;
		};
	}, [getToken]);

	return null;
};
