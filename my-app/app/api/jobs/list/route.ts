import { NextResponse } from "next/server"
import { jobPosts, profiles } from "@/lib/db"
import { cookies } from "next/headers"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get("userId")?.value

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user's profile to know their category
    const userProfile = profiles.find((p) => p.userId === userId)

    if (!userProfile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    // Filter jobs by category and status
    const availableJobs = jobPosts.filter(
      (job) => job.category === userProfile.category && job.status === "open" && job.createdBy !== userId,
    )

    return NextResponse.json({ jobs: availableJobs })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
