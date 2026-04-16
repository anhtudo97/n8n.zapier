"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useMemo } from "react"
import { useForm, useWatch } from "react-hook-form"
import z from "zod"

const formSchema = z.object({
    variablesName:
        z
            .string()
            .min(1, { message: "Variables name is required" })
            .regex(/^[A-Za-z_$][A-Za-z0-9_$]*$/, { message: "Variables name must be start with a letter, underscore, or dollar sign" }),
    endpoint:
        z
            // .url({ message: "Please enter a valid URL" }),
            .string()
            .min(1, { message: "Endpoint is required" }),
    method:
        z
            .enum(["GET", "POST", "PUT", "DELETE", "PATCH"]),
    body:
        z
            .string()
            .optional(),
})

export type HttpRequestFormValues = z.infer<typeof formSchema>

interface HttpRequestDialog {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (values: HttpRequestFormValues) => void
    defaultValues?: Partial<HttpRequestFormValues>
}

export const HttpRequestDialog = ({ open, onOpenChange, onSubmit, defaultValues = {} }: HttpRequestDialog) => {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            endpoint: defaultValues.endpoint || "",
            method: defaultValues.method || "GET",
            body: defaultValues.body || "",
        }
    })

    const watchVariablesName = useWatch({ control: form.control, name: "variablesName", defaultValue: defaultValues.variablesName || "API call" })
    const watchMethod = useWatch({ control: form.control, name: "method" })
    const showBodyField = useMemo(() => {
        return ["POST", "PUT", "PATCH"].includes(watchMethod)
    }, [watchMethod])

    const onFormSubmit = (values: z.infer<typeof formSchema>) => {
        onSubmit(values)
        onOpenChange(false)
    }

    useEffect(() => {
        if (open) {
            form.reset({
                variablesName: defaultValues.variablesName || "",
                endpoint: defaultValues.endpoint || "",
                method: defaultValues.method || "GET",
                body: defaultValues.body || "",
            })
        }
    }, [open, defaultValues, form])


    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>HTTP Request</DialogTitle>
                    <DialogDescription>
                        Trigger an HTTP request to a specified URL with custom headers and body.
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
                                        {`{{}${watchVariablesName}.httpResponse.data}}`},
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="method"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Method</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select HTTP method" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="GET">GET</SelectItem>
                                            <SelectItem value="POST">POST</SelectItem>
                                            <SelectItem value="PUT">PUT</SelectItem>
                                            <SelectItem value="DELETE">DELETE</SelectItem>
                                            <SelectItem value="PATCH">PATCH</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        Choose the HTTP method for the request.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="endpoint"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Endpoint</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="https://api.example.com/data" />
                                    </FormControl>
                                    <FormDescription>
                                        Static URL or use {"{{variables}}"} for simple values or {"{{json variables}}"} for JSON data from previous steps.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {
                            showBodyField && (
                                <FormField
                                    control={form.control}
                                    name="body"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Request Body</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    {...field}
                                                    placeholder={
                                                        `{\n  "key": "value"\n}`
                                                    }
                                                    className="min-h-[120px] text-sm font-mono" />
                                            </FormControl>
                                            <FormDescription>
                                                Use {"{{variables}}"} for simple values or {"{{json variables}}"} for JSON data from previous steps.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )
                        }
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