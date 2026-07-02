'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, Plus, Clock, Users } from 'lucide-react'

export default function DoctorDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')

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
        <h1 className="text-2xl font-bold text-gray-900">Clinix EMR - Doctor Dashboard</h1>
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
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Link
            href="/doctor/new-patient"
            className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
          >
            <Plus className="w-8 h-8 text-blue-600 mb-2" />
            <h3 className="font-semibold text-gray-900">New Patient</h3>
            <p className="text-sm text-gray-600">Register a new patient</p>
          </Link>

          <Link
            href="/doctor/appointments"
            className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
          >
            <Clock className="w-8 h-8 text-blue-600 mb-2" />
            <h3 className="font-semibold text-gray-900">Today&apos;s Appointments</h3>
            <p className="text-sm text-gray-600">View today&apos;s schedule</p>
          </Link>

          <Link
            href="/doctor/pending"
            className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
          >
            <Users className="w-8 h-8 text-blue-600 mb-2" />
            <h3 className="font-semibold text-gray-900">Pending Requests</h3>
            <p className="text-sm text-gray-600">Appointment requests</p>
          </Link>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <Search className="w-8 h-8 text-blue-600 mb-2" />
            <h3 className="font-semibold text-gray-900">Search Patient</h3>
            <p className="text-sm text-gray-600">Find patient records</p>
          </div>
        </div>

        {/* Patient Search */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Patient Search</h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search by name, ID, or contact..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Search
            </button>
          </div>
          {searchQuery && (
            <div className="mt-4 text-sm text-gray-600">
              Searching for: <span className="font-semibold">{searchQuery}</span>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">Welcome to Clinix EMR</h3>
          <p className="text-blue-800 text-sm">
            This is your doctor dashboard. Use the quick actions above to manage patients, view appointments, and handle requests. 
            The patient search allows you to find existing patients and access their medical records.
          </p>
        </div>
      </div>
    </div>
  )
}
