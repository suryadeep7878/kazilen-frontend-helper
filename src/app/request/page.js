"use client";

import { apiRequest } from "@/utils/api";
import React, { useState, useEffect } from "react";

export default function BookActionCard() {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [reqwor, setReqwor] = useState(null);
	useEffect(() => {
		const userId = localStorage.getItem("userId");
		async function fetchActionWorkflow() {
			try {
				setLoading(true);
				setError(null);

				const bookRes = await apiRequest("/get-book", "post", {
					userId: userId,
				});

				let actionRes = null;

				if (bookRes?.work) {
					actionRes = await apiRequest("/get-action", "post", {
						id: bookRes.work,
					});
					setReqwor("work");
				} else if (bookRes?.request) {
					actionRes = await apiRequest("/get-action", "post", {
						id: bookRes.request,
					});
					setReqwor("request");
				}

				if (actionRes) {
					setData(actionRes);
				} else {
					setData({
						customerName: "",
						customerId: "",
						action: "none",
						location: "",
					});
				}
			} catch (err) {
				console.error("Error fetching action:", err);
				setError("Failed to load action data.");
			} finally {
				setLoading(false);
			}
		}

		fetchActionWorkflow();
	}, []);

	const handleAccept = () => {
		const userId = localStorage.getItem("userId");
		const res = apiRequest("/acceptBooking", "post", {
			usr: userId,
			accept: true,
		});
	};

	const handleCancel = () => {
		const userId = localStorage.getItem("userId");
		const res = apiRequest("/acceptBooking", "post", {
			usr: userId,
			accept: false,
		});
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center p-8 text-slate-500">
				<span className="animate-pulse">Loading work details...</span>
			</div>
		);
	}

	if (error) {
		return (
			<div className="text-red-500 font-medium p-4 text-center">{error}</div>
		);
	}

	if (!data || data.action?.toLowerCase() === "none") {
		return (
			<div className="flex items-center justify-center p-8 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 text-slate-400 font-medium max-w-md mx-auto">
				No work here
			</div>
		);
	}

	// --- Card UI Render ---
	return (
		<div className="max-w-md mx-auto bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
			<div className="p-6">
				{/* Header Tag */}
				<div className="flex justify-between items-center mb-4">
					<span className="text-xs font-semibold tracking-wider uppercase bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full">
						Action Item
					</span>
					<span className="text-xs text-slate-400 font-mono">
						ID: {data.customerId}
					</span>
				</div>

				{/* Content Body */}
				<h3 className="text-lg font-bold text-slate-800 mb-1">
					{data.customerName}
				</h3>

				<p className="text-sm text-slate-600 mb-2">
					Status:{" "}
					<span className="font-semibold text-slate-700 capitalize">
						{data.action}
					</span>
				</p>

				{/* New Location Display */}
				{data.location && (
					<div className="flex items-start gap-2 text-sm text-slate-500 mb-6 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="w-4 h-4 mt-0.5 text-slate-400 shrink-0"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
							/>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
							/>
						</svg>
						<span>{data.location}</span>
					</div>
				)}

				{/* Action Buttons conditionally rendered if action is 'request' */}
				{reqwor === "request" && (
					<div className="flex gap-3 mt-4 border-t border-slate-100 pt-4">
						<button
							onClick={handleCancel}
							className="flex-1 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
						>
							Cancel
						</button>
						<button
							onClick={handleAccept}
							className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
						>
							Accept
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
