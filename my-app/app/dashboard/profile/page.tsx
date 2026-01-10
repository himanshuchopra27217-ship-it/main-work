import { redirect } from "next/navigation"
import { getSession, getUserProfile } from "@/lib/auth"
import { ProfileEditForm } from "@/components/profile-edit-form"

export default async function ProfilePage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  const profile = await getUserProfile(session.userId)

  if (!profile) {
    redirect("/dashboard/my-jobs/setup")
  }

  // Convert MongoDB ObjectId to plain object for client component
  const plainProfile = {
    _id: profile._id?.toString(),
    userId: profile.userId,
    category: profile.category,
    age: profile.age,
    mobile: profile.mobile,
    profilePhoto: profile.profilePhoto,
    createdAt: profile.createdAt,
    updatedAt: profile.updatedAt,
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground mt-2">Manage your profile information</p>
      </div>

      <ProfileEditForm profile={plainProfile} />
    </div>
  )
}