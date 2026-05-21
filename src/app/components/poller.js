"use client";

import { useEffect } from "react";
import { apiRequest } from "@/utils/api";

export default function BackgroundPoller() {
	useEffect(() => {
		if (typeof window === "undefined") return;

		console.log("BackgroundPoller initialized successfully on the client.");

		const runPoll = async () => {
			try {
				const userId = localStorage.getItem("userId");
				if (!userId) {
					console.log("Polling skipped.");
					return;
				}
				const data = await apiRequest("/poll", "post", { userId: userId });

			} catch (error) {
				console.error("Polling network/runtime error:", error);
			}
		};

		runPoll();

		const pollInterval = setInterval(runPoll, 5000);

		return () => {
			console.log("BackgroundPoller cleaned up.");
			clearInterval(pollInterval);
		};
	}, []);
	return null;
}
