"use client"

import { HTTP_REQUEST_CHANNEL_NAME, httpRequestChannel } from '@/inngest/channels/http-request'
import { Node, NodeProps, useReactFlow } from '@xyflow/react'
import { GlobeIcon } from 'lucide-react'
import { memo, useState } from 'react'
import { useNodeStatus } from '../../hooks/use-node-status'
import { BaseExecutionNode } from '../base-execution-node'
import { fetchHttRequestRealtimeToken } from './actions'
import { HttpRequestDialog, HttpRequestFormValues } from './dialog'

type HttpRequestNodeData = {
    variablesName?: string
    endpoint?: string
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
    body?: string
}

type HttpRequestNodeType = Node<HttpRequestNodeData>

export const HttpRequestNode = memo((props: NodeProps<HttpRequestNodeType>) => {
    const nodeData = props.data as HttpRequestNodeData
    const { setNodes } = useReactFlow()

    const description = nodeData.endpoint ? `${nodeData.method || "GET"} ${nodeData.endpoint}` : "Not configured yet"
    const nodeStatus = useNodeStatus({
        nodeId: props.id,
        channel: HTTP_REQUEST_CHANNEL_NAME,
        topic: "status",
        refreshToken: fetchHttRequestRealtimeToken
    })

    const [dialogOpen, setDialogOpen] = useState(false)

    const handleOpenSettings = () => {
        setDialogOpen(true)
    }

    const handleSubmit = (values: HttpRequestFormValues) => {
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
            <HttpRequestDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onSubmit={handleSubmit}
                defaultValues={nodeData}
            />
            <BaseExecutionNode
                {...props}
                id={props.id}
                icon={GlobeIcon}
                name="HTTP Request"
                status={nodeStatus}
                description={description}
                onSettings={handleOpenSettings}
                onDoubleClick={handleOpenSettings}
            />
        </>
    )
})

HttpRequestNode.displayName = "HttpRequestNode"