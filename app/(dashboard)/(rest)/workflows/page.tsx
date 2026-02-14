import { WorkflowsList } from "@/features/workflows/components/workflows"
import { prefetchWorkflows } from "@/features/workflows/server/prefetch"
import { requireAuth } from "@/lib/auth-utils"
import { HydrateClient } from "@/trpc/server"
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"

const Page = async () => {
  await requireAuth()

  prefetchWorkflows() // Prefetch workflows on the server before rendering the page

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <Suspense fallback={<div>Loading...</div>}>
          <WorkflowsList />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  )
}

export default Page
