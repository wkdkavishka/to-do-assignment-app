// app/page.tsx
"use client";

import { SignOutButton, useUser } from "@clerk/nextjs";
import NextImage from "next/image";
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
		<main className="min-h-screen flex flex-col items-center justify-center p-6">
			{/* Main Card Container */}
			<div className="w-full max-w-[1400px] rounded-2xl overflow-hidden shadow-2xl flex flex-col lg:flex-row animate-fadeIn">
				{/* ==================== LEFT: IMAGE ==================== */}
				<div className="relative w-full lg:w-1/2 h-96 lg:h-auto lg:min-h-[600px]">
					<NextImage
						src="/Images/main.jpg"
						alt="Todo Application"
						fill
						sizes="(max-width: 1024px) 100vw, 50vw"
						className="object-cover"
						priority
					/>
					{/* Gradient Overlay */}
					<div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 via-purple-600/20 to-pink-600/30" />
				</div>

				{/* ==================== RIGHT: CONTENT CARD ==================== */}
				<div className="w-full lg:w-1/2 bg-gradient-to-br from-white to-gray-50 flex items-center justify-center p-10 lg:p-16 xl:p-20">
					<div className="w-full max-w-md space-y-8">
						{/* Logo/Icon */}
						<div className="text-center animate-fadeIn">
							<div className="inline-block p-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl shadow-lg mb-6">
								<span className="text-6xl">✅</span>
							</div>
							<h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
								Todo App
							</h1>
							<p className="text-gray-600 text-lg">
								{isSignedIn
									? "Manage your tasks efficiently"
									: "Sign in to get started"}
							</p>
						</div>

						{/* Greeting */}
						{isSignedIn && (
							<div
								className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 animate-slideUp"
								style={{ animationDelay: "0.1s" }}
							>
								<p className="text-gray-500 text-sm mb-1">
									Welcome back,
								</p>
								<h2 className="text-2xl font-bold text-gray-900">
									{user?.firstName} {user?.lastName}
								</h2>
							</div>
						)}

						{/* Action Buttons */}
						<div
							className="space-y-4 animate-slideUp"
							style={{
								animationDelay: isSignedIn ? "0.2s" : "0.1s",
							}}
						>
							{isSignedIn ? (
								<>
									<button
										type="button"
										onClick={() => router.push("/todos")}
										className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3"
									>
										<span className="text-2xl">📝</span>
										Go to Todos
									</button>

									<button
										type="button"
										onClick={() => router.push("/user")}
										className="w-full bg-white text-gray-700 text-lg py-4 rounded-xl font-semibold  border-2 border-gray-200 hover:border-blue-300 hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-3"
									>
										<span className="text-2xl">👤</span>
										User Settings
									</button>

									<SignOutButton>
										<button
											type="button"
											className="w-full bg-gray-100 text-gray-700 text-lg py-4 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200 flex items-center justify-center gap-3"
										>
											<span className="text-2xl">🚪</span>
											Sign Out
										</button>
									</SignOutButton>
								</>
							) : (
								<button
									type="button"
									onClick={() => router.push("/sign-in")}
									className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3"
								>
									<span className="text-2xl">🔐</span>
									Sign In
								</button>
							)}
						</div>

						{/* Footer Note */}
						<div
							className="text-center text-sm text-gray-500 pt-6 border-t border-gray-200 animate-fadeIn"
							style={{
								animationDelay: isSignedIn ? "0.3s" : "0.2s",
							}}
						>
							{isSignedIn
								? "✨ Keep track of your daily tasks"
								: "🔒 Secure access • ⚡ Fast login"}
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
