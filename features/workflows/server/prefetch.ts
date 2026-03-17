import type { inferInput } from "@trpc/tanstack-react-query"
import { prefetch, trpc } from "@/trpc/server"

type Input = inferInput<typeof trpc.workflows.getMany>

/**
 * Prefetches the workflows for the current user. This can be used to prefetch data on the server before rendering a page.
 * @param params The input for the getMany query. This is currently not used, but can be extended in the future to allow for filtering, pagination, etc.
 */
export async function prefetchWorkflows(params: Input) {
    return prefetch(trpc.workflows.getMany.queryOptions(params))
}

/**
 * Prefetches a single workflow by its ID. This can be used to prefetch data on the server before rendering a page.
 * @param id The ID of the workflow to prefetch.
 */
export async function prefetchWorkflow(id: string) {
    return prefetch(trpc.workflows.getOne.queryOptions({ id }))
}