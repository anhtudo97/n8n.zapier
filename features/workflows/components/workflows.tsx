"use client"

import { EntityContainer, EntityHeader } from '@/components/entity-components'
import { useCreateWorkflow, useSuspenseWorkflows } from '../hooks/use-workflows'
import { PropsWithChildren } from 'react'
import { useUpgradeModal } from '@/hooks/use-upgrade-modal'
import { useRouter } from 'next/navigation'

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
            search={<></>}
            pagination={<></>}
        >
            {children}
        </EntityContainer>
    )
}
