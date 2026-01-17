import prisma from '@/lib/db'
import { createTRPCRouter, protectedProcedure } from '../init'
export const appRouter = createTRPCRouter({
    getUsers: protectedProcedure
        .query(() => {
            return prisma.user.findMany()
        }),
    getWorkflows: protectedProcedure
        .query(() => {
            return prisma.workflow.findMany()
        }),
    createWorkflow: protectedProcedure
        .mutation(() => {
            return prisma.workflow.create({
                data: {
                    name: 'New Workflow',
                }
            })
        }),
})
// export type definition of API
export type AppRouter = typeof appRouter