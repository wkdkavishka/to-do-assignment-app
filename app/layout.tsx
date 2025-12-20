// app/layout.tsx
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { AudioProvider } from "@/app/contexts/AudioContext";
import { ConditionalFooter } from "@/components/footer/conditionalFooterComp";
import { ConditionalNavbar } from "@/components/navbar/conditionalNavbarComp";
import { AlertProvider } from "@/components/shared/AlertProvider";
import { siteMetadata, viewport } from "@/data/metadata";
import { TokenBridge } from "@/utils/auth/TokenBridge";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

// Export metadata and viewport
export const metadata = siteMetadata;
export { viewport };

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ClerkProvider>
			<TokenBridge />
			<html lang="en">
				{/* Body */}
				<body
					className={`${geistSans.variable} ${geistMono.variable} antialiased`}
					suppressHydrationWarning
				>
					<AudioProvider>
						<AlertProvider>
							<div className="min-h-screen bg-slate-200 ">
								{/* Navbar */}
								<ConditionalNavbar />

								{/* Main Content */}
								<div className="min-h-screen pt-8 lg:pt-10">
									{children}
								</div>

								{/* Footer */}
								<ConditionalFooter />
							</div>
						</AlertProvider>
					</AudioProvider>
				</body>
			</html>
		</ClerkProvider>
	);
}
