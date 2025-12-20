// app/utils/RegisterSW.tsx
"use client";

import { useEffect, useRef } from "react";

export default function RegisterSW() {
	const registrationRef = useRef<ServiceWorkerRegistration | null>(null);
	const hasRegistered = useRef(false); // ← ADD THIS

	useEffect(() => {
		if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
			console.log("ServiceWorker not supported");
			return;
		}

		if (hasRegistered.current) {
			console.log("ServiceWorker already registered");
			return;
		}

		const registerWhenReady = async () => {
			if (document.readyState === "complete") {
				await doRegister();
			} else {
				await new Promise((resolve) =>
					window.addEventListener("load", resolve, { once: true }),
				);
				await doRegister();
			}
		};

		const doRegister = async () => {
			try {
				const reg = await navigator.serviceWorker.register("/sw.js", {
					scope: "/",
				});
				registrationRef.current = reg;
				hasRegistered.current = true; // ← MARK AS REGISTERED

				console.log("ServiceWorker registered → scope:", reg.scope);

				reg.addEventListener("updatefound", () => {
					const newWorker = reg.installing;
					if (newWorker) {
						newWorker.addEventListener("statechange", () => {
							if (
								newWorker.state === "installed" &&
								navigator.serviceWorker.controller
							) {
								console.log(
									"New version ready. Reload to update.",
								);
							}
						});
					}
				});
			} catch (err) {
				console.error("ServiceWorker registration failed:", err);
			}
		};

		registerWhenReady();

		const onControllerChange = () => window.location.reload();
		navigator.serviceWorker.addEventListener(
			"controllerchange",
			onControllerChange,
		);

		return () => {
			navigator.serviceWorker.removeEventListener(
				"controllerchange",
				onControllerChange,
			);
		};
	}, []);

	return null;
}
