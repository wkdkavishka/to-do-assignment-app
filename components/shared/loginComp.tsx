"use client";
// components/loginComp.tsx

import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface LoginCompProps {
	onSuccess?: () => void;
}

export default function LoginComp({ onSuccess }: LoginCompProps) {
	const router = useRouter();
	const { isLoaded: signInLoaded, signIn, setActive } = useSignIn();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [pending, setPending] = useState(false);
	const [error, setError] = useState("");

	async function handleLogin(e: React.FormEvent) {
		e.preventDefault();
		if (!signInLoaded) return;
		setPending(true);
		setError("");

		try {
			const result = await signIn.create({
				identifier: email,
				password,
			});

			if (result.status === "complete") {
				await setActive({ session: result.createdSessionId });
				console.log("Login successful!");
				router.push("/");
				onSuccess?.();
			} else {
				// Handle other statuses if needed, but for password auth, incomplete usually means error
				setError(`Login incomplete: ${result.status}`);
			}
		} catch (err: unknown) {
			const errorMessage =
				err && typeof err === "object" && "errors" in err
					? (err as { errors?: Array<{ message?: string }> })
							.errors?.[0]?.message || "Login failed"
					: err instanceof Error
						? err.message
						: "Login failed";
			setError(errorMessage);
		} finally {
			setPending(false);
		}
	}

	return (
		<form
			className="p-8 bg-white rounded-xl w-full max-w-sm flex flex-col gap-6 border border-gray-200 shadow-sm"
			onSubmit={handleLogin}
		>
			<h1 className="text-3xl font-bold text-center text-gradient tracking-wide">
				Student Login
			</h1>

			<div className="text-center text-gray-600 mb-2">
				Welcome back to your learning portal!
			</div>

			<input
				type="email"
				placeholder="Email address"
				className="border border-gray-300 p-3 bg-slate-50 text-gray-800 rounded-xl w-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition duration-200 outline-none"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
			/>

			<input
				type="password"
				placeholder="Password"
				className="border border-gray-300 p-3 bg-slate-50 text-gray-800 rounded-xl w-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition duration-200 outline-none"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
			/>

			{error && (
				<p className="text-red-500 text-sm text-center font-medium">
					{error}
				</p>
			)}

			<button
				disabled={pending}
				className="btn-primary text-white font-semibold py-3 rounded-xl transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
				type="submit"
			>
				{pending ? "Authenticating..." : "Login"}
			</button>

			<div className="text-center text-sm mt-2">
				<a
					href="/forgot-password"
					className="text-emerald-600 hover:text-emerald-700 font-medium transition duration-200"
				>
					Forgot Password?
				</a>
			</div>
		</form>
	);
}
