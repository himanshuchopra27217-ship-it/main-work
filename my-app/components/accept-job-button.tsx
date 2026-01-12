"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Phone } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface AcceptJobButtonProps {
  jobId: string
  mobile?: string
}

export function AcceptJobButton({ jobId, mobile }: AcceptJobButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleAccept = async () => {
    setLoading(true)

    try {
      const response = await fetch("/api/jobs/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ jobId }),
      })

      if (!response.ok) {
        throw new Error("Failed to accept job")
      }

      router.push("/dashboard/my-jobs")
      router.refresh()
    } catch (error) {
      console.error("Accept job error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="lg" className="gap-2">
          <CheckCircle2 className="h-4 w-4" />
          Accept Job
        </Button>
      </AlertDialogTrigger>
        <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Accept Job</AlertDialogTitle>
          <AlertDialogDescription>
            <div className="space-y-2">
              <p>Are you sure you want to accept this job? Once accepted, it will be assigned to you and hidden from other workers.</p>
              {mobile && (
                <div className="bg-muted p-3 rounded-md">
                  <p className="text-sm font-medium">Contact Information:</p>
                  <p className="text-sm flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {mobile}
                  </p>
                </div>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleAccept} disabled={loading}>
            {loading ? "Accepting..." : "Confirm"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
