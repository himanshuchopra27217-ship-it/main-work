import Link from "next/link"
import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { getJobById } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AcceptJobButton } from "@/components/accept-job-button"
import { DeclineJobButton } from "@/components/decline-job-button"
import { ChevronLeft, MapPin, IndianRupee, CalendarDays, Phone } from "lucide-react"

export default async function JobDetailPage({ params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session) redirect("/login")

  const job = await getJobById(params.id)
  if (!job) redirect("/dashboard/jobs")

  const isAssignedToMe = job.assignedTo === session.userId
  const isOpen = job.status === "open"
  const isAssigned = job.status === "assigned"
  const isCompleted = job.status === "completed"
  const isCancelled = job.status === "cancelled"
  const isCreator = job.createdBy === session.userId

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="outline" asChild>
          <Link href="/dashboard/jobs">
            <ChevronLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{job.title}</span>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="capitalize">{job.category}</Badge>
              <Badge className="capitalize" variant={isOpen ? "default" : isAssigned ? "secondary" : isCompleted ? "outline" : "destructive"}>
                {isOpen ? "Open" : isAssigned ? "Assigned" : isCompleted ? "Completed" : isCancelled ? "Cancelled" : job.status}
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {job.description && (
            <div>
              <div className="text-xs text-muted-foreground mb-1">Description</div>
              <p className="text-sm leading-relaxed">{job.description}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4" />
              <span>{job.city || job.location || "—"}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <IndianRupee className="h-4 w-4" />
              <span>{typeof job.budget === "number" ? job.budget : "—"}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CalendarDays className="h-4 w-4" />
              <span>{job.workDate || "—"}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4" />
              <span>{isAssignedToMe ? (job.mobile || "—") : "Hidden until accepted"}</span>
            </div>
          </div>

          {Array.isArray(job.workPhotos) && job.workPhotos.length > 0 ? (
            <div>
              <div className="text-xs text-muted-foreground mb-1">Work Photos</div>
              <div className="flex flex-wrap gap-2">
                {job.workPhotos.map((src: string, idx: number) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={idx} src={src} alt={`Work ${idx + 1}`} className="rounded-md border max-h-40" />
                ))}
              </div>
            </div>
          ) : job.workPhoto ? (
            <div>
              <div className="text-xs text-muted-foreground mb-1">Work Photo</div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={job.workPhoto} alt="Work" className="rounded-md border max-h-64" />
            </div>
          ) : null}

          <div className="flex items-center justify-end gap-3">
            {isOpen && !isCreator && (
              <AcceptJobButton jobId={job._id?.toString() || params.id} />
            )}
            {isAssignedToMe && isAssigned && (
              <DeclineJobButton jobId={job._id?.toString() || params.id} />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
