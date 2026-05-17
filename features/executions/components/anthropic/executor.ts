import { NodeExecutor } from "@/features/executions/types"
import { anthropicChannel } from "@/inngest/channels/anthropic"
import prisma from "@/lib/db"
import { decrypt } from "@/lib/encryption"
import { createAnthropic } from "@ai-sdk/anthropic"
import { generateText } from "ai"
import Handlebars from "handlebars"
import { NonRetriableError } from "inngest"

Handlebars.registerHelper("json", (context) => {
    const result = JSON.stringify(context, null, 2)
    const safeString = new Handlebars.SafeString(result)
    return safeString
})

type AnthropicData = {
    variablesName?: string
    model?: string
    systemPrompt?: string
    userPrompt?: string
    credentialId?: string
}

export const AnthropicExecutor: NodeExecutor<AnthropicData> = async ({ data, nodeId, context, step, publish, userId }) => {

    await publish(
        anthropicChannel().status({
            nodeId,
            status: "loading"
        })
    )

    if (!data.credentialId || typeof data.credentialId !== "string") {
        await publish(
            anthropicChannel().status({
                nodeId,
                status: "error",
            })
        )
        throw new NonRetriableError(`Credential ID is required for gemini node with id ${nodeId}`)
    }

    if (!data.variablesName || typeof data.variablesName !== "string") {
        await publish(
            anthropicChannel().status({
                nodeId,
                status: "error",
            })
        )
        throw new NonRetriableError(`Variables name is required for anthropic node with id ${nodeId}`)
    }

    if (!data.userPrompt || typeof data.userPrompt !== "string") {
        await publish(
            anthropicChannel().status({
                nodeId,
                status: "error",
            })
        )
        throw new NonRetriableError(`User prompt is required for anthropic node with id ${nodeId}`)
    }

    const systemPrompt = data.systemPrompt
        ? Handlebars.compile(data.systemPrompt)(context)
        : "You are a helpful assistant that tries to answer the user's question as best as you can."

    const userPrompt = Handlebars.compile(data.userPrompt)(context)

    const credential = await step.run("get-credential", () => {
        return prisma.credential.findUnique({
            where: {
                id: data.credentialId!,
                userId,
            }
        })
    })

    if (!credential) {
        throw new NonRetriableError(`Credential with ID ${data.credentialId} not found for gemini node with id ${nodeId}`)
    }
    // const credentialValue = process.env.ANTHROPIC_API_KEY

    const anthropic = createAnthropic({
        apiKey: decrypt(credential.value),
    })

    try {
        const { steps } = await step.ai.wrap(
            "anthropic-generate-text",
            generateText,
            {
                model: anthropic("anthropic-2.5-flash"),
                system: systemPrompt,
                prompt: userPrompt,
                experimental_telemetry: {
                    isEnabled: true,
                    recordInputs: true,
                    recordOutputs: true,
                }
            }
        )

        const text = steps[0].content[0].type === "text"
            ? steps[0].content[0].text
            : ""

        await publish(
            anthropicChannel().status({
                nodeId,
                status: "success"
            })
        )

        return {
            ...context,
            [data.variablesName || "anthropicResponse"]: {
                aiResponse: text
            }
        }

    } catch (error) {
        await publish(
            anthropicChannel().status({
                nodeId,
                status: "error",
            })
        )
        throw error
    }

}