import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { validateMobile } from "@/lib/validation"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { newMobile } = body || {}

    if (!newMobile || typeof newMobile !== "string") {
      return NextResponse.json({ error: "New mobile is required" }, { status: 400 })
    }

    if (!validateMobile(newMobile)) {
      return NextResponse.json({ error: "Invalid mobile format (10 digits)" }, { status: 400 })
    }

    const existing = await db.findUserByMobile(newMobile)
    if (existing && existing._id?.toString() !== session.userId) {
      return NextResponse.json({ error: "Mobile already in use" }, { status: 409 })
    }

    const updated = await db.updateUser(session.userId, { mobile: newMobile })
    if (!updated) {
      return NextResponse.json({ error: "Failed to update mobile" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
