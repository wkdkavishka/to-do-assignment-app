"use client";

import { useSignIn, useUser } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import LoadingAnimation from "@/components/shared/loadingAnimationComp";

export default function SignInPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { isLoaded, signIn, setActive } = useSignIn();
	const { isSignedIn } = useUser();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [pending, setPending] = useState(false);
	const [error, setError] = useState("");

	// Auto-redirect if already signed in (e.g. user refreshes sign-in page)
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

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!isLoaded || !signIn) return;

		setPending(true);
		setError("");

		try {
			const result = await signIn.create({
				identifier: email,
				password,
			});

			if (result.status === "complete") {
				await setActive({ session: result.createdSessionId });
				const redirectUrl = searchParams.get("redirect_url") || "/";
				router.replace(redirectUrl);
			} else {
				// Clerk usually provides a better error message, but this is a fallback.
				setError("Login failed. Please check your credentials.");
			}
		} catch (err: any) {
			// Use optional chaining for safer error extraction
			setError(err.errors?.[0]?.message || "Invalid email or password");
		} finally {
			setPending(false);
		}
	};

	return (
		// Updated container for full viewport height and center alignment (X and Y axis)
		<div className="flex min-h-screen items-center justify-center bg-gray-200 p-4">
			<div className="w-full max-w-sm space-y-6">
				{/*
          Clean, minimal sign-in form matching the site's design system
        */}
				<form
					onSubmit={handleLogin}
					className="flex flex-col gap-6 rounded-xl border border-gray-200 bg-white p-8 shadow-sm animate-fadeIn"
				>
					<h1 className="text-3xl font-bold text-center text-gradient tracking-wide">
						User Login
					</h1>

					<div className="mb-2 text-center text-gray-600">
						Welcome back to your To-Do List!
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
								showPassword ? "Hide password" : "Show password"
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
						{pending ? "Signing in..." : "Login"}
					</button>

					<div className="text-center text-sm">
						<a
							href="/forgot-password"
							className="font-medium text-emerald-600 hover:text-emerald-700 transition"
						>
							Forgot Password?
						</a>
					</div>

					<div className="text-center text-sm">
						<span className="text-gray-600">
							Don't have an account?{" "}
						</span>
						<a
							href="/sign-up"
							className="font-medium text-emerald-600 hover:text-emerald-700 transition"
						>
							Sign Up
						</a>
					</div>
				</form>
			</div>
		</div>
	);
}
