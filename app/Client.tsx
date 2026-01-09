'use client'

import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'
import { useTRPC } from '@/trpc/client'
import { useSuspenseQuery } from '@tanstack/react-query'

export const Client = () => {
    const trpc = useTRPC()
    const { data: session } = authClient.useSession()
    const { data } = useSuspenseQuery(trpc.getUsers.queryOptions())
    if (!data) return <div>Loading...</div>
    return <div>
        {
            JSON.stringify(session, null, 2)
        }
        {
            session && <Button onClick={async () => {
                await authClient.signOut()
            }}>
                Sign Out
            </Button>
        }
    </div>
}