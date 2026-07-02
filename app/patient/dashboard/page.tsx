'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Calendar, FileText, Pill, Bell } from 'lucide-react'

export default function PatientDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userStr = localStorage.getItem('user')
    if (!userStr) {
      router.push('/login')
      return
    }
    setUser(JSON.parse(userStr))
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Clinix EMR - Patient Portal</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{user.name}</span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6">
        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Welcome, {user.name}!</h2>
          <p className="text-gray-600 mt-2">Manage your health information and appointments</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Link
            href="/patient/appointments"
            className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
          >
            <Calendar className="w-8 h-8 text-blue-600 mb-2" />
            <h3 className="font-semibold text-gray-900">Appointments</h3>
            <p className="text-sm text-gray-600">View and request appointments</p>
          </Link>

          <Link
            href="/patient/records"
            className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
          >
            <FileText className="w-8 h-8 text-blue-600 mb-2" />
            <h3 className="font-semibold text-gray-900">Medical Records</h3>
            <p className="text-sm text-gray-600">View your health information</p>
          </Link>

          <Link
            href="/patient/prescriptions"
            className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
          >
            <Pill className="w-8 h-8 text-blue-600 mb-2" />
            <h3 className="font-semibold text-gray-900">Prescriptions</h3>
            <p className="text-sm text-gray-600">View your prescriptions</p>
          </Link>

          <Link
            href="/patient/notifications"
            className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
          >
            <Bell className="w-8 h-8 text-blue-600 mb-2" />
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            <p className="text-sm text-gray-600">View your notifications</p>
          </Link>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">Welcome to Your Patient Portal</h3>
          <p className="text-blue-800 text-sm">
            Use the quick actions above to view your medical records, manage appointments with your healthcare provider, 
            and check your prescriptions. Your health information is securely stored and accessible only to you and authorized providers.
          </p>
        </div>
      </div>
    </div>
  )
}
