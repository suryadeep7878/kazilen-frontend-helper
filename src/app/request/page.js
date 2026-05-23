"use client";

import { useState, useEffect } from "react";

import { apiRequest } from '@/utils/api';

export default function RequestsPage() {
	const [request, setRequest] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		async function fetchRequest() {
			try {
				setIsLoading(true);
				const data = await apiRequest("/get-book");

				if (data && Object.keys(data).length > 0) {
					setRequest(data);
				} else {
					setRequest(null);
				}
			} catch (err) {
				console.error("Error fetching request:", err);
				setError("Failed to load your request. Please try again later.");
			} finally {
				setIsLoading(false);
			}
		}

		fetchRequest();
	}, []);

	if (isLoading) {
		return (
			<div className="flex justify-center items-center min-h-[400px]">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="max-w-2xl mx-auto mt-8 p-4 bg-red-50 text-red-700 rounded-lg">
				{error}
			</div>
		);
	}

	return (
		<div className="max-w-2xl mx-auto p-6">
			<h1 className="text-2xl font-bold mb-6 text-gray-800">
				Your Book Requests
			</h1>

			{request ? (
				/* Rectangle Card Layout */
				<div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
					<div className="flex justify-between items-start">
						<div>
							<span className="inline-block text-xs font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 mb-3">
								{request.status || "Pending"}
							</span>
							<h2 className="text-xl font-bold text-gray-900 mb-1">
								{request.title}
							</h2>
							<p className="text-gray-600 font-medium">by {request.author}</p>
						</div>

						{request.date && (
							<span className="text-sm text-gray-400">
								{new Date(request.date).toLocaleDateString()}
							</span>
						)}
					</div>

					<div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
						<button className="text-sm text-blue-600 font-semibold hover:text-blue-800 transition-colors">
							View Details →
						</button>
					</div>
				</div>
			) : (
				/* Empty State Layout */
				<div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-12 text-center">
					<div className="text-gray-400 mb-3">
						<svg
							className="mx-auto h-12 w-12"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={1.5}
								d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
							/>
						</svg>
					</div>
					<h3 className="text-lg font-medium text-gray-900 mb-1">
						No requests found
					</h3>
					<p className="text-gray-500 text-sm max-w-sm mx-auto">
						You currently haven't submitted any book requests. When you do, they
						will show up right here.
					</p>
				</div>
			)}
		</div>
	);
}
