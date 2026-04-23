"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useWatch } from "react-hook-form"
import z from "zod"

const formSchema = z.object({
    variablesName:
        z
            .string()
            .min(1, { message: "Variables name is required" })
            .regex(/^[A-Za-z_$][A-Za-z0-9_$]*$/, { message: "Variables name must be start with a letter, underscore, or dollar sign" }),
    systemPrompt:
        z
            .string()
            .optional(),
    userPrompt:
        z
            .string()
            .min(1, { message: "User prompt is required" }),
})

export type AnthropicFormValues = z.infer<typeof formSchema>

interface AnthropicDialog {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (values: AnthropicFormValues) => void
    defaultValues?: Partial<AnthropicFormValues>
}

export const AnthropicDialog = ({ open, onOpenChange, onSubmit, defaultValues = {} }: AnthropicDialog) => {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            variablesName: defaultValues.variablesName || "",
            systemPrompt: defaultValues.systemPrompt || "",
            userPrompt: defaultValues.userPrompt || "",
        }
    })

    const watchVariablesName = useWatch({ control: form.control, name: "variablesName", defaultValue: defaultValues.variablesName || "API call" })

    const onFormSubmit = (values: z.infer<typeof formSchema>) => {
        onSubmit(values)
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Anthropic Request</DialogTitle>
                    <DialogDescription>
                        Trigger an Anthropic request configuration.
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
                            name="systemPrompt"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>System Prompt (optional)</FormLabel>
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
                            name="userPrompt"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>User Prompt</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            placeholder="What's the weather like in New York today?"
                                            className="min-h-[120px] text-sm font-mono" />
                                    </FormControl>
                                    <FormDescription>
                                        The user&apos;s input or query that you want the model to respond to. This is the main content that the model will process to generate a response.
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