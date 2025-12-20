"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useRef, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import LoadingAnimation from "@/components/shared/loadingAnimationComp";

export default function UserProfileComp() {
	const { user, isLoaded } = useUser();
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [currentPassword, setCurrentPassword] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState<{
		type: "success" | "error";
		text: string;
	} | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [showCurrentPassword, setShowCurrentPassword] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	useEffect(() => {
		if (user) {
			setFirstName(user.firstName || "");
			setLastName(user.lastName || "");
		}
	}, [user]);

	// ... (existing handlers)

	const handleImageUpload = async (
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		const file = e.target.files?.[0];
		if (!file || !user) return;

		setLoading(true);
		setMessage(null);
		try {
			await user.setProfileImage({ file });
			setMessage({
				type: "success",
				text: "Profile picture updated successfully!",
			});
		} catch (error: any) {
			console.error("Error updating profile picture:", error);
			setMessage({
				type: "error",
				text:
					error.errors?.[0]?.message ||
					"Failed to update profile picture.",
			});
		} finally {
			setLoading(false);
		}
	};

	const handleUpdateProfile = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!user) return;

		setLoading(true);
		setMessage(null);
		try {
			await user.update({
				firstName,
				lastName,
			});
			setMessage({
				type: "success",
				text: "Profile updated successfully!",
			});
		} catch (error: any) {
			console.error("Error updating profile:", error);
			setMessage({
				type: "error",
				text: error.errors?.[0]?.message || "Failed to update profile.",
			});
		} finally {
			setLoading(false);
		}
	};

	const handleUpdatePassword = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!user) return;

		if (!currentPassword) {
			setMessage({
				type: "error",
				text: "Please enter your current password.",
			});
			return;
		}

		if (password !== confirmPassword) {
			setMessage({ type: "error", text: "Passwords do not match." });
			return;
		}

		if (password.length < 8) {
			setMessage({
				type: "error",
				text: "Password must be at least 8 characters long.",
			});
			return;
		}

		setLoading(true);
		setMessage(null);
		try {
			// Clerk's updatePassword handles verification internally
			await user.updatePassword({
				newPassword: password,
				currentPassword: currentPassword,
				signOutOfOtherSessions: false,
			});

			setMessage({
				type: "success",
				text: "Password updated successfully!",
			});
			setCurrentPassword("");
			setPassword("");
			setConfirmPassword("");
		} catch (error: any) {
			console.error("Error updating password:", error);
			setMessage({
				type: "error",
				text:
					error.errors?.[0]?.message || "Failed to update password.",
			});
		} finally {
			setLoading(false);
		}
	};

	if (!isLoaded || !user) {
		return <LoadingAnimation />;
	}

	return (
		<div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
			<div className="p-6 border-b border-gray-100">
				<div className="flex items-center gap-4">
					<img
						src={user.imageUrl}
						alt="Profile"
						className="w-10 h-10 rounded-full object-cover border border-gray-200"
					/>
					<div className="text-left">
						<h3 className="text-lg font-semibold text-gray-900">
							Profile Settings
						</h3>
						<p className="text-sm text-gray-500">
							Manage your personal information and security
						</p>
					</div>
				</div>
			</div>

			<div className="p-6 space-y-8">
				{message && (
					<div
						className={`p-4 rounded-lg ${
							message.type === "success"
								? "bg-green-50 text-green-700"
								: "bg-red-50 text-red-700"
						} animate-fadeIn`}
					>
						{message.text}
					</div>
				)}

				{/* Profile Picture Section */}
				<div className="mt-6">
					<h3 className="text-sm font-medium text-gray-900 mb-4 uppercase tracking-wider">
						Profile Picture
					</h3>
					<div className="flex items-center gap-6">
						<div className="relative group">
							<img
								src={user.imageUrl}
								alt="Profile"
								className="w-24 h-24 rounded-full object-cover border-2 border-gray-100"
							/>
							{loading && (
								<div className="absolute inset-0 bg-white/50 flex items-center justify-center rounded-full">
									<div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
								</div>
							)}
						</div>
						<div>
							<input
								type="file"
								ref={fileInputRef}
								onChange={handleImageUpload}
								accept="image/*"
								className="hidden"
							/>
							<button
								type="button"
								onClick={() => fileInputRef.current?.click()}
								disabled={loading}
								className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
							>
								Change Photo
							</button>
							<p className="mt-2 text-xs text-gray-500">
								JPG, GIF or PNG. Max size of 800K
							</p>
						</div>
					</div>
				</div>

				<div className="border-t border-gray-100" />

				{/* Personal Information Section */}
				<form onSubmit={handleUpdateProfile}>
					<h3 className="text-sm font-medium text-gray-900 mb-4 uppercase tracking-wider">
						Personal Information
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								First Name
							</label>

							<input
								type="text"
								value={firstName}
								onChange={(e) => setFirstName(e.target.value)}
								disabled={loading}
								className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 transition-all"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Last Name
							</label>
							<input
								type="text"
								value={lastName}
								onChange={(e) => setLastName(e.target.value)}
								disabled={loading}
								className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 transition-all"
							/>
						</div>
					</div>
					<div className="mt-6 flex justify-end">
						<button
							type="submit"
							disabled={loading}
							className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
						>
							{loading ? "Saving..." : "Save Changes"}
						</button>
					</div>
				</form>

				<div className="border-t border-gray-100" />

				{/* Security Section */}
				<form onSubmit={handleUpdatePassword}>
					<h3 className="text-sm font-medium text-gray-900 mb-4 uppercase tracking-wider">
						Security
					</h3>
					<div className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Current Password
							</label>
							<div className="relative">
								<input
									type={
										showCurrentPassword
											? "text"
											: "password"
									}
									value={currentPassword}
									onChange={(e) =>
										setCurrentPassword(e.target.value)
									}
									disabled={loading}
									placeholder="Enter current password"
									className="w-full px-3 py-2 border placeholder:text-gray-700 text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 transition-all"
								/>
								<button
									type="button"
									onClick={() =>
										setShowCurrentPassword(
											!showCurrentPassword,
										)
									}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
									aria-label={
										showCurrentPassword
											? "Hide password"
											: "Show password"
									}
								>
									{showCurrentPassword ? (
										<FaEyeSlash className="h-5 w-5" />
									) : (
										<FaEye className="h-5 w-5" />
									)}
								</button>
							</div>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								New Password
							</label>
							<div className="relative">
								<input
									type={showPassword ? "text" : "password"}
									value={password}
									onChange={(e) =>
										setPassword(e.target.value)
									}
									disabled={loading}
									placeholder="Min. 8 characters"
									className="w-full px-3 py-2 border placeholder:text-gray-700 text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 transition-all"
								/>
								<button
									type="button"
									onClick={() =>
										setShowPassword(!showPassword)
									}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
									aria-label={
										showPassword
											? "Hide password"
											: "Show password"
									}
								>
									{showPassword ? (
										<FaEyeSlash className="h-5 w-5" />
									) : (
										<FaEye className="h-5 w-5" />
									)}
								</button>
							</div>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Confirm New Password
							</label>
							<div className="relative">
								<input
									type={
										showConfirmPassword
											? "text"
											: "password"
									}
									value={confirmPassword}
									onChange={(e) =>
										setConfirmPassword(e.target.value)
									}
									disabled={loading}
									placeholder="Re-enter new password"
									className="w-full px-3 py-2 border placeholder:text-gray-700 text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 transition-all"
								/>
								<button
									type="button"
									onClick={() =>
										setShowConfirmPassword(
											!showConfirmPassword,
										)
									}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
									aria-label={
										showConfirmPassword
											? "Hide password"
											: "Show password"
									}
								>
									{showConfirmPassword ? (
										<FaEyeSlash className="h-5 w-5" />
									) : (
										<FaEye className="h-5 w-5" />
									)}
								</button>
							</div>
						</div>
					</div>
					<div className="mt-6 flex justify-end">
						<button
							type="submit"
							disabled={loading || !password}
							className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 transition-colors"
						>
							{loading ? "Updating..." : "Update Password"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
