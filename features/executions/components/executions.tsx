"use client"

import { EmptyView, EntityContainer, EntityHeader, EntityItem, EntityList, EntityPagination, ErrorView, LoadingView } from '@/components/entity-components'
import type { Execution, ExecutionStatus } from '@/generated/prisma/client'
import { formatDistanceToNow } from 'date-fns'
import Image from 'next/image'
import { PropsWithChildren } from 'react'
import { useSuspenseExecutions } from '../hooks/use-executions'
import { useExecutionsParams } from '../hooks/use-executions-params'
import { CheckCircle2Icon, ClockIcon, Loader2Icon, XCircleIcon } from 'lucide-react'

export const ExecutionsPagination = () => {
    const [params, setParams] = useExecutionsParams()
    const executions = useSuspenseExecutions()
    return (
        <EntityPagination
            disabled={executions.isFetching}
            totalPages={executions.data.totalPages}
            page={executions.data.page}
            onPageChange={(page) => setParams({ ...params, page })}
        />
    )
}

export const ExecutionsList = () => {
    const executions = useSuspenseExecutions()

    if (executions.data.items.length === 0) {
        return <ExecutionsEmpty />
    }

    return (
        <EntityList
            items={executions.data.items}
            getKey={execution => execution.id}
            renderItem={(execution) => (
                <ExecutionItem
                    execution={execution}
                />
            )}
            emptyView={<ExecutionsEmpty />}
        />
    )
}

export const ExecutionsHeader = () => {
    return (
        <EntityHeader
            title="Executions"
            description="Manage your executions. Create, update, and organize your executions to securely access various services."
        />
    )
}

export const ExecutionsContainer = ({ children }: PropsWithChildren) => {
    return (
        <EntityContainer
            header={<ExecutionsHeader />}
            pagination={<ExecutionsPagination />}
        >
            {children}
        </EntityContainer>
    )
}

export const ExecutionsLoading = () => {
    return <LoadingView message="Loading executions..." />
}

export const ExecutionsError = () => {
    return <ErrorView message="Failed to load executions." />
}

export const ExecutionsEmpty = () => {
    return (
        <EmptyView
            message="No executions found. Create your first execution to get started."
        />
    )
}

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

export const ExecutionItem = ({ execution }: { execution: Execution & { workflow: { id: string; name: string } } }) => {
    const duration = execution.completedAt ?
        Math.round(
            (new Date(execution.completedAt).getTime() - new Date(execution.startedAt).getTime()) / 1000
        )
        : null

    const subtitle = (
        <>
            {execution.workflow.name} &bull; {duration !== null ? `${duration}s` : "In Progress"} &bull; Updated{" "}
            {formatDistanceToNow(new Date(execution.startedAt), { addSuffix: true })}
        </>
    )
    return (
        <EntityItem
            href={`/executions/${execution.id}`}
            title={formatStatus(execution.status)}
            subtitle={subtitle}
            image={
                <div className="size-8 flex items-center justify-center">
                    {getStatusIcon(execution.status)}
                </div>
            }
        />
    )
}