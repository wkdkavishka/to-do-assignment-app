// utils/api/core.ts
// Core API utilities: shared logic for all API calls

/**
 * API Configuration
 */
const API_BASE_URL =
	process.env.NODE_ENV === "development"
		? "http://localhost:3001"
		: process.env.NEXT_PUBLIC_API_URL;

/**
 * Helper to construct full API URLs
 */
export const apiUrl = (path: string): string => {
	// Remove leading slash if present to avoid double slashes
	const cleanPath = path.startsWith("/") ? path.slice(1) : path;
	return `${API_BASE_URL}/${cleanPath}`;
};

/**
 * Global deduplication map
 */
const ongoingRequests = new Map<string, Promise<unknown>>();

/**
 * Generic deduplicated fetch
 * Prevents multiple identical requests from being sent simultaneously
 */
export const dedupedFetch = async <T>(
	key: string,
	fn: () => Promise<T>,
): Promise<T> => {
	if (ongoingRequests.has(key)) {
		return ongoingRequests.get(key) as Promise<T>;
	}

	const promise = fn().finally(() => ongoingRequests.delete(key));
	ongoingRequests.set(key, promise as Promise<unknown>);
	return promise;
};

/**
 * Get Clerk authentication token
 * Uses the global token getter set up by the Clerk provider
 */
export const getAuthToken = async (): Promise<string | null> => {
	// Check if we're in the browser
	if (typeof window === "undefined") {
		console.warn("[getAuthToken] Not in browser environment");
		return null;
	}

	// Check if the token getter has been set up
	if (!(window as any).__getClerkToken) {
		console.warn(
			"[getAuthToken] window.__getClerkToken not found. Make sure the Clerk provider has set it up.",
		);
		return null;
	}

	try {
		const token = await (window as any).__getClerkToken();
		if (!token) {
			console.warn("[getAuthToken] Token is null or undefined");
			return null;
		}
		console.log(
			"[getAuthToken] Token retrieved successfully, length:",
			token.length,
		);
		return token;
	} catch (error) {
		console.error("[getAuthToken] Failed to get auth token:", error);
		return null;
	}
};

/**
 * Create authenticated headers with Bearer token
 */
export const createAuthHeaders = async (
	additionalHeaders: Record<string, string> = {},
): Promise<Record<string, string>> => {
	try {
		const token = await getAuthToken();
		const headers: Record<string, string> = {
			"Content-Type": "application/json",
			...additionalHeaders,
		};

		if (token) {
			headers.Authorization = `Bearer ${token}`;
		}

		return headers;
	} catch (error) {
		console.error(
			"[createAuthHeaders] Failed to create auth headers:",
			error,
		);
		return {};
	}
};

/**
 * Helper for authenticated GET requests
 */
export const authenticatedGet = async <T>(url: string): Promise<T> => {
	const headers = await createAuthHeaders();
	const res = await fetch(apiUrl(url), { headers });

	if (!res.ok) {
		const error = await res
			.json()
			.catch(() => ({ error: "Request failed" }));
		throw new Error(
			error.error || `Request failed with status ${res.status}`,
		);
	}

	return res.json();
};

/**
 * Helper for authenticated POST requests
 */
export const authenticatedPost = async <T>(
	url: string,
	body?: any,
): Promise<T> => {
	const headers = await createAuthHeaders();
	const res = await fetch(apiUrl(url), {
		method: "POST",
		headers,
		body: body ? JSON.stringify(body) : undefined,
	});

	if (!res.ok) {
		const error = await res
			.json()
			.catch(() => ({ error: "Request failed" }));
		throw new Error(
			error.error || `Request failed with status ${res.status}`,
		);
	}

	return res.json();
};

/**
 * Helper for authenticated PATCH requests
 */
export const authenticatedPatch = async <T>(
	url: string,
	body: any,
): Promise<T> => {
	const headers = await createAuthHeaders();
	const res = await fetch(apiUrl(url), {
		method: "PATCH",
		headers,
		body: JSON.stringify(body),
	});

	if (!res.ok) {
		const error = await res
			.json()
			.catch(() => ({ error: "Request failed" }));
		throw new Error(
			error.error || `Request failed with status ${res.status}`,
		);
	}

	return res.json();
};

/**
 * Helper for authenticated DELETE requests
 */
export const authenticatedDelete = async <T>(url: string): Promise<T> => {
	const headers = await createAuthHeaders();
	// Don't set Content-Type for DELETE requests with no body
	delete headers["Content-Type"];

	const res = await fetch(apiUrl(url), {
		method: "DELETE",
		headers,
	});

	if (!res.ok) {
		const error = await res
			.json()
			.catch(() => ({ error: "Request failed" }));
		throw new Error(
			error.error || `Request failed with status ${res.status}`,
		);
	}

	return res.json();
};

/**
 * Helper for public (unauthenticated) GET requests
 */
export const publicGet = async <T>(url: string): Promise<T> => {
	const res = await fetch(apiUrl(url));

	if (!res.ok) {
		const error = await res
			.json()
			.catch(() => ({ error: "Request failed" }));
		throw new Error(
			error.error || `Request failed with status ${res.status}`,
		);
	}

	return res.json();
};

/**
 * Helper for public (unauthenticated) POST requests
 */
export const publicPost = async <T>(url: string, body?: any): Promise<T> => {
	const res = await fetch(apiUrl(url), {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: body ? JSON.stringify(body) : undefined,
	});

	if (!res.ok) {
		const error = await res
			.json()
			.catch(() => ({ error: "Request failed" }));
		throw new Error(
			error.error || `Request failed with status ${res.status}`,
		);
	}

	return res.json();
};
