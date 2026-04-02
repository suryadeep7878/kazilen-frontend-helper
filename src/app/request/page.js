"use client";

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import OrderHistoryCard from "./components/OrderHistoryCard"

export default function OrderCard() {
  const router = useRouter()

  const gstRate = 0.05
  const platformFee = 10

  const [orders, setOrders] = useState([])
  const [currentOrder, setCurrentOrder] = useState(null)

  const [timer, setTimer] = useState(282)
  const [showBill, setShowBill] = useState(false)

  // 🆕 Simulate new booking coming
  useEffect(() => {
    const newBooking = {
      id: Date.now(),
      name: "Litti Chokha",
      description: "Classic Sattu Filling",
      price: 139,
      status: "pending",
    }

    setCurrentOrder(newBooking)

    // 👉 Add to top
    setOrders((prev) => [newBooking, ...prev])
  }, [])

  // ⏱ Timer
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

  const handleReject = () => {
    if (!currentOrder) return

    const updated = { ...currentOrder, status: "rejected" }

    setOrders((prev) =>
      prev.map((o) => (o.id === updated.id ? updated : o))
    )

    setCurrentOrder(null)
  }

  const handleAccept = () => {
    if (!currentOrder) return

    const updated = { ...currentOrder, status: "accepted" }

    setOrders((prev) =>
      prev.map((o) => (o.id === updated.id ? updated : o))
    )

    setCurrentOrder(updated)

    router.push("/booking")
  }

  const gstAmount = currentOrder
    ? +(currentOrder.price * gstRate).toFixed(2)
    : 0

  const totalAmount = currentOrder
    ? currentOrder.price + gstAmount + platformFee
    : 0

  return (
    <div className="w-full px-4 py-6 bg-white min-h-[400px]">

      {/* ✅ CURRENT ACTIVE ORDER */}
      {currentOrder ? (
        <>
          <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
            <span className="bg-slate-50 px-2 py-0.5 rounded border">
              ID: #{currentOrder.id}
            </span>
            <span>Now</span>
          </div>

          <div className="flex justify-between mb-4">
            <div>
              <span className="text-lg font-black text-slate-800">
                1 × {currentOrder.name}
              </span>
              <p className="text-[10px] text-slate-400 font-bold uppercase">
                {currentOrder.description}
              </p>
            </div>
            <span className="text-xl font-black text-indigo-600">
              ₹{currentOrder.price}
            </span>
          </div>

          {/* Bill */}
          <div className="border-y py-3">
            <button
              onClick={() => setShowBill(!showBill)}
              className="flex w-full justify-between"
            >
              <span className="text-xs font-bold text-slate-500">
                TOTAL BILL
              </span>
              <span className="font-bold">₹{totalAmount}</span>
            </button>

            {showBill && (
              <div className="mt-3 text-sm space-y-1">
                <p>Item: ₹{currentOrder.price}</p>
                <p>GST: ₹{gstAmount}</p>
                <p>Platform: ₹{platformFee}</p>
              </div>
            )}
          </div>

          {/* Actions */}
          {currentOrder.status === "pending" && (
            <div className="mt-6 flex gap-3">
              <button
                onClick={handleReject}
                className="w-1/2 border py-3 rounded-xl"
              >
                Reject
              </button>

              <button
                disabled={timer <= 0}
                onClick={handleAccept}
                className={`w-1/2 py-3 rounded-xl text-white ${
                  timer <= 0 ? "bg-gray-300" : "bg-green-600"
                }`}
              >
                Accept {formatTime(timer)}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center text-slate-400 mb-6">
          No active booking
        </div>
      )}

      {/* ✅ HISTORY LIST */}
      <div className="mt-8">
        <p className="text-xs font-bold text-slate-500 mb-3">
          ORDER HISTORY
        </p>

        {/* 🔥 Pass full list */}
        <OrderHistoryCard orders={orders} />
      </div>
    </div>
  )
}