import { Workflow } from '@/generated/prisma/client'
import { useSuspenseWorkflows } from '../hooks/use-workflows'

export const WorkflowsList = () => {
    const workflows = useSuspenseWorkflows()
    return (
        <div>
            {
                structuredClone(workflows).data.map((workflow: Workflow) => (
                    <div key={workflow.id}>
                        {workflow.name}
                    </div>
                ))
            }
        </div>
    )
}
