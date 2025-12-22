// app/user/page.tsx
"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import LoadingAnimation from "@/components/shared/loadingAnimationComp";
import UserProfileComp from "@/components/user/UserProfileComp";

export default function UserPage() {
	const router = useRouter();
	const { isLoaded, isSignedIn } = useUser();

	// Redirect if not signed in
	if (isLoaded && !isSignedIn) {
		router.replace("/sign-in");
		return null;
	}

	if (!isLoaded) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<LoadingAnimation size="md" color="blue" />
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-slate-200 flex items-center justify-center p-6">
			<div className="w-full max-w-4xl animate-fadeIn">
				<UserProfileComp />
			</div>
		</div>
	);
}
