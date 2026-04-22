"use client"

import { OPENAI_CHANNEL_NAME } from '@/inngest/channels/openai'
import { Node, NodeProps, useReactFlow } from '@xyflow/react'
import { memo, useState } from 'react'
import { useNodeStatus } from '../../hooks/use-node-status'
import { BaseExecutionNode } from '../base-execution-node'
import { fetchOpenAIRealtimeToken } from './actions'
import { OpenAiDialog, OpenAiFormValues } from './dialog'

type OpenAiNodeData = {
    model?: string
    systemPrompt?: string
    userPrompt?: string
}

type OpenAiNodeType = Node<OpenAiNodeData>

export const OpenAiNode = memo((props: NodeProps<OpenAiNodeType>) => {
    const nodeData = props.data as OpenAiNodeData
    const { setNodes } = useReactFlow()

    const description = nodeData.userPrompt ? `Model ${nodeData.model || "gpt-4o-mini"}: ${nodeData.userPrompt.slice(0, 50)}...` : "Not configured yet"
    const nodeStatus = useNodeStatus({
        nodeId: props.id,
        channel: OPENAI_CHANNEL_NAME,
        topic: "status",
        refreshToken: fetchOpenAIRealtimeToken
    })

    const [dialogOpen, setDialogOpen] = useState(false)

    const handleOpenSettings = () => {
        setDialogOpen(true)
    }

    const handleSubmit = (values: OpenAiFormValues) => {
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
            <OpenAiDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onSubmit={handleSubmit}
                defaultValues={nodeData}
            />
            <BaseExecutionNode
                {...props}
                id={props.id}
                icon="/openai.svg"
                name="OpenAI Request"
                status={nodeStatus}
                description={description}
                onSettings={handleOpenSettings}
                onDoubleClick={handleOpenSettings}
            />
        </>
    )
})

OpenAiNode.displayName = "OpenAiNode"