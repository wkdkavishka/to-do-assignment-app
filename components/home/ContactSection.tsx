"use client";

import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { siteData } from "@/data/site-data";

export default function ContactSection() {
	return (
		<RevealOnScroll className="h-fit">
			<div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
				<div className="p-6 border-b border-gray-100">
					<div className="flex items-center gap-4">
						<div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-xl">
							📞
						</div>
						<div className="text-left">
							<h2 className="text-xl font-bold text-gray-800">
								Contact Information
							</h2>
							<p className="text-sm text-gray-500">
								Get in touch with us
							</p>
						</div>
					</div>
				</div>

				<div className="p-8 space-y-6">
					<div className="flex items-start space-x-4">
						<div className="w-10 h-10 bg-red-300 rounded-lg flex items-center justify-center ">
							📍
						</div>
						<div>
							<p className="font-semibold text-gray-700">
								Address
							</p>
							<p className="text-gray-600">
								{siteData.ClassDetails.Address}
							</p>
						</div>
					</div>
					<div className="flex items-start space-x-4">
						<div className="w-10 h-10 bg-gray-300 rounded-lg flex items-center justify-center">
							📞
						</div>
						<div>
							<p className="font-semibold text-gray-700">Phone</p>
							<a href={`tel:${siteData.ClassDetails.Phone}`}>
								<p className="text-gray-600">
									+{siteData.ClassDetails.Phone}
								</p>
							</a>
						</div>
					</div>
					<div className="flex items-start space-x-4">
						<div className="w-10 h-10 bg-green-300 rounded-lg flex items-center justify-center ">
							💬
						</div>
						<div>
							<p className="font-semibold text-gray-700">
								WhatsApp
							</p>
							<a
								href={`https://wa.me/${siteData.ClassDetails.Whatsapp}`}
								target="_blank"
								rel="noopener noreferrer"
								className="text-green-800 hover:underline"
							>
								+{siteData.ClassDetails.Whatsapp}
							</a>
						</div>
					</div>
					<div className="flex items-start space-x-4">
						<div className="w-10 h-10 bg-blue-300 rounded-lg flex items-center justify-center ">
							✉️
						</div>
						<div>
							<p className="font-semibold text-gray-700">Email</p>
							<a href={`mailto:${siteData.ClassDetails.Email}`}>
								<p className="text-gray-600">
									{siteData.ClassDetails.Email}
								</p>
							</a>
						</div>
					</div>
				</div>
			</div>
		</RevealOnScroll>
	);
}
