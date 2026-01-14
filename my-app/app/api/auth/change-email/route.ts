import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { validateEmail } from "@/lib/validation"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { newEmail } = body || {}

    if (!newEmail || typeof newEmail !== "string") {
      return NextResponse.json({ error: "New email is required" }, { status: 400 })
    }

    if (!validateEmail(newEmail)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    const existing = await db.findUserByEmail(newEmail)
    if (existing && existing._id?.toString() !== session.userId) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 })
    }

    const updated = await db.updateUser(session.userId, { email: newEmail })
    if (!updated) {
      return NextResponse.json({ error: "Failed to update email" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
