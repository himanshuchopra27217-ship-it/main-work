import { NextResponse } from "next/server"
import { jobPosts } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, category, title, description } = body

    if (!userId || !category || !title || !description) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    const newJob = {
      id: Date.now().toString(),
      title,
      description,
      category,
      createdBy: userId,
      assignedTo: null,
      status: "open",
      createdAt: new Date().toISOString(),
    }

    jobPosts.push(newJob)

    return NextResponse.json({ message: "Job created successfully", job: newJob }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
