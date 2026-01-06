import { redirect } from "next/navigation"
import { getSession, getUserProfile } from "@/lib/auth"
import { ProfileSetupForm } from "@/components/profile-setup-form"

export default async function ProfileSetupPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  const profile = await getUserProfile(session.userId)

  if (profile) {
    redirect("/dashboard/profile")
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Setup Your Profile</h1>
        <p className="text-muted-foreground mt-2">Complete your profile to start posting or accepting jobs</p>
      </div>

      <ProfileSetupForm userId={session.userId} />
    </div>
  )
}
