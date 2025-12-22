// api/comman/api.enum.ts
// Centralized deduplication keys for API calls

/**
 * Deduplication keys for API calls
 * These keys are used with dedupedFetch to prevent duplicate simultaneous requests
 */
export enum ApiDedupKeys {
	// User
	CREATE_USER = "createUser",

	// To-dos
	GET_TODOS = "getTodos",
}

/**
 * Helper functions for dynamic deduplication keys
 */
export const DedupKeyHelpers = {
	// User
	createUser: (email: string) => `createUser-${email}`,

	// To-dos
	createTodo: (title: string) => `createTodo-${title}`,
	updateTodo: (id: number) => `updateTodo-${id}`,
	deleteTodo: (id: number) => `deleteTodo-${id}`,
	getTodosPaginated: (
		page: number,
		limit: number,
		filter: string,
		search?: string,
	) => `todos-${page}-${limit}-${filter}-${search || ""}`,
};

/**
 * API Route paths
 * Centralized definitions for all backend API routes
 */
export enum ApiRoutes {
	// User
	USER_CREATE = "/api/v0/user/create",
	USER_GET = "/api/v0/user",

	// To-dos
	TODOS = "/api/v0/todos",
}

/**
 * Helper functions for dynamic API routes
 */
export const ApiRouteHelpers = {
	// To-dos
	todoById: (id: number) => `${ApiRoutes.TODOS}/${id}`,
	todosWithParams: (params: {
		page?: number;
		limit?: number;
		search?: string;
		filter?: string;
	}) => {
		const queryParams = new URLSearchParams();
		if (params.page) queryParams.append("page", params.page.toString());
		if (params.limit) queryParams.append("limit", params.limit.toString());
		if (params.search) queryParams.append("search", params.search);
		if (params.filter) queryParams.append("filter", params.filter);
		return `${ApiRoutes.TODOS}?${queryParams.toString()}`;
	},
};
