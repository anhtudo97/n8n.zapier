"use client"

import { Node, NodeProps } from '@xyflow/react'
import { memo } from 'react'
import { BaseExecutionNode } from '../base-execution-node'
import { GlobeIcon } from 'lucide-react'
import { NodeStatus } from '@/components/react-flow/node-status-indicator'

type HttpRequestNodeData = {
    endpoint?: string
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
    body?: string
    [key: string]: unknown
}

type HttpRequestNodeType = Node<HttpRequestNodeData>

export const HttpRequestNode = memo((props: NodeProps<HttpRequestNodeType>) => {
    const nodeData = props.data as HttpRequestNodeData
    const description = nodeData.endpoint ? `${nodeData.method || "GET"} ${nodeData.endpoint}` : "Not configured yet"
    const nodeStatus = "loading" as NodeStatus

    return (
        <>
            <BaseExecutionNode
                {...props}
                id={props.id}
                icon={GlobeIcon}
                name="HTTP Request"
                status={nodeStatus}
                description={description}
                onSettings={() => { }}
                onDoubleClick={() => { }}
            />
        </>
    )
})

HttpRequestNode.displayName = "HttpRequestNode"