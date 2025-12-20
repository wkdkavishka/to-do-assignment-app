// app/student/page.tsx
"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { GoHomeButton } from "@/components/GoHomeButton";
import StudentResultsComp from "@/components/student/StudentResultsComp";
import UserProfileComp from "@/components/user/UserProfileComp";

export default function StudentDashboard() {
	const router = useRouter();

	const { user, isLoaded, isSignedIn } = useUser();

	// if user is not signed in or no results found, redirect to home
	if (!user || !isSignedIn) {
		router.replace("/sign-in");
		return null;
	}

	return (
		<div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
			<div className="w-full max-w-4xl">
				{/* Header */}
				<div className="text-center mb-10 animate-fadeIn">
					<h1 className="text-4xl font-bold text-gray-900 mb-2">
						Student Portal
					</h1>
					<p className="text-gray-600">
						Access your exams and results
					</p>
				</div>

				{/* Dashboard Cards */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
					{/* Paper Card */}
					<div
						onClick={() => router.push("/student/paper")}
						className="modern-card cursor-pointer group animate-slideUp"
						style={{ animationDelay: "0.05s" }}
					>
						<div className="flex items-center gap-4">
							<div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
								📝
							</div>
							<div>
								<h3 className="text-xl font-semibold text-gray-900 mb-1">
									Active Paper
								</h3>
								<p className="text-gray-600 text-sm">
									Take your current exam
								</p>
							</div>
						</div>
					</div>

					{/* Results Card */}
					<div
						onClick={() => router.push("/student/results")}
						className="modern-card cursor-pointer group animate-slideUp"
						style={{ animationDelay: "0.1s" }}
					>
						<div className="flex items-center gap-4">
							<div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
								📊
							</div>
							<div>
								<h3 className="text-xl font-semibold text-gray-900 mb-1">
									Last Exam Result
								</h3>
								<p className="text-gray-600 text-sm">
									View your last exam result
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Exam Results */}
				<div
					className="animate-slideUp mb-8"
					style={{ animationDelay: "0.15s" }}
				>
					<div className="modern-card p-6">
						<div className="mb-6">
							<h2 className="text-2xl font-bold text-gray-900 mb-1">
								Your Exam Results
							</h2>
							<p className="text-gray-600">
								View your exam history and scores
							</p>
						</div>
						<StudentResultsComp />
					</div>
				</div>

				{/* User Profile */}
				<div
					className="animate-slideUp mb-8"
					style={{ animationDelay: "0.2s" }}
				>
					<div className="modern-card p-6">
						<div className="mb-6">
							<h2 className="text-2xl font-bold text-gray-900 mb-1">
								Your Profile
							</h2>
							<p className="text-gray-600">
								Manage your account settings
							</p>
						</div>
						<UserProfileComp />
					</div>
				</div>

				{/* Back Button */}
				<div
					className="text-center animate-fadeIn"
					style={{ animationDelay: "0.25s" }}
				>
					<GoHomeButton animationDelay="0.25s" />
				</div>
			</div>
		</div>
	);
}
