"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CredentialType } from "@/generated/prisma/enums"
import { useUpgradeModal } from "@/hooks/use-upgrade-modal"
import { zodResolver } from "@hookform/resolvers/zod"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import z from "zod"
import { useCreateCredential, useSuspenseCredential, useUpdateCredential } from "../hooks/use-creadentials"

const credentialSchema = z.object({
    name: z.string().min(1, "Name is required"),
    type: z.enum(CredentialType),
    value: z.string().min(1, "API key is required"),
})

type FormValues = z.infer<typeof credentialSchema>

const credentialTypeOptions = [
    {
        value: CredentialType.OPENAI,
        label: "OpenAI",
        logo: "/openai.svg",
    },
    {
        value: CredentialType.ANTHROPIC,
        label: "Anthropic",
        logo: "/anthropic.svg",
    },
    {
        value: CredentialType.GEMINI,
        label: "Gemini",
        logo: "/gemini.svg",
    }
]

interface CredentialFormProps {
    initialData?: {
        id?: string
        name: string
        type: CredentialType
        value: string
    }
}

export const CredentialForm = ({ initialData }: CredentialFormProps) => {
    const router = useRouter()
    const createCredential = useCreateCredential()
    const updateCredential = useUpdateCredential()
    const { handleError, modal } = useUpgradeModal()

    const isEdit = !!initialData?.id

    const form = useForm<FormValues>({
        resolver: zodResolver(credentialSchema),
        defaultValues: {
            name: initialData?.name || "",
            type: initialData?.type || CredentialType.OPENAI,
            value: initialData?.value || "",
        }
    })

    const onSubmit = async (data: FormValues) => {
        if (isEdit && initialData?.id) {
            await updateCredential
                .mutateAsync({
                    id: initialData.id,
                    ...data
                }, {
                    onError: (error) => {
                        handleError(error)
                    }
                })
        } else {
            await createCredential
                .mutateAsync(data, {
                    onSuccess: (createdData) => {
                        router.push(`/credentials/${createdData.id}`)
                    },
                    onError: (error) => {
                        handleError(error)
                    }
                })

        }
    }

    return (
        <>
            {modal}
            <Card className="shadow-none">
                <CardHeader>
                    <CardTitle>
                        {isEdit ? "Edit Credential" : "Create Credential"}
                    </CardTitle>
                    <CardDescription>
                        {
                            isEdit
                                ? "Update your credential details below. Changes will take effect immediately."
                                : "Create a new credential by filling out the form below. This credential can be used to connect to external services and APIs."
                        }
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="My OpenAI Credential" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Type</FormLabel>
                                        <Select
                                            onValueChange={(value) => field.onChange(value)}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select a type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {
                                                    credentialTypeOptions.map(option => (
                                                        <SelectItem
                                                            key={option.value}
                                                            value={option.value}
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <Image
                                                                    src={option.logo}
                                                                    alt={option.label}
                                                                    width={16}
                                                                    height={16}
                                                                />
                                                                {option.label}
                                                            </div>
                                                        </SelectItem>
                                                    ))
                                                }
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="value"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>API Key</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="sk-..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex gap-4">
                                <Button
                                    type="submit"
                                    disabled={createCredential.isPending || updateCredential.isPending}
                                >
                                    {isEdit ? "Update Credential" : "Create Credential"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </>
    )
}

export const CredentialView = ({ crententialId }: { crententialId: string }) => {
    const { data: credential } = useSuspenseCredential(crententialId)

    return <CredentialForm initialData={credential} />
}