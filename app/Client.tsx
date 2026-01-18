'use client'

import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'
import { useTRPC } from '@/trpc/client'
import { useMutation, useSuspenseQuery } from '@tanstack/react-query'

export const Client = () => {
    const trpc = useTRPC()
    const { data: session } = authClient.useSession()
    const { data } = useSuspenseQuery(trpc.getUsers.queryOptions())
    const testAi = useMutation(trpc.testAi.mutationOptions())
    if (!data) return <div>Loading...</div>
    return <div className='flex flex-col gap-6'>
        {
            JSON.stringify(session, null, 2)
        }
        <Button onClick={async () => {
            const result = await testAi.mutate()
        }}>
            Test AI
        </Button>
        {
            session && <Button onClick={async () => {
                await authClient.signOut()
            }}>
                Sign Out
            </Button>
        }
    </div>
}