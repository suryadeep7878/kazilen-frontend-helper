// app/create-account/CreateAccountClient.js
'use client'

import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createProfessional } from '../lib/api'

export default function CreateAccountClient({ phoneFromQuery }) {
  const router = useRouter()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [dob, setDob] = useState('')
  const [gender, setGender] = useState('')
  const [category, setCategory] = useState('')
  const [touched, setTouched] = useState({})
  const [loading, setLoading] = useState(false)

  const [phone] = useState(phoneFromQuery)

  const canSubmit = Boolean(
    name.trim() && dob && gender && category && /^\d{10}$/.test(phone)
  )

  const CATEGORY_OPTIONS = [
    { value: 'customer', label: 'Customer' },
    { value: 'worker', label: 'Worker' },
    { value: 'shopkeeper', label: 'Shopkeeper' },
  ]

  const handleCreateAccount = async () => {
    if (!canSubmit) {
      setTouched({ name: true, dob: true, gender: true, category: true })
      alert('Please fill all required fields.')
      return
    }

    try {
      setLoading(true)

      const payload = {
        phone,
        name: name.trim(),
        email: email || null,
        dob,
        gender: gender.toUpperCase(),
        category,
      }

      const created = await createProfessional(payload)

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

      if (category) {
        localStorage.setItem('kazilen_professional_category', category)
        localStorage.setItem('kazilen_user_category', category)
      }

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
      {/* same UI as before — unchanged */}
      {/* (I’m not repeating UI to keep it clean, you can copy from your existing code) */}
    </div>
  )
}