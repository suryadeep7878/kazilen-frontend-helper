"use client"

import React, { useState } from "react"
import { Star, ChevronDown } from "lucide-react"

export default function WorkerDetails() {
  const [services, setServices] = useState([
    {
      id: 1,
      name: "Book Consultation",
      price: 100,
      details: "Basic consultation service",
      warranty: null,
      open: false,
      enabled: true,
      editing: false,
    },
    {
      id: 2,
      name: "Fan",
      price: 600,
      details: "One-time fixed price service",
      warranty: { value: 7, unit: "days" },
      open: false,
      enabled: true,
      editing: false,
    },
    {
      id: 3,
      name: "Light",
      price: 80,
      details: "Charged per working hour",
      warranty: null,
      open: false,
      enabled: true,
      editing: false,
    },
    {
      id: 4,
      name: "Wiring",
      price: 80,
      details: "Charged per working hour",
      warranty: null,
      open: false,
      enabled: true,
      editing: false,
    },
    {
      id: 5,
      name: "Doorbell",
      price: 80,
      details: "Charged per working hour",
      warranty: null,
      open: false,
      enabled: true,
      editing: false,
    },
    {
      id: 6,
      name: "MCB",
      price: 80,
      details: "Charged per working hour",
      warranty: null,
      open: false,
      enabled: true,
      editing: false,
    },
    {
      id: 7,
      name: "Inverter",
      price: 80,
      details: "Charged per working hour",
      warranty: null,
      open: false,
      enabled: true,
      editing: false,
    },
    {
      id: 8,
      name: "Stabiliser",
      price: 80,
      details: "Charged per working hour",
      warranty: null,
      open: false,
      enabled: true,
      editing: false,
    },
    {
      id: 9,
      name: "Book by Hour",
      price: 80,
      details: "Charged per working hour",
      warranty: null,
      open: false,
      enabled: true,
      editing: false,
    },
  ])

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
        s.id === id
          ? { ...s, enabled: !s.enabled, open: false, editing: false }
          : s
      )
    )
  }

  const startEdit = (id) => {
    setServices((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, editing: true } : s
      )
    )
  }

  const cancelEdit = (id) => {
    setServices((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, editing: false } : s
      )
    )
  }

  const updateField = (id, field, value) => {
    setServices((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, [field]: value } : s
      )
    )
  }

  const updateWarranty = (id, field, value) => {
    setServices((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              warranty: {
                ...(s.warranty || { value: "", unit: "days" }),
                [field]: value,
              },
            }
          : s
      )
    )
  }

  const formatWarranty = (warranty) => {
    if (!warranty || !warranty.value) return "No warranty"
    return `${warranty.value} ${warranty.unit}`
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto w-full space-y-8">

        {/* PROFILE CARD */}
        <div className="rounded-2xl bg-white px-6 py-5 border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold">{worker.name}</h1>
              <p className="text-sm text-slate-500">{worker.role}</p>
            </div>
            <div className="flex flex-col items-center">
              <img
                src={worker.image}
                className="h-16 w-16 rounded-full ring-2 ring-indigo-200"
              />
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
              className={`rounded-2xl bg-white px-6 py-5 border shadow-sm
                ${!s.enabled ? "opacity-60" : ""}`}
            >
              {/* HEADER */}
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 space-y-2">
                  <h3 className="font-medium">{s.name}</h3>

                  {s.editing ? (
                    <input
                      type="number"
                      value={s.price}
                      onChange={(e) =>
                        updateField(s.id, "price", e.target.value)
                      }
                      className="w-36 h-10 rounded-lg border px-3"
                    />
                  ) : (
                    <p className="text-lg font-semibold text-indigo-600">
                      ₹{s.price}
                    </p>
                  )}
                </div>

                {/* TOP ACTIONS */}
                <div className="flex flex-col items-end gap-3">
                  {/* TOGGLE – larger tap area */}
                  <button
                    onClick={() => toggleEnabled(s.id)}
                    className="p-2 rounded-full"
                  >
                    <div
                      className={`h-6 w-11 rounded-full relative ${
                        s.enabled ? "bg-indigo-600" : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                          s.enabled ? "left-6" : "left-1"
                        }`}
                      />
                    </div>
                  </button>

                  {/* DETAILS */}
                  <button
                    onClick={() => toggleOpen(s.id)}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm hover:bg-slate-100"
                  >
                    Details
                    <ChevronDown
                      className={`h-4 w-4 transition ${
                        s.open ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* DETAILS SECTION */}
              {s.open && (
                <div className="mt-4 rounded-xl bg-slate-50 px-4 py-4 text-sm text-slate-600 space-y-4">
                  {/* DETAILS */}
                  {s.editing ? (
                    <textarea
                      rows={2}
                      value={s.details}
                      onChange={(e) =>
                        updateField(s.id, "details", e.target.value)
                      }
                      className="w-full rounded-lg border px-3 py-2"
                    />
                  ) : (
                    <p>{s.details}</p>
                  )}

                  {/* WARRANTY */}
                  <div>
                    Warranty:{" "}
                    {s.editing ? (
                      <div className="flex gap-3 mt-2">
                        <input
                          type="number"
                          value={s.warranty?.value || ""}
                          onChange={(e) =>
                            updateWarranty(s.id, "value", e.target.value)
                          }
                          className="w-24 h-10 rounded-lg border px-3"
                        />
                        <select
                          value={s.warranty?.unit || "days"}
                          onChange={(e) =>
                            updateWarranty(s.id, "unit", e.target.value)
                          }
                          className="h-10 rounded-lg border px-3"
                        >
                          <option value="hours">Hours</option>
                          <option value="days">Days</option>
                          <option value="months">Months</option>
                          <option value="years">Years</option>
                        </select>
                      </div>
                    ) : (
                      <span className="font-medium">
                        {formatWarranty(s.warranty)}
                      </span>
                    )}
                  </div>

                  {/* RIGHT-ALIGNED ACTION BUTTONS */}
                  <div className="flex justify-end gap-3">
                    {!s.editing ? (
                      <button
                        onClick={() => startEdit(s.id)}
                        className="px-4 py-2 rounded-full text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100"
                      >
                        Edit
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => cancelEdit(s.id)}
                          className="px-4 py-2 rounded-full text-sm text-slate-600 bg-white border"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => cancelEdit(s.id)}
                          className="px-4 py-2 rounded-full text-sm font-medium text-white bg-indigo-600"
                        >
                          Save
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
