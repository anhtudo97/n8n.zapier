import { GeminiExecutor } from "@/features/executions/components/gemini/executor"
import { httpRequestExecutor } from "@/features/executions/components/http-request/executor"
import { googleFormTriggerExecutor } from "@/features/triggers/components/google-form-trigger/executor"
import { manualTriggerExecutor } from "@/features/triggers/components/manual-trigger/executor"
import { stripeTriggerExecutor } from "@/features/triggers/components/stripe-trigger/executor"
import { NodeType } from "@/generated/prisma/enums"
import { NodeExecutor } from "../types"

export const executorRegistry: Record<NodeType, NodeExecutor> = {
    [NodeType.HTTP_REQUEST]: httpRequestExecutor,
    [NodeType.INITIAL]: manualTriggerExecutor,
    [NodeType.MANUAL_TRIGGER]: manualTriggerExecutor,
    [NodeType.GOOGLE_FORM_TRIGGER]: googleFormTriggerExecutor,
    [NodeType.STRIPE_TRIGGER]: stripeTriggerExecutor,
    [NodeType.GEMINI]: GeminiExecutor,
    [NodeType.ANTHROPIC]: GeminiExecutor, // TODO: replace with AnthropicExecutor when it's ready
    [NodeType.OPENAI]: GeminiExecutor // TODO: replace with OpenAIExecutor when it's ready
}

export const getExecutor = (type: NodeType): NodeExecutor => {
    const executor = executorRegistry[type]

    if (!executor) {
        throw new Error(`No executor found for node type: ${type}`)
    }

    return executor
}