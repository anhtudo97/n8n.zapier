import { NonRetriableError } from "inngest"
import { inngest } from "./client"
import prisma from "@/lib/db"
import { topologicalSort } from "./utils"
import { ExecutionStatus, NodeType } from "@/generated/prisma/enums"
import { getExecutor } from "@/features/executions/lib/executor-registry"
import { httpRequestChannel } from "./channels/http-request"
import { manualTriggerChannel } from "./channels/manual-trigger"
import { googleFormTriggerChannel } from "./channels/google-form-trigger"
import { stripeTriggerChannel } from "./channels/stripe-trigger"
import { geminiChannel } from "./channels/gemini"
import { openaiChannel } from "./channels/openai"
import { anthropicChannel } from "./channels/anthropic"
import { discordChannel } from "./channels/discord"
import { slackChannel } from "./channels/slack"

export const executeWorkflow = inngest.createFunction(
  {
    id: "execute-workflow",
    retries: 0,
    onFailure: async ({ event }) => {
      const inngestEventId = event.data.event.id
      await prisma.execution.update({
        where: {
          id: inngestEventId,
        },
        data: {
          status: ExecutionStatus.FAILED,
          completedAt: new Date(),
          error: event.data.error.message || "Unknown error",
          errorStack: event.data.error.stack || "",
        },
      })
    },
  },
  {
    event: "workflows/execute.workflow",
    channels: [
      httpRequestChannel(),
      manualTriggerChannel(),
      googleFormTriggerChannel(),
      stripeTriggerChannel(),
      geminiChannel(),
      openaiChannel(),
      anthropicChannel(),
      discordChannel(),
      slackChannel()
    ] // This is the channel we will use to send real-time updates about the execution
  },
  async ({ event, step, publish }) => {
    const inngestEventId = event.id

    const workflowId = event.data.workflowId

    if (!workflowId || !inngestEventId) {
      throw new NonRetriableError("Workflow ID and Inngest Event ID are required")
    }

    await step.run("create-execution", async () => {
      await prisma.execution.create({
        data: {
          id: inngestEventId,
          workflowId,
        },
      })
    })

    const sortedNodes = await step.run("prepare-workflow", async () => {
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: {
          id: workflowId,
        },
        include: {
          nodes: true,
          connections: true,
        },
      })

      return topologicalSort(workflow.nodes, workflow.connections)

    })

    const userId = await step.run("find-user-id", async () => {
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: {
          id: workflowId,
        },
        select: {
          userId: true,
        },
      })

      return workflow.userId
    })

    let context = event.data.initialData || {}

    for (const node of sortedNodes) {
      const executor = getExecutor(node.type as NodeType)
      context = await executor({
        data: node.data as Record<string, unknown>,
        nodeId: node.id,
        userId,
        context,
        step,
        publish
      })
    }

    await step.run("mark-execution-complete", async () => {
      await prisma.execution.update({
        where: {
          id: inngestEventId,
          workflowId
        },
        data: {
          status: ExecutionStatus.SUCCESS,
          completedAt: new Date(),
          output: context,
        },
      })
    })

    return {
      workflowId,
      result: context,
    }
  }
)

