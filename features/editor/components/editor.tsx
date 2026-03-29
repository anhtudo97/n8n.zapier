"use client"

import { ErrorView, LoadingView } from '@/components/entity-components'
import { useSuspenseWorkflow } from '@/features/workflows/hooks/use-workflows'
import { useCallback, useState } from 'react'
import { addEdge, applyEdgeChanges, applyNodeChanges, type Edge, type Node, type EdgeChange, type NodeChange, type Connection, ReactFlow, Background, Controls, MiniMap, Panel } from '@xyflow/react'

import '@xyflow/react/dist/style.css'
import { nodeComponents } from '@/config/node-components'
import { AddNodeButton } from './add-node-button'
import { useSetAtom } from 'jotai'
import { editorAtom } from '../store/atoms'
interface EditorProps {
    workflowId: string
}

export const EditorLoading = () => {
    return <LoadingView message="Loading editor..." />
}

export const EditorError = () => {
    return <ErrorView message="Failed to load editor." />
}

export const Editor = ({ workflowId }: EditorProps) => {
    const { data: workflow } = useSuspenseWorkflow(workflowId)

    const [nodes, setNodes] = useState<Node[]>(workflow.nodes)
    const [edges, setEdges] = useState<Edge[]>(workflow.edges)
    
    const setEditor = useSetAtom(editorAtom)

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
                nodeTypes={nodeComponents}
                onInit={setEditor}
                fitView
            >
                <Background />
                <Controls />
                <MiniMap />
                <Panel position="top-right">
                    <AddNodeButton />
                </Panel>
            </ReactFlow>
        </div>
    )
}
