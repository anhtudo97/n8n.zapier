"use client"

import { ErrorView, LoadingView } from '@/components/entity-components'
import { useSuspenseWorkflow } from '@/features/workflows/hooks/use-workflows'
import { useCallback, useState } from 'react'
import { addEdge, applyEdgeChanges, applyNodeChanges, type Edge, type Node, type EdgeChange, type NodeChange, type Connection, ReactFlow, Background, Controls, MiniMap } from '@xyflow/react'
interface EditorProps {
    workflowId: string
}

export const EditorLoading = () => {
    return <LoadingView message="Loading editor..." />
}

export const EditorError = () => {
    return <ErrorView message="Failed to load editor." />
}

const initalNodes = [
    {
        id: 'n1',
        type: 'input',
        data: { label: 'Start' },
        position: { x: 250, y: 0 },
    },
    {
        id: 'n2',
        data: { label: 'Task 1' },
        position: { x: 250, y: 100 },
    }
]

const initalEdges = [
    { id: 'n1-n2', source: 'n1', target: 'n2', animated: true },
]

export const Editor = ({ workflowId }: EditorProps) => {
    const { data: workflow } = useSuspenseWorkflow(workflowId)

    const [nodes, setNodes] = useState<Node[]>(initalNodes)
    const [edges, setEdges] = useState<Edge[]>(initalEdges)

    const onNodesChange = useCallback(
        (changes: NodeChange[]) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
        [],
    )
    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
        [],
    )
    const onConnect = useCallback(
        (params: Connection) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
        [],
    )

    return (
        <div className="size-full">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
            >
                <Background />
                <Controls />
                <MiniMap />
            </ReactFlow>
        </div>
    )
}
