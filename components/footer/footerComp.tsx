// components/footer/footerComp.tsx

import { FaEnvelope, FaWhatsapp } from "react-icons/fa";
import { siteData } from "@/data/site-data";

export const Footer = () => {
	return (
		<footer className="glass-card-solid">
			<div className="px-6 py-3">
				{/* Bottom: Copyright */}
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
		</footer>
	);
};
