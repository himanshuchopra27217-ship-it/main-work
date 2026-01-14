import { NextResponse } from "next/server"
import { getJobById, updateJob } from "@/lib/db"
import { getSession } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { jobId } = body

    if (!jobId) {
      return NextResponse.json({ error: "Job ID is required" }, { status: 400 })
    }

    const job = await getJobById(jobId)
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    // Only the hiring user (creator) can mark completed
    if (job.createdBy !== session.userId) {
      return NextResponse.json({ error: "Only the creator can complete this job" }, { status: 403 })
    }

    // Allow completion when assigned or open (optional), typically when assigned
    const updatedJob = await updateJob(jobId, {
      status: "completed",
      completedAt: new Date().toISOString(),
    })

    if (!updatedJob) {
      return NextResponse.json({ error: "Failed to complete job" }, { status: 500 })
    }

    return NextResponse.json({ message: "Job marked as completed", job: updatedJob })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
