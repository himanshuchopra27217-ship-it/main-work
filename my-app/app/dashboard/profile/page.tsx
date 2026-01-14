import { redirect } from "next/navigation"
import { getSession, getUserProfile } from "@/lib/auth"
import { ProfilePreview } from "@/components/profile-preview"
import { UpdatePasswordForm } from "@/components/update-password-form"

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
    role: profile.role,
    category: profile.category,
    categories: profile.categories,
    age: profile.age,
    mobile: profile.mobile,
    profilePhoto: profile.profilePhoto,
    bio: profile.bio,
    skills: profile.skills,
    experience: profile.experience,
    createdAt: profile.createdAt,
    updatedAt: profile.updatedAt,
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground mt-2">Manage your profile information</p>
      </div>

      <ProfilePreview profile={plainProfile} />

      <UpdatePasswordForm />
    </div>
  )
}