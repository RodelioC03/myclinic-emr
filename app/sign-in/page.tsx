import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { AuthForm } from '@/components/auth-form'

export const metadata = {
  title: 'Sign In - MyClinic EMR',
  description: 'Sign in to your MyClinic account',
}

export default async function SignInPage() {
  try {
    const session = await auth.api.getSession({ headers: await headers() })

    if (session?.user) {
      // Redirect logged-in users based on their role
      if (session.user.role === 'doctor') {
        redirect('/doctor')
      } else if (session.user.role === 'admin') {
        redirect('/admin')
      } else {
        redirect('/patient')
      }
    }
  } catch (error) {
    // Session check failed, continue to sign-in form
    console.log('[v0] Session check failed, showing sign-in form')
  }

  return <AuthForm mode="sign-in" />
}
