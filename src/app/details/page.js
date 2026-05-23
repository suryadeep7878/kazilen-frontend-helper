"use client";

import { apiRequest } from "@/utils/api";
import { useState, useEffect } from "react";
import WorkerDetails from "../components/WorkerDetails";

export default function Page() {
	const [worker, setWorker] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchProfile() {
			try {
				const userID = localStorage.getItem("userID");

				if (!userID) {
					setLoading(false);
					return;
				}

				const res = await apiRequest("/get-profile", "POST", {
					userID: userID,
				});

				setWorker({
					name: res.name || "Unknown Worker",
					role: "Electrician",
					rating: res.rating || 0,
				});
			} catch (error) {
				console.error("Failed to fetch profile:", error);
			} finally {
				setLoading(false);
			}
		}

		fetchProfile();
	}, []);

	if (loading) {
		return (
			<div className="min-h-screen bg-slate-50 flex items-center justify-center">
				<p className="text-slate-500 font-medium">Loading profile...</p>
			</div>
		);
	}

	if (!worker) {
		return (
			<div className="min-h-screen bg-slate-50 flex items-center justify-center">
				<p className="text-red-500 font-medium">Profile not found.</p>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-slate-50 px-4 py-8">
			<WorkerDetails worker={worker} />
		</div>
	);
}
