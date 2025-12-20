// components/footer/footerComp.tsx

import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { FaEnvelope, FaWhatsapp } from "react-icons/fa";
import { siteData } from "@/data/site-data";

export const Footer = () => {
	const { isLoaded, isSignedIn, user } = useUser();

	return (
		<footer className="glass-card-solid">
			<div className="px-6 py-3">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-4">
					{/* Left: Class Info */}
					<div className="space-y-2">
						<h3 className="text-xl font-bold text-gradient mb-3">
							{siteData.ClassDetails.name}
						</h3>
						<p className="text-sm text-gray-600">
							{siteData.ClassDetails.description}
						</p>
					</div>

					{/* Center: Contact */}
					<div className="space-y-2">
						<h4 className="font-semibold text-gray-800 mb-3">
							Contact
						</h4>
						<p className="text-sm text-gray-600 flex items-center gap-2">
							📍 {siteData.ClassDetails.Address}
						</p>
						<p className="text-sm text-gray-600 flex items-center gap-2">
							📞 {siteData.ClassDetails.Phone}
						</p>
						<p className="text-sm text-gray-600 flex items-center gap-2">
							📞 {siteData.ClassDetails.phone2}
						</p>
						<p className="text-sm text-gray-600 flex items-center gap-2">
							✉️ {siteData.ClassDetails.Email}
						</p>
					</div>

					{/* Right: Quick Links */}
					<div className="space-y-2">
						<h4 className="font-semibold text-gray-800 mb-3">
							Quick Links
						</h4>
						<div className="flex flex-col gap-2">
							<Link
								href="/"
								className="text-sm text-gray-600 hover:text-purple-600 transition-colors"
							>
								🏠 Home
							</Link>
							{isSignedIn &&
								user?.publicMetadata.role === "student" && (
									<Link
										href="/student"
										className="text-sm text-gray-600 hover:text-purple-600 transition-colors"
									>
										📚 Student Portal
									</Link>
								)}
							{isSignedIn &&
								user?.publicMetadata.role === "teacher" && (
									<Link
										href="/teacher"
										className="text-sm text-gray-600 hover:text-purple-600 transition-colors"
									>
										👨‍🏫 Teacher Portal
									</Link>
								)}
							{isSignedIn &&
								user?.publicMetadata.role === "admin" && (
									<Link
										href="/admin"
										className="text-sm text-gray-600 hover:text-purple-600 transition-colors"
									>
										⚙️ Admin Portal
									</Link>
								)}
						</div>
					</div>
				</div>

				{/* Bottom: Copyright */}
				<div className="pt-3 border-t border-gray-200">
					<div className="flex flex-col items-center gap-2">
						{/* Copyright Text */}
						<p className="text-base text-gray-600">
							© {new Date().getFullYear()}{" "}
							<a
								href={siteData.authorData.socialData.website}
								className="text-green-600 hover:text-yellow-600 font-semibold transition-colors cursor-pointer"
								target="_blank"
								rel="noopener noreferrer"
							>
								{siteData.authorData.about.name}
							</a>
							. All rights reserved.
						</p>

						{/* Contact Icons */}
						<div className="flex items-center gap-4">
							<a
								href={`mailto:${siteData.authorData.socialData.email}`}
								className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
								aria-label="Email"
							>
								<FaEnvelope className="w-5 h-5" />
								<span className="text-sm sm:inline">
									{siteData.authorData.socialData.email}
								</span>
							</a>
							<a
								href={`https://wa.me/${siteData.authorData.socialData.whatsapp.replace(/\s/g, "")}`}
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors"
								aria-label="WhatsApp"
							>
								<FaWhatsapp className="w-5 h-5" />
								<span className="text-sm sm:inline">
									{siteData.authorData.socialData.whatsapp}
								</span>
							</a>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};
