"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useCredentialsByType } from "@/features/credentials/hooks/use-creadentials"
import { CredentialType } from "@/generated/prisma/enums"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm, useWatch } from "react-hook-form"
import z from "zod"

const formSchema = z.object({
    variablesName:
        z
            .string()
            .min(1, { message: "Variables name is required" })
            .regex(/^[A-Za-z_$][A-Za-z0-9_$]*$/, { message: "Variables name must be start with a letter, underscore, or dollar sign" }),
    username:
        z
            .string()
            .optional(),
    content:
        z
            .string()
            .min(1, { message: "Content is required" })
            .max(2000, { message: "Content must be less than 2000 characters" }),
    webhookUrl:
        z
            .string()
            .min(1, { message: "Webhook URL is required" }),
})

export type DiscordFormValues = z.infer<typeof formSchema>

interface DiscordDialog {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (values: DiscordFormValues) => void
    defaultValues?: Partial<DiscordFormValues>
}

export const DiscordDialog = ({ open, onOpenChange, onSubmit, defaultValues = {} }: DiscordDialog) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            variablesName: defaultValues.variablesName || "",
            webhookUrl: defaultValues.webhookUrl || "",
            username: defaultValues.username || "",
            content: defaultValues.content || "",
        }
    })

    useEffect(() => {
        if (open) {
            form.reset({
                webhookUrl: defaultValues.webhookUrl || "",
                variablesName: defaultValues.variablesName || "",
                username: defaultValues.username || "",
                content: defaultValues.content || "",
            })
        }
    }, [open, defaultValues, form])

    const watchVariablesName = useWatch({ control: form.control, name: "variablesName", defaultValue: defaultValues.variablesName || "Discord" })

    const onFormSubmit = (values: z.infer<typeof formSchema>) => {
        onSubmit(values)
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Discord Configuration</DialogTitle>
                    <DialogDescription>
                        Configure the Discord node settings.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-8 mt-4">
                        <FormField
                            control={form.control}
                            name="variablesName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Variables Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Enter a name for the variables" />
                                    </FormControl>
                                    <FormDescription>
                                        Use this name to reference the result in other nodes:
                                        {" "}
                                        {`{{${watchVariablesName}.aiResponse.text}}`},
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="webhookUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Webhook URL</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Enter your Discord webhook URL" />
                                    </FormControl>
                                    <FormDescription>
                                        Get this from Discord: Channel Settings &gt; Integrations &gt; Webhooks &gt; New Webhook
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Message Content</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            placeholder="You are a helpful assistant that provides weather information based on the user's query."
                                            className="min-h-[80px] text-sm font-mono" />
                                    </FormControl>
                                    <FormDescription>
                                        Sets the behavior of the model. For example, you can use it to instruct the model to act as a specific character or to provide responses in a certain style.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                       <FormField 
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bot username (optional)</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Enter your Discord bot username" />
                                    </FormControl>
                                    <FormDescription>
                                        If not set, it will use the default username of the webhook.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter className="mt-4">
                            <Button type="submit">
                                Save
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}