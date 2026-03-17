/* eslint-disable react-hooks/set-state-in-render */
"use client"

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useSuspenseWorkflow, useUpdateWorkflowName } from "@/features/workflows/hooks/use-workflows"
import { SaveIcon } from "lucide-react"
import Link from "next/link"
import { useEffect, useMemo, useRef, useState } from "react"

interface EditorHeaderProps {
    workflowId: string
}

export const EditorBreadcrumbs = ({ workflowId }: EditorHeaderProps) => {
    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link prefetch href="/workflows">
                            Workflows
                        </Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <EditorNameInput workflowId={workflowId} />
            </BreadcrumbList>
        </Breadcrumb>
    )
}

export const EditorSaveButton = ({ workflowId }: EditorHeaderProps) => {
    return (
        <div className="ml-auto">
            <Button size="sm" onClick={() => { }} disabled={false}>
                <SaveIcon className="size-4" />
                Save
            </Button>
        </div>
    )
}

export const EditorNameInput = ({ workflowId }: EditorHeaderProps) => {
    const { data } = useSuspenseWorkflow(workflowId)
    const updateWorkflowName = useUpdateWorkflowName()

    const [isEditing, setIsEditing] = useState(false)
    const [name, setName] = useState(data.name)

    const inputRef = useRef<HTMLInputElement>(null)

    useMemo(() => {
        if (data.name) {
            setName(data.name)
        }
    }, [data.name])

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus()
            inputRef.current.select()
        }
    }, [isEditing])

    const handleSave = async () => {
        if (name === data.name) {
            setIsEditing(false)
            return
        }

        try {
            await updateWorkflowName.mutateAsync({ id: workflowId, name })
        } catch {
            setName(data.name)
        } finally {
            setIsEditing(false)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSave()
        } else if (e.key === "Escape") {
            setName(data.name)
            setIsEditing(false)
        }
    }

    if (isEditing) {
        return (
            <Input
                ref={inputRef}
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                disabled={updateWorkflowName.isPending}
                className="h-7 w-auto min-w-[100px] px-2"
            />
        )
    }

    return (
        <BreadcrumbItem onClick={() => setIsEditing(true)} className="cursor-pointer hover:text-foreground transition-colors">
            {data.name || "Untitled Workflow"}
        </BreadcrumbItem>
    )
}

export const EditorHeader = ({ workflowId }: EditorHeaderProps) => {
    return (
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4 bg-background">
            <SidebarTrigger />
            <div className="flex flex-row items-center justify-between gap-x-4 w-full">
                <EditorBreadcrumbs workflowId={workflowId} />
                <EditorSaveButton workflowId={workflowId} />
            </div>
        </header>
    )
}
