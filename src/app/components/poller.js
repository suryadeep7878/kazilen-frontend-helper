"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/utils/api";

export default function BackgroundTask() {
	const userId = localStorage.getItem("userId");
	const { data, error } = useQuery({
		queryKey: ["background-sync"],
		queryFn: () => apiRequest("/poll-this", "POST", { id: userId }),
		refetchInterval: 10000,
		refetchIntervalInBackground: true,
	});

	useEffect(() => {
		if (data) {
			console.log("Background Sync Successful:", data);
		}
		if (error) {
			console.error("Background Sync Failed:", error);
		}
	}, [data, error]);

	return null;
}
