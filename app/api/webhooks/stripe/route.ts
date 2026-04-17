import { sendWorkflowExecution } from "@/inngest/utils"
import { NextRequest, NextResponse } from "next/server"
import { success } from "zod"

export async function POST(request: NextRequest) {
    try {
        const url = new URL(request.url)
        const workflowId = url.searchParams.get("workflowId")

        if (!workflowId) {
            return NextResponse.json(
                { error: "Missing workflowId query parameter." },
                { status: 500 }
            )
        }

        // Here you would typically fetch the workflow configuration using the workflowId
        // and then process the Google Form submission accordingly.
        // For demonstration purposes, we'll just return a success response.

        const body = await request.json()

        const stripeData = {
            eventId: body.id,
            eventType: body.type,
            timestamp: body.created,
            livemode: body.livemode,
            raw: body.data?.object
        }

        await sendWorkflowExecution({
            workflowId,
            initialData: {
                stripe: stripeData
            }
        })

        return NextResponse.json(
            { message: `Stripe workflow with ID ${workflowId} processed successfully.` },
            { status: 200 }
        )
    } catch (error) {
        console.error("Error processing Stripe workflow:", error)
        return NextResponse.json(
            { error: "An error occurred while processing the Stripe workflow." },
            { status: 500 }
        )
    }
}