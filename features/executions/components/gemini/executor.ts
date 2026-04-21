import { NodeExecutor } from "@/features/executions/types"
import { geminiChannel } from '@/inngest/channels/gemini'
import Handlebars from "handlebars"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { generateText } from "ai"
import { NonRetriableError } from "inngest"

Handlebars.registerHelper("json", (context) => {
    const result = JSON.stringify(context, null, 2)
    const safeString = new Handlebars.SafeString(result)
    return safeString
})

type GeminiData = {
    variablesName?: string
    model?: string
    systemPrompt?: string
    userPrompt?: string
}

export const GeminiExecutor: NodeExecutor<GeminiData> = async ({ data, nodeId, context, step, publish }) => {

    await publish(
        geminiChannel().status({
            nodeId,
            status: "loading"
        })
    )

    if (!data.variablesName || typeof data.variablesName !== "string") {
        await publish(
            geminiChannel().status({
                nodeId,
                status: "error",
            })
        )
        throw new NonRetriableError(`Variables name is required for gemini node with id ${nodeId}`)
    }

    if (!data.userPrompt || typeof data.userPrompt !== "string") {
        await publish(
            geminiChannel().status({
                nodeId,
                status: "error",
            })
        )
        throw new NonRetriableError(`User prompt is required for gemini node with id ${nodeId}`)
    }

    const systemPrompt = data.systemPrompt
        ? Handlebars.compile(data.systemPrompt)(context)
        : "You are a helpful assistant that tries to answer the user's question as best as you can."

    const userPrompt = Handlebars.compile(data.userPrompt)(context)

    const credentialValue = process.env.GOOGLE_GENERATIVE_AI_API_KEY

    const google = createGoogleGenerativeAI({
        apiKey: credentialValue
    })

    try {
        const { steps } = await step.ai.wrap(
            "gemini-generate-text",
            generateText,
            {
                model: google("gemini-2.5-flash"),
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
            geminiChannel().status({
                nodeId,
                status: "success"
            })
        )

        return {
            ...context,
            [data.variablesName || "geminiResponse"]: {
                aiResponse: text
            }
        }

    } catch (error) {
        await publish(
            geminiChannel().status({
                nodeId,
                status: "error",
            })
        )
        throw error
    }

}