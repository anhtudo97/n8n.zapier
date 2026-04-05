import { Connection, Node } from "@/generated/prisma/client"
import toposort from 'toposort'

export const topologicalSort = (
    nodes: Node[],
    connections: Connection[]
): Node[] => {
    if (connections.length === 0) return nodes

    // Build edge list for toposort: [from, to]
    const edges: [string, string][] = connections.map((conn) => [conn.fromNodeId, conn.toNodeId] as [string, string])

    const connectedNodeIds = new Set<string>()
    for (const conn of connections) {
        connectedNodeIds.add(conn.fromNodeId)
        connectedNodeIds.add(conn.toNodeId)
    }

    // Add isolated nodes (not in connections) as edges to themselves
    for (const node of nodes) {
        if (!connectedNodeIds.has(node.id)) {
            edges.push([node.id, node.id])
        }
    }

    let sortedNodeIds: string[]
    try {
        sortedNodeIds = toposort(edges)
        sortedNodeIds = [...new Set(sortedNodeIds)] // Remove duplicates while preserving order
    } catch (err) {
        if (err instanceof Error && err.message.includes('Cyclic')) {
            throw new Error(`Cycle detected in workflow: ${err.message}`)
        }

        throw err
    }

    const nodeMap = new Map(nodes.map(node => [node.id, node]))
    return sortedNodeIds.map(id => nodeMap.get(id)!).filter(Boolean)
}