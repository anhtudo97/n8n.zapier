"use client"

import { DISCORD_CHANNEL_NAME } from '@/inngest/channels/discord'
import { Node, NodeProps, useReactFlow } from '@xyflow/react'
import { memo, useState } from 'react'
import { useNodeStatus } from '../../hooks/use-node-status'
import { BaseExecutionNode } from '../base-execution-node'
import { fetchDiscordRealtimeToken } from './actions'
import { DiscordDialog, DiscordFormValues } from './dialog'

type DiscordNodeData = {
    webhookUrl?: string
    content?: string
    username?: string
}

type DiscordNodeType = Node<DiscordNodeData>

export const DiscordNode = memo((props: NodeProps<DiscordNodeType>) => {
    const nodeData = props.data as DiscordNodeData
    const { setNodes } = useReactFlow()

    const description = nodeData.content ? `Send ${nodeData.content.slice(0, 50)}...` : "Not configured yet"
    const nodeStatus = useNodeStatus({
        nodeId: props.id,
        channel: DISCORD_CHANNEL_NAME,
        topic: "status",
        refreshToken: fetchDiscordRealtimeToken
    })

    const [dialogOpen, setDialogOpen] = useState(false)

    const handleOpenSettings = () => {
        setDialogOpen(true)
    }

    const handleSubmit = (values: DiscordFormValues) => {
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
            <DiscordDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onSubmit={handleSubmit}
                defaultValues={nodeData}
            />
            <BaseExecutionNode
                {...props}
                id={props.id}
                icon="/discord.svg"
                name="Discord Request"
                status={nodeStatus}
                description={description}
                onSettings={handleOpenSettings}
                onDoubleClick={handleOpenSettings}
            />
        </>
    )
})

DiscordNode.displayName = "DiscordNode"