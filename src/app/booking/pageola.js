'use client'

import React, { useRef, useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import {
  Phone,
  Home,
  Navigation,
  Wrench,
  IndianRupee,
  CalendarDays,
  Clock,
  Loader2
} from "lucide-react"
import { apiRequest } from "@/utils/api"
import { confirmStartPin, confirmEndPin } from "@/lib/bookingApi"

export default function BookingPage() {
  const [otp, setOtp] = useState(["", "", "", ""])
  const [error, setError] = useState("")
  const [step, setStep] = useState("start") // start → working → end → completed
  const inputsRef = useRef([])

  // 1. Fetch current assigned job
  const { data: jobData, isLoading: jobLoading } = useQuery({
    queryKey: ["current-job"],
    queryFn: () => apiRequest("/current-job"),
    refetchInterval: 5000,
  })

  // Sync step with booking action
  useEffect(() => {
    if (jobData) {
      if (jobData.action === "STARTED") setStep("working")
      if (jobData.is_finished) setStep("completed")
    }
  }, [jobData])

  // Autofocus first input when step changes
  useEffect(() => {
    if (step === "start" || step === "end") {
      setTimeout(() => inputsRef.current[0]?.focus(), 100)
    }
  }, [step])

  if (jobLoading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>
  if (!jobData) return <div className="p-10 text-center">No active jobs assigned.</div>

  const customer = jobData.customer
  const worker = jobData.worker

  // 📞 Call
  const handleCall = () => {
    window.location.href = `tel:${customer.phoneNo}`
  }

  // 🗺️ Maps
  const openMaps = () => {
    window.open(`https://www.google.com/maps?q=${customer.address}`)
  }

  // OTP input
  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    setError("")
    if (value && index < 3) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
  }

  const resetOtp = () => setOtp(["", "", "", ""])

  // Verify OTP
  const handleVerify = async () => {
    const enteredOtp = otp.join("")
    if (enteredOtp.length < 4) {
      setError("Enter complete OTP")
      return
    }

    try {
      if (step === "start") {
        await confirmStartPin(customer.phoneNo, worker.phoneNo, enteredOtp, jobData.id)
        setStep("working")
        resetOtp()
      } else if (step === "end") {
        await confirmEndPin(customer.phoneNo, worker.phoneNo, enteredOtp, jobData.id)
        setStep("completed")
      }
    } catch (err) {
      setError(err.message || "Invalid OTP. Try again.")
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex justify-between px-4 py-3 bg-white border-b">
        <h1 className="text-lg font-semibold">Current Job</h1>
        <button onClick={handleCall} className="flex items-center gap-2 text-blue-600">
          <Phone size={18} /> Call Customer
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Customer */}
        <div className="bg-white p-4 rounded-xl flex gap-4 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
             {customer.name[0]}
          </div>
          <div>
            <p className="font-semibold">{customer.name}</p>
            <p className="text-sm text-gray-600">{customer.phoneNo}</p>
          </div>
        </div>

        {/* Location */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <p className="font-semibold">Service Address</p>
            <button onClick={openMaps} className="text-blue-600 flex items-center gap-1 text-sm font-medium">
              <Navigation size={16}/> Directions
            </button>
          </div>
          <p className="text-sm text-gray-600">{customer.address || "No address provided"}</p>
        </div>

        {/* Service */}
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-blue-500">
            <p className="font-semibold flex gap-2 items-center">
              <Wrench size={16}/> {worker.categories || "Service"}
            </p>
            <p className="text-xs text-gray-400 mt-1">ID: {jobData.id.split("-")[0]}</p>
        </div>

        {/* ===== FLOW SECTION ===== */}
        {step === "start" && (
          <OtpBox
            title="Customer's Start PIN"
            subtitle="Ask the customer for the 4-digit PIN to begin work"
            otp={otp}
            error={error}
            inputsRef={inputsRef}
            handleChange={handleChange}
            handleKeyDown={handleKeyDown}
            handleVerify={handleVerify}
          />
        )}

        {step === "working" && (
          <div className="bg-emerald-50 p-6 rounded-2xl text-center border border-emerald-100">
            <p className="text-emerald-700 font-bold text-lg mb-1">Work in Progress</p>
            <p className="text-emerald-600 text-sm mb-5">You are currently serving {customer.name}</p>
            <button
              onClick={() => { setStep("end"); resetOtp(); }}
              className="w-full bg-emerald-600 text-white px-4 py-3 rounded-full font-semibold shadow-lg shadow-emerald-200"
            >
              Finish Job
            </button>
          </div>
        )}

        {step === "end" && (
          <OtpBox
            title="Customer's End PIN"
             subtitle="Ask the customer for the end-service PIN to complete"
            otp={otp}
            error={error}
            inputsRef={inputsRef}
            handleChange={handleChange}
            handleKeyDown={handleKeyDown}
            handleVerify={handleVerify}
          />
        )}

        {step === "completed" && (
          <div className="bg-blue-600 p-8 rounded-2xl text-center text-white shadow-xl">
             <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <IndianRupee size={32} />
             </div>
            <p className="text-xl font-bold mb-1">Job Completed!</p>
            <p className="opacity-80 text-sm">₹ Payment will be processed shortly</p>
            <button 
              onClick={() => window.location.href = "/"}
              className="mt-6 bg-white text-blue-600 px-6 py-2 rounded-full font-bold text-sm"
            >
              Back to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function OtpBox({ title, subtitle, otp, error, inputsRef, handleChange, handleKeyDown, handleVerify }) {
  return (
    <div className="bg-white p-6 rounded-2xl text-center shadow-lg border">
      <p className="font-bold text-lg text-gray-800">{title}</p>
      <p className="text-sm text-gray-500 mb-6">{subtitle}</p>
      <div className="flex justify-center gap-4 mb-4">
        {otp.map((d, i) => (
          <input
            key={i}
            ref={(el) => inputsRef.current[i] = el}
            value={d}
            maxLength={1}
            onChange={(e) => handleChange(e.target.value, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            className="w-12 h-14 border-2 rounded-xl text-center text-xl font-bold focus:border-blue-500 focus:ring-0 outline-none transition-colors"
          />
        ))}
      </div>
      {error && <p className="text-red-500 text-sm font-medium mb-4">{error}</p>}
      <button onClick={handleVerify} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold shadow-md active:scale-[0.98] transition-transform">
        Verify & Continue
      </button>
    </div>
  )
}