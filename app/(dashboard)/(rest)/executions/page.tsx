import { CredentialsList } from "@/features/credentials/components/credentials"
import { executionsParamsLoader } from "@/features/executions/server/params-loader"
import { prefetchExecutions } from "@/features/executions/server/prefetch"
import { requireAuth } from "@/lib/auth-utils"
import { HydrateClient } from "@/trpc/server"
import { SearchParams } from "nuqs"
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"

type Props = {
  searchParams: Promise<SearchParams>
}

const Page = async ({ searchParams }: Props) => {
  await requireAuth()

  const params = await executionsParamsLoader(searchParams)
  prefetchExecutions(params)

  return (
    <>
      <HydrateClient>
        <ErrorBoundary fallback={<></>}>
          <Suspense fallback={<></>}>
            <h1>Executions</h1>
          </Suspense>
        </ErrorBoundary>
      </HydrateClient >
    </ >
  )
}

export default Page
