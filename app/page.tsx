import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/90">
      {/* Decorative elements */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-8">
        <div className="text-center max-w-2xl">
          {/* Logo */}
          <div className="flex items-center justify-center mb-8">
            <div className="p-4 bg-primary-light rounded-2xl">
              <svg className="w-12 h-12 text-primary" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
              </svg>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4 text-balance">
            MyClinic EMR
          </h1>
          <p className="text-lg md:text-xl text-muted mb-8">
            Modern Electronic Medical Records System for seamless healthcare management
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/sign-in"
              className="px-8 py-4 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all font-semibold shadow-sm hover:shadow-md"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="px-8 py-4 border border-primary text-primary rounded-lg hover:bg-primary-light transition-all font-semibold"
            >
              Create Account
            </Link>
          </div>

          {/* Account Types */}
          <div className="mt-16 pt-12 border-t border-line">
            <p className="text-sm font-semibold text-muted mb-6 uppercase tracking-wide">Choose your account type</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Doctor Card */}
              <div className="p-8 bg-panel rounded-xl border border-line hover:border-primary/30 hover:shadow-lg transition-all">
                <div className="text-4xl mb-4">👨‍⚕️</div>
                <h3 className="text-xl font-bold text-foreground mb-2">For Doctors</h3>
                <p className="text-muted mb-4">
                  Manage patient records, schedule appointments, and track medical consultations efficiently
                </p>
                <ul className="text-sm text-muted space-y-2">
                  <li>✓ Patient Management</li>
                  <li>✓ Medical Records</li>
                  <li>✓ Appointment Scheduling</li>
                  <li>✓ Consultation Tracking</li>
                </ul>
              </div>

              {/* Patient Card */}
              <div className="p-8 bg-panel rounded-xl border border-line hover:border-primary/30 hover:shadow-lg transition-all">
                <div className="text-4xl mb-4">👤</div>
                <h3 className="text-xl font-bold text-foreground mb-2">For Patients</h3>
                <p className="text-muted mb-4">
                  Access your health information, book appointments, and view medical records securely
                </p>
                <ul className="text-sm text-muted space-y-2">
                  <li>✓ View Health Info</li>
                  <li>✓ Book Appointments</li>
                  <li>✓ Medical Records</li>
                  <li>✓ Doctor Directory</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="mt-16 pt-12 border-t border-line">
            <h2 className="text-2xl font-bold text-foreground mb-8">Why Choose MyClinic?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-panel/50 rounded-lg">
                <div className="text-2xl mb-3">🔒</div>
                <h4 className="font-semibold text-foreground mb-2">Secure & Private</h4>
                <p className="text-sm text-muted">End-to-end encryption for all patient data</p>
              </div>
              <div className="p-6 bg-panel/50 rounded-lg">
                <div className="text-2xl mb-3">⚡</div>
                <h4 className="font-semibold text-foreground mb-2">Fast & Reliable</h4>
                <p className="text-sm text-muted">Lightning-fast access to medical records</p>
              </div>
              <div className="p-6 bg-panel/50 rounded-lg">
                <div className="text-2xl mb-3">📱</div>
                <h4 className="font-semibold text-foreground mb-2">Mobile Ready</h4>
                <p className="text-sm text-muted">Access anytime, anywhere on any device</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
