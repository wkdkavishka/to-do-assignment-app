#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("🚀 Starting production build process...\n");

// Step 1: Run npm build
console.log("📦 Step 1/5: Building Next.js application...");
try {
	execSync("npm run build", { stdio: "inherit" });
	console.log("✅ Build completed successfully!\n");
} catch {
	console.error("❌ Build failed!");
	process.exit(1);
}

// Step 2: Remove dist folder if it exists
console.log("🗑️  Step 2/5: Cleaning up old dist folder...");
const distPath = path.join(__dirname, "dist");
if (fs.existsSync(distPath)) {
	fs.rmSync(distPath, { recursive: true, force: true });
	console.log("✅ Old dist folder removed\n");
} else {
	console.log("ℹ️  No existing dist folder found\n");
}

// Step 3: Create new dist folder
console.log("📁 Step 3/5: Creating new dist folder...");
fs.mkdirSync(distPath, { recursive: true });
console.log("✅ Dist folder created\n");

// Step 4: Copy .next/standalone/ contents to dist/
console.log("📋 Step 4/5: Copying build artifacts...");

const standalonePath = path.join(__dirname, ".next", "standalone");
if (!fs.existsSync(standalonePath)) {
	console.error("❌ Error: .next/standalone folder not found!");
	console.error('Make sure next.config.ts has output: "standalone"');
	process.exit(1);
}

// Copy standalone contents to dist
console.log("  → Copying .next/standalone/ to dist/...");
copyRecursive(standalonePath, distPath);
console.log("  ✅ Standalone files copied");

// Copy public folder to dist/public
const publicPath = path.join(__dirname, "public");
const distPublicPath = path.join(distPath, "public");
if (fs.existsSync(publicPath)) {
	console.log("  → Copying public/ to dist/public/...");
	copyRecursive(publicPath, distPublicPath);
	console.log("  ✅ Public files copied");
} else {
	console.log("  ⚠️  No public folder found, skipping...");
}

// Copy .next/static to dist/.next/static
const staticPath = path.join(__dirname, ".next", "static");
const distNextPath = path.join(distPath, ".next");
const distStaticPath = path.join(distNextPath, "static");

if (fs.existsSync(staticPath)) {
	console.log("  → Copying .next/static/ to dist/.next/static/...");
	fs.mkdirSync(distNextPath, { recursive: true });
	copyRecursive(staticPath, distStaticPath);
	console.log("  ✅ Static files copied");
} else {
	console.log("  ⚠️  No .next/static folder found, skipping...");
}

console.log("\n✅ All artifacts copied successfully!\n");

// Step 5: Display summary
console.log("📊 Step 5/5: Build Summary");
console.log("─".repeat(50));

const distSize = getFolderSize(distPath);
console.log(`📦 Dist folder size: ${formatBytes(distSize)}`);
console.log(`📁 Dist location: ${distPath}`);
console.log("─".repeat(50));

console.log("\n🎉 Production build completed successfully!");
console.log("\n📝 Next steps:");
console.log("  1. Build Docker image: npm run docker:build-local");
console.log("  2. Run container: npm run docker:run-local");
console.log("  or simply: npm run docker:dev-local\n");

// Helper function to copy files recursively
function copyRecursive(src, dest) {
	const stats = fs.statSync(src);

	if (stats.isDirectory()) {
		if (!fs.existsSync(dest)) {
			fs.mkdirSync(dest, { recursive: true });
		}

		const entries = fs.readdirSync(src);
		for (const entry of entries) {
			copyRecursive(path.join(src, entry), path.join(dest, entry));
		}
	} else {
		fs.copyFileSync(src, dest);
	}
}

// Helper function to get folder size
function getFolderSize(folderPath) {
	let totalSize = 0;

	function calculateSize(itemPath) {
		const stats = fs.statSync(itemPath);

		if (stats.isDirectory()) {
			const entries = fs.readdirSync(itemPath);
			for (const entry of entries) {
				calculateSize(path.join(itemPath, entry));
			}
		} else {
			totalSize += stats.size;
		}
	}

	if (fs.existsSync(folderPath)) {
		calculateSize(folderPath);
	}

	return totalSize;
}

// Helper function to format bytes
function formatBytes(bytes) {
	if (bytes === 0) return "0 Bytes";

	const k = 1024;
	const sizes = ["Bytes", "KB", "MB", "GB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return Math.round((bytes / k ** i) * 100) / 100 + " " + sizes[i];
}
