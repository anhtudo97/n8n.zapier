import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import { DropdownMenu } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { AlertTriangleIcon, Loader2Icon, MoreVerticalIcon, PackageOpenIcon, PlusIcon, SearchIcon, TrashIcon } from 'lucide-react'
import Link from 'next/link'
import { Button } from './ui/button'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from './ui/empty'
import { Input } from './ui/input'

type EntityHeaderProps = {
    title: string
    description: string
    newButtonLabel: string
    disabled?: boolean
    isCreating?: boolean
} & (
        | { onNew: () => void; newButtonHref?: never }
        | { newButtonHref: string; onNew?: never }
        | { onNew?: never; newButtonHref?: never }
    )

export const EntityHeader = ({ title, description, newButtonLabel, disabled, isCreating, onNew, newButtonHref }: EntityHeaderProps) => {
    return (
        <div className="flex items-center justify-between gap-x-4">
            <div className="flex flex-col gap-y-1">
                <h1 className="text-lg md:text-xl font-semibold">{title}</h1>
                {
                    description && <p className="text-xs md:text-sm text-muted-foreground">{description}</p>
                }
            </div>
            {
                onNew && !newButtonHref && (
                    <Button disabled={disabled || isCreating} onClick={onNew} size="sm">
                        <PlusIcon />
                        {newButtonLabel}
                    </Button>
                )
            }
            {
                newButtonHref && !onNew && (
                    <Button asChild size="sm">
                        <Link href={newButtonHref} prefetch>
                            <PlusIcon />
                            {newButtonLabel}
                        </Link>
                    </Button>
                )
            }
        </div>
    )
}

type EntityContainerProps = {
    children: React.ReactNode
    header?: React.ReactNode
    search?: React.ReactNode
    pagination?: React.ReactNode
}

export const EntityContainer = ({ header, search, pagination, children }: EntityContainerProps) => {
    return (
        <div className="p-4 md:px-10 md:py-6 h-full">
            <div className="mx-auto max-w-7xl w-full flex flex-col justify-between gap-y-8 h-full">
                <div className="flex flex-col gap-6">
                    {header}
                    {search}
                </div>
                <div className="overflow-x-auto">
                    {children}
                </div>
                {pagination}
            </div>
        </div>
    )
}

interface EntitySearchProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
}

export const EntitySearch = ({ value, onChange, placeholder }: EntitySearchProps) => {
    return (
        <div className="relative ml-auto">
            <SearchIcon className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
                className="max-w-[200px] bg-background shadow-none border-border pl-8"
                placeholder={placeholder || "Search..."}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    )
}

interface EntityPaginationProps {
    page: number
    totalPages: number
    onPageChange: (page: number) => void
    disabled?: boolean
}

export const EntityPagination = ({ page, totalPages, onPageChange, disabled }: EntityPaginationProps) => {
    return (
        <div className="flex items-center justify-center gap-x-2 w-full">
            <div className="flex-1 text-sm text-muted-foreground">
                Page {page} of {totalPages || 1}
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    disabled={disabled || page <= 1}
                    variant="outline"
                    onClick={() => onPageChange(Math.max(page - 1, 1))}
                    size="sm"
                >
                    Previous
                </Button>
                <Button
                    disabled={disabled || page >= totalPages || totalPages === 0}
                    variant="outline"
                    onClick={() => onPageChange(Math.min(page + 1, totalPages))}
                    size="sm"
                >
                    Next
                </Button>
            </div>
        </div>
    )
}

interface StateViewProps {
    message?: string
}

export const LoadingView = ({ message }: StateViewProps) => {
    return (
        <div className="flex justify-center items-center h-full flex-1 flex-col gap-y-4">
            <Loader2Icon className="animate-spin size-6 text-primary" />
            {Boolean(message) && <p className="text-sm text-muted-foreground">
                {message}
            </p>}
        </div>
    )
}

export const ErrorView = ({ message }: StateViewProps) => {
    return (
        <div className="flex justify-center items-center h-full flex-1 flex-col gap-y-4">
            <AlertTriangleIcon className="size-6 text-primary" />
            {Boolean(message) && <p className="text-sm text-muted-foreground">
                {message}
            </p>}
        </div>
    )
}

interface EmptyViewProps extends StateViewProps {
    onNew?: () => void
}

export const EmptyView = ({ message, onNew }: EmptyViewProps) => {
    return (
        <Empty className="border border-dashed bg-white">
            <EmptyHeader>
                <EmptyMedia variant={'icon'}>
                    <PackageOpenIcon />
                </EmptyMedia>
            </EmptyHeader>
            <EmptyTitle>
                No items
            </EmptyTitle>
            {
                Boolean(message) && (
                    <EmptyDescription>
                        {message}
                    </EmptyDescription>
                )
            }
            {
                !!onNew && (
                    <EmptyContent>
                        <Button onClick={onNew}>
                            Add item
                        </Button>
                    </EmptyContent>
                )
            }
        </Empty>
    )
}

interface EntityListProps<T> {
    items: T[]
    renderItem: (item: T) => React.ReactNode
    getKey?: (item: T, index: number) => string | number
    emptyView?: React.ReactNode
    className?: string
}

export const EntityList = <T,>({ items, renderItem, getKey, emptyView, className }: EntityListProps<T>) => {
    if (items.length === 0 && emptyView) {
        return (
            <div className="flex-1 flex justify-center items-center">
                <div className="max-w-sm mx-auto">{emptyView}</div>
            </div>
        )
    }

    return (
        <div className={
            cn(
                "flex flex-col gap-y-4",
                className
            )
        }>
            {
                items.map((item, index) => (
                    <div key={getKey ? getKey(item, index) : index}>
                        {renderItem(item)}
                    </div>
                ))
            }
        </div>
    )
}

interface EntityItemProps {
    href: string
    title: string
    subtitle?: React.ReactNode
    image?: React.ReactNode
    actions?: React.ReactNode
    onRemove?: () => void | Promise<void>
    isRemoving?: boolean
    className?: string
}

export const EntityItem = ({ href, title, subtitle, image, actions, onRemove, isRemoving, className }: EntityItemProps) => {
    const handleRemove = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (isRemoving) return
        await onRemove?.()
    }

    return (
        <Link href={href} prefetch>
            <Card
                className={
                    cn(
                        "p-4 shadow-none hover:shadow cursor-pointer",
                        isRemoving && "opacity-50 cursor-not-allowed",
                        className
                    )
                }
            >
                <CardContent className="flex flex-row items-center justify-between p-0">
                    <div className="flex items-center gap-3">
                        {image}
                        <div>
                            <CardTitle className="text-base font-medium">
                                {title}
                            </CardTitle>
                            {
                                !!subtitle && (
                                    <CardDescription className="text-xs">
                                        {subtitle}
                                    </CardDescription>
                                )
                            }
                        </div>
                    </div>

                    {
                        (actions || onRemove) && (
                            <div className="flex gap-x-4 items-center">
                                {actions}
                                {
                                    onRemove && (
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    size={'icon'}
                                                    variant={"ghost"}
                                                    onClick={
                                                        e => {
                                                            e.stopPropagation()
                                                        }
                                                    }
                                                >
                                                    <MoreVerticalIcon className="size-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent
                                                align="end"
                                                onClick={
                                                    e => {
                                                        e.stopPropagation()
                                                    }
                                                }
                                            >
                                                <DropdownMenuItem onClick={handleRemove}>
                                                    <TrashIcon className="size-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    )
                                }
                            </div>
                        )
                    }
                </CardContent>
            </Card>
        </Link>
    )
}

