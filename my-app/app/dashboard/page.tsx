import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { getJobsByUser, getAssignedJobsByUser, getAvailableJobsByCategory, getUserProfile } from "@/lib/db"
import { db } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Briefcase, Users, Plus, Search, User } from "lucide-react"
import Link from "next/link"
import RecentJobs from "@/components/recent-jobs"

export default async function DashboardPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  const profile = await getUserProfile(session.userId)

  if (!profile) {
    redirect("/dashboard/my-jobs/setup")
  }

  const user = await db.findUserById(session.userId)

  if (!user) {
    redirect("/login")
  }

  // Get some stats for the dashboard
  const createdJobs = await getJobsByUser(session.userId)
  const assignedJobs = await getAssignedJobsByUser(session.userId)
  const userCategories = profile.categories || (profile.category ? [profile.category] : [])
  const availableJobs = userCategories.length > 0 ? await getAvailableJobsByCategory(userCategories[0], session.userId) : []

  const stats = {
    postedJobs: createdJobs.length,
    acceptedJobs: assignedJobs.length,
    availableJobs: availableJobs.length,
  }

  return (
    <div>
      <div className="space-y-8 max-w-6xl">
          {/* Welcome Section */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome back, {user.name}!
            </h1>
            <p className="text-muted-foreground mt-2">
              {profile.role === 'worker' 
                ? `Find work opportunities in your selected categories.`
                : `Here's an overview of your job activity.`
              }
            </p>
          {profile.role === 'worker' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Find Work
                </CardTitle>
                <CardDescription>
                  Browse and accept available jobs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button asChild className="w-full">
                  <Link href="/dashboard/jobs">
                    Browse Jobs
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/dashboard/switch-role?to=hiring">
                    Publish Your Work
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}

          </div>

          {/* Stats */}
          <div className="grid gap-6 grid-cols-2">
            {profile.role !== 'worker' && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Jobs Posted</CardTitle>
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.postedJobs}</div>
                  <p className="text-xs text-muted-foreground">
                    Jobs you've created
                  </p>
                </CardContent>
              </Card>
            )}

            <Link href="/dashboard/my-jobs?view=accepted">
            <Card className="hover:shadow-md transition">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Jobs Accepted</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.acceptedJobs}</div>
                <p className="text-xs text-muted-foreground">
                  Jobs you're working on
                </p>
              </CardContent>
            </Card>
            </Link>
          </div>

          {/* Recent Jobs - full width column */}
          <RecentJobs categories={userCategories} />

          {/* Quick Actions - fixed 2 columns per row */}
          <div className="grid gap-6 grid-cols-2">
            {profile.role !== 'worker' && (
              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Job Management
                  </CardTitle>
                  <CardDescription>
                    Create and manage your job postings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button asChild className="w-full">
                    <Link href="/dashboard/jobs/create">
                      <Plus className="h-4 w-4 mr-2" />
                      Post Your Work
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/dashboard/my-jobs">
                      View My Jobs
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" size="sm" className="w-full">
                    <Link href="/dashboard/switch-role?to=worker">
                      Switch to Worker Mode
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
            {/* Worker quick action moved to top grid */}
          </div>

          {/* Profile Status */}
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Status
              </CardTitle>
              <CardDescription>
                Your profile information and category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Categories</p>
                  <div className="flex flex-wrap gap-1">
                    {(profile.categories || (profile.category ? [profile.category] : [])).map((cat: string) => (
                      <span key={cat} className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-secondary text-secondary-foreground">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
                <Button asChild variant="outline">
                  <Link href="/dashboard/my-jobs/profile/edit">
                    Edit Profile
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
      </div>
    </div>
  )
}