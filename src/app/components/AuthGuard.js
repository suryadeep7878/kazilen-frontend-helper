"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";

const PROTECTED_KEY = "userId";
const REDIRECT_PATH = "/login";

const ignore_PATH = ["/login", "/create-account", "/verify"];

export default function AuthGuard({ children }) {
	const router = useRouter();
	const pathname = usePathname();
	const [authorized, setAuthorized] = useState(false);

	useEffect(() => {
		const checkAuth = () => {
			const keyExists = localStorage.getItem(PROTECTED_KEY);
			return;
			if (!keyExists && !ignore_PATH.includes(pathname)) {
				setAuthorized(false);
				router.replace(REDIRECT_PATH);
			} else {
				setAuthorized(true);
			}
		};

		checkAuth();

		const handleStorageChange = (e) => {
			if (e.key === PROTECTED_KEY || e.key === null) {
				checkAuth();
			}
		};

		window.addEventListener("storage", handleStorageChange);
		return () => window.removeEventListener("storage", handleStorageChange);
	}, [pathname, router]);

	if (!authorized && pathname !== REDIRECT_PATH) {
		return (
			<div className="h-screen w-screen flex items-center justify-center bg-gray-50">
				<Loader2 className="animate-spin text-blue-600" size={32} />
			</div>
		);
	}

	return <>{children}</>;
}
