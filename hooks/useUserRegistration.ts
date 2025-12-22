"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { callApi_ensureUser } from "@/api/user";

export function useUserRegistration() {
	const { isLoaded, isSignedIn, user } = useUser();
	const [isRegistered, setIsRegistered] = useState(false);
	const [isRegistering, setIsRegistering] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		async function registerUser() {
			if (!isLoaded || !isSignedIn || isRegistered || isRegistering) {
				return;
			}

			setIsRegistering(true);
			setError(null);

			try {
				await callApi_ensureUser();
				setIsRegistered(true);
			} catch (err: any) {
				console.error("Failed to register user:", err);
				setError(err.message || "Failed to register user");
			} finally {
				setIsRegistering(false);
			}
		}

		registerUser();
	}, [isLoaded, isSignedIn, user?.id, isRegistered, isRegistering]);

	return {
		isRegistered,
		isRegistering,
		error,
		isReady: isLoaded && isSignedIn && isRegistered,
	};
}
