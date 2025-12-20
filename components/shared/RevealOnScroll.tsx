"use client";

import { useEffect, useRef, useState } from "react";

interface RevealOnScrollProps {
	children: React.ReactNode;
	className?: string;
	delay?: number;
}

export const RevealOnScroll = ({
	children,
	className = "",
	delay = 0,
}: RevealOnScrollProps) => {
	const [isVisible, setIsVisible] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setIsVisible(true);
					observer.disconnect();
				}
			},
			{
				threshold: 0.1,
				rootMargin: "50px",
			},
		);

		if (ref.current) {
			observer.observe(ref.current);
		}

		return () => observer.disconnect();
	}, []);

	return (
		<div
			ref={ref}
			style={{ transitionDelay: `${delay}ms` }}
			className={`transition-all duration-700 ease-out transform ${
				isVisible
					? "opacity-100 translate-y-0"
					: "opacity-0 translate-y-10"
			} ${className}`}
		>
			{children}
		</div>
	);
};
