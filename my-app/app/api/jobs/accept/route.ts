import { NextResponse } from "next/server"
import { jobPosts } from "@/lib/db"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get("userId")?.value

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { jobId } = body

    if (!jobId) {
      return NextResponse.json({ error: "Job ID is required" }, { status: 400 })
    }

    const jobIndex = jobPosts.findIndex((job) => job.id === jobId)

    if (jobIndex === -1) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    const job = jobPosts[jobIndex]

    // Check if job is still open
    if (job.status !== "open") {
      return NextResponse.json({ error: "Job is no longer available" }, { status: 400 })
    }

    // Check if user is trying to accept their own job
    if (job.createdBy === userId) {
      return NextResponse.json({ error: "You cannot accept your own job" }, { status: 400 })
    }

    // Assign job to user
    jobPosts[jobIndex] = {
      ...job,
      assignedTo: userId,
      status: "assigned",
      assignedAt: new Date().toISOString(),
    }

    return NextResponse.json({ message: "Job accepted successfully", job: jobPosts[jobIndex] })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
