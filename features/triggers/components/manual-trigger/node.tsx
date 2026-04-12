import { useNodeStatus } from '@/features/executions/hooks/use-node-status'
import { MANUAL_TRIGGER_CHANNEL_NAME } from '@/inngest/channels/manual-trigger'
import { NodeProps } from '@xyflow/react'
import { MousePointerIcon } from 'lucide-react'
import { memo, useState } from 'react'
import { BaseTriggerNode } from '../base-trigger-node'
import { fetchManualTriggerRealtimeToken } from './actions'
import { ManualTriggerDialog } from './dialog'

export const ManualTriggerNode = memo(
    (props: NodeProps) => {

        const [dialogOpen, setDialogOpen] = useState(false)

        const handleOpenSettings = () => {
            setDialogOpen(true)
        }

        const nodeStatus = useNodeStatus({
            nodeId: props.id,
            channel: MANUAL_TRIGGER_CHANNEL_NAME,
            topic: "status",
            refreshToken: fetchManualTriggerRealtimeToken
        })

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
