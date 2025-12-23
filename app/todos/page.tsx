// app/todos/page.tsx
"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight, FaSearch } from "react-icons/fa";
import {
	callApi_createTodo,
	callApi_deleteTodo,
	callApi_getTodos,
	callApi_updateTodo,
} from "@/api/todos";
import AlertModal from "@/components/shared/alertModal";
import LoadingAnimation from "@/components/shared/loadingAnimationComp";
import AddTodoForm from "@/components/todos/AddTodoForm";
import TodoItem, { type Todo } from "@/components/todos/TodoItem";
import { useUserRegistration } from "@/hooks/useUserRegistration";

type FilterType = "all" | "active" | "completed";

interface AlertState {
	isOpen: boolean;
	type: "success" | "error" | "warning" | "info";
	title?: string;
	message: string;
}

export default function TodosPage() {
	const router = useRouter();
	const { isLoaded, isSignedIn } = useUser();
	const {
		isReady,
		isRegistering,
		error: registrationError,
	} = useUserRegistration();

	const [todos, setTodos] = useState<Todo[]>([]);
	const [loading, setLoading] = useState(true);
	const [filter, setFilter] = useState<FilterType>("all");
	const [searchQuery, setSearchQuery] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [total, setTotal] = useState(0);
	const itemsPerPage = 6;

	// Alert modal state
	const [alert, setAlert] = useState<AlertState>({
		isOpen: false,
		type: "info",
		message: "",
	});

	const showAlert = (
		type: AlertState["type"],
		message: string,
		title?: string,
	) => {
		setAlert({ isOpen: true, type, message, title });
	};

	const closeAlert = () => {
		setAlert((prev) => ({ ...prev, isOpen: false }));
	};

	// Redirect if not signed in
	useEffect(() => {
		if (isLoaded && !isSignedIn) {
			router.replace("/sign-in");
		}
	}, [isLoaded, isSignedIn, router]);

	// Fetch todos from API
	const fetchTodos = useCallback(async () => {
		setLoading(true);
		try {
			const result = await callApi_getTodos({
				page: currentPage,
				limit: itemsPerPage,
				search: searchQuery || undefined,
				filter,
			});

			setTodos(result.todos);
			setTotal(result.total);
			setTotalPages(result.totalPages);
		} catch (error) {
			console.error("Failed to fetch todos:", error);
			setTodos([]);
		} finally {
			setLoading(false);
		}
	}, [currentPage, searchQuery, filter]);

	// Fetch when filters change - but only if user is registered
	useEffect(() => {
		if (isReady) {
			fetchTodos();
		}
	}, [isReady, fetchTodos]);

	const handleAddTodo = async (title: string, description: string) => {
		try {
			await callApi_createTodo(title, description);
			await fetchTodos(); // Refresh list
			showAlert("success", "Todo created successfully!", "Success");
		} catch (error) {
			console.error("Failed to add todo:", error);
			showAlert(
				"error",
				"Failed to add todo. Please try again.",
				"Error",
			);
		}
	};

	const handleToggleTodo = async (id: number, isCompleted: boolean) => {
		try {
			await callApi_updateTodo(id, { isCompleted });
			await fetchTodos(); // Refresh list
		} catch (error) {
			console.error("Failed to update todo:", error);
			showAlert(
				"error",
				"Failed to update todo. Please try again.",
				"Error",
			);
		}
	};

	const handleDeleteTodo = async (id: number) => {
		try {
			await callApi_deleteTodo(id);
			await fetchTodos(); // Refresh list
			showAlert("success", "Todo deleted successfully!", "Success");
		} catch (error) {
			console.error("Failed to delete todo:", error);
			showAlert(
				"error",
				"Failed to delete todo. Please try again.",
				"Error",
			);
		}
	};

	const handleEditTodo = async (
		id: number,
		title: string,
		description: string,
	) => {
		try {
			await callApi_updateTodo(id, { title, description });
			await fetchTodos(); // Refresh list
			showAlert("success", "Todo updated successfully!", "Success");
		} catch (error) {
			console.error("Failed to update todo:", error);
			showAlert(
				"error",
				"Failed to update todo. Please try again.",
				"Error",
			);
		}
	};

	// Show loading while checking auth or registering user
	if (!isLoaded || !isSignedIn || isRegistering) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<LoadingAnimation size="md" color="blue" />
			</div>
		);
	}

	// Show error if registration failed
	if (registrationError) {
		return (
			<div className="flex min-h-screen items-center justify-center px-6">
				<div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md">
					<div className="text-6xl mb-4">⚠️</div>
					<h2 className="text-2xl font-bold text-gray-900 mb-2">
						Registration Failed
					</h2>
					<p className="text-red-600 mb-6">{registrationError}</p>
					<button
						type="button"
						onClick={() => router.push("/sign-in")}
						className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
					>
						Back to Sign In
					</button>
				</div>
			</div>
		);
	}

	// Only show todos page when user is fully registered
	if (!isReady) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<LoadingAnimation size="md" color="blue" />
			</div>
		);
	}

	return (
		<div className="min-h-screen mt-4 bg-slate-200 p-6">
			<div className="max-w-5xl mx-auto">
				{/* Header */}
				<div className="text-center mb-8">
					<div className="inline-block p-5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-lg mb-4 animate-fadeIn">
						<span className="text-5xl">📝</span>
					</div>
					<h1 className="text-4xl font-bold text-gray-900 mb-2 animate-fadeIn">
						My Todos
					</h1>
					<p className="text-gray-600 animate-fadeIn">
						Manage your To Do's Heare
					</p>
				</div>

				{/* Add Todo Form */}
				<div
					className="mb-6 animate-slideUp"
					style={{ animationDelay: "0.1s" }}
				>
					<AddTodoForm onAdd={handleAddTodo} />
				</div>

				{/* Filters and Search */}
				<div
					className="bg-white rounded-xl p-6 shadow-sm border-2 border-gray-200 mb-6 animate-slideUp"
					style={{ animationDelay: "0.2s" }}
				>
					{/* Filter Tabs */}
					<div className="flex flex-wrap gap-2 mb-4">
						{(["all", "active", "completed"] as FilterType[]).map(
							(f) => (
								<button
									key={f}
									type="button"
									onClick={() => {
										setFilter(f);
										setCurrentPage(1);
									}}
									className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
										filter === f
											? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
											: "bg-gray-100 text-gray-700 hover:bg-gray-200"
									}`}
								>
									{f.charAt(0).toUpperCase() + f.slice(1)}
									{f === "all" && ` (${total})`}
								</button>
							),
						)}
					</div>
					cc
					{/* Search Bar */}
					<div className="relative">
						<FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
						<input
							type="text"
							placeholder="Search todos by title or description..."
							value={searchQuery}
							onChange={(e) => {
								setSearchQuery(e.target.value);
								setCurrentPage(1);
							}}
							className="w-full pl-12 pr-4 text-black placeholder:text-gray-500 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
						/>
						{searchQuery && (
							<button
								type="button"
								onClick={() => setSearchQuery("")}
								className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
							>
								✕
							</button>
						)}
					</div>
				</div>

				{/* Todos List */}
				<div
					className="animate-slideUp mb-6"
					style={{ animationDelay: "0.3s" }}
				>
					{loading ? (
						<div className="flex justify-center py-12">
							<LoadingAnimation size="md" color="blue" />
						</div>
					) : todos.length === 0 ? (
						<div className="text-center py-12 bg-white rounded-xl shadow-sm border-2 border-gray-200">
							<div className="text-6xl mb-4">
								{searchQuery
									? "🔍"
									: filter === "completed"
										? "🎯"
										: "📝"}
							</div>
							<h3 className="text-xl font-semibold text-gray-700 mb-2">
								{searchQuery
									? "No todos found"
									: filter === "completed"
										? "No completed todos"
										: filter === "active"
											? "No active todos"
											: "No todos yet"}
							</h3>
							<p className="text-gray-500">
								{searchQuery
									? "Try a different search term"
									: "Add your first todo to get started!"}
							</p>
						</div>
					) : (
						<div className="space-y-3">
							{todos.map((todo) => (
								<TodoItem
									key={todo.id}
									todo={todo}
									onToggle={handleToggleTodo}
									onDelete={handleDeleteTodo}
									onEdit={handleEditTodo}
								/>
							))}
						</div>
					)}
				</div>

				{/* Pagination */}
				{totalPages > 1 && (
					<div className="flex justify-center items-center gap-4 bg-white rounded-xl p-4 shadow-sm border-2 border-gray-200 animate-fadeIn">
						<button
							type="button"
							onClick={() =>
								setCurrentPage((p) => Math.max(1, p - 1))
							}
							disabled={currentPage === 1}
							className="p-2 rounded-lg border-2 border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-blue-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-200"
						>
							<FaChevronLeft />
						</button>
						<span className="text-sm font-medium text-gray-700">
							Page {currentPage} of {totalPages}
						</span>
						<button
							type="button"
							onClick={() =>
								setCurrentPage((p) =>
									Math.min(totalPages, p + 1),
								)
							}
							disabled={currentPage === totalPages}
							className="p-2 rounded-lg border-2 border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-blue-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-200"
						>
							<FaChevronRight />
						</button>
					</div>
				)}

				{/* Navigation Buttons */}
				{/* <div className="flex gap-4 mt-8 animate-fadeIn">
					<button
						type="button"
						onClick={() => router.push("/")}
						className="flex-1 bg-white text-gray-700 py-3 rounded-xl font-semibold border-2 border-gray-200 hover:border-blue-300 hover:bg-gray-50 transition-all duration-200"
					>
						🏠 Home
					</button>
					<button
						type="button"
						onClick={() => router.push("/user")}
						className="flex-1 bg-white text-gray-700 py-3 rounded-xl font-semibold border-2 border-gray-200 hover:border-blue-300 hover:bg-gray-50 transition-all duration-200"
					>
						👤 Profile
					</button>
				</div> */}
			</div>

			{/* Alert Modal */}
			<AlertModal
				isOpen={alert.isOpen}
				onClose={closeAlert}
				type={alert.type}
				title={alert.title}
				message={alert.message}
			/>
		</div>
	);
}
