import { NextResponse } from "next/server"
import { jobPosts } from "@/lib/db"
import { cookies } from "next/headers"

export async function DELETE(request: Request) {
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

    // Check if user is the creator or assigned worker
    if (job.createdBy !== userId && job.assignedTo !== userId) {
      return NextResponse.json({ error: "You don't have permission to delete this job" }, { status: 403 })
    }

    // Delete the job
    jobPosts.splice(jobIndex, 1)

    return NextResponse.json({ message: "Job deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
