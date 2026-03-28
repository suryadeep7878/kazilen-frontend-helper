import { memo } from 'react'

const WarrantyPeriodCard = memo(function WarrantyPeriodCard() {
  return (
    <div className="mt-4 p-5 rounded-2xl bg-green-50 border border-green-100 shadow-sm space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <p className="text-xs font-bold text-green-700 uppercase tracking-widest">Warranty Active</p>
      </div>
      <p className="text-sm text-slate-700 font-medium">
        Remaining coverage: <b className="text-green-700">5 days</b>
      </p>
      <p className="text-[10px] font-medium text-slate-500 leading-relaxed">
        Covers all quality issues, parts replacement, and service-related complaints during the active period.
      </p>
    </div>
  )
})

export default WarrantyPeriodCard;
