import { NodeProps } from '@xyflow/react'
import { memo, useState } from 'react'
import { BaseTriggerNode } from '../base-trigger-node'
import { GoogleFormTriggerDialog } from './dialog'

export const GoogleFormTrigger = memo(
    (props: NodeProps) => {

        const [dialogOpen, setDialogOpen] = useState(false)

        const handleOpenSettings = () => {
            setDialogOpen(true)
        }

        const nodeStatus = "initial"

        return (
            <>
                <GoogleFormTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen} />
                <BaseTriggerNode
                    {...props}
                    icon="/googleform.svg"
                    name="Google Form Trigger"
                    description="When form is submitted"
                    status={nodeStatus}
                    onSettings={handleOpenSettings}
                    onDoubleClick={handleOpenSettings}
                />
            </>
        )
    }
)

GoogleFormTrigger.displayName = "GoogleFormTrigger"
