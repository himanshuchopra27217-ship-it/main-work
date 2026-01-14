"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function UpdateMobileForm() {
  const [mobile, setMobile] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)
    try {
      const res = await fetch("/api/auth/change-mobile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ newMobile: mobile })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to update mobile")
      setSuccess("Mobile number updated successfully")
      setMobile("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Mobile Number</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4 max-w-md">
          <div className="space-y-2">
            <Label htmlFor="mobile">New Mobile</Label>
            <Input id="mobile" type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} required placeholder="0123456789" />
            <p className="text-xs text-muted-foreground">Enter 10 digits (0-9)</p>
          </div>
          {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}
          {success && <div className="text-sm text-green-600 bg-green-100 p-3 rounded-md">{success}</div>}
          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>{loading ? "Updating..." : "Update Mobile"}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
