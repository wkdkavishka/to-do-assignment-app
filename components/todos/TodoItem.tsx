// components/todos/TodoItem.tsx
"use client";

import { useState } from "react";

export interface Todo {
	id: number;
	title: string;
	description: string;
	isCompleted: boolean;
}

interface TodoItemProps {
	todo: Todo;
	onToggle: (id: number, isCompleted: boolean) => Promise<void>;
	onDelete: (id: number) => Promise<void>;
	onEdit: (id: number, title: string, description: string) => Promise<void>;
}

export default function TodoItem({
	todo,
	onToggle,
	onDelete,
	onEdit,
}: TodoItemProps) {
	const [isDeleting, setIsDeleting] = useState(false);
	const [isToggling, setIsToggling] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [editedTitle, setEditedTitle] = useState(todo.title);
	const [editedDescription, setEditedDescription] = useState(
		todo.description,
	);

	const handleToggle = async () => {
		setIsToggling(true);
		try {
			await onToggle(todo.id, !todo.isCompleted);
		} finally {
			setIsToggling(false);
		}
	};

	const handleDelete = async () => {
		if (window.confirm("Are you sure you want to delete this todo?")) {
			setIsDeleting(true);
			try {
				await onDelete(todo.id);
			} catch (error) {
				setIsDeleting(false);
			}
		}
	};

	const handleEdit = () => {
		setEditedTitle(todo.title);
		setEditedDescription(todo.description);
		setIsEditing(true);
	};

	const handleSave = async () => {
		if (!editedTitle.trim()) {
			alert("Title cannot be empty!");
			return;
		}

		if (editedTitle.length > 200) {
			alert("Title is too long (max 200 characters)");
			return;
		}

		if (editedDescription.length > 1000) {
			alert("Description is too long (max 1000 characters)");
			return;
		}

		setIsSaving(true);
		try {
			await onEdit(todo.id, editedTitle.trim(), editedDescription.trim());
			setIsEditing(false);
		} catch (error) {
			console.error("Failed to save todo:", error);
		} finally {
			setIsSaving(false);
		}
	};

	const handleCancel = () => {
		setEditedTitle(todo.title);
		setEditedDescription(todo.description);
		setIsEditing(false);
	};

	return (
		<div
			className={`group p-5 bg-white rounded-xl border-2 transition-all duration-200 hover:shadow-md ${
				todo.isCompleted
					? "border-green-200 bg-green-50/50"
					: "border-gray-200 hover:border-blue-300"
			} ${isDeleting || isSaving ? "opacity-50 pointer-events-none" : ""}`}
		>
			{isEditing ? (
				// Edit Mode
				<div className="space-y-4">
					{/* Title Input */}
					<div>
						<label
							htmlFor={`title-${todo.id}`}
							className="block text-sm font-medium text-gray-700 mb-2"
						>
							Title <span className="text-red-500">*</span>
						</label>
						<input
							type="text"
							id={`title-${todo.id}`}
							value={editedTitle}
							onChange={(e) => setEditedTitle(e.target.value)}
							placeholder="Enter todo title..."
							className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-black"
							disabled={isSaving}
							maxLength={200}
						/>
						<p className="text-xs text-gray-500 mt-1">
							{editedTitle.length}/200
						</p>
					</div>

					{/* Description Input */}
					<div>
						<label
							htmlFor={`description-${todo.id}`}
							className="block text-sm font-medium text-gray-700 mb-2"
						>
							Description
						</label>
						<textarea
							id={`description-${todo.id}`}
							value={editedDescription}
							onChange={(e) =>
								setEditedDescription(e.target.value)
							}
							placeholder="Add a description (optional)..."
							rows={3}
							className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none resize-none text-black"
							disabled={isSaving}
							maxLength={1000}
						/>
						<p className="text-xs text-gray-500 mt-1">
							{editedDescription.length}/1000
						</p>
					</div>

					{/* Action Buttons */}
					<div className="flex gap-2 justify-end">
						<button
							type="button"
							onClick={handleCancel}
							disabled={isSaving}
							className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
						>
							Cancel
						</button>
						<button
							type="button"
							onClick={handleSave}
							disabled={isSaving || !editedTitle.trim()}
							className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{isSaving ? "Saving..." : "Save"}
						</button>
					</div>
				</div>
			) : (
				// View Mode
				<div className="flex items-start gap-4">
					{/* Checkbox */}
					<button
						type="button"
						onClick={handleToggle}
						disabled={isToggling}
						className={`flex-shrink-0 w-6 h-6 rounded-md border-2 transition-all duration-200 mt-1 ${
							todo.isCompleted
								? "bg-green-500 border-green-500"
								: "border-gray-300 hover:border-blue-500"
						} ${isToggling ? "opacity-50 cursor-wait" : "cursor-pointer"}`}
					>
						{todo.isCompleted && (
							<svg
								className="w-full h-full text-white"
								fill="none"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="3"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path d="M5 13l4 4L19 7" />
							</svg>
						)}
					</button>

					{/* Content */}
					<div className="flex-1 min-w-0">
						<h3
							className={`text-lg font-semibold mb-1 ${
								todo.isCompleted
									? "text-gray-500 line-through"
									: "text-gray-900"
							}`}
						>
							{todo.title}
						</h3>
						<p
							className={`text-sm ${
								todo.isCompleted
									? "text-gray-400"
									: "text-gray-600"
							}`}
						>
							{todo.description}
						</p>
					</div>

					{/* Action Buttons */}
					<div className="flex gap-1">
						{/* Edit Button */}
						<button
							type="button"
							onClick={handleEdit}
							className="flex-shrink-0 p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
							title="Edit todo"
						>
							<svg
								className="w-5 h-5"
								fill="none"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
							</svg>
						</button>

						{/* Delete Button */}
						<button
							type="button"
							onClick={handleDelete}
							disabled={isDeleting}
							className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100 disabled:opacity-50 disabled:cursor-wait"
							title="Delete todo"
						>
							<svg
								className="w-5 h-5"
								fill="none"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
							</svg>
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
