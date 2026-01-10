import { NextResponse } from "next/server"
import { getAvailableJobsByCategory, getUserProfile } from "@/lib/db"
import { cookies } from "next/headers"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get("userId")?.value

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user's profile to know their category
    const userProfile = await getUserProfile(userId)

    if (!userProfile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    // Get available jobs by category
    const availableJobs = await getAvailableJobsByCategory(userProfile.category, userId)

    return NextResponse.json({ jobs: availableJobs })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
