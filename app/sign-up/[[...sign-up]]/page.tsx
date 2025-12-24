"use client";

import { useSignUp, useUser } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { callApi_createUser } from "@/api/user";
import LoadingAnimation from "@/components/shared/loadingAnimationComp";

export default function SignUpPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { isLoaded, signUp, setActive } = useSignUp();
	const { isSignedIn } = useUser();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [verificationCode, setVerificationCode] = useState("");
	const [pendingVerification, setPendingVerification] = useState(false);
	const [pending, setPending] = useState(false);
	const [error, setError] = useState("");

	// Auto-redirect if already signed in
	useEffect(() => {
		if (isLoaded && isSignedIn === true) {
			const redirectUrl = searchParams.get("redirect_url") || "/";
			router.replace(redirectUrl);
		}
	}, [isLoaded, searchParams, router, isSignedIn]);

	if (!isLoaded) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<LoadingAnimation size="md" color="blue" />
			</div>
		);
	}

	const handleSignUp = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!isLoaded || !signUp) return;

		setPending(true);
		setError("");

		try {
			// Create the sign-up with email and password
			await signUp.create({
				emailAddress: email,
				password,
			});

			// Send email verification code
			await signUp.prepareEmailAddressVerification({
				strategy: "email_code",
			});

			// Show verification code input
			setPendingVerification(true);
		} catch (err: any) {
			setError(err.errors?.[0]?.message || "Sign up failed");
		} finally {
			setPending(false);
		}
	};

	const handleVerification = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!isLoaded || !signUp) return;

		setPending(true);
		setError("");

		try {
			// Verify the email address
			const completeSignUp = await signUp.attemptEmailAddressVerification(
				{
					code: verificationCode,
				},
			);

			if (completeSignUp.status === "complete") {
				// Set the active session
				await setActive({ session: completeSignUp.createdSessionId });

				// Small delay to ensure Clerk token propagates
				await new Promise((resolve) => setTimeout(resolve, 500));

				// Create user in backend database
				try {
					await callApi_createUser();
				} catch (error: any) {
					// Ignore duplicate user errors (409) - user already exists
					if (
						!error.message?.includes("409") &&
						!error.message?.includes("already exists")
					) {
						console.error(
							"Failed to create user in database:",
							error,
						);
						// Continue anyway - user is created in Clerk
					}
				}

				// Redirect to home page
				const redirectUrl = searchParams.get("redirect_url") || "/";
				router.replace(redirectUrl);
			} else {
				setError("Verification failed. Please try again.");
			}
		} catch (err: any) {
			setError(err.errors?.[0]?.message || "Invalid verification code");
		} finally {
			setPending(false);
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-200 p-4">
			<div className="w-full max-w-sm space-y-6">
				{!pendingVerification ? (
					<form
						onSubmit={handleSignUp}
						className="flex flex-col gap-6 rounded-xl border border-gray-200 bg-white p-8 shadow-sm animate-fadeIn"
					>
						<h1 className="text-3xl font-bold text-center text-gradient tracking-wide">
							Create Account
						</h1>

						<div className="mb-2 text-center text-gray-600">
							Join us and start organizing your tasks!
						</div>

						<input
							type="email"
							placeholder="Email address"
							required
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full rounded-lg border border-gray-300 bg-slate-50 p-3 text-gray-800 outline-none transition focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
						/>

						<div className="relative">
							<input
								type={showPassword ? "text" : "password"}
								placeholder="Password"
								required
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="w-full rounded-lg border border-gray-300 bg-slate-50 p-3 pr-12 text-gray-800 outline-none transition focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
								aria-label={
									showPassword
										? "Hide password"
										: "Show password"
								}
							>
								{showPassword ? (
									<FaEyeSlash className="h-5 w-5" />
								) : (
									<FaEye className="h-5 w-5" />
								)}
							</button>
						</div>

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
							{pending ? "Creating account..." : "Sign Up"}
						</button>

						<div className="text-center text-sm">
							<span className="text-gray-600">
								Already have an account?{" "}
							</span>
							<a
								href="/sign-in"
								className="font-medium text-emerald-600 hover:text-emerald-700 transition"
							>
								Sign In
							</a>
						</div>
					</form>
				) : (
					<form
						onSubmit={handleVerification}
						className="flex flex-col gap-6 rounded-xl border border-gray-200 bg-white p-8 shadow-sm animate-fadeIn"
					>
						<h1 className="text-3xl font-bold text-center text-gradient tracking-wide">
							Verify Email
						</h1>

						<div className="mb-2 text-center text-gray-600">
							We sent a verification code to{" "}
							<strong>{email}</strong>
						</div>

						<input
							type="text"
							placeholder="Verification code"
							required
							value={verificationCode}
							onChange={(e) =>
								setVerificationCode(e.target.value)
							}
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
							{pending ? "Verifying..." : "Verify Email"}
						</button>

						<div className="text-center text-sm">
							<button
								type="button"
								onClick={() => {
									setPendingVerification(false);
									setVerificationCode("");
									setError("");
								}}
								className="font-medium text-emerald-600 hover:text-emerald-700 transition"
							>
								← Back to sign up
							</button>
						</div>
					</form>
				)}
			</div>
		</div>
	);
}
