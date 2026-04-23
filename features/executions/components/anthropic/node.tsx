"use client"

import { ANTHROPIC_CHANNEL_NAME } from '@/inngest/channels/anthropic'
import { Node, NodeProps, useReactFlow } from '@xyflow/react'
import { memo, useState } from 'react'
import { useNodeStatus } from '../../hooks/use-node-status'
import { BaseExecutionNode } from '../base-execution-node'
import { fetchAnthropicRealtimeToken } from './actions'
import { AnthropicDialog, AnthropicFormValues } from './dialog'

type AnthropicNodeData = {
    model?: string
    systemPrompt?: string
    userPrompt?: string
}

type AnthropicNodeType = Node<AnthropicNodeData>

export const AnthropicNode = memo((props: NodeProps<AnthropicNodeType>) => {
    const nodeData = props.data as AnthropicNodeData
    const { setNodes } = useReactFlow()

    const description = nodeData.userPrompt ? `Model ${nodeData.model || "anthropic-2.5-flash"}: ${nodeData.userPrompt.slice(0, 50)}...` : "Not configured yet"
    const nodeStatus = useNodeStatus({
        nodeId: props.id,
        channel: ANTHROPIC_CHANNEL_NAME,
        topic: "status",
        refreshToken: fetchAnthropicRealtimeToken
    })

    const [dialogOpen, setDialogOpen] = useState(false)

    const handleOpenSettings = () => {
        setDialogOpen(true)
    }

    const handleSubmit = (values: AnthropicFormValues) => {
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
            <AnthropicDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onSubmit={handleSubmit}
                defaultValues={nodeData}
            />
            <BaseExecutionNode
                {...props}
                id={props.id}
                icon="/anthropic.svg"
                name="Anthropic Request"
                status={nodeStatus}
                description={description}
                onSettings={handleOpenSettings}
                onDoubleClick={handleOpenSettings}
            />
        </>
    )
})

AnthropicNode.displayName = "AnthropicNode"