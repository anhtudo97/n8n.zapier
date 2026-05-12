import { NodeExecutor } from "@/features/executions/types"
import { discordChannel } from "@/inngest/channels/discord"
import Handlebars from "handlebars"
import { decode } from "html-entities"
import { NonRetriableError } from "inngest"
import ky from "ky"

Handlebars.registerHelper("json", (context) => {
    const result = JSON.stringify(context, null, 2)
    const safeString = new Handlebars.SafeString(result)
    return safeString
})

type DiscordData = {
    variablesName?: string
    webhookUrl?: string
    username?: string
    content?: string
}

export const DiscordExecutor: NodeExecutor<DiscordData> = async ({ data, nodeId, context, step, userId, publish }) => {

    await publish(
        discordChannel().status({
            nodeId,
            status: "loading"
        })
    )

    if (!data.variablesName || typeof data.variablesName !== "string") {
        await publish(
            discordChannel().status({
                nodeId,
                status: "error",
            })
        )
        throw new NonRetriableError(`Variables name is required for discord node with id ${nodeId}`)
    }

    if (!data.webhookUrl || typeof data.webhookUrl !== "string") {
        await publish(
            discordChannel().status({
                nodeId,
                status: "error",
            })
        )
        throw new NonRetriableError(`Webhook URL is required for discord node with id ${nodeId}`)
    }

    if (!data.content || typeof data.content !== "string") {
        await publish(
            discordChannel().status({
                nodeId,
                status: "error",
            })
        )
        throw new NonRetriableError(`Message content is required for discord node with id ${nodeId}`)
    }

    const rawContent = Handlebars.compile(data.content)(context)
    const content = decode(rawContent)
    const username = data.username ? Handlebars.compile(data.username)(context) : undefined

    try {
        const result = await step.run("discord-webhook", async () => {
            await ky.post(data.webhookUrl as string, {
                json: {
                    content: content.slice(0, 2000), // Discord has a max message length of 2000 characters
                    username
                }
            })

            return {
                ...context,
                [data.variablesName as string]: {
                    discordMessageSent: true,
                }
            }
        })

        await publish(
            discordChannel().status({
                nodeId,
                status: "success"
            })
        )

        return result

    } catch (error) {
        await publish(
            discordChannel().status({
                nodeId,
                status: "error",
            })
        )
        throw error
    }

}