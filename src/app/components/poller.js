'use client'

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/utils/api";

export default function BackgroundTask() {
  const { data, error } = useQuery({
    queryKey: ["background-sync"],
    queryFn: () => {
      const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
      
      if (!userId) return null;

      return apiRequest("/poll-this", "POST", { id: userId });
    },
    refetchInterval: 10000,
    refetchIntervalInBackground: true,
    enabled: typeof window !== "undefined" && !!localStorage.getItem("userId"),
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
