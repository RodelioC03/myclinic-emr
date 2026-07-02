import { AuthForm } from '@/components/auth-form'

export const metadata = {
  title: 'Sign Up - MyClinic EMR',
  description: 'Create a MyClinic account',
}

export default function SignUpPage() {
  return <AuthForm mode="sign-up" />
}
