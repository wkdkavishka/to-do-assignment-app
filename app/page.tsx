// app/page.tsx
"use client";

import { SignOutButton, useUser } from "@clerk/nextjs";
import NextImage from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
	FaChevronDown,
	FaChevronLeft,
	FaChevronRight,
	FaChevronUp,
	FaSearch,
} from "react-icons/fa";
import { callApi_getActivePaper_Full, callApi_getTimetable } from "@/api";
import ContactSection from "@/components/home/ContactSection";
import LoadingAnimation from "@/components/shared/loadingAnimationComp";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { siteData } from "@/data/site-data";
import type { TimetableEntry } from "@/types/api";

export default function Home() {
	const { isLoaded, isSignedIn, user } = useUser();
	const router = useRouter();
	const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
	const [loadingTimetable, setLoadingTimetable] = useState(true);
	const [showAll, setShowAll] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 5;

	useEffect(() => {
		if (document.fullscreenElement) {
			document.exitFullscreen();
		}
		fetchTimetable();
	}, []); // fetchTimetable is stable as it uses callApi_getTimetable which is external

	const fetchTimetable = async () => {
		try {
			const data = await callApi_getTimetable();
			setTimetable(data);
		} catch (error) {
			console.error("Error fetching timetable:", error);
		} finally {
			setLoadingTimetable(false);
		}
	};

	const filteredTimetable = timetable.filter(
		(item) =>
			item.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
			item.day.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	const totalPages = Math.ceil(filteredTimetable.length / itemsPerPage);
	const paginatedTimetable = filteredTimetable.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage,
	);

	const displayedTimetable =
		timetable.length > 10
			? paginatedTimetable
			: showAll
				? timetable
				: timetable.slice(0, 7);

	if (!isLoaded) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<LoadingAnimation size="md" color="blue" />
			</div>
		);
	}

	return (
		<main className="min-h-screen flex flex-col items-center p-6 pt-10 lg:pt-16">
			{/* Main Card Container */}
			<div className="w-full max-w-[1600px] rounded-xl overflow-hidden h-1/2 flex flex-col lg:flex-row animate-fadeIn">
				{/* ==================== LEFT: IMAGE ==================== */}
				<div className="relative w-full lg:w-2/3 h-96 lg:h-auto">
					<NextImage
						src="/Images/main.jpg"
						alt="Korean Class Portal"
						fill
						sizes="(max-width: 1024px) 100vw, 60vw"
						className="object-cover"
						priority
					/>
					{/* Modern Overlay with Gradient */}
					{/* <div className="absolute inset-0 flex items-end">
            <div className="p-10 text-white"> */}
					{/* <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3 animate-slideUp">
                {siteData.ClassDetails.name}
              </h1> */}
					{/* <p
                className="text-lg md:text-xl lg:text-2xl opacity-95 max-w-lg animate-slideUp"
                style={{ animationDelay: "0.1s" }}
              >
                {siteData.ClassDetails.description}
              </p> */}
					{/* </div>
          </div> */}
				</div>

				{/* ==================== RIGHT: CONTENT CARD ==================== */}
				<div className="w-full lg:w-1/3 bg-white flex items-center justify-center p-10 lg:p-16 xl:p-20">
					<div className="w-full max-w-md space-y-10">
						{/* Greeting */}
						<div className="text-center animate-fadeIn">
							{isSignedIn ? (
								<>
									<h2 className="text-3xl md:text-4xl font-bold text-gradient mb-3">
										Welcome back!
									</h2>
									<p className="text-xl md:text-2xl text-gray-700 font-semibold">
										{user?.firstName} {user?.lastName}
									</p>
								</>
							) : (
								<>
									<h2 className="text-3xl md:text-4xl font-bold text-gradient mb-3">
										{siteData.ClassDetails.name}
									</h2>
									<p className="text-gray-600 text-lg">
										Sign in to access your Class Portal
									</p>
								</>
							)}
						</div>

						{/* Action Buttons */}
						<div
							className="space-y-4 animate-slideUp"
							style={{ animationDelay: "0.2s" }}
						>
							{isSignedIn ? (
								<>
									{user?.publicMetadata.role === "admin" ? (
										<>
											<button
												type="button"
												onClick={() =>
													router.push("/admin")
												}
												className="w-full btn-success text-lg py-4 rounded-xl"
											>
												⚙️ Admin Panel
											</button>

											<SignOutButton>
												<button
													type="button"
													className="w-full btn-danger text-lg py-4 rounded-xl"
												>
													🚪 Sign Out
												</button>
											</SignOutButton>
										</>
									) : (
										<>
											<button
												type="button"
												onClick={async () => {
													try {
														const paper =
															await callApi_getActivePaper_Full();
														if (paper) {
															router.push(
																`/student/handlePaper/prepare?paperId=${paper.id}`,
															);
														} else {
															// No active paper - still go to prepare, it will show "no paper" message
															router.push(
																"/student/handlePaper/prepare",
															);
														}
													} catch (error) {
														console.error(
															"Failed to fetch active paper:",
															error,
														);
														// On error, still navigate - prepare page will handle it
														router.push(
															"/student/handlePaper/prepare",
														);
													}
												}}
												className="w-full btn-primary text-lg py-4 rounded-xl"
											>
												📝 Go to Paper
											</button>

											{user?.publicMetadata.role ===
												"teacher" && (
												<button
													type="button"
													onClick={() =>
														router.push("/teacher")
													}
													className="w-full btn-success text-lg py-4 rounded-xl"
												>
													👨‍🏫 Teacher Dashboard
												</button>
											)}

											<SignOutButton>
												<button
													type="button"
													className="w-full btn-danger text-lg py-4 rounded-xl"
												>
													🚪 Sign Out
												</button>
											</SignOutButton>
										</>
									)}
								</>
							) : (
								<button
									type="button"
									onClick={() => router.push("/sign-in")}
									className="w-full btn-primary text-lg py-4 rounded-xl"
								>
									🔐 Sign In
								</button>
							)}
						</div>

						{/* Footer Note */}
						<div
							className="text-center text-sm text-gray-500 pt-6 border-t border-gray-200 animate-fadeIn"
							style={{ animationDelay: "0.3s" }}
						>
							{isSignedIn
								? "✨ Ready to continue your exam"
								: "🔒 Secure access • ⚡ Fast login"}
						</div>
					</div>
				</div>
			</div>

			{/* Timetable & Contact Section */}
			<div className="w-full max-w-[1600px] mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
				{/* Contact Info */}
				<ContactSection />

				{/* Timetable */}
				<RevealOnScroll delay={200}>
					<div className="bg-white rounded-xl p-8 shadow-sm h-full flex flex-col">
						<div className="flex justify-between items-center mb-6">
							<h2 className="text-2xl font-bold text-gray-800">
								Class Timetable
							</h2>
							{timetable.length > 10 && (
								<div className="relative">
									<input
										type="text"
										placeholder="Search..."
										value={searchQuery}
										onChange={(e) => {
											setSearchQuery(e.target.value);
											setCurrentPage(1);
										}}
										className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-48"
									/>
									<FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3 h-3" />
								</div>
							)}
						</div>

						{loadingTimetable ? (
							<div className="flex justify-center py-8">
								<LoadingAnimation size="sm" color="blue" />
							</div>
						) : (
							<div className="flex-1 flex flex-col">
								<div className="space-y-4 flex-1">
									{displayedTimetable.length > 0 ? (
										displayedTimetable.map((item) => (
											<div
												key={item.id}
												className="flex justify-between items-center border-b border-gray-100 pb-3 last:border-0"
											>
												<div>
													<p className="font-semibold text-gray-700">
														{item.day}
													</p>
													<p className="text-sm text-gray-500">
														{item.subject}
													</p>
												</div>
												<span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
													{item.time}
												</span>
											</div>
										))
									) : (
										<p className="text-gray-500 text-center py-4">
											No classes found.
										</p>
									)}
								</div>

								{/* Controls */}
								<div className="mt-6 pt-4 border-t border-gray-100">
									{timetable.length > 10 ? (
										<div className="flex justify-between items-center">
											<button
												type="button"
												onClick={() =>
													setCurrentPage((p) =>
														Math.max(1, p - 1),
													)
												}
												disabled={currentPage === 1}
												className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg disabled:opacity-50"
											>
												<FaChevronLeft />
											</button>
											<span className="text-sm text-gray-600">
												Page {currentPage} of{" "}
												{totalPages}
											</span>
											<button
												type="button"
												onClick={() =>
													setCurrentPage((p) =>
														Math.min(
															totalPages,
															p + 1,
														),
													)
												}
												disabled={
													currentPage === totalPages
												}
												className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg disabled:opacity-50"
											>
												<FaChevronRight />
											</button>
										</div>
									) : timetable.length > 7 ? (
										<button
											type="button"
											onClick={() => setShowAll(!showAll)}
											className="w-full py-2 flex items-center justify-center gap-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium"
										>
											{showAll ? (
												<>
													Show Less <FaChevronUp />
												</>
											) : (
												<>
													Show More <FaChevronDown />
												</>
											)}
										</button>
									) : null}
								</div>
							</div>
						)}
					</div>
				</RevealOnScroll>
			</div>

			{/* Class Images Gallery */}
			<RevealOnScroll
				delay={400}
				className="w-full max-w-[1600px] mt-8 mb-16"
			>
				<h2 className="text-2xl font-bold mb-6 text-gray-800 px-2">
					Class Gallery
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{siteData.classImages.map((img, index) => (
						<div
							key={img}
							className="relative h-64 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
						>
							<NextImage
								src={img}
								alt={`Class image ${index + 1}`}
								fill
								className="object-cover group-hover:scale-105 transition-transform duration-500"
								sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
							/>
						</div>
					))}
				</div>
			</RevealOnScroll>
		</main>
	);
}
