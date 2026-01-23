import { AppHeader } from '@/components/app-header'
import { PropsWithChildren } from 'react'

const layout = ({ children }: PropsWithChildren) => {
    return (
        <>
            <AppHeader />
            <main className='flex-1'>
                {children}
            </main>
        </>
    )
}

export default layout