import { useTRPC } from "@/trpc/client"
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { useCredentialsParams } from "./use-credentials-params"
import { CredentialType } from "@/generated/prisma/enums"

export const useSuspenseCredentials = () => {
    const trpc = useTRPC()
    const [params] = useCredentialsParams()
    return useSuspenseQuery(trpc.credentials.getMany.queryOptions(params))
}

/**
 * Custom hook to create a new credential.
 * @returns A mutation object that can be used to trigger the creation of a new credential.
 */
export const useCreateCredential = () => {
    const queryClient = useQueryClient()
    const trpc = useTRPC()

    return useMutation(
        trpc.credentials.create.mutationOptions({
            onSuccess: (data) => {
                toast.success(`Credential "${data.name}" created successfully!`)
                queryClient.invalidateQueries(trpc.credentials.getMany.queryOptions({}))
            },
            onError: (error) => {
                toast.error(`Failed to create credential: ${error.message}`)
            },
        })
    )
}

/**
 * Custom hook to remove a credential by its ID.
 * @returns A mutation object that can be used to trigger the removal of a credential.
 */
export const useRemoveCredential = () => {
    const trpc = useTRPC()
    const queryClient = useQueryClient()

    return useMutation(
        trpc.credentials.remove.mutationOptions({
            onSuccess: (data) => {
                toast.success("Credential removed successfully!")
                queryClient.invalidateQueries(trpc.credentials.getMany.queryOptions({}))
                queryClient.invalidateQueries(trpc.credentials.getOne.queryOptions({ id: data.id }))
            },
            onError: (error) => {
                toast.error(`Failed to remove credential: ${error.message}`)
            },
        })
    )
}

/**
 * Custom hook to fetch a single credential by its ID using React Query's suspense mode.
 * @param id The ID of the credential to fetch.
 * @returns The credential data.
 */
export const useSuspenseCredential = (id: string) => {
    const trpc = useTRPC()
    return useSuspenseQuery(trpc.credentials.getOne.queryOptions({ id }))
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

/**
 * Custom hook to fetch credentials by their type.
 * @param type The type of credentials to fetch.
 * @returns An array of credentials matching the specified type.
 */
export const useCredentialsByType = (type: CredentialType) => {
    const trpc = useTRPC()
    return useQuery(trpc.credentials.getByType.queryOptions({ type }))
}