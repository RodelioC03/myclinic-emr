import { AuthForm } from '@/components/auth-form'

export const metadata = {
  title: 'Sign In - MyClinic EMR',
  description: 'Sign in to your MyClinic account',
}

export default function SignInPage() {
  return <AuthForm mode="sign-in" />
}
