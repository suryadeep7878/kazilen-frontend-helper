"use client";

import React, { use, useState } from "react";
import { Star, ChevronDown } from "lucide-react";
import { apiRequest } from "@/utils/api";

export default function WorkerDetails({ worker }) {
	const [isSaved, setSaved] = useState(false);
	const storedId = localStorage.getItem("userId");

	const [services, setServices] = useState([]);
	const data = apiRequest("/getSubCat", "POST", { id: storedId }).json();

	const transformedData = Object.entries(data).map(([key, value]) => ({
		name: key.replace(/-/g, " "),
		key: key,
		price: value.price,
		details: value.details,
		enabled: value.visible,
		editing: false,
		open: false,
	}));

	setServices(transformedData);

	const handleSave = async () => {
		try {
			setSaved(true);
			const res = apiRequest("/update", "POST", {
				sub_categories: services,
				id: storedId,
			});
		} catch (error) {
			console.log(error);
		} finally {
			setSaved(false);
		}
	};

	const toggleVisible = (key) => {
		setServices((prev) => ({
			...prev,
			[key]: {
				...prev[key],
				visible: !prev[key].visible,
			},
		}));
	};

	const updateDetails = (key, value) => {
		setServices((prev) => ({
			...prev,
			[key]: {
				...prev[key],
				details: value,
			},
		}));
	};

	const toggleOpen = (key) => {
		setServices((prev) => ({
			...prev,
			[key]: {
				...prev[key],
				open: !prev[key].open,
			},
		}));
	};

	const saveChanges = async () => {
		setSaving(true);

		const cleanedData = {};
		Object.entries(services).forEach(([key, value]) => {
			cleanedData[key] = {
				visible: value.visible,
				price: value.price,
				details: value.details,
			};
		});

		try {
			const response = apiRequest("/update-subcategories", "post", {
				id: localStorage.getItem("worker_id"),
				subcategories: cleanedData,
			});

			if (response.ok) alert("Data synced successfully!");
		} catch (error) {
			console.error("Save failed:", error);
		} finally {
			setSaving(false);
		}
	};

	return (
		<div className="space-y-4">
			{Object.entries(services).map(([key, s]) => (
				<div
					key={key}
					className={`rounded-2xl bg-white px-6 py-5 border shadow-sm ${!s.visible ? "opacity-60" : ""}`}
				>
					<div className="flex justify-between items-start gap-4">
						<div className="flex-1 space-y-2">
							<h3 className="font-medium capitalize">
								{key.replace(/-/g, " ")}
							</h3>
							<p className="text-lg font-semibold text-indigo-600">
								₹{s.price}
							</p>
						</div>

						<div className="flex flex-col items-end gap-3">
							{/* Toggle Button for Visible Criteria */}
							<button onClick={() => toggleVisible(key)}>
								<div
									className={`h-6 w-11 rounded-full relative transition-colors ${s.visible ? "bg-indigo-600" : "bg-slate-300"}`}
								>
									<span
										className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${s.visible ? "left-6" : "left-1"}`}
									/>
								</div>
							</button>

							{/* Open Button to show details input */}
							<button
								onClick={() => toggleOpen(key)}
								className="text-xs text-indigo-600 underline"
							>
								{s.open ? "Close Details" : "Edit Details"}
							</button>
						</div>
					</div>

					{/* Conditional Input Field for Details */}
					{s.open && (
						<div className="mt-4 bg-slate-50 p-4 rounded-xl space-y-4">
							<label className="text-xs font-semibold text-slate-500 uppercase">
								Service Details
							</label>
							<textarea
								value={s.details}
								onChange={(e) => updateDetails(key, e.target.value)}
								placeholder="Enter service description..."
								className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
								rows={3}
							/>
						</div>
					)}
				</div>
			))}
			{/* Always Visible Save Button Container */}
			<div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
				<button
					onClick={saveChanges}
					disabled={saving}
					className="w-full max-w-2xl mx-auto block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl transition-all disabled:bg-slate-400"
				>
					{saving ? "Syncing with Cloud..." : "Save & Update Services"}
				</button>
			</div>
		</div>
	);
}
