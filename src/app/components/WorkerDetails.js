'use client'

import React, { useState, memo, useCallback } from "react"
import { Star, ChevronDown, Check, X, Edit2 } from "lucide-react"

const WorkerServiceItem = memo(function WorkerServiceItem({ service, onToggleEnabled, onUpdate }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [localPrice, setLocalPrice] = useState(service.price)
  const [localDetails, setLocalDetails] = useState(service.details)

  const handleSave = () => {
    onUpdate(service.id, { price: localPrice, details: localDetails })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setLocalPrice(service.price)
    setLocalDetails(service.details)
    setIsEditing(false)
  }

  const formatWarranty = (warranty) => {
    if (!warranty || !warranty.value) return "No warranty"
    return `${warranty.value} ${warranty.unit}`
  }

  return (
    <div
      className={`rounded-2xl bg-white px-6 py-5 border transition-all duration-200 ${
        !service.enabled ? "opacity-60 bg-gray-50" : "shadow-sm hover:shadow-md"
      }`}
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 space-y-2">
          <h3 className="font-semibold text-gray-800">{service.name}</h3>

          {isEditing ? (
            <div className="flex items-center gap-2">
              <span className="text-gray-400 font-bold">₹</span>
              <input
                type="number"
                value={localPrice}
                onChange={(e) => setLocalPrice(e.target.value)}
                className="w-24 h-9 rounded-lg border border-indigo-200 px-3 text-sm focus:ring-2 focus:ring-indigo-100 outline-none"
              />
            </div>
          ) : (
            <p className="text-lg font-bold text-indigo-600">
              ₹{service.price}
            </p>
          )}
        </div>

        <div className="flex flex-col items-end gap-3">
          <button 
            onClick={() => onToggleEnabled(service.id)}
            className="focus:outline-none"
          >
            <div
              className={`h-6 w-11 rounded-full relative transition-colors duration-200 ${
                service.enabled ? "bg-indigo-600" : "bg-slate-300"
              }`}
            >
              <span
                className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all duration-200 ${
                  service.enabled ? "left-6" : "left-1"
                }`}
              />
            </div>
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors uppercase tracking-wider"
          >
            Details
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="mt-4 bg-slate-50 p-4 rounded-xl space-y-4 border border-slate-100 animate-in fade-in slide-in-from-top-2 duration-200">
          {isEditing ? (
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Service Details</label>
              <textarea
                value={localDetails}
                onChange={(e) => setLocalDetails(e.target.value)}
                className="w-full border border-indigo-100 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-100 outline-none min-h-[80px]"
              />
            </div>
          ) : (
            <p className="text-sm text-slate-600 leading-relaxed">{service.details}</p>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
            <div className="flex items-center gap-2">
               <span className="text-[10px] font-bold text-slate-400 uppercase">Warranty:</span>
               <span className="text-sm font-medium text-slate-700">{formatWarranty(service.warranty)}</span>
            </div>

            <div className="flex gap-2">
              {!isEditing ? (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
              ) : (
                <>
                  <button 
                    onClick={handleCancel}
                    className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Cancel"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={handleSave}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Save"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
})

export default function WorkerDetails({ worker }) {
  const [services, setServices] = useState([
    {
      id: 1,
      name: "Book Consultation",
      price: 100,
      details: "Basic consultation service",
      warranty: null,
      enabled: true,
    },
    {
      id: 2,
      name: "Fan",
      price: 600,
      details: "One-time fixed price service",
      warranty: { value: 7, unit: "days" },
      enabled: true,
    },
    {
      id: 3,
      name: "Light",
      price: 80,
      details: "Charged per working hour",
      warranty: null,
      enabled: true,
    },
    {
      id: 4,
      name: "Wiring",
      price: 120,
      details: "Complex wiring installation",
      warranty: null,
      enabled: true,
    },
    {
      id: 5,
      name: "Doorbell",
      price: 150,
      details: "Modern smart doorbell setup",
      warranty: null,
      enabled: true,
    },
    {
      id: 6,
      name: "MCB",
      price: 250,
      details: "Safe circuit breaker replacement",
      warranty: null,
      enabled: true,
    },
    {
      id: 7,
      name: "Inverter",
      price: 800,
      details: "Full backup system installation",
      warranty: null,
      enabled: true,
    },
    {
      id: 8,
      name: "Stabiliser",
      price: 300,
      details: "Voltage protection setup",
      warranty: null,
      enabled: true,
    },
    {
      id: 9,
      name: "Book by Hour",
      price: 100,
      details: "Hourly service for custom tasks",
      warranty: null,
      enabled: true,
    },
  ])

  const toggleEnabled = useCallback((id) => {
    setServices((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, enabled: !s.enabled } : s
      )
    )
  }, [])

  const updateServiceData = useCallback((id, updates) => {
    setServices((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, ...updates } : s
      )
    )
  }, [])

  return (
    <div className="space-y-6">
      {/* PROFILE */}
      <div className="rounded-3xl bg-white px-6 py-6 border shadow-sm border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-0.5 shadow-lg">
                <div className="h-full w-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                   <img 
                    src={worker.image || "/avatar.jpg"} 
                    alt={worker.name}
                    className="h-full w-full object-cover" 
                   />
                </div>
             </div>
             <div>
               <h1 className="text-xl font-bold text-gray-900">{worker.name}</h1>
               <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest">{worker.role}</p>
             </div>
          </div>

          <div className="flex items-center gap-1 rounded-2xl bg-amber-50 px-4 py-2 border border-amber-100 shadow-sm">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-extrabold text-amber-900">{worker.rating}</span>
          </div>
        </div>
      </div>

      {/* SERVICES */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-gray-400 uppercase px-1 tracking-widest">Active Services</h2>
        {services.map((s) => (
          <WorkerServiceItem 
            key={s.id} 
            service={s} 
            onToggleEnabled={toggleEnabled}
            onUpdate={updateServiceData}
          />
        ))}
      </div>
    </div>
  )
}