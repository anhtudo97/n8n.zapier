"use client"

import { EntityHeader } from '@/components/entity-components'
import { useSuspenseWorkflows } from '../hooks/use-workflows'

export const WorkflowsList = () => {
    const workflows = useSuspenseWorkflows()
    return (
        <p>
            {
                JSON.stringify(workflows.data, null, 2)
            }
        </p>
    )
}

export const WorkflowsHeader = ({ disabled }: { disabled?: boolean }) => {
    return (
        <>
            <EntityHeader
                title="Workflows"
                description="Automate your processes with workflows. Create, manage, and optimize your workflows to streamline operations and boost productivity."
                newButtonLabel="New Workflow"
                onNew={() => { }}
                disabled={disabled}
                isCreating={false}
            />
        </>
    )
}
