"use client"

import { useEffect, useState } from "react"
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

  useEffect(() => {
    if (timer <= 0) return
    const interval = setInterval(() => {
      setTimer((t) => t - 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [timer])

  const formatTime = (sec) => {
    const m = String(Math.floor(sec / 60)).padStart(2, "0")
    const s = String(sec % 60).padStart(2, "0")
    return `${m}:${s}`
  }

  return (
    <div className="w-full px-4 py-3">
      {/* Header */}
      <div className="flex justify-between text-sm text-gray-500">
        <span>ID:4489</span>
        <span>9:10 PM</span>
      </div>

      {/* Item */}
      <div className="mt-3 flex justify-between text-base font-medium">
        <span>1 × Litti Chokha</span>
        <span>₹{itemPrice}</span>
      </div>

      {/* Total Bill */}
      <button
        onClick={() => setShowBill(!showBill)}
        className="mt-3 flex w-full items-center justify-between text-sm font-medium text-gray-700"
      >
        <span>Total Bill</span>
        <span className="flex items-center gap-1">
          ₹{totalAmount}
          {showBill ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </button>

      {/* Bill Breakdown */}
      {showBill && (
        <div className="mt-2 space-y-1 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Item Total</span>
            <span>₹{itemPrice}</span>
          </div>
          <div className="flex justify-between">
            <span>GST (5%)</span>
            <span>₹{gstAmount}</span>
          </div>
          <div className="flex justify-between">
            <span>Platform Fee</span>
            <span>₹{platformFee}</span>
          </div>

          <div className="mt-2 flex justify-between font-semibold text-gray-800">
            <span>Total Payable</span>
            <span>₹{totalAmount}</span>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 flex gap-3">
        <button
          className="w-1/2 rounded-md border border-red-600 py-2 text-red-600"
          onClick={() => alert("Order Rejected")}
        >
          Reject
        </button>

        <button
          className="w-1/2 rounded-md bg-green-600 py-2 font-medium text-white disabled:opacity-60"
          disabled={timer <= 0}
          onClick={() => alert("Order Accepted")}
        >
          Accept ({formatTime(timer)})
        </button>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex w-full border-b text-base font-semibold">
        <button
          onClick={() => setActiveTab("history")}
          className={`flex-1 py-2 text-center ${
            activeTab === "history"
              ? "text-black border-b-2 border-black"
              : "text-gray-400"
          }`}
        >
          Order history
        </button>

        <button
          onClick={() => setActiveTab("warranty")}
          className={`flex-1 py-2 text-center ${
            activeTab === "warranty"
              ? "text-black border-b-2 border-black"
              : "text-gray-400"
          }`}
        >
          Warranty Period
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-3">
        {activeTab === "history" && <OrderHistoryCard />}
        {activeTab === "warranty" && <WarrantyPeriodCard />}
      </div>
    </div>
  )
}
