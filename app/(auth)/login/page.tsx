import { LoginForm } from '@/features/auth/components/login-form'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!!session) {
    redirect('/')
  }

  return <LoginForm />
}

export default Page
