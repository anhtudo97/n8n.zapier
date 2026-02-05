import { workflowsRouter } from "@/features/workflows/server/router"
import { inngest } from "@/inngest/client"
import { createTRPCRouter, premiumProcedure } from "../init"

export const appRouter = createTRPCRouter({
  workflows: workflowsRouter,
  testAi: premiumProcedure.mutation(async () => {
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
