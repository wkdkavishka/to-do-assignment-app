"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Unauthorized() {
	const router = useRouter();

	return (
		<div className="min-h-screen gradient-bg flex items-center justify-center p-4">
			<div className="max-w-md w-full bg-white rounded-xl p-10 text-center animate-fadeIn border border-gray-100">
				<div className="mb-8">
					<div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6 animate-scaleIn">
						<svg
							className="w-10 h-10 text-red-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<title>Unauthorized Access</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
							/>
						</svg>
					</div>
					<h1 className="text-3xl md:text-4xl font-bold text-gradient mb-4">
						Unauthorized Access
					</h1>
					<p className="text-gray-600 text-lg">
						You don't have permission to access this page. Please
						contact your administrator if you believe this is an
						error.
					</p>
				</div>

				<div
					className="space-y-4 animate-slideUp"
					style={{ animationDelay: "0.2s" }}
				>
					<Link
						href="/"
						className="btn-primary w-full inline-flex items-center justify-center"
					>
						<svg
							className="w-5 h-5 mr-2"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<title>Go to Homepage</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
							/>
						</svg>
						🏠 Go to Homepage
					</Link>

					<button
						type="button"
						onClick={() => router.back()}
						className="btn-ghost w-full inline-flex items-center justify-center"
					>
						<svg
							className="w-5 h-5 mr-2"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<title>Go Back</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M10 19l-7-7m0 0l7-7m-7 7h18"
							/>
						</svg>
						← Go Back
					</button>
				</div>

				<div
					className="mt-8 pt-6 border-t border-gray-200 animate-fadeIn"
					style={{ animationDelay: "0.3s" }}
				>
					<p className="text-sm text-gray-600">
						Need help?{" "}
						<Link
							href="/contact"
							className="text-gradient font-semibold hover:underline"
						>
							Contact Support
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
