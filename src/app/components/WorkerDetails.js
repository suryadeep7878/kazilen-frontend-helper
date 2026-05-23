"use client";

import React, { useEffect, useState } from "react";
import { apiRequest } from "@/utils/api";

export default function WorkerDetails({ worker }) {

	const [services, setServices] = useState([]);
	const [saving, setSaving] = useState(false);
	const [isSaved, setSaved] = useState(false);

	useEffect(() => {
		const fetchData = async () => {

			const storedId = localStorage.getItem("userId");

			try {
				const data = await apiRequest(
					"/getSubCat",
					"POST",
					{ id: storedId }
				);

				if (!data) return;

				const transformedData = Object.entries(data).map(
					([key, value]) => ({
						name: key.replace(/-/g, " "),
						key,
						price: value.price,
						details: value.details,
						visible: value.visible,
						open: false,
					})
				);

				setServices(transformedData);

			} catch (error) {
				console.error(error);
			}
		};

		fetchData();
	}, []);

	const toggleVisible = (key) => {
		setServices((prev) =>
			prev.map((service) =>
				service.key === key
					? {
							...service,
							visible: !service.visible,
					  }
					: service
			)
		);
	};

	const updateDetails = (key, value) => {
		setServices((prev) =>
			prev.map((service) =>
				service.key === key
					? {
							...service,
							details: value,
					  }
					: service
			)
		);
	};

	const toggleOpen = (key) => {
		setServices((prev) =>
			prev.map((service) =>
				service.key === key
					? {
							...service,
							open: !service.open,
					  }
					: service
			)
		);
	};

	const saveChanges = async () => {

		setSaving(true);

		try {

			const cleanedData = {};

			services.forEach((service) => {
				cleanedData[service.key] = {
					visible: service.visible,
					price: service.price,
					details: service.details,
				};
			});

			const response = await apiRequest(
				"/update-subcategories",
				"POST",
				{
					id: localStorage.getItem("worker_id"),
					subcategories: cleanedData,
				}
			);

			console.log(response);

			alert("Data synced successfully!");

		} catch (error) {

			console.error("Save failed:", error);

		} finally {

			setSaving(false);
		}
	};

	return (
		<div className="space-y-4 pb-28">

			{services.map((s) => (

				<div
					key={s.key}
					className={`rounded-2xl bg-white px-6 py-5 border shadow-sm ${
						!s.visible ? "opacity-60" : ""
					}`}
				>

					<div className="flex justify-between items-start gap-4">

						<div className="flex-1 space-y-2">

							<h3 className="font-medium capitalize">
								{s.name}
							</h3>

							<p className="text-lg font-semibold text-indigo-600">
								₹{s.price}
							</p>

						</div>

						<div className="flex flex-col items-end gap-3">

							<button onClick={() => toggleVisible(s.key)}>

								<div
									className={`h-6 w-11 rounded-full relative transition-colors ${
										s.visible
											? "bg-indigo-600"
											: "bg-slate-300"
									}`}
								>

									<span
										className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${
											s.visible ? "left-6" : "left-1"
										}`}
									/>

								</div>

							</button>

							<button
								onClick={() => toggleOpen(s.key)}
								className="text-xs text-indigo-600 underline"
							>
								{s.open ? "Close Details" : "Edit Details"}
							</button>

						</div>
					</div>

					{s.open && (
						<div className="mt-4 bg-slate-50 p-4 rounded-xl space-y-4">

							<label className="text-xs font-semibold text-slate-500 uppercase">
								Service Details
							</label>

							<textarea
								value={s.details}
								onChange={(e) =>
									updateDetails(s.key, e.target.value)
								}
								placeholder="Enter service description..."
								className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
								rows={3}
							/>

						</div>
					)}

				</div>
			))}

			<div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">

				<button
					onClick={saveChanges}
					disabled={saving}
					className="w-full max-w-2xl mx-auto block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl transition-all disabled:bg-slate-400"
				>

					{saving
						? "Syncing with Cloud..."
						: "Save & Update Services"}

				</button>

			</div>

		</div>
	);
}