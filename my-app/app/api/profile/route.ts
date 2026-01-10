import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { createProfile, updateProfile } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { userId, category, age, mobile, profilePhoto } = body

    // Validate required fields
    if (!category || !age || !mobile) {
      return NextResponse.json(
        { error: "Category, age, and mobile are required" },
        { status: 400 }
      )
    }

    // Validate userId matches session
    if (userId !== session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Create profile
    const profile = await createProfile({
      userId,
      category,
      age: parseInt(age),
      mobile,
      profilePhoto: profilePhoto || null,
    })

    return NextResponse.json({ success: true, profile })
  } catch (error) {
    console.error("Profile creation error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { userId, category, age, mobile, profilePhoto } = body

    // Validate required fields
    if (!category || !age || !mobile) {
      return NextResponse.json(
        { error: "Category, age, and mobile are required" },
        { status: 400 }
      )
    }

    // Validate userId matches session
    if (userId !== session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Update profile
    const profile = await updateProfile(userId, {
      category,
      age: parseInt(age),
      mobile,
      profilePhoto: profilePhoto || null,
    })

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, profile })
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}