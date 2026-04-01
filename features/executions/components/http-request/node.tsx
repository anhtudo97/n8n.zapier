"use client"

import { Node, NodeProps, useReactFlow } from '@xyflow/react'
import { memo, useState } from 'react'
import { BaseExecutionNode } from '../base-execution-node'
import { GlobeIcon } from 'lucide-react'
import { NodeStatus } from '@/components/react-flow/node-status-indicator'
import { HttpRequestFormValues, HttpRequestDialog } from './dialog'

type HttpRequestNodeData = {
    endpoint?: string
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
    body?: string
}

type HttpRequestNodeType = Node<HttpRequestNodeData>

export const HttpRequestNode = memo((props: NodeProps<HttpRequestNodeType>) => {
    const nodeData = props.data as HttpRequestNodeData
    const { setNodes } = useReactFlow()

    const description = nodeData.endpoint ? `${nodeData.method || "GET"} ${nodeData.endpoint}` : "Not configured yet"
    const nodeStatus = "loading" as NodeStatus

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