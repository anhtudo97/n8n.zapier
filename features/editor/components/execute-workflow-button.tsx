import { Button } from '@/components/ui/button'
import { useExecuteWorkflow } from '@/features/workflows/hooks/use-workflows'
import { FlaskConicalIcon } from 'lucide-react'

interface ExecuteWorkflowButtonProps {
    workflowId: string
}

export const ExecuteWorkflowButton = ({ workflowId }: ExecuteWorkflowButtonProps) => {
    const excuteWorkflow = useExecuteWorkflow()

    const handleExecute = () => {
        excuteWorkflow.mutate({ id: workflowId })
    }

    return (
        <Button size={"lg"} onClick={handleExecute} disabled={excuteWorkflow.isPending}>
            <FlaskConicalIcon className="size-4" />
            Execute Workflow
        </Button>

    )
}
