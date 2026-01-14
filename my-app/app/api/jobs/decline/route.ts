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
    const { jobId, reason } = body

    if (!jobId) {
      return NextResponse.json({ error: "Job ID is required" }, { status: 400 })
    }

    const job = await getJobById(jobId)

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    // Only the assigned worker can decline
    if (job.assignedTo !== session.userId || job.status !== "assigned") {
      return NextResponse.json({ error: "You can't decline this job" }, { status: 400 })
    }

    const declineRecord = {
      userId: session.userId,
      reason: (reason || "").toString().slice(0, 500),
      at: new Date().toISOString(),
    }

    const updatedJob = await updateJob(jobId, {
      assignedTo: null,
      assignedAt: null,
      status: "open",
      declineHistory: [...(job.declineHistory || []), declineRecord],
    })

    if (!updatedJob) {
      return NextResponse.json({ error: "Failed to decline job" }, { status: 500 })
    }

    return NextResponse.json({ message: "Job declined", job: updatedJob })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
