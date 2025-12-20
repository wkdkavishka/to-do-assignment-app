"use client";

import type React from "react";
import { createContext, useCallback, useContext, useState } from "react";
import AlertModal, { type AlertModalProps } from "./alertModal";

interface AlertContextType {
	showAlert: (
		message: string,
		type?: AlertModalProps["type"],
		title?: string,
	) => void;
	showSuccess: (message: string, title?: string) => void;
	showError: (message: string, title?: string) => void;
	showWarning: (message: string, title?: string) => void;
	showInfo: (message: string, title?: string) => void;
	showConfirm: (
		message: string,
		options?: {
			title?: string;
			confirmText?: string;
			cancelText?: string;
		},
	) => Promise<boolean>;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: React.ReactNode }) {
	const [alertState, setAlertState] = useState<AlertModalProps>({
		isOpen: false,
		onClose: () => {},
		type: "info",
		message: "",
	});

	const closeAlert = useCallback(() => {
		setAlertState((prev) => ({ ...prev, isOpen: false }));
	}, []);

	const showAlert = useCallback(
		(
			message: string,
			type: AlertModalProps["type"] = "info",
			title?: string,
		) => {
			setAlertState({
				isOpen: true,
				onClose: closeAlert,
				type,
				title,
				message,
				showCancel: false,
			});
		},
		[closeAlert],
	);

	const showSuccess = useCallback(
		(message: string, title?: string) =>
			showAlert(message, "success", title),
		[showAlert],
	);

	const showError = useCallback(
		(message: string, title?: string) => showAlert(message, "error", title),
		[showAlert],
	);

	const showWarning = useCallback(
		(message: string, title?: string) =>
			showAlert(message, "warning", title),
		[showAlert],
	);

	const showInfo = useCallback(
		(message: string, title?: string) => showAlert(message, "info", title),
		[showAlert],
	);

	const showConfirm = useCallback(
		(
			message: string,
			options?: {
				title?: string;
				confirmText?: string;
				cancelText?: string;
			},
		): Promise<boolean> => {
			return new Promise((resolve) => {
				setAlertState({
					isOpen: true,
					type: "confirm",
					title: options?.title,
					message,
					confirmText: options?.confirmText || "Confirm",
					cancelText: options?.cancelText || "Cancel",
					showCancel: true,
					onClose: () => {
						closeAlert();
						resolve(false);
					},
					onConfirm: () => {
						closeAlert();
						resolve(true);
					},
				});
			});
		},
		[closeAlert],
	);

	return (
		<AlertContext.Provider
			value={{
				showAlert,
				showSuccess,
				showError,
				showWarning,
				showInfo,
				showConfirm,
			}}
		>
			{children}
			<AlertModal {...alertState} />
		</AlertContext.Provider>
	);
}

export function useGlobalAlert() {
	const context = useContext(AlertContext);
	if (context === undefined) {
		throw new Error("useGlobalAlert must be used within an AlertProvider");
	}
	return context;
}
