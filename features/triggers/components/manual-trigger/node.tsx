import { NodeProps } from '@xyflow/react'
import { MousePointerIcon } from 'lucide-react'
import { memo, useState } from 'react'
import { BaseTriggerNode } from '../base-trigger-node'
import { ManualTriggerDialog } from './dialog'
import { NodeStatus } from '@/components/react-flow/node-status-indicator'

export const ManualTriggerNode = memo(
    (props: NodeProps) => {

        const [dialogOpen, setDialogOpen] = useState(false)

        const handleOpenSettings = () => {
            setDialogOpen(true)
        }

        const nodeStatus = "loading" as NodeStatus

        return (
            <>
                <ManualTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen} />
                <BaseTriggerNode
                    {...props}
                    icon={MousePointerIcon}
                    name="Manual Trigger"
                    description="Trigger the workflow manually"
                    status={nodeStatus}
                    onSettings={handleOpenSettings}
                    onDoubleClick={handleOpenSettings}
                />
            </>
        )
    }
)

ManualTriggerNode.displayName = "ManualTriggerNode"
