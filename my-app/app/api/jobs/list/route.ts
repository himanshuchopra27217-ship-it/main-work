import { NextResponse } from "next/server"
import { getAvailableJobsByCategory, getUserProfile, getJobsByUser } from "@/lib/db"
import { getSession } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user's profile to know their category
    const userProfile = await getUserProfile(session.userId)

    if (!userProfile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    let jobs: any[] = []

    if (userProfile.role === "hiring" || userProfile.role === "admin") {
      // For hiring/admin: show their posted jobs
      jobs = await getJobsByUser(session.userId)
    } else {
      // For workers: show available jobs by categories
      const userCategories = userProfile.categories || (userProfile.category ? [userProfile.category] : [])
      if (userCategories.length > 0) {
        const jobsPromises = userCategories.map(category => getAvailableJobsByCategory(category, session.userId))
        const jobsArrays = await Promise.all(jobsPromises)
        const allJobs = jobsArrays.flat()
        jobs = allJobs.filter((job, index, self) => index === self.findIndex(j => j._id === job._id))
      }
    }

    // Hide sensitive fields and normalize ids to strings for client routing
    const safeJobs = jobs.map((job: any) => ({
      _id: job._id?.toString?.() ?? job._id ?? job.id,
      title: job.title,
      description: job.description,
      category: job.category,
      city: job.city,
      budget: job.budget,
      createdAt: job.createdAt,
      status: job.status,
      workDate: job.workDate,
      // mobile intentionally omitted
    }))

    return NextResponse.json({ jobs: safeJobs })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
