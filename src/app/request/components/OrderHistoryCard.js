"use client"

export default function OrderHistoryCard() {
  return (
    <div className="mt-4 rounded-lg border border-gray-200 bg-white p-4">
      <h3 className="mb-3 text-sm font-semibold text-gray-900">
        Order Timeline
      </h3>

      <div className="space-y-3 text-sm text-gray-700">
        <div className="flex gap-2">
          <span className="mt-1 h-2 w-2 rounded-full bg-gray-400" />
          <p>Order placed at 9:05 PM</p>
        </div>

        <div className="flex gap-2">
          <span className="mt-1 h-2 w-2 rounded-full bg-gray-400" />
          <p>Order accepted by vendor</p>
        </div>

        <div className="flex gap-2">
          <span className="mt-1 h-2 w-2 rounded-full bg-green-500" />
          <p className="font-medium">Preparing food</p>
        </div>
      </div>
    </div>
  )
}
