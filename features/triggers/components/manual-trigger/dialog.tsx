"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface ManualTriggerDialog {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export const ManualTriggerDialog = ({ open, onOpenChange }: ManualTriggerDialog) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Manual Trigger</DialogTitle>
                    <DialogDescription>
                        This trigger allows you to start the workflow manually. You can use this trigger to test your workflow or to run it on demand.
                    </DialogDescription>
                    <div className="py-4">
                        <p className="text-sm text-muted-foreground">
                            Manual Trigger
                        </p>
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}