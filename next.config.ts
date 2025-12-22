import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	reactCompiler: true,
	// output: "", // Enable standalone output for Docker optimization
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "img.clerk.com",
			},
		],
	},
	experimental: {
		optimizePackageImports: ["react-icons", "@clerk/nextjs"],
	},
};

export default nextConfig;
