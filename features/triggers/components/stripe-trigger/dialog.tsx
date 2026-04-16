"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CopyIcon } from "lucide-react"
import { useParams } from "next/navigation"
import { toast } from "sonner"

interface StripeTriggerDialog {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export const StripeTriggerDialog = ({ open, onOpenChange }: StripeTriggerDialog) => {
    const params = useParams()
    const workflowId = params.workflowId as string

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    const webhookUrl = `${baseUrl}/api/webhooks/stripe?workflowId=${workflowId}`

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(webhookUrl)
            toast.success("Webhook URL copied to clipboard")
        } catch {
            toast.error("Failed to copy webhook URL")
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Stripe Trigger Configuration</DialogTitle>
                    <DialogDescription>
                        Use this webhook URL in your Stripe integration to trigger the workflow when an event occurs.
                    </DialogDescription>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="webhook-url">
                                Webhook URL
                            </Label>
                            <div className="flex gap-2">
                                <Input
                                    id="webhook-url"
                                    value={webhookUrl}
                                    readOnly
                                    className="font-mono text-sm"
                                />
                                <Button
                                    type="button"
                                    size="icon"
                                    variant={"outline"}
                                    onClick={copyToClipboard}
                                >
                                    <CopyIcon className="size-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
                            <h4 className="font-semibold text-sm flex items-center gap-2">
                                <span className="inline-flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">?</span>
                                Setup Instructions
                            </h4>
                            <ol className="text-sm text-muted-foreground space-y-2 list-none">
                                {[
                                    "Open your Stripe Dashboard",
                                    <>Go to <span className="font-medium text-foreground">Developers</span> → <span className="font-medium text-foreground">Webhooks</span></>,
                                    <>Click <span className="font-medium text-foreground">&ldquo;Add endpoint&rdquo;</span></>,
                                    "Paste the webhook URL above",
                                    <>Select events to listen for (e.g., <span className="font-mono bg-background border rounded px-1 text-xs">payment_intent.succeeded</span>)</>,
                                    "Save and copy the signing secret",
                                ].map((step, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
                                            {i + 1}
                                        </span>
                                        <span>{step}</span>
                                    </li>
                                ))}
                            </ol>
                        </div>

                      

                        <div className="rounded-lg bg-muted p-4 space-y-2">
                            <h4 className="font-medium text-sm">Avaiable Variables</h4>
                            <ul className="text-sm text-muted-foreground space-y-1">
                                <li>
                                    <code className="bg-background px-1 py-0.5 rounded">
                                       {"{{stripe.amount}}"} - Payment amount
                                    </code>
                                </li>
                                <li>
                                    <code className="bg-background px-1 py-0.5 rounded">
                                       {"{{stripe.currency}}"} - Payment currency
                                    </code>
                                </li>
                                <li>
                                    <code className="bg-background px-1 py-0.5 rounded">
                                       {"{{stripe.customerId}}"} - Customer ID
                                    </code>
                                </li>
                                <li>
                                    <code className="bg-background px-1 py-0.5 rounded">
                                       {"{{json stripe}}"} - Full Stripe event object in JSON format
                                    </code>
                                </li>
                                <li>
                                    <code className="bg-background px-1 py-0.5 rounded">
                                       {"{{stripe.eventType}}"} - Event type (e.g., payment_intent.succeeded)
                                    </code>
                                </li>
                            </ul>
                        </div>
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}