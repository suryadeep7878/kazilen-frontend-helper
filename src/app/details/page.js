"use client";

import dynamic from 'next/dynamic'
import { DetailsSkeleton } from '../../components/Skeletons'
import { apiRequest } from '@/utils/api';

const WorkerDetails = dynamic(() => import("../components/WorkerDetails"), {
  loading: () => <DetailsSkeleton />,
  ssr: false
})

export default function Page() {
	// const userID = localStorage.getItem('userID')
  const res = apiRequest('/get-profile', 'POST' )
  const worker = {
    name: `${res.name}`, // ✅ fixed name here
    role: "Electrician",
    rating: res.rating,
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <WorkerDetails worker={worker} />
    </div>
  )
}
