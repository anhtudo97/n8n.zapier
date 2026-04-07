import ky, { type Options as KyOptions } from 'ky'
import { NodeExecutor } from "@/features/executions/types"
import { NonRetriableError } from "inngest"

type HttpRequestData = {
    endpoint?: string
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
    body?: string
}

export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async ({ data, nodeId, context, step }) => {

    if (!data.endpoint) {
        throw new NonRetriableError(`Endpoint is required for http-request node with id ${nodeId}`)
    }

    // const result = await step.fetch(data.endpoint)

    const result = await step.run(`http-request`, async () => {
        const endpoint = data.endpoint!
        const method = data.method || "GET"

        const options: KyOptions = {
            method
        }

        if (["POST", "PUT", "PATCH"].includes(method)) {
            options.body = (data.body)
        }

        const response = await ky(endpoint, options)
        const contentType = response.headers.get("content-type") || ""
        const responseData = contentType.includes("application/json")
            ? await response.json()
            : await response.text()

        return {
            ...context,
            httpResponse: {
                status: response.status,
                statusText: response.statusText,
                data: responseData
            }
        }
    })

    return result
}