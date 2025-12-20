import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}

export default function PaginationComp({
	currentPage,
	totalPages,
	onPageChange,
}: PaginationProps) {
	if (totalPages <= 1) return null;

	const getPageNumbers = () => {
		const pages = [];
		const maxVisiblePages = 5;

		if (totalPages <= maxVisiblePages) {
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}
		} else {
			if (currentPage <= 3) {
				for (let i = 1; i <= 4; i++) {
					pages.push(i);
				}
				pages.push(-1); // Separator
				pages.push(totalPages);
			} else if (currentPage >= totalPages - 2) {
				pages.push(1);
				pages.push(-1); // Separator
				for (let i = totalPages - 3; i <= totalPages; i++) {
					pages.push(i);
				}
			} else {
				pages.push(1);
				pages.push(-1);
				pages.push(currentPage - 1);
				pages.push(currentPage);
				pages.push(currentPage + 1);
				pages.push(-1);
				pages.push(totalPages);
			}
		}
		return pages;
	};

	return (
		<div className="flex items-center justify-center gap-2 mt-6">
			<button
				type="button"
				onClick={() => onPageChange(currentPage - 1)}
				disabled={currentPage === 1}
				className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-600"
				aria-label="Previous page"
			>
				<FaChevronLeft className="w-4 h-4" />
			</button>

			<div className="flex items-center gap-1">
				{getPageNumbers().map((page, index) => (
					<React.Fragment key={page === -1 ? `sep-${index}` : page}>
						{page === -1 ? (
							<span className="px-2 text-gray-400">...</span>
						) : (
							<button
								type="button"
								onClick={() => onPageChange(page)}
								className={`min-w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${
									currentPage === page
										? "bg-blue-600 text-white shadow-md shadow-blue-200"
										: "text-gray-600 hover:bg-gray-50 border border-transparent hover:border-gray-200"
								}`}
							>
								{page}
							</button>
						)}
					</React.Fragment>
				))}
			</div>

			<button
				type="button"
				onClick={() => onPageChange(currentPage + 1)}
				disabled={currentPage === totalPages}
				className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-600"
				aria-label="Next page"
			>
				<FaChevronRight className="w-4 h-4" />
			</button>
		</div>
	);
}
