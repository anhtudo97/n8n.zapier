import ky, { type Options as KyOptions } from 'ky'
import { NodeExecutor } from "@/features/executions/types"
import { NonRetriableError } from "inngest"
import Handlebars from "handlebars"

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

function parseHttpRequestData(data: Record<string, unknown>, nodeId: string): HttpRequestData {
    const { endpoint, variablesName, method, body } = data

    if (!endpoint || typeof endpoint !== "string") {
        throw new NonRetriableError(`Endpoint is required for http-request node with id ${nodeId}`)
    }
    if (!variablesName || typeof variablesName !== "string") {
        throw new NonRetriableError(`Variables name is required for http-request node with id ${nodeId}`)
    }
    if (!method || typeof method !== "string") {
        throw new NonRetriableError(`Method is required for http-request node with id ${nodeId}`)
    }

    return {
        endpoint,
        variablesName,
        method: method as HttpMethod,
        body: typeof body === "string" ? body : undefined,
    }
}

export const httpRequestExecutor: NodeExecutor = async ({ data, nodeId, context, step }) => {
    const { endpoint, method, body, variablesName } = parseHttpRequestData(data, nodeId)

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



        return {
            ...context,
            [variablesName]: {
                httpResponse: {
                    status: response.status,
                    statusText: response.statusText,
                    data: responseData,
                },
            },
        }
    })

    return result
}