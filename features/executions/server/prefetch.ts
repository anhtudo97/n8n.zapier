import type { inferInput } from "@trpc/tanstack-react-query"
import { prefetch, trpc } from "@/trpc/server"

type Input = inferInput<typeof trpc.executions.getMany>

/**
 * Prefetches the executions for the current user. This can be used to prefetch data on the server before rendering a page.
 * @param params The input for the getMany query. This is currently not used, but can be extended in the future to allow for filtering, pagination, etc.
 */
export async function prefetchExecutions(params: Input) {
    return prefetch(trpc.executions.getMany.queryOptions(params))
}

/**
 * Prefetches a single execution by its ID. This can be used to prefetch data on the server before rendering a page.
 * @param id The ID of the execution to prefetch.
 */
export async function prefetchExecution(id: string) {
    return prefetch(trpc.executions.getOne.queryOptions({ id }))
}