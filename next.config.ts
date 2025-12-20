import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	reactCompiler: true,
	// output: "", // Enable standalone output for Docker optimization
	experimental: {
		optimizePackageImports: ["react-icons", "@clerk/nextjs"],
	},
};

export default nextConfig;
