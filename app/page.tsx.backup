// app/page.tsx
"use client";

import { SignOutButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import LoadingAnimation from "@/components/shared/loadingAnimationComp";

export default function Home() {
	const { isLoaded, isSignedIn, user } = useUser();
	const router = useRouter();

	if (!isLoaded) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<LoadingAnimation size="md" color="blue" />
			</div>
		);
	}

	return (
		<main className="flex min-h-screen items-center justify-center bg-gray-200 p-4">
			<div className="w-full max-w-sm space-y-6">
				{/* Main Card */}
				<div className="flex flex-col gap-6 rounded-xl border border-gray-200 bg-white p-8 shadow-sm animate-fadeIn">
					{/* Logo/Icon */}
					<div className="text-center">
						<div className="inline-block p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-md mb-4">
							<span className="text-5xl">✅</span>
						</div>
						<h1 className="text-3xl font-bold text-center text-gradient tracking-wide mb-2">
							Todo App
						</h1>
						<p className="text-gray-600">
							{isSignedIn
								? "Manage your tasks"
								: "Sign in to get started"}
						</p>
					</div>

					{/* Action Buttons */}
					<div className="space-y-3">
						{isSignedIn ? (
							<>
								<button
									type="button"
									onClick={() => router.push("/todos")}
									className="btn-primary w-full rounded-xl py-3 font-semibold text-white transition hover:scale-105"
								>
									<span className="text-xl mr-2">📝</span>
									Go to Todos
								</button>

								<button
									type="button"
									onClick={() => router.push("/user")}
									className="w-full bg-white text-gray-700 py-3 rounded-xl font-semibold border-2 border-gray-200 hover:border-emerald-300 hover:bg-gray-50 transition"
								>
									<span className="text-xl mr-2">👤</span>
									User Settings
								</button>

								<SignOutButton>
									<button
										type="button"
										className="w-full bg-gray-100 text-gray-700 bg-red-500/70 hover:bg-red-600/70 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
									>
										<span className="text-xl mr-2">🚪</span>
										Sign Out
									</button>
								</SignOutButton>
							</>
						) : (
							<button
								type="button"
								onClick={() => router.push("/sign-in")}
								className="btn-primary w-full rounded-xl py-3 font-semibold text-white transition hover:scale-105"
							>
								<span className="text-xl mr-2">🔐</span>
								Sign In
							</button>
						)}
					</div>

					{/* Footer Note */}
					<div className="text-center text-sm text-gray-500 pt-4 border-t border-gray-200">
						{isSignedIn
							? "✨ Keep track of your daily tasks"
							: "🔒 Secure access • ⚡ Fast login"}
					</div>
				</div>
			</div>
		</main>
	);
}
