"use client"

import { NodeProps, Position, useReactFlow } from '@xyflow/react'
import { LucideIcon } from 'lucide-react'
import Image from 'next/image'
import { memo, PropsWithChildren } from 'react'
import { BaseHandle } from '../../../components/react-flow/base-handle'
import { BaseNode, BaseNodeContent } from '../../../components/react-flow/base-node'
import { WorkflowNode } from '../../../components/workflow-node'

interface BaseTriggerNodeProps extends NodeProps {
    icon: LucideIcon | string
    name: string
    description: string
    // status: "idle" | "running" | "success" | "error"
    onSettings?: () => void
    onDoubleClick?: () => void
}

export const BaseTriggerNode = memo(
    ({ id, icon: Icon, name, description, onSettings, onDoubleClick, children }: BaseTriggerNodeProps & PropsWithChildren) => {

        const { setEdges, setNodes } = useReactFlow()

        const handleDelete = () => {
            setNodes((nodes) => nodes.filter((node) => node.id !== id))
            setEdges((edges) => edges.filter((edge) => edge.source !== id && edge.target !== id))
        }

        return (
            <WorkflowNode
                name={name}
                description={description}
                onSettings={onSettings}
                onDelete={handleDelete}
            >
                <BaseNode onDoubleClick={onDoubleClick} className="rounded-l-2xl relative group">
                    <BaseNodeContent>
                        {
                            typeof Icon === "string" ? (
                                <Image src={Icon} alt={`${name} icon`} width={16} height={16} className="object-cover" />
                            ) : (
                                <Icon className="size-4 text-muted-foreground" />
                            )
                        }
                        {children}
                        <BaseHandle
                            id="source-1"
                            type="source"
                            position={Position.Right}
                        />
                    </BaseNodeContent>
                </BaseNode>
            </WorkflowNode>
        )
    }
)

BaseTriggerNode.displayName = "BaseTriggerNode"