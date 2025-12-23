// components/todos/AddTodoForm.tsx
"use client";

import { useState } from "react";

interface AddTodoFormProps {
	onAdd: (title: string, description: string) => Promise<void>;
}

export default function AddTodoForm({ onAdd }: AddTodoFormProps) {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isExpanded, setIsExpanded] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!title.trim()) return;

		setIsSubmitting(true);
		try {
			await onAdd(title.trim(), description.trim());
			setTitle("");
			setDescription("");
			setIsExpanded(false);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="bg-white rounded-xl p-6 shadow-sm border-2 border-gray-200">
			<h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
				<span className="text-lg">➕</span>
				Add New Todo
			</h2>

			<form onSubmit={handleSubmit} className="space-y-4">
				{/* Title Input */}
				<div>
					<label
						htmlFor="title"
						className="block text-sm font-medium text-gray-700 mb-2"
					>
						Title <span className="text-red-500">*</span>
					</label>
					<input
						type="text"
						id="title"
						value={title}
						onChange={(e) => {
							setTitle(e.target.value);
							if (!isExpanded && e.target.value)
								setIsExpanded(true);
						}}
						placeholder="Enter todo title..."
						className="w-full px-4 py-3 placeholder:text-gray-500  text-black border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
						required
						disabled={isSubmitting}
					/>
				</div>

				{/* Description Input - Show when user starts typing */}
				{isExpanded && (
					<div className="animate-slideDown">
						<label
							htmlFor="description"
							className="block text-sm font-medium text-gray-700 mb-2"
						>
							Description
						</label>
						<textarea
							id="description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder="Add a description (optional)..."
							rows={3}
							className="w-full px-4 py-3 border-2 placeholder:text-gray-500  text-black border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none resize-none"
							disabled={isSubmitting}
						/>
					</div>
				)}

				{/* Submit Button */}
				<button
					type="submit"
					disabled={!title.trim() || isSubmitting}
					className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
				>
					{isSubmitting ? (
						<span className="flex items-center justify-center gap-2">
							<svg
								className="animate-spin h-5 w-5"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
							>
								<circle
									className="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									strokeWidth="4"
								/>
								<path
									className="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								/>
							</svg>
							Adding...
						</span>
					) : (
						"Add Todo"
					)}
				</button>
			</form>
		</div>
	);
}
