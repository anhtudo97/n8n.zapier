import { useNodeStatus } from '@/features/executions/hooks/use-node-status'
import { STRIPE_TRIGGER_CHANNEL_NAME } from '@/inngest/channels/stripe-trigger'
import { NodeProps } from '@xyflow/react'
import { memo, useState } from 'react'
import { BaseTriggerNode } from '../base-trigger-node'
import { fetchStripeTriggerRealtimeToken } from './actions'
import { StripeTriggerDialog } from './dialog'

export const StripeTriggerNode = memo(
    (props: NodeProps) => {

        const [dialogOpen, setDialogOpen] = useState(false)

        const handleOpenSettings = () => {
            setDialogOpen(true)
        }
        const nodeStatus = useNodeStatus({
            nodeId: props.id,
            channel: STRIPE_TRIGGER_CHANNEL_NAME,
            topic: "status",
            refreshToken: fetchStripeTriggerRealtimeToken
        })


        return (
            <>
                <StripeTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen} />
                <BaseTriggerNode
                    {...props}
                    icon="/stripe.svg"
                    name="Stripe Trigger"
                    description="When a Stripe event occurs"
                    status={nodeStatus}
                    onSettings={handleOpenSettings}
                    onDoubleClick={handleOpenSettings}
                />
            </>
        )
    }
)

StripeTriggerNode.displayName = "StripeTriggerNode"
