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

    // Check if job is still open
    if (job.status !== "open") {
      return NextResponse.json({ error: "Job is no longer available" }, { status: 400 })
    }

    // Check if user is trying to accept their own job
    if (job.createdBy === session.userId) {
      return NextResponse.json({ error: "You cannot accept your own job" }, { status: 400 })
    }

    // Assign job to user
    const updatedJob = await updateJob(jobId, {
      assignedTo: session.userId,
      status: "assigned",
      assignedAt: new Date().toISOString(),
    })

    if (!updatedJob) {
      return NextResponse.json({ error: "Failed to accept job" }, { status: 500 })
    }

    return NextResponse.json({ message: "Job accepted successfully", job: updatedJob })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
