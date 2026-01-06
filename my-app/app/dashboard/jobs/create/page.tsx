import { redirect } from "next/navigation"
import { getSession, getUserProfile } from "@/lib/auth"
import { JobCreateForm } from "@/components/job-create-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function CreateJobPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  const profile = await getUserProfile(session.userId)

  if (!profile) {
    redirect("/dashboard/profile/setup")
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Create Job Post</h1>
        <p className="text-muted-foreground mt-2">Post a new job opportunity in your category</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
          <CardDescription>Fill in the information about the job you want to post</CardDescription>
        </CardHeader>
        <CardContent>
          <JobCreateForm userId={session.userId} userCategory={profile.category} />
        </CardContent>
      </Card>
    </div>
  )
}
