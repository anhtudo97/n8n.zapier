import { PlusIcon } from 'lucide-react'
import { Button } from './ui/button'
import Link from 'next/link'

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
