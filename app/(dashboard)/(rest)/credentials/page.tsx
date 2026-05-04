import { CredentialsContainer, CredentialsList } from "@/features/credentials/components/credentials"
import { credentialsParamsLoader } from "@/features/credentials/server/params-loader"
import { prefetchCredentials } from "@/features/credentials/server/prefetch"
import { requireAuth } from "@/lib/auth-utils"
import { HydrateClient } from "@/trpc/server"
import { SearchParams } from "nuqs/server"
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"

type Props = {
  searchParams: Promise<SearchParams>
}


const Page = async ({ searchParams }: Props) => {
  await requireAuth()

  const params = await credentialsParamsLoader(searchParams)
  prefetchCredentials(params) // Prefetch credentials on the server before rendering the page

  return (
    <CredentialsContainer>
      <HydrateClient>
        <ErrorBoundary fallback={<p>Failed to load credentials.</p>}>
          <Suspense fallback={<p>Loading credentials...</p>}>
            <CredentialsList />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </CredentialsContainer>
  )
}
export default Page
