import { useTRPC } from "@/trpc/client"
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { useWorkflowsParams } from "./use-workflows-params"

export const useSuspenseWorkflows = () => {
    const trpc = useTRPC()
    const [params] = useWorkflowsParams()
    return useSuspenseQuery(trpc.workflows.getMany.queryOptions(params))
}

/**
 * Custom hook to create a new workflow.
 * @returns A mutation object that can be used to trigger the creation of a new workflow.
 */
export const useCreateWorkflow = () => {
    const queryClient = useQueryClient()
    const trpc = useTRPC()

    return useMutation(
        trpc.workflows.create.mutationOptions({
            onSuccess: (data) => {
                toast.success(`Workflow "${data.name}" created successfully!`)
                queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({}))
            },
            onError: (error) => {
                toast.error(`Failed to create workflow: ${error.message}`)
            },
        })
    )
}

/**
 * Custom hook to remove a workflow by its ID.
 * @returns A mutation object that can be used to trigger the removal of a workflow.
 */
export const useRemoveWorkflow = () => {
    const trpc = useTRPC()
    const queryClient = useQueryClient()

    return useMutation(
        trpc.workflows.remove.mutationOptions({
            onSuccess: (data) => {
                toast.success("Workflow removed successfully!")
                queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({}))
                queryClient.invalidateQueries(trpc.workflows.getOne.queryOptions({ id: data.id }))
            },
            onError: (error) => {
                toast.error(`Failed to remove workflow: ${error.message}`)
            },
        })
    )
}

/**
 * Custom hook to fetch a single workflow by its ID using React Query's suspense mode.
 * @param id The ID of the workflow to fetch.
 * @returns The workflow data.
 */
export const useSuspenseWorkflow = (id: string) => {
    const trpc = useTRPC()
    return useSuspenseQuery(trpc.workflows.getOne.queryOptions({ id }))
}

/**
 * Custom hook to update the name of a workflow.
 * @returns A mutation object that can be used to trigger the update of a workflow's name.
 */
export const useUpdateWorkflowName = () => {
    const queryClient = useQueryClient()
    const trpc = useTRPC()

    return useMutation(
        trpc.workflows.updateName.mutationOptions({
            onSuccess: (data) => {
                toast.success(`Workflow "${data.name}" updated successfully!`)
                queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({}))
                queryClient.invalidateQueries(trpc.workflows.getOne.queryOptions({ id: data.id }))
            },
            onError: (error) => {
                toast.error(`Failed to update workflow: ${error.message}`)
            },
        })
    )
}

/**
 * Custom hook to update a workflow's nodes and connections.
 * @returns A mutation object that can be used to trigger the update of a workflow's nodes and connections.
 */
export const useUpdateWorkflow = () => {
    const queryClient = useQueryClient()
    const trpc = useTRPC()

    return useMutation(
        trpc.workflows.update.mutationOptions({
            onSuccess(data) {
                toast.success(`Workflow "${data.name}" updated successfully!`)
                queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({}))
                queryClient.invalidateQueries(trpc.workflows.getOne.queryOptions({ id: data.id }))
            },
            onError(error) {
                toast.error(`Failed to update workflow: ${error.message}`)
            }
        })
    )
}