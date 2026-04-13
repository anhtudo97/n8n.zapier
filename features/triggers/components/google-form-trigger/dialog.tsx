"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CopyIcon } from "lucide-react"
import { useParams } from "next/navigation"
import { toast } from "sonner"

interface GoogleFormTriggerDialog {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export const GoogleFormTriggerDialog = ({ open, onOpenChange }: GoogleFormTriggerDialog) => {
    const params = useParams()
    const workflowId = params.workflowId as string

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    const webhookUrl = `${baseUrl}/api/webhooks/google-form?workflowId=${workflowId}`

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
                    <DialogTitle>Google Form Trigger</DialogTitle>
                    <DialogDescription>
                        Use this webhook URL in your Google Form to trigger the workflow when a form is submitted.
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
                                    "Open your Google Form",
                                    <>Click on the three dots <span className="font-mono bg-background border rounded px-1">⋮</span> in the top right corner</>,
                                    <>Select <span className="font-medium text-foreground">&ldquo;Script editor&rdquo;</span> from the dropdown menu</>,
                                    "Copy and paste the following code into the script editor",
                                    <>Replace <span className="font-mono bg-background border rounded px-1 text-xs">WEBHOOK_URL</span> with your actual webhook URL above</>,
                                    <>Save and click <span className="font-medium text-foreground">&ldquo;Triggers&rdquo;</span> → <span className="font-medium text-foreground">&ldquo;Add trigger&rdquo;</span></>,
                                    <>Choose: <span className="font-medium text-foreground">From form</span> → <span className="font-medium text-foreground">On form submit</span> → Save</>,
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

                        <div className="rounded-lg bg-muted p-4 space-y-3">
                            <h4 className="font-semibold text-sm">Google Apps Script:</h4>
                            <Button
                                type="button"
                                variant={"outline"}
                                onClick={() => {}}
                            >
                                <CopyIcon className="size-4 mr-2" />
                                Copy Google Apps Script
                            </Button>
                            <p className="text-xs text-muted-foreground">
                                This script sends a POST request to the webhook URL with the form responses whenever the form is submitted.
                            </p>
                        </div>
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}