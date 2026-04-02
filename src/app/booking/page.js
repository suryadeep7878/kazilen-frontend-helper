'use client'

import React, { useRef, useState, useEffect } from "react"
import {
  Phone,
  Home,
  Navigation,
  Wrench,
  IndianRupee,
  CalendarDays,
  Clock
} from "lucide-react"

export default function BookingPage() {

  const phoneNumber = "+919876543237"

  const [otp, setOtp] = useState(["", "", "", ""])
  const [error, setError] = useState("")
  const [step, setStep] = useState("start") // start → working → end → completed

  const inputsRef = useRef([])

  // ⚠️ TEMP (replace with backend)
  const START_OTP = "1234"
  const END_OTP = "5678"

  const location = {
    title: "Andheri East, Mumbai",
    address: "Flat 402, ABC Apartment",
    landmark: "Near Metro Station",
    lat: 19.1136,
    lng: 72.8697,
    label: "Home"
  }

  const service = {
    name: "Fan Repair",
    id: "5564645569",
    category: "Electrical Repair",
    type: "Inspection & Repair",
    price: 550,
    duration: "60-90 mins",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952"
  }

  const booking = {
    date: "3 April 2026",
    time: "10:15 AM"
  }

  // Autofocus first input when step changes
  useEffect(() => {
    if (step === "start" || step === "end") {
      setTimeout(() => inputsRef.current[0]?.focus(), 100)
    }
  }, [step])

  // 📞 Call
  const handleCall = () => {
    window.location.href = `tel:${phoneNumber}`
  }

  // 🗺️ Maps
  const openMaps = () => {
    window.open(`https://www.google.com/maps?q=${location.lat},${location.lng}`)
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

  const resetOtp = () => {
    setOtp(["", "", "", ""])
  }

  // Verify OTP
  const handleVerify = () => {
    const enteredOtp = otp.join("")

    if (enteredOtp.length < 4) {
      setError("Enter complete OTP")
      return
    }

    if (step === "start") {
      if (enteredOtp === START_OTP) {
        setStep("working")
        resetOtp()
      } else {
        setError("Wrong OTP. Try again.")
      }
    }

    else if (step === "end") {
      if (enteredOtp === END_OTP) {
        setStep("completed")
      } else {
        setError("Wrong OTP. Try again.")
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <div className="flex justify-between px-4 py-3 bg-white border-b">
        <h1 className="text-lg font-semibold">Job Details</h1>

        <button onClick={handleCall} className="flex items-center gap-2 text-blue-600">
          <Phone size={18} /> Call
        </button>
      </div>

      <div className="p-4 space-y-4">

        {/* Customer */}
        <div className="bg-white p-4 rounded-xl flex gap-4 shadow-sm">
          <img src="https://randomuser.me/api/portraits/men/32.jpg" className="w-14 h-14 rounded-full"/>
          <div>
            <p className="font-semibold">Rahul Sharma</p>
            <p className="text-sm text-gray-600">+91 XXXXXXXX37</p>
            <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
              <Home size={14}/> Home
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <p className="font-semibold mb-2">Location</p>

          <div className="flex gap-3">
            <img
              src={`https://maps.googleapis.com/maps/api/staticmap?center=${location.lat},${location.lng}&zoom=15&size=200x200&markers=color:red%7C${location.lat},${location.lng}&key=YOUR_API_KEY`}
              className="w-24 h-24 rounded-lg"
            />

            <div>
              <p className="font-semibold">{location.title}</p>
              <p className="text-sm text-gray-600">{location.address}</p>
              <p className="text-sm text-gray-600">{location.landmark}</p>
            </div>
          </div>

          <div className="flex justify-between mt-3">
            <span className="text-sm bg-gray-100 px-3 py-1 rounded">Home</span>

            <button onClick={openMaps} className="text-blue-600 flex items-center gap-1">
              <Navigation size={16}/> Maps
            </button>
          </div>
        </div>

        {/* Service */}
        <div className="bg-white p-4 rounded-xl flex gap-4 shadow-sm">
          <img src={service.image} className="w-28 h-28 rounded-lg"/>

          <div className="flex-1">
            <p className="font-semibold flex gap-2 items-center">
              <Wrench size={16}/> {service.name}
            </p>

            <p className="text-xs bg-gray-100 px-2 py-1 rounded inline-block mt-1">
              ID: {service.id}
            </p>

            <p className="text-sm mt-2">₹ {service.price}</p>
            <p className="text-sm text-gray-500">{service.duration}</p>
          </div>
        </div>

        {/* Booking */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <p className="font-semibold mb-2">Booking</p>

          <p className="flex items-center gap-2">
            <CalendarDays size={16}/> {booking.date}
          </p>

          <p className="flex items-center gap-2 mt-2">
            <Clock size={16}/> {booking.time}
          </p>
        </div>

        {/* ===== FLOW SECTION ===== */}

        {step === "start" && (
          <OtpBox
            title="Enter OTP to Start Work"
            otp={otp}
            error={error}
            inputsRef={inputsRef}
            handleChange={handleChange}
            handleKeyDown={handleKeyDown}
            handleVerify={handleVerify}
          />
        )}

        {step === "working" && (
          <div className="bg-green-50 p-4 rounded-xl text-center">
            <p className="text-green-700 font-semibold mb-3">Work Started ✅</p>

            <button
              onClick={() => setStep("end")}
              className="bg-orange-500 text-white px-4 py-2 rounded"
            >
              Complete Work
            </button>
          </div>
        )}

        {step === "end" && (
          <OtpBox
            title="Enter OTP to Complete Work"
            otp={otp}
            error={error}
            inputsRef={inputsRef}
            handleChange={handleChange}
            handleKeyDown={handleKeyDown}
            handleVerify={handleVerify}
          />
        )}

        {step === "completed" && (
          <div className="bg-green-100 p-4 rounded-xl text-center">
            <p className="text-green-700 font-semibold">Job Completed 🎉</p>
          </div>
        )}

      </div>
    </div>
  )
}

/* 🔥 Reusable OTP Component */
function OtpBox({
  title,
  otp,
  error,
  inputsRef,
  handleChange,
  handleKeyDown,
  handleVerify
}) {
  return (
    <div className="bg-white p-4 rounded-xl text-center shadow-sm">
      <p className="mb-3 font-semibold">{title}</p>

      <div className="flex justify-center gap-3 mb-3">
        {otp.map((d, i) => (
          <input
            key={i}
            ref={(el) => inputsRef.current[i] = el}
            value={d}
            maxLength={1}
            onChange={(e) => handleChange(e.target.value, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            className="w-12 h-12 border rounded text-center text-lg focus:ring-2 focus:ring-blue-500"
          />
        ))}
      </div>

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      <button
        onClick={handleVerify}
        className="w-full bg-blue-600 text-white py-2 rounded"
      >
        Verify OTP
      </button>
    </div>
  )
}