import { NodeExecutor } from "@/features/executions/types"
import { slackChannel } from "@/inngest/channels/slack"
import Handlebars from "handlebars"
import { decode } from "html-entities"
import { NonRetriableError } from "inngest"
import ky from "ky"

Handlebars.registerHelper("json", (context) => {
    const result = JSON.stringify(context, null, 2)
    const safeString = new Handlebars.SafeString(result)
    return safeString
})

type SlackData = {
    variablesName?: string
    webhookUrl?: string
    content?: string
}

export const SlackExecutor: NodeExecutor<SlackData> = async ({ data, nodeId, context, step, userId, publish }) => {

    await publish(
        slackChannel().status({
            nodeId,
            status: "loading"
        })
    )

    if (!data.variablesName || typeof data.variablesName !== "string") {
        await publish(
            slackChannel().status({
                nodeId,
                status: "error",
            })
        )
        throw new NonRetriableError(`Variables name is required for slack node with id ${nodeId}`)
    }

    if (!data.webhookUrl || typeof data.webhookUrl !== "string") {
        await publish(
            slackChannel().status({
                nodeId,
                status: "error",
            })
        )
        throw new NonRetriableError(`Webhook URL is required for slack node with id ${nodeId}`)
    }

    if (!data.content || typeof data.content !== "string") {
        await publish(
            slackChannel().status({
                nodeId,
                status: "error",
            })
        )
        throw new NonRetriableError(`Message content is required for slack node with id ${nodeId}`)
    }

    const rawContent = Handlebars.compile(data.content)(context)
    const content = decode(rawContent)

    try {
        const result = await step.run("slack-webhook", async () => {
            await ky.post(data.webhookUrl as string, {
                json: {
                    content,
                },
                headers: {
                    "Content-Type": "application/json",
                }
            })

            return {
                ...context,
                [data.variablesName as string]: {
                    slackMessageSent: true,
                }
            }
        })

        await publish(
            slackChannel().status({
                nodeId,
                status: "success"
            })
        )

        return result

    } catch (error) {
        console.log(error)
        await publish(
            slackChannel().status({
                nodeId,
                status: "error",
            })
        )
        throw error
    }

}