"use client"

import { GEMINI_CHANNEL_NAME } from '@/inngest/channels/gemini'
import { Node, NodeProps, useReactFlow } from '@xyflow/react'
import { memo, useState } from 'react'
import { useNodeStatus } from '../../hooks/use-node-status'
import { BaseExecutionNode } from '../base-execution-node'
import { fetchGeminiRealtimeToken } from './actions'
import { GeminiDialog, GeminiFormValues } from './dialog'

type GeminiNodeData = {
    model?: string
    systemPrompt?: string
    userPrompt?: string
    credentialId?: string
    variablesName?: string
}

type GeminiNodeType = Node<GeminiNodeData>

export const GeminiNode = memo((props: NodeProps<GeminiNodeType>) => {
    const nodeData = props.data as GeminiNodeData
    const { setNodes } = useReactFlow()

    const description = nodeData.userPrompt ? `Model ${nodeData.model || "gemini-2.5-flash"}: ${nodeData.userPrompt.slice(0, 50)}...` : "Not configured yet"
    const nodeStatus = useNodeStatus({
        nodeId: props.id,
        channel: GEMINI_CHANNEL_NAME,
        topic: "status",
        refreshToken: fetchGeminiRealtimeToken
    })

    const [dialogOpen, setDialogOpen] = useState(false)

    const handleOpenSettings = () => {
        setDialogOpen(true)
    }

    const handleSubmit = (values: GeminiFormValues) => {
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
            <GeminiDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onSubmit={handleSubmit}
                defaultValues={nodeData}
            />
            <BaseExecutionNode
                {...props}
                id={props.id}
                icon="/gemini.svg"
                name="Gemini Request"
                status={nodeStatus}
                description={description}
                onSettings={handleOpenSettings}
                onDoubleClick={handleOpenSettings}
            />
        </>
    )
})

GeminiNode.displayName = "GeminiNode"