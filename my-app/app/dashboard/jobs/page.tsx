import { redirect } from "next/navigation"
import { getSession, getUserProfile } from "@/lib/auth"
import { getAllAvailableJobs, getAvailableJobsByCategory } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Briefcase, Calendar, User, MapPin, Phone } from "lucide-react"
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

  // Only workers can browse jobs
  if (profile.role !== "worker" && profile.role !== "admin") {
    redirect("/dashboard")
  }

  const userCategories = profile.categories || (profile.category ? [profile.category] : [])
  
  // Get jobs from user's categories
  let availableJobs: any[] = []
  if (userCategories.length > 0) {
    // Get jobs from all user categories
    const jobsPromises = userCategories.map(category => getAvailableJobsByCategory(category, session.userId))
    const jobsArrays = await Promise.all(jobsPromises)
    // Flatten and remove duplicates
    const allJobs = jobsArrays.flat()
    const uniqueJobs = allJobs.filter((job, index, self) => 
      index === self.findIndex(j => j._id === job._id)
    )
    availableJobs = uniqueJobs
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Job Opportunities</h1>
        <p className="text-muted-foreground mt-2">
          Browse all available job opportunities
        </p>
      </div>

      {availableJobs.length === 0 ? (
        <Card >
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Briefcase className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Jobs Available</h3>
            <p className="text-muted-foreground text-center max-w-md">
              There are currently no open job posts in your selected categories. Check back
              later or consider posting your own job.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {availableJobs.map((job: any) => {
            const jobId = (job._id?.toString?.() ?? job._id ?? job.id) as string
            const isCreator = job.createdBy === session.userId
            return (
            <Card key={jobId} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-2xl">{job.title}</CardTitle>
                      <Badge variant={job.status === 'open' ? 'default' : 'secondary'}>
                        {job.status === 'open' ? 'Open' : 'Closed'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span className="font-medium">{job.category}</span>
                      {job.subCategory && <span>• {job.subCategory}</span>}
                    </div>
                    <CardDescription className="text-base leading-relaxed">{job.description}</CardDescription>
                  </div>
                  {job.workPhoto && (
                    <img
                      src={job.workPhoto}
                      alt="Work photo"
                      className="w-20 h-20 rounded-lg object-cover border"
                    />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{job.city}{job.location && `, ${job.location}`}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Work Date: {new Date(job.workDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-lg font-semibold text-primary">
                      ₹{job.budget?.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Posted {new Date(job.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Job ID: {job.id?.slice(-6) || 'N/A'}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  {!isCreator && <AcceptJobButton jobId={jobId} />}
                </div>
              </CardContent>
            </Card>
          )})}
        </div>
      )}
    </div>
  )
}
