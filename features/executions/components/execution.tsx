import { ExecutionStatus } from "@/generated/prisma/enums"
import { CheckCircle2Icon, ClockIcon, Loader2Icon, XCircleIcon } from "lucide-react"
import { useSuspenseExecution } from "../hooks/use-executions"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"


const getStatusIcon = (status: ExecutionStatus) => {
    switch (status) {
        case "SUCCESS":
            return <CheckCircle2Icon className="size-5 text-green-600" />
        case "FAILED":
            return <XCircleIcon className="size-5 text-red-600" />
        case "RUNNING":
            return <Loader2Icon className="size-5 text-blue-600 animate-spin" />
        default:
            return <ClockIcon className="size-5 text-gray-600" />
    }
}

const formatStatus = (status: ExecutionStatus) => {
    return status.charAt(0) + status.slice(1).toLowerCase()
}

interface ExecutionProps {
    executionId: string
}

export const ExecutionView = ({ executionId }: ExecutionProps) => {
    const { data: execution } = useSuspenseExecution(executionId)
    const [showStackTrace, setShowStackTrace] = useState(false)

    const duration = execution?.completedAt
        ? Math.round((new Date(execution.completedAt).getTime() - new Date(execution.startedAt).getTime()) / 1000)
        : null

    return (
        <Card className="shadow-none">
            <CardHeader>
                <div className="flex items-center gap-3">
                    {getStatusIcon(execution.status)}
                    <div>
                        <CardTitle>
                            {formatStatus(execution.status)}
                        </CardTitle>

                        <CardDescription>
                            {execution.workflow.name} &bull; {duration !== null ? `${duration}s` : "In Progress"} &bull; Updated{" "}
                            {formatDistanceToNow(new Date(execution.startedAt), { addSuffix: true })}
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">
                            Workflow
                        </p>
                        <Link prefetch href={`/workflows/${execution.workflowId}`} className="text-smtext-primary hover:underline">
                            {execution.workflow.name}
                        </Link>
                    </div>

                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Status</p>
                        <p className="text-sm">{formatStatus(execution.status)}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Started</p>
                        <p className="text-sm">{formatDistanceToNow(new Date(execution.startedAt), { addSuffix: true })}</p>
                    </div>
                    {
                        execution.completedAt ? (
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                                <p className="text-sm">{formatDistanceToNow(new Date(execution.completedAt), { addSuffix: true })}</p>
                            </div>
                        ) : null
                    }
                    {
                        duration !== null ? (
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Duration</p>
                                <p className="text-sm">{`${duration}s`}</p>
                            </div>
                        ) : null
                    }
                    {
                        execution.inngestEventId ? (
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Inngest Event ID</p>
                                <p className="text-sm">{execution.inngestEventId}</p>
                            </div>
                        ) : null
                    }
                </div>
                {
                    execution.error ? (
                        <div className="mt-6 p-4 bg-red-50 rounded-md space-y-3">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Error</p>

                                <p className="text-sm text-red-600 font-mono">{execution.error}</p>
                            </div>
                            {
                                execution.errorStack && (
                                    <Collapsible
                                        open={showStackTrace}
                                        onOpenChange={setShowStackTrace}
                                    >
                                        <CollapsibleTrigger asChild>
                                            <Button variant="outline" size="sm" className="text-red-900 hover:text-red-100">
                                                {showStackTrace ? "Hide Stack Trace" : "Show Stack Trace"}
                                            </Button>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <pre className="text-xs text-red-600 font-mono whitespace-pre-wrap">{execution.errorStack}</pre>
                                        </CollapsibleContent>
                                    </Collapsible>
                                )
                            }
                        </div>
                    ) : null
                }
                {
                    execution.output && (
                        <div className="mt-6 p-4 bg-green-50 rounded-md space-y-3">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Output</p>

                                <pre className="text-sm text-green-600 font-mono whitespace-pre-wrap overflow-auto">{JSON.stringify(execution.output, null, 2)}</pre>
                            </div>
                        </div>
                    )
                }

            </CardContent>
        </Card>
    )
}
