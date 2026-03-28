"use client";

import { useEffect, useState, useTransition } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

import OrderHistoryCard from "./components/OrderHistoryCard"
import WarrantyPeriodCard from "./components/WarrantyPeriodCard"

export default function OrderCard() {
  const itemPrice = 139
  const gstRate = 0.05
  const platformFee = 10

  const gstAmount = +(itemPrice * gstRate).toFixed(2)
  const totalAmount = itemPrice + gstAmount + platformFee

  const [showBill, setShowBill] = useState(false)
  const [timer, setTimer] = useState(282)
  const [activeTab, setActiveTab] = useState("history")
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (timer <= 0) return
    const interval = setInterval(() => {
      setTimer((t) => t - 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [timer])

  const handleTabChange = (tab) => {
    startTransition(() => {
      setActiveTab(tab)
    })
  }

  const formatTime = (sec) => {
    const m = String(Math.floor(sec / 60)).padStart(2, "0")
    const s = String(sec % 60).padStart(2, "0")
    return `${m}:${s}`
  }

  return (
    <div className="w-full px-4 py-6 bg-white min-h-[400px]">
      {/* Header */}
      <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
        <span className="bg-slate-50 px-2 py-0.5 rounded border border-slate-100">ID: #4489</span>
        <span>9:10 PM</span>
      </div>

      {/* Item info */}
      <div className="flex justify-between items-baseline mb-4">
        <div className="flex flex-col">
          <span className="text-lg font-black text-slate-800">1 × Litti Chokha</span>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Classic Sattu Filling</span>
        </div>
        <span className="text-xl font-black text-indigo-600">₹{itemPrice}</span>
      </div>

      {/* Bill Breakdown Toggle */}
      <div className="border-y border-slate-100 py-3">
        <button
          onClick={() => setShowBill(!showBill)}
          className="flex w-full items-center justify-between"
        >
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Bill</span>
          <div className="flex items-center gap-2">
            <span className="text-lg font-black text-slate-800">₹{totalAmount}</span>
            <div className={`p-1 rounded-full bg-slate-50 transition-transform ${showBill ? 'rotate-180' : ''}`}>
              <ChevronDown size={14} className="text-slate-400" />
            </div>
          </div>
        </button>

        {showBill && (
          <div className="mt-4 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="flex justify-between text-xs font-medium text-slate-500">
              <span>Item Total</span>
              <span>₹{itemPrice}</span>
            </div>
            <div className="flex justify-between text-xs font-medium text-slate-500">
              <span>GST (5%)</span>
              <span>₹{gstAmount}</span>
            </div>
            <div className="flex justify-between text-xs font-medium text-slate-500">
              <span>Platform Fee</span>
              <span>₹{platformFee}</span>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-200/60 flex justify-between">
              <span className="text-sm font-bold text-slate-800">Total Payable</span>
              <span className="text-sm font-black text-indigo-600">₹{totalAmount}</span>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-6 flex gap-3">
        <button
          className="w-1/2 rounded-xl border-2 border-slate-200 py-3 text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-colors active:scale-95"
          onClick={() => alert("Order Rejected")}
        >
          Reject
        </button>

        <button
          className={`w-1/2 rounded-xl shadow-lg shadow-green-100 py-3 text-xs font-black uppercase tracking-widest text-white transition-all active:scale-95 flex items-center justify-center gap-2 ${timer <= 0 ? 'bg-slate-300' : 'bg-green-600 hover:bg-green-700'
            }`}
          disabled={timer <= 0}
          onClick={() => alert("Order Accepted")}
        >
          Accept <span className="text-[10px] opacity-80">{formatTime(timer)}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="mt-8 flex w-full gap-4">
        <button
          onClick={() => handleTabChange("history")}
          className={`relative flex-1 py-3 text-center text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "history" ? "text-indigo-600" : "text-slate-400"
            }`}
        >
          Order history
          {activeTab === "history" && (
            <div className="absolute bottom-0 left-1/4 right-1/4 h-1 bg-indigo-600 rounded-full" />
          )}
        </button>

        <button
          onClick={() => handleTabChange("warranty")}
          className={`relative flex-1 py-3 text-center text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "warranty" ? "text-indigo-600" : "text-slate-400"
            }`}
        >
          Warranty Period
          {activeTab === "warranty" && (
            <div className="absolute bottom-0 left-1/4 right-1/4 h-1 bg-indigo-600 rounded-full" />
          )}
        </button>
      </div>

      {/* Tab Content */}
      <div className={`mt-2 transition-opacity duration-300 ${isPending ? 'opacity-40' : 'opacity-100'}`}>
        {activeTab === "history" && <OrderHistoryCard />}
        {activeTab === "warranty" && <WarrantyPeriodCard />}
      </div>
    </div>
  )
}
