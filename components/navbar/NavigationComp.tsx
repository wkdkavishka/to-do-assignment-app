// components/navbar/NavigationComp.tsx
"use client";

import { SignOutButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { siteData } from "@/data/site-data";

export const NavigationComp = () => {
	const router = useRouter();
	const pathname = usePathname();
	const { isSignedIn, user } = useUser();
	const [isScrolled, setIsScrolled] = useState(false);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

	// Close sidebar on sign out
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

	const showBackground = isScrolled;

	return (
		<>
			<nav
				className={`w-full fixed top-0 z-50 transition-all duration-300 border-b-1 border-blue-400 ${
					showBackground
						? "bg-white/80 backdrop-blur-md"
						: "bg-white/90 backdrop-blur-md"
				} animate-fadeIn`}
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
							{siteData.siteInformation.name}
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
										{user.firstName && user.lastName ? (
											<p className="text-sm font-semibold text-gray-700">
												{user.firstName} {user.lastName}
											</p>
										) : (
											<p className="text-xs text-amber-600 font-medium">
												{
													user.emailAddresses[0]
														.emailAddress
												}
											</p>
										)}
									</div>
									<div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg transition-transform group-hover:scale-105 overflow-hidden">
										{user?.imageUrl ? (
											<Image
												src={user.imageUrl}
												alt="Profile"
												width={40}
												height={40}
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

			{/* --- SIDEBAR DRAWER --- */}
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

						{user ? (
							<>
								{/* User Info */}
								<div className="p-6 bg-gray-50 shrink-0">
									<div className="flex items-center gap-4 mb-2">
										<div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-sm overflow-hidden">
											{user.imageUrl ? (
												<Image
													src={user.imageUrl}
													alt="Profile"
													width={48}
													height={48}
													className="w-full h-full object-cover"
												/>
											) : (
												user.firstName?.charAt(0) || "U"
											)}
										</div>
										<div>
											{user.firstName && user.lastName ? (
												<p className="font-bold text-gray-800 text-lg">
													{user.firstName}{" "}
													{user.lastName}
												</p>
											) : (
												<p className="text-sm text-amber-600 font-medium">
													update your name
												</p>
											)}
										</div>
									</div>
									<p className="text-sm text-gray-500 truncate">
										{user.primaryEmailAddress?.emailAddress}
									</p>
								</div>

								{/* Navigation Links */}
								<div className="flex-1 overflow-y-auto py-2">
									<div className="px-4 space-y-1">
										{/* Go to Todos */}
										<button
											type="button"
											onClick={() => {
												router.push("/todos");
												setIsSidebarOpen(false);
											}}
											className="w-full flex items-center gap-3 p-4 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-xl transition-all font-medium group"
										>
											<span className="text-xl group-hover:scale-110 transition-transform">
												📝
											</span>
											Go to Todos
										</button>

										{/* Profile */}
										<button
											type="button"
											onClick={() => {
												router.push("/user");
												setIsSidebarOpen(false);
											}}
											className="w-full flex items-center gap-3 p-4 text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-xl transition-all font-medium group"
										>
											<span className="text-xl group-hover:scale-110 transition-transform">
												👤
											</span>
											Profile
										</button>
									</div>
								</div>

								{/* Sign Out */}
								<div className="p-4 border-t border-gray-100 shrink-0">
									<SignOutButton>
										<button
											type="button"
											onClick={() =>
												setIsSidebarOpen(false)
											}
											className="w-full flex items-center justify-center gap-2 p-4 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors font-semibold"
										>
											🚪 Sign Out
										</button>
									</SignOutButton>
								</div>
							</>
						) : (
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
