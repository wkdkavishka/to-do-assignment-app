// components/loadingAnimationComp.tsx
interface LoadingAnimationProps {
	size?: "sm" | "md" | "lg";
	color?: "blue" | "gray" | "white" | "gradient";
	className?: string;
}

export default function LoadingAnimation({
	size = "md",
	color = "gradient",
	className = "",
}: LoadingAnimationProps) {
	const sizeClasses = {
		sm: "h-6 w-6 border-2",
		md: "h-12 w-12 border-4",
		lg: "h-16 w-16 border-4",
	};

	const colorClasses = {
		blue: "border-blue-500 border-t-transparent",
		gray: "border-gray-500 border-t-transparent",
		white: "border-white border-t-transparent",
		gradient: "border-purple-500 border-t-transparent",
	};

	return (
		<div className="flex flex-col items-center justify-center gap-4">
			<div
				className={`animate-spin rounded-full ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
			/>
			{color === "gradient" && (
				<p className="text-white font-semibold text-lg animate-pulse">
					Loading...
				</p>
			)}
		</div>
	);
}
