import { redirect } from "next/navigation"
import { getSession, getUserProfile } from "@/lib/auth"
import { getAvailableJobsByCategory } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Briefcase, Calendar, User } from "lucide-react"
import { AcceptJobButton } from "@/components/accept-job-button"

export default async function BrowseJobsPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  const profile = await getUserProfile(session.userId)

  if (!profile) {
    redirect("/dashboard/profile/setup")
  }

  const availableJobs = await getAvailableJobsByCategory(profile.category, session.userId)

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Available Jobs</h1>
        <p className="text-muted-foreground mt-2">
          Browse job opportunities in your category: <strong>{profile.category}</strong>
        </p>
      </div>

      {availableJobs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Briefcase className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Jobs Available</h3>
            <p className="text-muted-foreground text-center max-w-md">
              There are currently no open job posts in the <strong>{profile.category}</strong> category. Check back
              later or consider posting your own job.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {availableJobs.map((job: any) => (
            <Card key={job.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-2xl">{job.title}</CardTitle>
                      <Badge variant="default">Open</Badge>
                    </div>
                    <CardDescription className="text-base leading-relaxed mt-3">{job.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      <span>{job.category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>Job ID: {job.id.slice(-6)}</span>
                    </div>
                  </div>

                  <AcceptJobButton jobId={job.id} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
