'use client'

import { useTRPC } from '@/trpc/client'
import { useQuery, useSuspenseQuery } from '@tanstack/react-query'

export function Client() {
    const trpc = useTRPC()
    const { data } = useSuspenseQuery(trpc.getUsers.queryOptions())
    if (!data) return <div>Loading...</div>
    return <div>{JSON.stringify(data, null, 2)}</div>
}