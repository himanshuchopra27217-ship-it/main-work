import { redirect } from "next/navigation"
import type { ReactNode } from "react"
import { getSession, getUserProfile } from "@/lib/auth"
import { findUserById } from "@/lib/db"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardNav } from "@/components/dashboard-nav"

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await getSession()
  if (!session) {
    redirect("/login")
  }

  const profile = await getUserProfile(session.userId)
  const user = await findUserById(session.userId)

  const headerUser = {
    name: user?.name || (session.email?.split("@")[0] ?? "User"),
    email: user?.email || session.email,
  }

  const role = profile?.role

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={headerUser} />
      <div className="container mx-auto max-w-7xl px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[16rem_1fr] gap-6">
          <div className="hidden lg:block lg:sticky lg:top-20 self-start">
            <DashboardNav userRole={role} />
          </div>
          <main className="min-w-0" role="main" aria-label="Dashboard content">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
