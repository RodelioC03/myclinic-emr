import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import Link from 'next/link'
import { Users, AlertCircle, TrendingUp, Activity } from 'lucide-react'

export const metadata = {
  title: 'Admin Dashboard - MyClinic EMR',
  description: 'Hospital administration and management',
}

export default async function AdminPage() {
  try {
    const session = await auth.api.getSession({ headers: await headers() })

    // Redirect if not authenticated
    if (!session?.user) {
      redirect('/sign-in')
    }

    // Redirect if not admin
    if (session.user.role !== 'admin') {
      redirect('/')
    }
  } catch (error) {
    // Session check failed, redirect to sign-in
    console.log('[v0] Session check failed, redirecting to sign-in')
    redirect('/sign-in')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-line bg-panel sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-light rounded-lg">
              <AlertCircle className="text-primary" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">MyClinic Admin</h1>
              <p className="text-sm text-muted">Hospital Management System</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted">Welcome, {session.user.name || 'Administrator'}</span>
            <Link
              href="/api/auth/signout"
              className="px-4 py-2 text-sm font-medium text-primary hover:bg-primary-light rounded-lg transition-colors"
            >
              Sign Out
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Patients */}
          <div className="p-6 bg-panel border border-line rounded-xl hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted">Total Patients</h3>
              <Users className="text-primary" size={20} />
            </div>
            <p className="text-3xl font-bold text-foreground">2,481</p>
            <p className="text-xs text-muted mt-2">↑ 12% from last month</p>
          </div>

          {/* Active Doctors */}
          <div className="p-6 bg-panel border border-line rounded-xl hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted">Active Doctors</h3>
              <Activity className="text-primary" size={20} />
            </div>
            <p className="text-3xl font-bold text-foreground">48</p>
            <p className="text-xs text-muted mt-2">23 online now</p>
          </div>

          {/* Today's Appointments */}
          <div className="p-6 bg-panel border border-line rounded-xl hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted">Today's Appointments</h3>
              <TrendingUp className="text-primary" size={20} />
            </div>
            <p className="text-3xl font-bold text-foreground">156</p>
            <p className="text-xs text-muted mt-2">89 completed</p>
          </div>

          {/* Pending Issues */}
          <div className="p-6 bg-panel border border-line rounded-xl hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted">Pending Issues</h3>
              <AlertCircle className="text-error" size={20} />
            </div>
            <p className="text-3xl font-bold text-foreground">12</p>
            <p className="text-xs text-muted mt-2">3 urgent</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 p-6 bg-panel border border-line rounded-xl">
            <h2 className="text-lg font-bold text-foreground mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <Link
                href="#"
                className="p-4 border border-line rounded-lg hover:bg-primary-light hover:border-primary transition-all text-center"
              >
                <p className="text-sm font-medium text-foreground">Manage Users</p>
              </Link>
              <Link
                href="#"
                className="p-4 border border-line rounded-lg hover:bg-primary-light hover:border-primary transition-all text-center"
              >
                <p className="text-sm font-medium text-foreground">View Reports</p>
              </Link>
              <Link
                href="#"
                className="p-4 border border-line rounded-lg hover:bg-primary-light hover:border-primary transition-all text-center"
              >
                <p className="text-sm font-medium text-foreground">System Settings</p>
              </Link>
              <Link
                href="#"
                className="p-4 border border-line rounded-lg hover:bg-primary-light hover:border-primary transition-all text-center"
              >
                <p className="text-sm font-medium text-foreground">Audit Logs</p>
              </Link>
              <Link
                href="#"
                className="p-4 border border-line rounded-lg hover:bg-primary-light hover:border-primary transition-all text-center"
              >
                <p className="text-sm font-medium text-foreground">Billing</p>
              </Link>
              <Link
                href="#"
                className="p-4 border border-line rounded-lg hover:bg-primary-light hover:border-primary transition-all text-center"
              >
                <p className="text-sm font-medium text-foreground">Integrations</p>
              </Link>
            </div>
          </div>

          {/* System Status */}
          <div className="p-6 bg-panel border border-line rounded-xl">
            <h2 className="text-lg font-bold text-foreground mb-4">System Status</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted">Database</span>
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted">API Server</span>
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted">Authentication</span>
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted">Email Service</span>
                <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full"></span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="p-6 bg-panel border border-line rounded-xl">
          <h2 className="text-lg font-bold text-foreground mb-4">Recent Activity</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <div>
                <p className="text-sm font-medium text-foreground">New user registration</p>
                <p className="text-xs text-muted">Dr. Maria Santos registered</p>
              </div>
              <span className="text-xs text-muted">2 minutes ago</span>
            </div>
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <div>
                <p className="text-sm font-medium text-foreground">System backup completed</p>
                <p className="text-xs text-muted">All data successfully backed up</p>
              </div>
              <span className="text-xs text-muted">15 minutes ago</span>
            </div>
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <div>
                <p className="text-sm font-medium text-foreground">New appointment scheduled</p>
                <p className="text-xs text-muted">Patient: Juan Dela Cruz</p>
              </div>
              <span className="text-xs text-muted">45 minutes ago</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Report generated</p>
                <p className="text-xs text-muted">Monthly performance report</p>
              </div>
              <span className="text-xs text-muted">1 hour ago</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
