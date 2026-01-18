import { inngest } from "./client"

import { google } from '@ai-sdk/google'
import { generateText } from 'ai'

export const execute = inngest.createFunction(
    { id: "execute-ai" },
    { event: "execute/ai" },
    async ({ event, step }) => {
        const { steps } = await step.ai.wrap(
            "gemini-generate-text",
            generateText,
            {
                model: google('gemini-2.5-flash'),
                system: 'You are a helpful assistant that helps users with their tasks.',
                prompt: "What is 2 + 2?"
            })

        return steps
    },
)