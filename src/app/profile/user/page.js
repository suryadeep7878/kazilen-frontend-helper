"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BackHeader from "../components/BackHeader";
import { getCookie } from "@/utils/customCookie";
import { apiRequest } from "@/utils/api";

export default function UserProfilePage() {
	const router = useRouter();

	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);

	const [userId, setUserId] = useState(null);
	const [phoneNo, setPhoneNo] = useState(null);

	const [name, setName] = useState("");
	const [gender, setGender] = useState("");
	const [address, setAddress] = useState("");
	const [phone, setPhone] = useState("");

	useEffect(() => {
		async function load() {
			try {
				setLoading(true);

				const userId = await getCookie("userId");

				const sessionToken = await getCookie("session_token");

				if (userId && sessionToken) {
					setUserId(userId);
					await fetchAndPopulate(userId);
				} else {
					router.push("/login");
				}
			} catch (err) {
				console.error("Failed to load user:", err);
				alert("Failed to load profile. Please try again.");
				router.push("/login");
			} finally {
				setLoading(false);
			}
		}

		load();
	}, [router]);

	async function fetchAndPopulate(id) {
		const res = await apiRequest("/get-profile", "post", { userId: id });
		const data = res?.data || res;

		if (!data) {
			throw new Error("User not found");
		}
		setUserId(data.id || data.userId || null);
		setName(data.name ?? "");
		setGender(data.gender ?? "");
		setAddress(data.address ?? "");
		setPhone(data.phoneNo ?? "");
	}

	if (loading) {
		return (
			<div className="min-h-screen bg-white flex items-center justify-center">
				<div className="text-gray-600">Loading profile…</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-white">
			<BackHeader />

			<div className="p-4 space-y-4">
				<h2 className="text-lg font-semibold">Your profile</h2>

				{/* Name */}
				<div>
					<label className="text-xs text-gray-500">Name</label>
					<input
						type="text"
						value={name}
						readOnly
						className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
						placeholder="Your full name"
					/>
				</div>

				{/* Gender */}
				<div>
					<label className="text-xs text-gray-500">Gender</label>
					<select
						value={gender}
						className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
					>
						<option value="">Select</option>
						<option value="M">Male</option>
						<option value="F">Female</option>
						<option value="O">Other</option>
					</select>
				</div>

				{/* Phone */}
				<div>
					<label className="text-xs text-gray-500">Phone Number</label>
					<input
						type="tel"
						value={phone}
						className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
						placeholder="Your phone number"
					/>
				</div>

				{/* Address */}
				<div>
					<label className="text-xs text-gray-500">Address</label>
					<textarea
						value={address}
						className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
						placeholder="Your residential address"
						rows={3}
					/>
				</div>
			</div>
		</div>
	);
}
