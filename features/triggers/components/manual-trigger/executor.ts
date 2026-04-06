import { NodeExecutor } from "@/features/executions/types"

export const manualTriggerExecutor: NodeExecutor = async ({ nodeId, context, step }) => {
    const result = await step.run(`manual-trigger`, async () => context)

    return result
}