"use client";

import { useAuth, useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingAnimation from "@/components/shared/loadingAnimationComp";

export default function ForgotPasswordPage() {
	const router = useRouter();
	const { isLoaded, signIn, setActive } = useSignIn();
	const { isSignedIn } = useAuth();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [code, setCode] = useState("");
	const [successfulCreation, setSuccessfulCreation] = useState(false);
	const [pending, setPending] = useState(false);
	const [error, setError] = useState("");

	// Auto-redirect if already signed in
	useEffect(() => {
		if (isLoaded && isSignedIn === true) {
			router.replace("/");
		}
	}, [isLoaded, isSignedIn, router]);

	if (!isLoaded) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<LoadingAnimation size="md" color="blue" />
			</div>
		);
	}

	// Send the password reset code to the user's email
	const handleSendCode = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!isLoaded || !signIn) return;

		setPending(true);
		setError("");

		try {
			await signIn.create({
				strategy: "reset_password_email_code",
				identifier: email,
			});
			setSuccessfulCreation(true);
		} catch (err: any) {
			setError(err.errors?.[0]?.message || "Failed to send reset code");
		} finally {
			setPending(false);
		}
	};

	// Reset the user's password and sign them in
	const handleResetPassword = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!isLoaded || !signIn) return;

		setPending(true);
		setError("");

		try {
			const result = await signIn.attemptFirstFactor({
				strategy: "reset_password_email_code",
				code,
				password,
			});

			if (result.status === "complete") {
				// Set the active session and sign in the user
				await setActive({ session: result.createdSessionId });
				router.replace("/");
			} else {
				setError("Password reset incomplete. Please try again.");
			}
		} catch (err: any) {
			setError(err.errors?.[0]?.message || "Failed to reset password");
		} finally {
			setPending(false);
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-200 p-4">
			<div className="w-full max-w-sm space-y-6">
				{!successfulCreation ? (
					// Step 1: Enter email
					<form
						onSubmit={handleSendCode}
						className="flex flex-col gap-6 rounded-xl border border-gray-200 bg-white p-8 shadow-sm animate-fadeIn"
					>
						<h1 className="text-3xl font-bold text-center text-gradient tracking-wide">
							Forgot Password?
						</h1>

						<div className="mb-2 text-center text-gray-600">
							Enter your email to receive a password reset code
						</div>

						<input
							type="email"
							placeholder="Email address"
							required
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full rounded-lg border border-gray-300 bg-slate-50 p-3 text-gray-800 outline-none transition focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
						/>

						{error && (
							<p className="rounded bg-red-50 py-2 text-center text-sm font-medium text-red-500">
								{error}
							</p>
						)}

						<button
							type="submit"
							disabled={pending}
							className="btn-primary rounded-xl py-3 font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50"
						>
							{pending ? "Sending..." : "Send Reset Code"}
						</button>

						<div className="text-center text-sm">
							<a
								href="/sign-in"
								className="font-medium text-emerald-600 hover:text-emerald-700 transition"
							>
								Back to Sign In
							</a>
						</div>
					</form>
				) : (
					// Step 2: Enter code and new password
					<form
						onSubmit={handleResetPassword}
						className="flex flex-col gap-6 rounded-xl border border-gray-200 bg-white p-8 shadow-sm animate-fadeIn"
					>
						<h1 className="text-3xl font-bold text-center text-gradient tracking-wide">
							Reset Password
						</h1>

						<div className="mb-2 text-center text-gray-600">
							Enter the code sent to your email and your new
							password
						</div>

						<input
							type="text"
							placeholder="Reset code"
							required
							value={code}
							onChange={(e) => setCode(e.target.value)}
							className="w-full rounded-lg border border-gray-300 bg-slate-50 p-3 text-gray-800 outline-none transition focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
						/>

						<input
							type="password"
							placeholder="New password"
							required
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full rounded-lg border border-gray-300 bg-slate-50 p-3 text-gray-800 outline-none transition focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
						/>

						{error && (
							<p className="rounded bg-red-50 py-2 text-center text-sm font-medium text-red-500">
								{error}
							</p>
						)}

						<button
							type="submit"
							disabled={pending}
							className="btn-primary rounded-xl py-3 font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50"
						>
							{pending ? "Resetting..." : "Reset Password"}
						</button>

						<div className="text-center text-sm">
							<button
								type="button"
								onClick={() => {
									setSuccessfulCreation(false);
									setCode("");
									setPassword("");
									setError("");
								}}
								className="font-medium text-emerald-600 hover:text-emerald-700 transition"
							>
								Resend Code
							</button>
						</div>
					</form>
				)}
			</div>
		</div>
	);
}
