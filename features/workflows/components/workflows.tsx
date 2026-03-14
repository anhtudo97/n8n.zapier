"use client"

import { EntityContainer, EntityHeader, EntityPagination, EntitySearch, ErrorView, LoadingView } from '@/components/entity-components'
import { useEntitySearch } from '@/hooks/use-entity-search'
import { useUpgradeModal } from '@/hooks/use-upgrade-modal'
import { useRouter } from 'next/navigation'
import { PropsWithChildren } from 'react'
import { useCreateWorkflow, useSuspenseWorkflows } from '../hooks/use-workflows'
import { useWorkflowsParams } from '../hooks/use-workflows-params'

export const WorkflosSearch = () => {
    const [params, setParams] = useWorkflowsParams()
    const { searchValue, onSearchChange } = useEntitySearch({
        params,
        setParams,
    })
    return (
        <EntitySearch
            value={searchValue}
            onChange={onSearchChange}
            placeholder="Search workflows..."

        />
    )
}

export const WorkflowsPagination = () => {
    const [params, setParams] = useWorkflowsParams()
    const workflows = useSuspenseWorkflows()
    return (
        <EntityPagination
            disabled={workflows.isFetching}
            totalPages={workflows.data.totalPages}
            page={workflows.data.page}
            onPageChange={(page) => setParams({ ...params, page })}
        />
    )
}

export const WorkflowsList = () => {
    const workflows = useSuspenseWorkflows()
    return (
        <div className="flex-1 justify-center items-center">
            <p>
                {
                    JSON.stringify(workflows.data, null, 2)
                }
            </p>
        </div>
    )
}

export const WorkflowsHeader = ({ disabled }: { disabled?: boolean }) => {
    const createWorkflow = useCreateWorkflow()
    const { handleError, modal } = useUpgradeModal()
    const router = useRouter()

    const handleCreateWorkflow = () => {
        createWorkflow.mutate(undefined, {
            onSuccess: (data) => {
                router.push(`/workflows/${data.id}`)
            },
            onError: (error) => {
                handleError(error)
            }
        })
    }
    return (
        <>
            {modal}
            <EntityHeader
                title="Workflows"
                description="Automate your processes with workflows. Create, manage, and optimize your workflows to streamline operations and boost productivity."
                newButtonLabel="New Workflow"
                onNew={handleCreateWorkflow}
                disabled={disabled}
                isCreating={createWorkflow.isPending}
            />
        </>
    )
}

export const WorkflowsContainer = ({ children }: PropsWithChildren) => {
    return (
        <EntityContainer
            header={<WorkflowsHeader />}
            search={<WorkflosSearch />}
            pagination={<WorkflowsPagination />}
        >
            {children}
        </EntityContainer>
    )
}

export const WorkflowsLoading = () => {
    return <LoadingView message="Loading workflows..." />
}

export const WorkflowsError = () => {
    return <ErrorView message="Failed to load workflows." />
}