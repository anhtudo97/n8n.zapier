import { sendWorkflowExecution } from "@/inngest/utils"
import { NextRequest, NextResponse } from "next/server"

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

        const formData = {
            formId: body.formId,
            formTitle: body.formTitle,
            responseId: body.responseId,
            timestamp: body.timestamp,
            respondentEmail: body.respondentEmail,
            responses: body.responses,
            raw: body
        }

        await sendWorkflowExecution({
            workflowId,
            initialData: {
                googleForm: formData
            }
        })

        return NextResponse.json(
            { message: `Google Form workflow with ID ${workflowId} processed successfully.` },
            { status: 200 }
        )
    } catch (error) {
        console.error("Error processing Google Form workflow:", error)
        return NextResponse.json(
            { error: "An error occurred while processing the Google Form workflow." },
            { status: 500 }
        )
    }
}