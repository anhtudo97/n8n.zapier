import { NodeType } from "@/generated/prisma/enums"
import { NodeExecutor } from "../types"
import { manualTriggerExecutor } from "@/features/triggers/components/manual-trigger/executor"

export const executorRegistry: Record<NodeType, NodeExecutor> = {
    [NodeType.HTTP_REQUEST]: manualTriggerExecutor,
    [NodeType.INITIAL]: manualTriggerExecutor,
    [NodeType.MANUAL_TRIGGER]: manualTriggerExecutor,
}

export const getExecutor = (type: NodeType): NodeExecutor => {
    const executor = executorRegistry[type]

    if (!executor) {
        throw new Error(`No executor found for node type: ${type}`)
    }

    return executor
}