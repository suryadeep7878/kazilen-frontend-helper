"use client";

import { useEffect } from "react";
import { apiRequest } from "@/utils/api";
import { useRouter, usePathname } from "next/navigation";
import { getCookie } from "@/utils/customCookie";

export default function BackgroundPoller() {
	const router = useRouter();
	const pathname = usePathname();

	useEffect(() => {
		if (typeof window === "undefined") return;

		console.log("BackgroundPoller initialized successfully on the client.");

		const runPoll = async () => {
			try {
				const userId = getCookie("userId");
				const session_token = getCookie("session_token");
				if ((!userId) || (!session_token)) {
					console.log("Polling skipped.");
					return;
				}
				const data = await apiRequest("/poll", "post", { userId: userId });
				if (data.work||data.request){
					if (pathname != "/request") router.push("/request");
				}
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
	}, [router, pathname]);
	return null;
}
