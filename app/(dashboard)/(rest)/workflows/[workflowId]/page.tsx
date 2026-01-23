
interface PageProps {
    params: Promise<{ workflowId: string }>
}

const Page = async ({ params }: PageProps) => {

    const { workflowId } = await params

    return (
        <div>
            Workflow ID Page with ID: {workflowId}
        </div>
    )
}

export default Page