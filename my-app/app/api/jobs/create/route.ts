import { NextResponse } from "next/server"
import { createJob } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, category, title, description, budget, location, priority, deadline } = body

    if (!userId || !category || !title || !description) {
      return NextResponse.json({ error: "Required fields are missing" }, { status: 400 })
    }

    const newJob = await createJob({
      title,
      description,
      category,
      createdBy: userId,
      assignedTo: null,
      status: "open",
      budget: budget || undefined,
      location: location || undefined,
      priority: priority || "medium",
      deadline: deadline || undefined,
      createdAt: new Date().toISOString(),
    })

    return NextResponse.json({ message: "Job created successfully", job: newJob }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
