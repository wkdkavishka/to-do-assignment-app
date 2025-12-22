import { ApiRoutes } from "./comman/api.enum";
import { authenticatedGet, authenticatedPost } from "./comman/core";

export interface User {
	id: string;
	email: string;
	name: string | null;
}

export interface GetUserResponse {
	success: boolean;
	data: User;
}

/**
 * Get current authenticated user from backend DB
 */
export async function callApi_getUser(): Promise<User | null> {
	try {
		const response = await authenticatedGet<GetUserResponse>(
			ApiRoutes.USER_GET,
		);
		return response.data;
	} catch (error: any) {
		// User doesn't exist (404)
		if (error.message?.includes("404")) {
			return null;
		}
		throw error;
	}
}

/**
 * Create user in backend DB
 */
export async function callApi_createUser(): Promise<void> {
	await authenticatedPost(ApiRoutes.USER_CREATE, {});
}

/**
 * Ensure user exists in backend DB (get or create)
 */
export async function callApi_ensureUser(): Promise<User> {
	// Try to get user
	let user = await callApi_getUser();

	// If not found, create
	if (!user) {
		await callApi_createUser();
		user = await callApi_getUser();

		if (!user) {
			throw new Error("Failed to create user");
		}
	}

	return user;
}
