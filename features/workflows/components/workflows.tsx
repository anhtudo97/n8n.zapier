"use client"

import { EmptyView, EntityContainer, EntityHeader, EntityItem, EntityList, EntityPagination, EntitySearch, ErrorView, LoadingView } from '@/components/entity-components'
import { useEntitySearch } from '@/hooks/use-entity-search'
import { useUpgradeModal } from '@/hooks/use-upgrade-modal'
import { useRouter } from 'next/navigation'
import { PropsWithChildren } from 'react'
import { useCreateWorkflow, useRemoveWorkflow, useSuspenseWorkflows } from '../hooks/use-workflows'
import { useWorkflowsParams } from '../hooks/use-workflows-params'
import { Workflow } from '@/generated/prisma/client'
import { WorkflowIcon } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export const WorkflowsSearch = () => {
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

    if (workflows.data.items.length === 0) {
        return <WorkflowsEmpty />
    }

    return (
        <EntityList
            items={workflows.data.items}
            getKey={workflow => workflow.id}
            renderItem={(workflow) => (
                <WorkflowItem
                    workflow={workflow}
                />
            )}
            emptyView={<WorkflowsEmpty />}
        />
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
            search={<WorkflowsSearch />}
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

export const WorkflowsEmpty = () => {
    const router = useRouter()
    const createWorkflow = useCreateWorkflow()
    const { handleError, modal } = useUpgradeModal()

    const handleCreateWorkflow = () => {
        createWorkflow.mutate(undefined, {
            onError: (error) => {
                handleError(error)
            },
            onSuccess: (data) => {
                router.push(`/workflows/${data.id}`)
            }
        })
    }

    return (
        <>
            {modal}
            <EmptyView
                message="No workflows found. Create your first workflow to get started."
                onNew={handleCreateWorkflow}
            />
        </>
    )
}

export const WorkflowItem = ({ workflow }: { workflow: Workflow }) => {
    const removeWorkflow = useRemoveWorkflow()

    const handleRemoveWorkflow = () => {
        removeWorkflow.mutate({ id: workflow.id })
    }

    return (
        <EntityItem
            href={`/workflows/${workflow.id}`}
            title={workflow.name}
            subtitle={
                <>
                    Updated {formatDistanceToNow(new Date(workflow.updatedAt), { addSuffix: true })}{" "}
                    &bull; Created{" "}
                    {formatDistanceToNow(new Date(workflow.createdAt), { addSuffix: true })}
                </>
            }
            image={
                <div className="size-8 flex items-center justify-center">
                    <WorkflowIcon className="size-5 text-muted-foreground" />
                </div>
            }
            onRemove={handleRemoveWorkflow}
            isRemoving={removeWorkflow.isPending}
        />
    )
}