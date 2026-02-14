import { WorkflowsList } from "@/features/workflows/components/workflows"
import { requireAuth } from "@/lib/auth-utils"

const Page = async () => {
  await requireAuth()

  return <WorkflowsList />
}

export default Page
