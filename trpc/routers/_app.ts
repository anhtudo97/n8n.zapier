import { inngest } from "@/inngest/client"
import prisma from "@/lib/db"
import { createTRPCRouter, protectedProcedure } from "../init"

export const appRouter = createTRPCRouter({
  getUsers: protectedProcedure.query(() => {
    return prisma.user.findMany()
  }),
  getWorkflows: protectedProcedure.query(() => {
    return prisma.workflow.findMany()
  }),
  createWorkflow: protectedProcedure.mutation(() => {
    return prisma.workflow.create({
      data: {
        name: "New Workflow"
      }
    })
  }),
  testAi: protectedProcedure.mutation(async () => {
    await inngest.send({
      name: "execute/ai"
    })

    return {
      success: true,
      message: "AI execution started"
    }
  })
})
// export type definition of API
export type AppRouter = typeof appRouter
