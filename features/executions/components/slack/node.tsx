"use client"

import { SLACK_CHANNEL_NAME } from '@/inngest/channels/slack'
import { Node, NodeProps, useReactFlow } from '@xyflow/react'
import { memo, useState } from 'react'
import { useNodeStatus } from '../../hooks/use-node-status'
import { BaseExecutionNode } from '../base-execution-node'
import { fetchSlackRealtimeToken } from './actions'
import { SlackDialog, SlackFormValues } from './dialog'

type SlackNodeData = {
    webhookUrl?: string
    content?: string
    username?: string
}

type SlackNodeType = Node<SlackNodeData>

export const SlackNode = memo((props: NodeProps<SlackNodeType>) => {
    const nodeData = props.data as SlackNodeData
    const { setNodes } = useReactFlow()

    const description = nodeData.content ? `Send ${nodeData.content.slice(0, 50)}...` : "Not configured yet"
    const nodeStatus = useNodeStatus({
        nodeId: props.id,
        channel: SLACK_CHANNEL_NAME,
        topic: "status",
        refreshToken: fetchSlackRealtimeToken
    })

    const [dialogOpen, setDialogOpen] = useState(false)

    const handleOpenSettings = () => {
        setDialogOpen(true)
    }

    const handleSubmit = (values: SlackFormValues) => {
        setNodes((nodes) =>
            nodes.map((node) => {
                if (node.id === props.id) {
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            ...values
                        }
                    }
                }
                return node
            })
        )
    }

    return (
        <>
            <SlackDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onSubmit={handleSubmit}
                defaultValues={nodeData}
            />
            <BaseExecutionNode
                {...props}
                id={props.id}
                icon="/slack.svg"
                name="Slack Request"
                status={nodeStatus}
                description={description}
                onSettings={handleOpenSettings}
                onDoubleClick={handleOpenSettings}
            />
        </>
    )
})

SlackNode.displayName = "SlackNode"