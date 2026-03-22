import WorkerDetails from "../components/WorkerDetails"

export default function Page() {
  const worker = {
    name: "Rajesh Kumar", // ✅ fixed name here
    role: "Electrician",
    rating: 4.6,
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <WorkerDetails worker={worker} />
    </div>
  )
}