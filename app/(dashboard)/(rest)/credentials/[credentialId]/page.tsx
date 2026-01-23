import React from 'react'

interface PageProps {
    params: Promise<{ credentialId: string }>
}

const Page = async ({ params }: PageProps) => {
    
    const { credentialId } = await params

    return (
        <div>
            Credential ID Page with ID: {credentialId}
        </div>
    )
}

export default Page