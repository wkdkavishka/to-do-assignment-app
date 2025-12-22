// api/todos.ts
// Todos API calls

import { ApiRouteHelpers, ApiRoutes, DedupKeyHelpers } from "./comman/api.enum";
import {
	authenticatedDelete,
	authenticatedGet,
	authenticatedPatch,
	authenticatedPost,
	dedupedFetch,
} from "./comman/core";

export interface Todo {
	id: number;
	title: string;
	description: string;
	isCompleted: boolean;
	userId: string;
}

export interface PaginatedTodosResponse {
	data: {
		todos: Todo[];
		total: number;
		page: number;
		totalPages: number;
	};
}

export interface GetTodosParams {
	page?: number;
	limit?: number;
	search?: string;
	filter?: "all" | "active" | "completed";
}

/**
 * Fetch todos for the authenticated user
 */
export async function callApi_getTodos(
	params: GetTodosParams = {},
): Promise<PaginatedTodosResponse["data"]> {
	const { page = 1, limit = 10, search, filter = "all" } = params;

	return dedupedFetch(
		DedupKeyHelpers.getTodosPaginated(page, limit, filter, search),
		async () => {
			const url = ApiRouteHelpers.todosWithParams({
				page,
				limit,
				search,
				filter,
			});
			const response =
				await authenticatedGet<PaginatedTodosResponse>(url);
			return response.data;
		},
	);
}

/**
 * Create a new todo
 */
export async function callApi_createTodo(
	title: string,
	description: string,
): Promise<Todo> {
	return dedupedFetch(DedupKeyHelpers.createTodo(title), async () => {
		const response = await authenticatedPost<{ data: Todo }>(
			ApiRoutes.TODOS,
			{
				title,
				description,
			},
		);
		return response.data;
	});
}

/**
 * Update a todo
 */
export async function callApi_updateTodo(
	id: number,
	updates: {
		title?: string;
		description?: string;
		isCompleted?: boolean;
	},
): Promise<Todo> {
	return dedupedFetch(DedupKeyHelpers.updateTodo(id), async () => {
		const response = await authenticatedPatch<{ data: Todo }>(
			ApiRouteHelpers.todoById(id),
			updates,
		);
		return response.data;
	});
}

/**
 * Delete a todo
 */
export async function callApi_deleteTodo(id: number): Promise<void> {
	return dedupedFetch(DedupKeyHelpers.deleteTodo(id), async () => {
		await authenticatedDelete(ApiRouteHelpers.todoById(id));
	});
}
