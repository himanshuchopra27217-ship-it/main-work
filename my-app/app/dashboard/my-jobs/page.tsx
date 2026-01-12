import { redirect } from "next/navigation"
import { getSession, getUserProfile } from "@/lib/auth"
import { getJobsByUser, getAssignedJobsByUser } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Briefcase, Calendar, Phone } from "lucide-react"
import Link from "next/link"
import { DeleteJobButton } from "@/components/delete-job-button"

export default async function MyJobsPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  const profile = await getUserProfile(session.userId)

  if (!profile) {
    redirect("/dashboard/profile/setup")
  }

  const createdJobs = await getJobsByUser(session.userId)
  const assignedJobs = await getAssignedJobsByUser(session.userId)

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Jobs</h1>
        <p className="text-muted-foreground mt-2">Manage jobs you've posted and accepted</p>
      </div>

      {/* Jobs I Posted */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Jobs I Posted</h2>
          <Button asChild>
            <Link href="/dashboard/jobs/create">Create New Job</Link>
          </Button>
        </div>

        {createdJobs.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-center">You haven't posted any jobs yet</p>
              <Button asChild className="mt-4">
                <Link href="/dashboard/jobs/create">Post Your First Job</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {createdJobs.map((job: any) => (
              <Card key={job.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-xl">{job.title}</CardTitle>
                        <Badge variant={job.status === "open" ? "default" : "secondary"}>
                          {job.status === "open" ? "Open" : "Assigned"}
                        </Badge>
                      </div>
                      <CardDescription>{job.description}</CardDescription>
                    </div>
                    <DeleteJobButton jobId={job.id} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4" />
                      <span>{job.category}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Jobs I Accepted */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Jobs I Accepted</h2>

        {assignedJobs.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-center">You haven't accepted any jobs yet</p>
              <Button asChild variant="outline" className="mt-4 bg-transparent">
                <Link href="/dashboard/jobs">Browse Available Jobs</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {assignedJobs.map((job: any) => (
              <Card key={job.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-xl">{job.title}</CardTitle>
                        <Badge>Assigned to You</Badge>
                      </div>
                      <CardDescription>{job.description}</CardDescription>
                    </div>
                    <DeleteJobButton jobId={job.id} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4" />
                      <span>{job.category}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      <span>{job.mobile}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
