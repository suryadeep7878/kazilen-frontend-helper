"use client";

import React, { use, useState } from "react";
import { Star, ChevronDown } from "lucide-react";
import { apiRequest } from "@/utils/api";

export default function WorkerDetails({ worker }) {
	const [isSaved, setSaved] = useState(false);
	const storedId = localStorage.getItem('worker_id');
	const data = apiRequest('/getSubCat', 'POST', storedId)

	const handleSave = async () => {
		try {
			setSaved(true);
			const res = apiRequest("/update", "POST", {sub_categories: services, id: storedId});
		} catch (error) {
			console.log(error);
		} finally {
			setSaved(false);
		}
	};

	const [services, setServices] = useState([data])

	const toggleEnabled = (id) => {
		setServices((prev) =>
			prev.map((s) =>
				s.id === id
					? { ...s, enabled: !s.visible}
					: s,
			),
		);
	};

	const updateField = (id, field, value) => {
		setServices((prev) =>
			prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
		);
	};

	return (
		<div className="space-y-8">
			{/* PROFILE */}
			<div className="rounded-2xl bg-white px-6 py-5 border shadow-sm">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-lg font-semibold">{worker.name}</h1>
						<p className="text-sm text-slate-500">{worker.role}</p>
					</div>

					<div className="flex flex-col items-center">
						<img className="h-16 w-16 rounded-full ring-2 ring-indigo-200" />
						<div className="mt-1 flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs">
							<Star className="h-3 w-3 fill-amber-400" />
							{worker.rating}
						</div>
					</div>
				</div>
			</div>

			{/* SERVICES */}
			<div className="space-y-4">
				{services.map((s) => (
					<div
						key={s.id}
						className={`rounded-2xl bg-white px-6 py-5 border shadow-sm ${!s.enabled ? "opacity-60" : ""
							}`}
					>
						<div className="flex justify-between items-start gap-4">
							<div className="flex-1 space-y-2">
								<h3 className="font-medium">{s.name}</h3>

								{s.editing ? (
									<input
										type="number"
										value={s.price}
										onChange={(e) => updateField(s.id, "price", e.target.value)}
										className="w-36 h-10 rounded-lg border px-3"
									/>
								) : (
									<p className="text-lg font-semibold text-indigo-600">
										₹{s.price}
									</p>
								)}
							</div>

							<div className="flex flex-col items-end gap-3">
								<button onClick={() => toggleEnabled(s.id)}>
									<div
										className={`h-6 w-11 rounded-full relative ${s.enabled ? "bg-indigo-600" : "bg-slate-300"
											}`}
									>
										<span
											className={`absolute top-1 h-4 w-4 rounded-full bg-white ${s.enabled ? "left-6" : "left-1"
												}`}
										/>
									</div>
								</button>
							</div>
						</div>

						{s.open && (
							<div className="mt-4 bg-slate-50 p-4 rounded-xl space-y-4">
								{s.editing ? (
									<textarea
										value={s.details}
										onChange={(e) =>
											updateField(s.id, "details", e.target.value)
										}
										className="w-full border rounded-lg p-2"
									/>
								) : (
									<p>{s.details}</p>
								)}
							</div>
						)}
					</div>
				))}
			</div>
			<button
				onClick={handleSave}
				disabled={isSaved}
				className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
			>
				{isSaved ? "Saving..." : "Save Changes"}
			</button>
		</div>
	);
}
