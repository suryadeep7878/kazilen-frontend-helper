import { memo } from 'react'

const OrderHistoryCard = memo(function OrderHistoryCard() {
  return (
    <div className="mt-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
        Order Timeline
      </h3>

      <div className="space-y-4 text-sm text-slate-600">
        <div className="flex gap-3">
          <span className="mt-1 h-2 w-2 rounded-full bg-slate-300 shadow-sm" />
          <p className="font-medium">Order placed at 9:10 PM</p>
        </div>

        <div className="flex gap-3">
          <span className="mt-1 h-2 w-2 rounded-full bg-slate-300 shadow-sm" />
          <p className="font-medium">Order accepted by vendor</p>
        </div>

        <div className="flex gap-3">
          <span className="mt-1 h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)] animate-pulse" />
          <p className="font-bold text-slate-800">Preparing your order</p>
        </div>
      </div>
    </div>
  )
})

export default OrderHistoryCard;
