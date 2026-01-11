"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface SwitchRoleFormProps {
  currentRole: string
  targetRole: string
}

export function SwitchRoleForm({ currentRole, targetRole }: SwitchRoleFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSwitchRole = async () => {
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/switch-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetRole }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to switch role")
      }

      router.push("/dashboard")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border p-6">
        <h2 className="text-lg font-semibold mb-2">
          Current Role: {currentRole === 'worker' ? 'Worker' : 'Hiring Manager'}
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          {currentRole === 'worker'
            ? "You can browse and accept jobs in your category."
            : "You can post jobs and manage your projects."
          }
        </p>

        <h2 className="text-lg font-semibold mb-2">
          New Role: {targetRole === 'worker' ? 'Worker' : 'Hiring Manager'}
        </h2>
        <p className="text-sm text-muted-foreground">
          {targetRole === 'worker'
            ? "You will be able to browse and accept jobs in your category."
            : "You will be able to post jobs and manage your projects."
          }
        </p>
      </div>

      {error && (
        <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
          {error}
        </div>
      )}

      <div className="flex gap-4">
        <Button
          onClick={handleSwitchRole}
          disabled={loading}
          className="flex-1"
        >
          {loading ? "Switching..." : `Confirm Switch to ${targetRole === 'hiring' ? 'Hiring' : 'Worker'} Mode`}
        </Button>

        <Button
          variant="outline"
          onClick={() => router.push("/dashboard")}
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}