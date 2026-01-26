import { AppHeader } from "@/components/app-header"
import { PropsWithChildren } from "react"

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <AppHeader />
      <main className="flex-1">{children}</main>
    </>
  )
}

export default Layout
