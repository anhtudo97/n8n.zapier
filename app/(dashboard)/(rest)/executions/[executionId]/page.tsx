
interface PageProps {
    params: Promise<{ executionId: string }>
}

const Page = async ({ params }: PageProps) => {

    const { executionId } = await params

    return (
        <div>
            Execution ID Page with ID: {executionId}
        </div>
    )
}

export default Page