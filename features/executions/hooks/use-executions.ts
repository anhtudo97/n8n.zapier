import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query"
import { useExecutionsParams } from "./use-executions-params"

export const useSuspenseExecutions = () => {
    const trpc = useTRPC()
    const [params] = useExecutionsParams()
    return useSuspenseQuery(trpc.executions.getMany.queryOptions(params))
}

/**
 * Custom hook to fetch a single execution by its ID using React Query's suspense mode.
 * @param id The ID of the execution to fetch.
 * @returns The execution data.
 */
export const useSuspenseExecution = (id: string) => {
    const trpc = useTRPC()
    return useSuspenseQuery(trpc.executions.getOne.queryOptions({ id }))
}