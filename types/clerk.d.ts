import "@clerk/nextjs/server";

declare module "@clerk/nextjs/server" {
	interface ClerkJWTClaims {
		metadata?: {
			role?: "student" | "teacher" | "admin" | string;
		};
		public_metadata?: {
			role?: "student" | "teacher" | "admin" | string;
		};
	}
}
