import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import prisma from "./db"
import { polar, checkout, portal, usage, webhooks } from "@polar-sh/better-auth"
import { polarClient } from "./polar"

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "sqlite", ...etc
    }),
    emailAndPassword: {
        enabled: true,
        autoSignIn: true,
    },
    plugins: [
        polar({
            client: polarClient,
            createCustomerOnSignUp: true,
            use: [
                checkout({
                    products: [
                        {
                            productId: "6af10274-6839-4b78-be5b-94f31a19f0fa",
                            slug: "pro" // Custom slug for easy reference in Checkout URL, e.g. /checkout/Nodebase-Pro
                        }
                    ],
                    successUrl: process.env.POLAR_SUCCESS_URL,
                    authenticatedUsersOnly: true
                }),
                portal(),
                usage(), // Optional: Enables usage tracking for metered billing
            ]
        })
    ]
})