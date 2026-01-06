import { cookies } from "next/headers"
import { users, profiles } from "@/lib/db"

export async function getSession() {
  const cookieStore = await cookies()
  const session = cookieStore.get("session")
  const userId = cookieStore.get("userId")

  if (!session || !userId) {
    return null
  }

  return {
    sessionToken: session.value,
    userId: userId.value,
  }
}

export async function requireAuth() {
  const session = await getSession()

  if (!session) {
    throw new Error("Unauthorized")
  }

  return session
}

export async function getUserData(userId: string) {
  const user = users.find((u) => u.id === userId)

  if (!user) {
    return null
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    mobile: user.mobile,
  }
}

export async function getUserProfile(userId: string) {
  const profile = profiles.find((p) => p.userId === userId)
  return profile || null
}
