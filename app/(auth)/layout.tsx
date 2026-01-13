import { AuthLayout } from '@/features/auth/components/auth-layout'
import { PropsWithChildren } from 'react'

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <AuthLayout>
      {children}
    </AuthLayout>
  )
}
export default Layout
