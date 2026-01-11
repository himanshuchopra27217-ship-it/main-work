import { NextResponse } from "next/server"
import { createJob } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, category, subCategory, title, description, budget, mobile, city, status, workPhoto, workDate, location } = body

    if (!userId || !category || !title || !description || !budget || !mobile || !city || !workDate) {
      return NextResponse.json({ error: "Required fields are missing" }, { status: 400 })
    }

    const newJob = await createJob({
      title,
      description,
      category,
      subCategory: subCategory || undefined,
      createdBy: userId,
      assignedTo: null,
      status: status || "open",
      budget: parseFloat(budget),
      mobile,
      city,
      workPhoto: workPhoto || undefined,
      workDate,
      location: location || undefined,
      createdAt: new Date().toISOString(),
    })

    return NextResponse.json({ message: "Job created successfully", job: newJob }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
