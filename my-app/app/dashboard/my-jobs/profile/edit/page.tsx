import { redirect } from "next/navigation"
import { getSession, getUserProfile } from "@/lib/auth"
import { ProfileEditForm } from "@/components/profile-edit-form"

export default async function ProfileEditPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  const profile = await getUserProfile(session.userId)

  if (!profile) {
    redirect("/dashboard/profile/setup")
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Edit Profile</h1>
        <p className="text-muted-foreground mt-2">Update your professional information</p>
      </div>

      <ProfileEditForm profile={profile} />
    </div>
  )
}
