import { redirect } from "next/navigation"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { getSession, getUserProfile } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { ProfileEditForm } from "@/components/profile-edit-form"
import { UpdateEmailForm } from "@/components/update-email-form"
import { UpdateMobileForm } from "@/components/update-mobile-form"

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
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Button variant="outline" asChild>
          <Link href="/dashboard/profile">
            <ChevronLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Edit Profile</h1>
        <p className="text-muted-foreground mt-2">Update your professional information</p>
      </div>

      <div className="max-w-2xl space-y-8">
        <ProfileEditForm profile={profile} />

        <div>
          <h2 className="text-xl font-semibold mb-2">Account</h2>
          <p className="text-muted-foreground mb-4">Update your login email and phone number</p>
          <div className="grid gap-6">
            <UpdateEmailForm />
            <UpdateMobileForm />
          </div>
        </div>
      </div>
    </div>
  )
}
