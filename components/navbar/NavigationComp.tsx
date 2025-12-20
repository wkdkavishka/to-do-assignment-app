// components/navbar/NavigationComp.tsx
"use client";

import { SignOutButton, useUser } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { callApi_createPaper, callApi_getCurrentCreatingPaper } from "@/api";
import { useGlobalAlert } from "@/components/shared/AlertProvider";
import { siteData } from "@/data/site-data";

export const NavigationComp = () => {
	const router = useRouter();
	const pathname = usePathname();
	const { isSignedIn, user } = useUser();
	const { showError } = useGlobalAlert();
	const [isScrolled, setIsScrolled] = useState(false);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [isCreatingPaper, setIsCreatingPaper] = useState(false);

	// Helper function to get role-based colors
	const getRoleColors = () => {
		const role = user?.publicMetadata?.role as string;
		if (role === "admin") {
			return {
				bg: "bg-red-100",
				text: "text-red-700",
				border: "border-red-200",
				darkBg: "bg-red-700",
			};
		}
		if (role === "teacher") {
			return {
				bg: "bg-orange-100",
				text: "text-orange-700",
				border: "border-orange-200",
				darkBg: "bg-orange-700",
			};
		}
		return {
			bg: "bg-green-100",
			text: "text-green-700",
			border: "border-green-200",
			darkBg: "bg-green-700",
		};
	};

	const roleColors = getRoleColors();

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 10);
		};
		handleScroll();
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	// Close sidebar on pathname change
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		setIsSidebarOpen(false);
	}, [pathname]);

	// 1. Close sidebar on sign out
	useEffect(() => {
		if (!isSignedIn) {
			setIsSidebarOpen(false);
		}
	}, [isSignedIn]);

	// Lock body scroll when sidebar is open
	useEffect(() => {
		if (isSidebarOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "unset";
		}
		return () => {
			document.body.style.overflow = "unset";
		};
	}, [isSidebarOpen]);

	const handleAddPaperClick = async () => {
		if (isCreatingPaper) return;
		setIsCreatingPaper(true);
		try {
			// 1. Check if there is already a creating paper
			const currentPaper = await callApi_getCurrentCreatingPaper();

			if (currentPaper) {
				router.push(`/teacher/addPaper?paperId=${currentPaper.id}`);
				setIsSidebarOpen(false);
				return;
			}

			// 2. If not, create a new one
			const newPaper = await callApi_createPaper(
				`New Paper - ${new Date().toLocaleDateString()}`,
			);
			router.push(`/teacher/addPaper?paperId=${newPaper.id}`);
			setIsSidebarOpen(false);
		} catch (error) {
			console.error("Failed to handle add paper:", error);
			showError("Failed to initialize paper. Please try again.");
		} finally {
			setIsCreatingPaper(false);
		}
	};

	const showBackground = isScrolled;

	return (
		<>
			<nav
				className={`w-full fixed top-0 z-50 transition-all duration-300 border-b-1 border-green-400 ${
					showBackground
						? "bg-white/80 backdrop-blur-md"
						: "bg-white/90 backdrop-blur-md" // while on top
				}  animate-fadeIn`}
			>
				<div className="relative flex h-16 items-center justify-between px-6 sm:px-8 max-w-7xl mx-auto">
					{/* --- DESKTOP: Left Spacer --- */}
					<div className="hidden w-10 lg:block" />

					{/* --- TITLE / LOGO --- */}
					<div className="flex items-center lg:absolute lg:inset-x-0 lg:justify-center lg:pointer-events-none">
						<h1
							onClick={() => router.push("/")}
							className="cursor-pointer text-2xl md:text-3xl font-bold transition-all hover:scale-105 select-none pointer-events-auto text-gradient"
						>
							{siteData.ClassDetails.name}
						</h1>
					</div>

					{/* --- RIGHT SIDE: Triggers --- */}
					{isSignedIn && (
						<>
							{/* DESKTOP TRIGGER */}
							<div className="hidden lg:flex items-center gap-3 ml-auto relative pointer-events-auto">
								<button
									type="button"
									onClick={() => setIsSidebarOpen(true)}
									className="flex items-center gap-3 focus:outline-none group p-1 rounded-full hover:bg-gray-50 transition-colors"
								>
									<div className="text-right transition-opacity group-hover:opacity-80">
										<p className="text-sm font-semibold text-gray-700">
											{user?.firstName} {user?.lastName}
										</p>
										<p className="text-xs text-gray-500">
											{(user?.publicMetadata
												?.role as string) || "Student"}
										</p>
									</div>
									<div
										className={`w-10 h-10 rounded-full ${roleColors.bg} flex items-center justify-center ${roleColors.text} font-bold text-lg transition-transform group-hover:scale-105 border ${roleColors.border} overflow-hidden`}
									>
										{user?.imageUrl ? (
											<img
												src={user.imageUrl}
												alt="Profile"
												className="w-full h-full object-cover"
											/>
										) : (
											user?.firstName?.charAt(0) || "U"
										)}
									</div>
								</button>
							</div>

							{/* MOBILE TRIGGER */}
							<div className="lg:hidden flex items-center ml-auto">
								<button
									type="button"
									onClick={() => setIsSidebarOpen(true)}
									className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg focus:outline-none"
								>
									<svg
										className="w-6 h-6"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<title>Menu</title>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M4 6h16M4 12h16M4 18h16"
										/>
									</svg>
								</button>
							</div>
						</>
					)}
				</div>
			</nav>

			{/* --- UNIFIED SIDEBAR DRAWER --- */}
			{isSidebarOpen && (
				<div className="fixed inset-0 z-[100]">
					<button
						type="button"
						className="fixed inset-0 bg-white/10 backdrop-blur-sm transition-opacity"
						onClick={() => setIsSidebarOpen(false)}
					/>

					<div className="fixed right-0 top-0 h-screen w-[85%] max-w-sm bg-white shadow-2xl animate-slideInRight flex flex-col border-l border-gray-200">
						{/* Header */}
						<div className="flex items-center justify-between p-5 border-b border-gray-100 shrink-0">
							<h2 className="font-bold text-lg text-gray-800">
								Menu
							</h2>
							<button
								type="button"
								onClick={() => setIsSidebarOpen(false)}
								className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors focus:outline-none"
							>
								<svg
									className="w-6 h-6"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<title>Close</title>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</button>
						</div>

						{/* 3. SAFE RENDER: Only show content if user exists */}
						{user ? (
							<>
								<div className="p-6 bg-gray-50 shrink-0">
									<div className="flex items-center gap-4 mb-2">
										<div
											className={`w-12 h-12 rounded-full ${roleColors.darkBg} flex items-center justify-center text-white font-bold text-xl border ${roleColors.border} shadow-sm overflow-hidden`}
										>
											{user.imageUrl ? (
												<img
													src={user.imageUrl}
													alt="Profile"
													className="w-full h-full object-cover"
												/>
											) : (
												user.firstName?.charAt(0) || "U"
											)}
										</div>
										<div>
											<p className="font-bold text-gray-800 text-lg">
												{user.firstName} {user.lastName}
											</p>
											<span className="inline-block px-2 py-0.5 text-xs font-medium bg-white border border-gray-200 rounded-full text-gray-600 capitalize">
												{(user.publicMetadata
													?.role as string) ||
													"Student"}
											</span>
										</div>
									</div>
									<p className="text-sm text-gray-500 truncate">
										{user.primaryEmailAddress?.emailAddress}
									</p>
								</div>

								<div className="flex-1 overflow-y-auto py-2">
									<div className="px-4 space-y-1">
										{user.publicMetadata?.role ===
											"admin" && (
											<button
												type="button"
												onClick={() => {
													router.push("/admin");
													setIsSidebarOpen(false);
												}}
												className="w-full flex items-center gap-3 p-4 text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-xl transition-all font-medium group"
											>
												<span className="text-xl group-hover:scale-110 transition-transform">
													⚙️
												</span>
												Admin Panel
											</button>
										)}

										{user.publicMetadata?.role ===
											"teacher" && (
											<>
												<button
													type="button"
													onClick={() => {
														router.push("/teacher");
														setIsSidebarOpen(false);
													}}
													className="w-full flex items-center gap-3 p-4 text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-xl transition-all font-medium group"
												>
													<span className="text-xl group-hover:scale-110 transition-transform">
														👨‍🏫
													</span>
													Teacher Dashboard
												</button>
												<button
													type="button"
													onClick={
														handleAddPaperClick
													}
													disabled={isCreatingPaper}
													className="w-full flex items-center gap-3 p-4 text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-xl transition-all font-medium group disabled:opacity-50 disabled:cursor-not-allowed"
												>
													<span className="text-xl group-hover:scale-110 transition-transform">
														{isCreatingPaper
															? "⏳"
															: "📝"}
													</span>
													{isCreatingPaper
														? "Initializing..."
														: "Add Paper"}
												</button>
												<button
													type="button"
													onClick={() => {
														router.push(
															"/teacher/managePaperGroups",
														);
														setIsSidebarOpen(false);
													}}
													className="w-full flex items-center gap-3 p-4 text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-xl transition-all font-medium group"
												>
													<span className="text-xl group-hover:scale-110 transition-transform">
														📑
													</span>
													Manage Paper Groups
												</button>
												<button
													type="button"
													onClick={() => {
														router.push(
															"/teacher/submissions",
														);
														setIsSidebarOpen(false);
													}}
													className="w-full flex items-center gap-3 p-4 text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-xl transition-all font-medium group"
												>
													<span className="text-xl group-hover:scale-110 transition-transform">
														📊
													</span>
													Exam Submissions
												</button>
												<button
													type="button"
													onClick={() => {
														router.push(
															"/teacher/profile",
														);
														setIsSidebarOpen(false);
													}}
													className="w-full flex items-center gap-3 p-4 text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-xl transition-all font-medium group"
												>
													<span className="text-xl group-hover:scale-110 transition-transform">
														👤
													</span>
													Profile
												</button>
											</>
										)}

										{/* Student Links (or common links) */}
										{(!user.publicMetadata?.role ||
											user.publicMetadata?.role ===
												"student") && (
											<>
												<button
													type="button"
													onClick={() => {
														router.push("/student");
														setIsSidebarOpen(false);
													}}
													className="w-full flex items-center gap-3 p-4 text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-xl transition-all font-medium group"
												>
													<span className="text-xl group-hover:scale-110 transition-transform">
														📚
													</span>
													Student Dashboard
												</button>
												<button
													type="button"
													onClick={() => {
														router.push(
															"/student/paper/setup",
														);
														setIsSidebarOpen(false);
													}}
													className="w-full flex items-center gap-3 p-4 text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-xl transition-all font-medium group"
												>
													<span className="text-xl group-hover:scale-110 transition-transform">
														📝
													</span>
													Active Paper
												</button>
												<button
													type="button"
													onClick={() => {
														router.push(
															"/student/paperGroups",
														);
														setIsSidebarOpen(false);
													}}
													className="w-full flex items-center gap-3 p-4 text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-xl transition-all font-medium group"
												>
													<span className="text-xl group-hover:scale-110 transition-transform">
														📚
													</span>
													My Paper Groups
												</button>
												<button
													type="button"
													onClick={() => {
														router.push("/student");
														setIsSidebarOpen(false);
													}}
													className="w-full flex items-center gap-3 p-4 text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-xl transition-all font-medium group"
												>
													<span className="text-xl group-hover:scale-110 transition-transform">
														🏆
													</span>
													Results
												</button>
											</>
										)}
									</div>
								</div>

								<div className="p-4 border-t border-gray-100 shrink-0">
									<SignOutButton>
										<button
											type="button"
											onClick={() =>
												setIsSidebarOpen(false)
											} // 4. Close immediately on click
											className="w-full flex items-center justify-center gap-2 p-4 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors font-semibold"
										>
											🚪 Sign Out
										</button>
									</SignOutButton>
								</div>
							</>
						) : (
							// Empty/Loading state if user data is cleared while menu is open
							<div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
								Signing out...
							</div>
						)}
					</div>
				</div>
			)}
		</>
	);
};
