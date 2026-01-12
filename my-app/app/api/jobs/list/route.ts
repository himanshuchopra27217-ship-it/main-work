import { NextResponse } from "next/server"
import { getAvailableJobsByCategory, getUserProfile } from "@/lib/db"
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

    // Get available jobs by categories
    const userCategories = userProfile.categories || (userProfile.category ? [userProfile.category] : [])
    let availableJobs: any[] = []
    
    if (userCategories.length > 0) {
      // Get jobs from all user categories
      const jobsPromises = userCategories.map(category => getAvailableJobsByCategory(category, session.userId))
      const jobsArrays = await Promise.all(jobsPromises)
      // Flatten and remove duplicates
      const allJobs = jobsArrays.flat()
      availableJobs = allJobs.filter((job, index, self) => 
        index === self.findIndex(j => j._id === job._id)
      )
    }

    return NextResponse.json({ jobs: availableJobs })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
