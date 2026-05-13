"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
    content:
        z
            .string()
            .min(1, { message: "Content is required" }),
    webhookUrl:
        z
            .string()
            .min(1, { message: "Webhook URL is required" }),
})

export type SlackFormValues = z.infer<typeof formSchema>

interface SlackDialog {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (values: SlackFormValues) => void
    defaultValues?: Partial<SlackFormValues>
}

export const SlackDialog = ({ open, onOpenChange, onSubmit, defaultValues = {} }: SlackDialog) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            variablesName: defaultValues.variablesName || "",
            webhookUrl: defaultValues.webhookUrl || "",
            content: defaultValues.content || "",
        }
    })

    useEffect(() => {
        if (open) {
            form.reset({
                webhookUrl: defaultValues.webhookUrl || "",
                variablesName: defaultValues.variablesName || "",
                content: defaultValues.content || "",
            })
        }
    }, [open, defaultValues, form])

    const watchVariablesName = useWatch({ control: form.control, name: "variablesName", defaultValue: defaultValues.variablesName || "Slack" })

    const onFormSubmit = (values: z.infer<typeof formSchema>) => {
        onSubmit(values)
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Slack Configuration</DialogTitle>
                    <DialogDescription>
                        Configure the Slack node settings.
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
                                        <Input {...field} placeholder="Enter your Slack webhook URL" />
                                    </FormControl>
                                    <FormDescription>
                                        Get this from Slack: Workspace Settings &gt; Workflows &gt; Webhooks &gt; New Webhook
                                    </FormDescription>
                                    <FormDescription>
                                        Make sure the &quot;key&quot; is &quot;content&quot;
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