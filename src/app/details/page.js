"use client"

import React, { useState } from "react"
import { Star, Edit2, ChevronDown } from "lucide-react"

export default function WorkerDetails() {
  const [services, setServices] = useState([
    {
      id: 1,
      name: "Consultation",
      price: 100,
      details: "Basic consultation service",
      warranty: null,
      open: false,
      enabled: true,
    },
    {
      id: 2,
      name: "Fixed Charge",
      price: 600,
      details: "One-time fixed price service",
      warranty: { value: 7, unit: "days" },
      open: false,
      enabled: true,
    },
    {
      id: 3,
      name: "Book by Hour",
      price: 80,
      details: "Charged per working hour",
      warranty: null,
      open: false,
      enabled: true,
    },
  ])

  const [editingService, setEditingService] = useState(null)
  const [tempPrice, setTempPrice] = useState("")
  const [tempDetails, setTempDetails] = useState("")
  const [tempWarrantyValue, setTempWarrantyValue] = useState("")
  const [tempWarrantyUnit, setTempWarrantyUnit] = useState("days")

  const worker = {
    name: "Rajesh Kumar",
    role: "Helper",
    rating: 4.6,
    image: "https://i.pravatar.cc/150?img=12",
  }

  const toggleOpen = (id) => {
    setServices((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, open: !s.open } : s
      )
    )
  }

  const toggleEnabled = (id) => {
    setServices((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, enabled: !s.enabled } : s
      )
    )
  }

  const openEditModal = (service) => {
    setEditingService(service)
    setTempPrice(service.price.toString())
    setTempDetails(service.details)
    setTempWarrantyValue(service.warranty?.value?.toString() || "")
    setTempWarrantyUnit(service.warranty?.unit || "days")
  }

  const closeEditModal = () => {
    setEditingService(null)
    setTempPrice("")
    setTempDetails("")
    setTempWarrantyValue("")
    setTempWarrantyUnit("days")
  }

  const saveEdit = () => {
    const price = parseFloat(tempPrice)
    if (isNaN(price) || price <= 0) return

    const warranty =
      tempWarrantyValue && Number(tempWarrantyValue) > 0
        ? { value: Number(tempWarrantyValue), unit: tempWarrantyUnit }
        : null

    setServices((prev) =>
      prev.map((s) =>
        s.id === editingService.id
          ? { ...s, price, details: tempDetails, warranty }
          : s
      )
    )
    closeEditModal()
  }

  const formatWarranty = (warranty) => {
    if (!warranty) return "No warranty"
    return `${warranty.value} ${warranty.unit}`
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto w-full space-y-8">

        {/* ================= PROFILE CARD ================= */}
        <div className="rounded-2xl bg-white px-6 py-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-slate-900">
                {worker.name}
              </h1>
              <p className="text-sm text-slate-500">{worker.role}</p>
            </div>

            <div className="flex flex-col items-center">
              <img
                src={worker.image}
                alt="profile"
                className="h-16 w-16 rounded-full object-cover ring-2 ring-indigo-200"
              />
              <div className="mt-1 flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                {worker.rating}
              </div>
            </div>
          </div>
        </div>

        {/* ================= SERVICES ================= */}
        <div className="space-y-4">
          {services.map((s) => (
            <div
              key={s.id}
              className={`rounded-2xl bg-white px-6 py-5 border border-slate-200 shadow-sm transition
                ${!s.enabled ? "opacity-60" : "hover:shadow-md"}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-medium text-slate-900">
                    {s.name}
                  </h3>
                  <span
                    className={`text-lg font-semibold ${
                      s.enabled ? "text-indigo-600" : "text-slate-400"
                    }`}
                  >
                    ₹{s.price}
                  </span>
                </div>

                <div className="flex items-center gap-5">
                  {/* TOGGLE */}
                  <button
                    onClick={() => toggleEnabled(s.id)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full
                      ${s.enabled ? "bg-indigo-600" : "bg-slate-300"}`}
                  >
                    <span
                      className={`h-4 w-4 rounded-full bg-white transition-transform
                        ${s.enabled ? "translate-x-6" : "translate-x-1"}`}
                    />
                  </button>

                  <button
                    onClick={() => openEditModal(s)}
                    className="text-sm font-medium text-indigo-600 hover:underline"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => toggleOpen(s.id)}
                    className="flex items-center gap-1 text-sm text-slate-600 hover:text-indigo-600"
                  >
                    Details
                    <ChevronDown
                      size={18}
                      className={`transition-transform ${
                        s.open ? "rotate-180 text-indigo-600" : ""
                      }`}
                    />
                  </button>
                </div>
              </div>

              {s.open && s.enabled && (
                <div className="mt-4 space-y-2 rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  <div>{s.details}</div>
                  <div>
                    Warranty:{" "}
                    <span className="font-medium text-slate-700">
                      {formatWarranty(s.warranty)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ================= EDIT MODAL ================= */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold mb-4">Edit Service</h2>

            <div className="space-y-4">
              <input
                type="number"
                value={tempPrice}
                onChange={(e) => setTempPrice(e.target.value)}
                placeholder="Price (₹)"
                className="w-full rounded-lg border px-3 py-2"
              />

              <textarea
                rows={3}
                value={tempDetails}
                onChange={(e) => setTempDetails(e.target.value)}
                placeholder="Service details"
                className="w-full rounded-lg border px-3 py-2"
              />

              {/* WARRANTY */}
              <div className="flex gap-3">
                <input
                  type="number"
                  placeholder="Warranty"
                  value={tempWarrantyValue}
                  onChange={(e) => setTempWarrantyValue(e.target.value)}
                  className="w-1/2 rounded-lg border px-3 py-2"
                />
                <select
                  value={tempWarrantyUnit}
                  onChange={(e) => setTempWarrantyUnit(e.target.value)}
                  className="w-1/2 rounded-lg border px-3 py-2"
                >
                  <option value="hours">Hours</option>
                  <option value="days">Days</option>
                  <option value="months">Months</option>
                  <option value="years">Years</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button onClick={closeEditModal} className="px-4 py-2 text-sm">
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
