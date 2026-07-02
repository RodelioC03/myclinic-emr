'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      if (user.role === 'DOCTOR' || user.role === 'ADMIN') {
        router.push('/doctor/dashboard')
      } else {
        router.push('/patient/dashboard')
      }
    } else {
      router.push('/login')
    }
  }, [router])

  return null
}
