"use client"

import { NodeType } from "@/generated/prisma/enums"
import { GlobeIcon, MousePointerIcon } from "lucide-react"
import { ComponentType, PropsWithChildren, useCallback } from "react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet"
import Image from "next/image"
import { Separator } from "./ui/separator"
import { useReactFlow } from "@xyflow/react"
import { toast } from "sonner"
import { createId } from "@paralleldrive/cuid2"

export type NodeTypeOption = {
    type: NodeType
    label: string
    description: string
    icon: ComponentType<{ className?: string }> | string
}

const triggerNodes: NodeTypeOption[] = [
    {
        type: NodeType.MANUAL_TRIGGER,
        label: "Manual Trigger",
        description: "Trigger the workflow manually.",
        icon: MousePointerIcon
    }
]

const executionNodes: NodeTypeOption[] = [
    {
        type: NodeType.HTTP_REQUEST,
        label: "HTTP Request",
        description: "Make an HTTP request to an API endpoint.",
        icon: GlobeIcon
    }
]

interface NodeSelectorProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export const NodeSelector = ({ open, onOpenChange, children }: NodeSelectorProps & PropsWithChildren) => {

    const { setNodes, getNodes, screenToFlowPosition } = useReactFlow()

    const handleNodeSelect = useCallback((selection: NodeTypeOption) => {
        if (selection.type === NodeType.MANUAL_TRIGGER) {
            const nodes = getNodes()
            const hasManualTrigger = nodes.some(node => node.type === NodeType.MANUAL_TRIGGER)

            if (hasManualTrigger) {
                toast.error("You can only have one manual trigger node in your workflow.")
                return
            }
        }

        setNodes((nodes) => {
            const hasInitalNode = nodes.some(node => node.type === NodeType.INITIAL)

            const centerX = window.innerWidth / 2
            const centerY = window.innerHeight / 2

            const flowPosition = screenToFlowPosition({
                x: centerX + (Math.random() - 0.5) * 200, // Add some random offset to avoid overlap
                y: centerY + (Math.random() - 0.5) * 200 // Add some random offset to avoid overlap
            })

            const newNode = {
                id: createId(),
                data: {},
                position: flowPosition,
                type: selection.type
            }

            if (hasInitalNode) {
                return [newNode]
            }

            return [...nodes, newNode]
        })

        onOpenChange(false)
    }, [
        setNodes,
        getNodes,
        screenToFlowPosition,
        onOpenChange
    ])

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetTrigger asChild>
                {children}
            </SheetTrigger>

            <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>
                        What triggers this workflow?
                    </SheetTitle>
                    <SheetDescription>
                        Select a trigger to start building your workflow. You can always change this later.
                    </SheetDescription>
                </SheetHeader>
                <div>
                    {
                        triggerNodes.map((node) => {
                            const Icon = node.icon

                            return (
                                <div
                                    key={node.type}
                                    className="w-full justify-start h-auto py-5 px-4 rounded-none cursor-pointer border-l-2 border-transparent hover:border-l-primary"
                                    onClick={() => handleNodeSelect(node)}
                                >
                                    <div className="flex items-center gap-6 w-full overflow-hidden">
                                        {
                                            typeof node.icon === "string" ? (
                                                <Image src={node.icon} alt={node.label} className="size-5 object-cover rounded-sm" sizes="50vw" />
                                            ) : (
                                                <Icon className="size-5" />
                                            )
                                        }
                                        <div className="flex flex-col items-start text-left">
                                            <span className="font-medium text-sm">
                                                {node.label}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {node.description}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                <Separator />
                <div>
                    {
                        executionNodes.map((node) => {
                            const Icon = node.icon

                            return (
                                <div
                                    key={node.type}
                                    className="w-full justify-start h-auto py-5 px-4 rounded-none cursor-pointer border-l-2 border-transparent hover:border-l-primary"
                                    onClick={() => handleNodeSelect(node)}
                                >
                                    <div className="flex items-center gap-6 w-full overflow-hidden">
                                        {
                                            typeof node.icon === "string" ? (
                                                <Image src={node.icon} alt={node.label} className="size-5 object-cover rounded-sm" sizes="50vw" />
                                            ) : (
                                                <Icon className="size-5" />
                                            )
                                        }
                                        <div className="flex flex-col items-start text-left">
                                            <span className="font-medium text-sm">
                                                {node.label}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {node.description}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </SheetContent>
        </Sheet>
    )
}
