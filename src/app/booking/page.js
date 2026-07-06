'use client'

import React, { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  Phone,
  Navigation,
  Wrench,
  IndianRupee,
  Loader2,
  CheckCircle2
} from "lucide-react"
import { apiRequest } from "@/utils/api"

export default function BookingPage() {
  const queryClient = useQueryClient()
  const [step, setStep] = useState("idle") // idle → start → working → end → completed

  // 1. Fetch the specific booking details
  const { data: jobData, isLoading: jobLoading, error } = useQuery({
    queryKey: ["current-job"],
    queryFn: () => apiRequest("/getBooking", "GET"), // Adjust method if your API requires POST for fetching
    refetchInterval: step === "working" ? 5000 : false, // Poll only when working
  })

  // 2. Mutation to accept the booking
  const acceptMutation = useMutation({
    mutationFn: () => apiRequest("/acceptBooking", "POST"),
    onSuccess: () => {
      queryClient.invalidateQueries(["current-job"])
      setStep("start")
    },
  })

  // Sync internal UI step with API status
  useEffect(() => {
    if (jobData) {
      if (jobData.status === "ACCEPTED") setStep("start")
      if (jobData.status === "STARTED" || jobData.action === "STARTED") setStep("working")
      if (jobData.status === "FINISHED" || jobData.is_finished) setStep("completed")
    }
  }, [jobData])

  if (jobLoading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>
  
  // If no job is returned or there's an error, show empty state
  if (!jobData || error) return (
    <div className="p-10 text-center flex flex-col items-center gap-4">
      <p className="text-gray-500">No active bookings found.</p>
      <button 
        onClick={() => window.location.reload()} 
        className="text-blue-600 font-medium"
      >
        Refresh Page
      </button>
    </div>
  )

  const { customer, worker, id } = jobData

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="flex justify-between px-4 py-3 bg-white border-b sticky top-0 z-10">
        <h1 className="text-lg font-semibold">Booking Details</h1>
        <a href={`tel:${customer?.phoneNo}`} className="flex items-center gap-2 text-blue-600">
          <Phone size={18} /> Call
        </a>
      </div>

      <div className="p-4 space-y-4">
        {/* Customer Profile Card */}
        <div className="bg-white p-4 rounded-xl flex gap-4 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
             {customer?.name?.[0] || "C"}
          </div>
          <div>
            <p className="font-bold text-gray-800">{customer?.name || "Customer Name"}</p>
            <p className="text-sm text-gray-500">{customer?.phoneNo || "No Phone"}</p>
            <div className="flex items-center gap-1 mt-1 text-xs font-medium text-emerald-600 bg-emerald-50 w-fit px-2 py-0.5 rounded">
              <CheckCircle2 size={12} /> Verified Customer
            </div>
          </div>
        </div>

        {/* Location Card */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <p className="font-semibold text-gray-700">Service Address</p>
            <button 
              onClick={() => window.open(`https://www.google.com/maps?q=${customer?.address}`, '_blank')}
              className="text-blue-600 flex items-center gap-1 text-sm font-medium"
            >
              <Navigation size={16}/> Directions
            </button>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            {customer?.address || "Address not specified"}
          </p>
        </div>

        {/* Service Details Badge */}
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-blue-500 flex justify-between items-center">
            <div>
              <p className="font-semibold flex gap-2 items-center text-gray-800">
                <Wrench size={16} className="text-blue-500"/> {worker?.categories || "General Service"}
              </p>
              <p className="text-xs text-gray-400 mt-1">Booking ID: {id?.split("-")[0].toUpperCase()}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 uppercase">Estimated Pay</p>
              <p className="font-bold text-gray-800 flex items-center justify-end">
                <IndianRupee size={14} /> {jobData.amount || "---"}
              </p>
            </div>
        </div>

        {/* ===== ACTION FLOW SECTION ===== */}
        
        {step === "idle" && (
           <div className="bg-white p-6 rounded-2xl text-center shadow-lg border-2 border-blue-100">
             <p className="font-bold text-lg text-gray-800">New Request Assigned</p>
             <p className="text-sm text-gray-500 mb-6">Review the details above before accepting the job.</p>
             <button 
               onClick={() => acceptMutation.mutate()}
               disabled={acceptMutation.isPending}
               className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold shadow-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
             >
               {acceptMutation.isPending ? "Accepting..." : "Accept Booking"}
             </button>
           </div>
        )}

        {step === "start" && (
          <div className="bg-white p-6 rounded-2xl text-center shadow-lg border">
            <p className="font-bold text-lg text-gray-800">At Customer Location?</p>
            <p className="text-sm text-gray-500 mb-6">Once you arrive, start the job to track your time.</p>
            <button 
              onClick={() => setStep("working")}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold shadow-md active:scale-[0.98] transition-transform"
            >
              Start Job Now
            </button>
          </div>
        )}

        {step === "working" && (
          <div className="bg-emerald-50 p-6 rounded-2xl text-center border border-emerald-100">
            <div className="flex justify-center mb-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            <p className="text-emerald-700 font-bold text-lg mb-1">Work in Progress</p>
            <p className="text-emerald-600 text-sm mb-5">Serving {customer?.name}</p>
            <button
              onClick={() => setStep("end")}
              className="w-full bg-emerald-600 text-white px-4 py-3 rounded-full font-semibold shadow-lg shadow-emerald-200 hover:bg-emerald-700"
            >
              Finish Job
            </button>
          </div>
        )}

        {step === "end" && (
          <div className="bg-white p-6 rounded-2xl text-center shadow-lg border">
            <p className="font-bold text-lg text-gray-800">Job Completion</p>
            <p className="text-sm text-gray-500 mb-6">Please ensure the work area is clean before finishing.</p>
            <button 
              onClick={() => setStep("completed")}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold shadow-md"
            >
              Confirm Completion
            </button>
          </div>
        )}

        {step === "completed" && (
          <div className="bg-blue-600 p-8 rounded-2xl text-center text-white shadow-xl">
             <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <IndianRupee size={32} />
             </div>
            <p className="text-xl font-bold mb-1">Great Job!</p>
            <p className="opacity-80 text-sm">₹{jobData.amount || "0"} will be added to your wallet</p>
            <button 
              onClick={() => window.location.href = "/"}
              className="mt-6 bg-white text-blue-600 px-6 py-2 rounded-full font-bold text-sm hover:bg-gray-100"
            >
              Back to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
