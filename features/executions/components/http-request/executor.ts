import ky, { type Options as KyOptions } from 'ky'
import { NodeExecutor } from "@/features/executions/types"
import { NonRetriableError } from "inngest"
import Handlebars from "handlebars"
import { httpRequestChannel } from '@/inngest/channels/http-request'
import { Realtime } from '@inngest/realtime'

Handlebars.registerHelper("json", (context) => {
    const result = JSON.stringify(context, null, 2)
    const safeString = new Handlebars.SafeString(result)
    return safeString
})

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH"

type HttpRequestData = {
    variablesName: string
    endpoint: string
    method: HttpMethod
    body?: string
}

async function parseHttpRequestData(data: Record<string, unknown>, nodeId: string, publish: Realtime.PublishFn): Promise<HttpRequestData> {
    const { endpoint, variablesName, method, body } = data

    if (!endpoint || typeof endpoint !== "string") {
        await publish(
            httpRequestChannel().status({
                nodeId,
                status: "error",
            })
        )
        throw new NonRetriableError(`Endpoint is required for http-request node with id ${nodeId}`)
    }
    if (!variablesName || typeof variablesName !== "string") {
        await publish(
            httpRequestChannel().status({
                nodeId,
                status: "error",
            })
        )
        throw new NonRetriableError(`Variables name is required for http-request node with id ${nodeId}`)
    }
    if (!method || typeof method !== "string") {
        await publish(
            httpRequestChannel().status({
                nodeId,
                status: "error",
            })
        )
        throw new NonRetriableError(`Method is required for http-request node with id ${nodeId}`)
    }

    return {
        endpoint,
        variablesName,
        method: method as HttpMethod,
        body: typeof body === "string" ? body : undefined,
    }
}

export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async ({ data, nodeId, context, step, publish }) => {
    await publish(
        httpRequestChannel().status({
            nodeId,
            status: "loading"
        })
    )

    const { endpoint, method, body, variablesName } = await parseHttpRequestData(data, nodeId, publish)

    try {
        const result = await step.run(`http-request`, async () => {
            const resolvedEndpoint = Handlebars.compile(endpoint)(context)

            const options: KyOptions = { method }

            if (["POST", "PUT", "PATCH"].includes(method)) {
                const resolved = Handlebars.compile(body || "{}")(context)
                JSON.parse(resolved) // Validate JSON
                options.body = resolved
                options.headers = { "Content-Type": "application/json" }
            }

            const response = await ky(resolvedEndpoint, options)
            const contentType = response.headers.get("content-type") || ""
            const responseData = contentType.includes("application/json")
                ? await response.json()
                : await response.text()

            const compiledVariablesName = Handlebars.compile(variablesName)(context)

            return {
                ...context,
                [compiledVariablesName]: {
                    httpResponse: {
                        status: response.status,
                        statusText: response.statusText,
                        data: responseData,
                    },
                },
            }
        })

        await publish(
            httpRequestChannel().status({
                nodeId,
                status: "success",
            })
        )

        return result
    } catch (error) {
        await publish(
            httpRequestChannel().status({
                nodeId,
                status: "error",
            })
        )
        throw error
    }
}