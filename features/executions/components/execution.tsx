import { ExecutionStatus } from "@/generated/prisma/enums"
import { CheckCircle2Icon, ClockIcon, Loader2Icon, XCircleIcon } from "lucide-react"
import { useSuspenseExecution } from "../hooks/use-executions"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"


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
                </div>
            </CardContent>
        </Card>
    )
}
