//  components/shared/alertModal.tsx
"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";

export interface AlertModalProps {
	isOpen: boolean;
	onClose: () => void;
	type: "success" | "error" | "warning" | "info" | "confirm";
	title?: string;
	message: string;
	confirmText?: string;
	cancelText?: string;
	onConfirm?: () => void | Promise<void>;
	showCancel?: boolean;
	isLoading?: boolean;
}

export default function AlertModal({
	isOpen,
	onClose,
	type,
	title,
	message,
	confirmText = "OK",
	cancelText = "Cancel",
	onConfirm,
	showCancel = false,
	isLoading = false,
}: AlertModalProps) {
	// Handle keyboard events
	useEffect(() => {
		if (!isOpen) return;

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape" && !isLoading) {
				onClose();
			} else if (e.key === "Enter" && onConfirm && !isLoading) {
				onConfirm();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, onClose, onConfirm, isLoading]);

	if (!isOpen || typeof document === "undefined") return null;

	// Type-based styling
	const typeConfig = {
		success: {
			icon: "✓",
			iconBg: "bg-green-100",
			iconColor: "text-green-600",
			buttonBg: "bg-green-600 hover:bg-green-700",
		},
		error: {
			icon: "✕",
			iconBg: "bg-red-100",
			iconColor: "text-red-600",
			buttonBg: "bg-red-600 hover:bg-red-700",
		},
		warning: {
			icon: "⚠",
			iconBg: "bg-yellow-100",
			iconColor: "text-yellow-600",
			buttonBg: "bg-yellow-600 hover:bg-yellow-700",
		},
		info: {
			icon: "ℹ",
			iconBg: "bg-blue-100",
			iconColor: "text-blue-600",
			buttonBg: "bg-blue-600 hover:bg-blue-700",
		},
		confirm: {
			icon: "?",
			iconBg: "bg-purple-100",
			iconColor: "text-purple-600",
			buttonBg: "bg-purple-600 hover:bg-purple-700",
		},
	};

	const config = typeConfig[type];

	return createPortal(
		// biome-ignore lint/a11y/noStaticElementInteractions: todo: wix with windsurfer
		<div
			className="fixed inset-0 bg-black/30 backdrop-blur-lg flex items-center justify-center z-[9999] p-4 animate-fadeIn"
			style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
			onClick={(e) => {
				if (e.target === e.currentTarget && !isLoading) onClose();
			}}
		>
			<div className="bg-white border-1 border-blue-500 rounded-3xl shadow-2xl p-8 w-full max-w-md animate-scaleInrelative overflow-hidden">
				{/* Decorative background blob */}
				<div
					className={`absolute -top-10 -right-10 w-32 h-32 rounded-full ${config.iconBg} opacity-20 blur-2xl`}
				/>

				{/* Icon */}
				<div className="flex justify-center mb-6 relative">
					<div
						className={`w-20 h-20 rounded-full ${config.iconBg} flex items-center justify-center shadow-inner`}
					>
						<span
							className={`text-4xl font-bold ${config.iconColor}`}
						>
							{config.icon}
						</span>
					</div>
				</div>

				{/* Title */}
				{title && (
					<h2 className="text-2xl font-bold text-gray-900 text-center mb-3">
						{title}
					</h2>
				)}

				{/* Message */}
				<p className="text-gray-600 text-center mb-8 text-lg leading-relaxed whitespace-pre-line">
					{message}
				</p>

				{/* Buttons */}
				<div className="flex justify-center gap-4">
					{showCancel && (
						<button
							type="button"
							onClick={onClose}
							disabled={isLoading}
							className="px-6 py-3 rounded-xl font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors w-full disabled:opacity-50"
						>
							{cancelText}
						</button>
					)}
					<button
						type="button"
						onClick={() => {
							if (onConfirm) {
								onConfirm();
							} else {
								onClose();
							}
						}}
						disabled={isLoading}
						className={`px-6 py-3 rounded-xl font-semibold text-white shadow-lg transition-all transform active:scale-95 w-full flex items-center justify-center gap-2 ${
							type === "error" || type === "warning"
								? "bg-red-500 hover:bg-red-600 shadow-red-500/30"
								: "bg-green-500 hover:bg-green-600 shadow-green-500/30"
						} disabled:opacity-50 disabled:cursor-not-allowed`}
					>
						{isLoading && (
							<svg
								className="animate-spin h-5 w-5"
								viewBox="0 0 24 24"
								fill="none"
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
						)}
						{confirmText}
					</button>
				</div>
			</div>
		</div>,
		document.body,
	);
}
