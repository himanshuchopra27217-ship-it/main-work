import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { getUserProfile } from "@/lib/db"
import { SwitchRoleForm } from "@/components/switch-role-form"

interface SwitchRolePageProps {
  searchParams: Promise<{ to?: string }>
}

export default async function SwitchRolePage({ searchParams }: SwitchRolePageProps) {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  const profile = await getUserProfile(session.userId)

  if (!profile) {
    redirect("/dashboard/my-jobs/setup")
  }

  const params = await searchParams
  const targetRole = params.to === 'hiring' ? 'hiring' : 'worker'

  // If already the target role, redirect back to dashboard
  if (profile.role === targetRole) {
    redirect("/dashboard")
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Switch to {targetRole === 'hiring' ? 'Hiring' : 'Worker'} Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">
          {targetRole === 'hiring'
            ? "Switch to hiring mode to post jobs and find workers for your projects."
            : "Switch to worker mode to browse and accept available jobs."
          }
        </p>
      </div>

      <SwitchRoleForm currentRole={profile.role} targetRole={targetRole} />
    </div>
  )
}