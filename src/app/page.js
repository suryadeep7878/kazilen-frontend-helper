'use client'

import Header from './components/Header'
import MyProgress from './components/MyProgress'
import OrderPlanCard from './components/OrderPlanCard'
import PlansCard from './components/PlansCard'

export default function Home() {
  const handleRecharge = () => {
    console.log('Recharge clicked')
  }

  return (
    <main className="min-h-screen bg-white pt-6">
      <div className="w-full px-4">

        {/* Header */}
          <div style={{ width: 32 }} />
          <Header imageSrc="/avatar.jpg" />
          <div style={{ width: 32 }} />
        
        {/* Progress */}
        <div className="mt-6">
          <MyProgress />
        </div>

        {/* Order / Plan Info */}
        <div className="mt-6">
          <OrderPlanCard />
        </div>

        {/* Plans */}
        <PlansCard onRecharge={handleRecharge} />
      </div>
    </main>
  )
}
