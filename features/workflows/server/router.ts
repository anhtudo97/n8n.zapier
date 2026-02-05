import prisma from "@/lib/db"
import { generateSlug } from "random-word-slugs"
import { createTRPCRouter, protectedProcedure } from "@/trpc/init"
import z from "zod"

export const workflowsRouter = createTRPCRouter({
    create: protectedProcedure.mutation(async ({ ctx }) => {
        return prisma.workflow.create({
            data: {
                name: generateSlug(3),
                userId: ctx.auth.user.id,
            },
        })
    }),
    remove: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            return prisma.workflow.delete({
                where: {
                    id: input.id,
                    userId: ctx.auth.user.id,
                },
            })
        })
})