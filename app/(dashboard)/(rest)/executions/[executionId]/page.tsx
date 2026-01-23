import { requireAuth } from "@/lib/auth-utils"

interface PageProps {
    params: Promise<{ executionId: string }>
}

const Page = async ({ params }: PageProps) => {
    await requireAuth()
    const { executionId } = await params

    return (
        <div>
            Execution ID Page with ID: {executionId}
        </div>
    )
}

export default Page