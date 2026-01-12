'use client'

import { useState, useMemo } from 'react'

const PROGRESS_DATA = {
  today: { earnings: 0, hours: '0:00 hrs', orders: 0 },
  week: { earnings: 248.5, hours: '12:45 hrs', orders: 18 }
}

const PERIODS = [
  { key: 'today', label: 'Today' },
  { key: 'week', label: 'This Week' }
]

const BUTTON_CLASSES = {
  active:
    'bg-sky-500 text-white shadow-md ring-2 ring-sky-400 scale-105',
  inactive:
    'bg-sky-100 text-sky-800 hover:bg-sky-200'
}

export default function MyProgress() {
  const [period, setPeriod] = useState('today')

  const current = useMemo(() => PROGRESS_DATA[period], [period])

  return (
    <section className="w-full mx-auto space-y-4">
      <div className="bg-white rounded-md shadow p-4">
        {/* Header */}
        <header className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-700">
            My Progress
          </h3>

          <div
            className="flex items-center gap-2"
            role="tablist"
            aria-label="Progress period"
          >
            {PERIODS.map(({ key, label }) => {
              const isActive = period === key

              return (
                <button
                  key={key}
                  onClick={() => setPeriod(key)}
                  role="tab"
                  aria-selected={isActive}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold
                    transition-all duration-200 ease-out
                    ${isActive ? BUTTON_CLASSES.active : BUTTON_CLASSES.inactive}`}
                  style={{ minWidth: 92 }}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </header>

        {/* Stats */}
        <div className="bg-gray-100 rounded-md p-4">
          <div className="flex items-stretch">
            <Stat
              label="Earnings"
              value={formatINRCurrency(current.earnings)}
            />
            <Divider />
            <Stat label="Time" value={current.hours} />
            <Divider />
            <Stat label="Orders" value={current.orders} />
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------- helpers ---------- */

function formatINRCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(Number(amount))
}

/* ---------- UI components ---------- */

function Stat({ label, value }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-3">
      <div className="text-2xl font-bold text-gray-800">
        {value}
      </div>
      <div className="text-sm text-gray-600 mt-1">
        {label}
      </div>
    </div>
  )
}

function Divider() {
  return (
    <div
      className="w-px bg-gray-300"
      role="separator"
      aria-hidden="true"
    />
  )
}
