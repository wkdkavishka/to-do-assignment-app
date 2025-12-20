import { useCallback, useState } from "react";
import type { AlertModalProps } from "@/components/shared/alertModal";

interface AlertState {
	isOpen: boolean;
	type: AlertModalProps["type"];
	title?: string;
	message: string;
	confirmText?: string;
	cancelText?: string;
	onConfirm?: () => void | Promise<void>;
	showCancel?: boolean;
}

export function useAlert() {
	const [alertState, setAlertState] = useState<AlertState>({
		isOpen: false,
		type: "info",
		message: "",
	});
	const [isLoading, setIsLoading] = useState(false);

	const closeAlert = useCallback(() => {
		setAlertState((prev) => ({ ...prev, isOpen: false }));
		setIsLoading(false);
	}, []);

	const showAlert = useCallback(
		(
			message: string,
			type: AlertModalProps["type"] = "info",
			title?: string,
		) => {
			setAlertState({
				isOpen: true,
				type,
				title,
				message,
				showCancel: false,
			});
		},
		[],
	);

	const showSuccess = useCallback(
		(message: string, title?: string) => {
			showAlert(message, "success", title);
		},
		[showAlert],
	);

	const showError = useCallback(
		(message: string, title?: string) => {
			showAlert(message, "error", title);
		},
		[showAlert],
	);

	const showWarning = useCallback(
		(message: string, title?: string) => {
			showAlert(message, "warning", title);
		},
		[showAlert],
	);

	const showInfo = useCallback(
		(message: string, title?: string) => {
			showAlert(message, "info", title);
		},
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
					onConfirm: async () => {
						setIsLoading(true);
						// Small delay to show loading state
						await new Promise((r) => setTimeout(r, 100));
						closeAlert();
						resolve(true);
					},
				});

				// Override close to resolve false
				const originalClose = closeAlert;
				setAlertState((prev) => ({
					...prev,
					onConfirm: async () => {
						setIsLoading(true);
						await new Promise((r) => setTimeout(r, 100));
						originalClose();
						resolve(true);
					},
				}));
			});
		},
		[closeAlert],
	);

	return {
		alertState: { ...alertState, isLoading },
		closeAlert,
		showAlert,
		showSuccess,
		showError,
		showWarning,
		showInfo,
		showConfirm,
	};
}
