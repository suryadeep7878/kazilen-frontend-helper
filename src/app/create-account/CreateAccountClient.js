// app/create-account/CreateAccountClient.js
'use client'

import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { apiRequest } from '@/utils/api'
import { SkeletonButton } from '../../components/Skeletons'

export default function CreateAccountClient({ phoneFromQuery }) {
  const router = useRouter()
	const serach = useSearchParams()
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [dob, setDob] = useState('')
  const [gender, setGender] = useState('')
  //const [category, setCategory] = useState('')
  const [touched, setTouched] = useState({})
  const [loading, setLoading] = useState(false)

  const [phone] = serach.get("phone")

  const canSubmit = Boolean(
    name.trim() && dob && gender && /^\d{10}$/.test(phone)
  )

  //const CATEGORY_OPTIONS = [
  //  { value: 'customer', label: 'Customer' },
  //  { value: 'worker', label: 'Worker' },
  //  { value: 'shopkeeper', label: 'Shopkeeper' },
  //]

  const handleCreateAccount = async () => {
    if (!canSubmit) {
      setTouched({ name: true, dob: true, gender: true})
      alert('Please fill all required fields.')
      return
    }

    try {
      setLoading(true)

      const payload = {
				phone: phone,
        name: name.trim(),
        dob: dob,
        gender: gender.toUpperCase(),
      //  category:category,
				address:address
      }

      const created = await apiRequest("/create-worker", "POST", payload) 

      if (created?.id) {
        const idStr = String(created.id)

        localStorage.setItem('kazilen_professional_id', idStr)
        localStorage.setItem('professionalId', idStr)
        localStorage.setItem('kazilen_user_id', idStr)
        localStorage.setItem('userId', idStr)
      }

      const finalPhone = created?.phone || phone

      if (finalPhone) {
        localStorage.setItem('kazilen_professional_phone', finalPhone)
        localStorage.setItem('kazilen_user_phone', finalPhone)
        localStorage.setItem('kazilen_user_phone_v2', finalPhone)
      }

      //if (category) {
      //  localStorage.setItem('kazilen_professional_category', category)
      //  localStorage.setItem('kazilen_user_category', category)
      //}

      alert('Account created successfully!')
      router.replace('/')
    } catch (err) {
      console.error(err)
      alert(err?.message || 'Create failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="flex items-center gap-3 p-4 shadow-sm border-b">
        <button onClick={() => router.back()} className="text-gray-700">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-semibold text-gray-800">Create your profile</h1>
      </div>

      <div className="px-4 mt-4">
        <fieldset className="relative border rounded-lg px-3 pt-4 pb-2">
          <legend className="text-xs px-1 text-gray-500">Phone</legend>
          <input
            type="tel"
            value={phone}
            readOnly
            className="w-full border-none bg-transparent p-0 text-sm text-gray-800 focus:outline-none"
          />
        </fieldset>
        {!/^\d{10}$/.test(phone) && (
          <p className="text-xs text-red-500 mt-1">
            Phone not found or invalid. Go back to login and enter a valid phone.
          </p>
        )}
      </div>

      <div className="px-4 mt-6">
        <fieldset className={`relative border rounded-lg px-3 pt-4 pb-2 ${touched.name && !name.trim() ? 'border-red-400' : 'border-gray-300'}`}>
          <legend className="text-xs px-1 text-gray-500">Name *</legend>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, name: true }))}
            placeholder="Enter your full name"
            className="w-full border-none bg-transparent p-0 text-sm text-gray-800 focus:outline-none"
          />
        </fieldset>
        {touched.name && !name.trim() && (
          <p className="text-xs text-red-500 mt-1">Name is required.</p>
        )}
      </div>

      <div className="px-4 mt-4">
        <fieldset className={`relative border rounded-lg px-3 pt-4 pb-2 ${touched.dob && !dob ? 'border-red-400' : 'border-gray-300'}`}>
          <legend className="text-xs px-1 text-gray-500">Date of birth *</legend>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, dob: true }))}
            className="w-full border-none bg-transparent p-0 text-sm text-gray-800 focus:outline-none"
          />
        </fieldset>
        {touched.dob && !dob && (
          <p className="text-xs text-red-500 mt-1">Date of birth is required.</p>
        )}
      </div>

      <div className="px-4 mt-4">
        <fieldset className={`relative border rounded-lg px-3 pt-4 pb-2 ${touched.gender && !gender ? 'border-red-400' : 'border-gray-300'}`}>
          <legend className="text-xs px-1 text-gray-500">Gender *</legend>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, gender: true }))}
            className="w-full border-none bg-transparent text-sm text-gray-800 focus:outline-none"
          >
            <option value="" disabled>Select gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </fieldset>
        {touched.gender && !gender && (
          <p className="text-xs text-red-500 mt-1">Gender is required.</p>
        )}
      </div>

      <div className="px-4 mt-6 pb-6">
        {loading ? (
          <SkeletonButton className="w-full" text="Creating..." />
        ) : (
          <button
            onClick={handleCreateAccount}
            disabled={!canSubmit}
            className={`w-full py-3 rounded-xl font-medium ${canSubmit ? 'bg-yellow-400 hover:bg-yellow-500 text-black' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
          >
            Create Account
          </button>
        )}
      </div>
    </div>
  )
}
