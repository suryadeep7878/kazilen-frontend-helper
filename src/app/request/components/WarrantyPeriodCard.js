"use client"

export default function WarrantyPeriodCard() {
  return (
    <div className="mt-3 space-y-2 text-sm text-gray-700">
      <p className="font-medium text-green-600">Warranty Active</p>
      <p>
        Warranty left: <b>5 days</b>
      </p>
      <p className="text-gray-500">
        Covers quality issues & service complaints
      </p>
    </div>
  )
}
