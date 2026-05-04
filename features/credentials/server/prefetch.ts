import type { inferInput } from "@trpc/tanstack-react-query"
import { prefetch, trpc } from "@/trpc/server"

type Input = inferInput<typeof trpc.credentials.getMany>

/**
 * Prefetches the credentials for the current user. This can be used to prefetch data on the server before rendering a page.
 * @param params The input for the getMany query. This is currently not used, but can be extended in the future to allow for filtering, pagination, etc.
 */
export async function prefetchCredentials(params: Input) {
    return prefetch(trpc.credentials.getMany.queryOptions(params))
}

/**
 * Prefetches a single credential by its ID. This can be used to prefetch data on the server before rendering a page.
 * @param id The ID of the credential to prefetch.
 */
export async function prefetchCredential(id: string) {
    return prefetch(trpc.credentials.getOne.queryOptions({ id }))
}