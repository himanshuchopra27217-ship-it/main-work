"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

type Job = {
  _id?: string
  title: string
  description?: string
  category: string
  city?: string
  budget?: number
  createdAt?: string
}

interface RecentJobsProps {
  categories: string[]
}

export default function RecentJobs({ categories }: RecentJobsProps) {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState<string>("all")

  useEffect(() => {
    let mounted = true
    setLoading(true)
    fetch("/api/jobs/list")
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return
        const list: Job[] = Array.isArray(data?.jobs) ? data.jobs : []
        setJobs(list)
      })
      .catch(() => setJobs([]))
      .finally(() => mounted && setLoading(false))
    return () => {
      mounted = false
    }
  }, [])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    const cat = category
    return jobs
      .filter((job) => (cat === "all" ? true : job.category === cat))
      .filter((job) =>
        q
          ? (job.title || "").toLowerCase().includes(q) || (job.description || "").toLowerCase().includes(q)
          : true,
      )
      .sort((a, b) => {
        const ad = a.createdAt ? Date.parse(a.createdAt) : 0
        const bd = b.createdAt ? Date.parse(b.createdAt) : 0
        return bd - ad
      })
      .slice(0, 6)
  }, [jobs, search, category])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Recent Jobs</span>
          <div className="flex gap-2">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Search jobs"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-48"
            />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-sm text-muted-foreground">Loading jobs…</div>
        ) : filtered.length === 0 ? (
          <div className="text-sm text-muted-foreground">No jobs found.</div>
        ) : (
          <div className="space-y-3">
            {filtered.map((job) => (
              <div key={job._id || job.title} className="rounded-lg border p-3 flex items-center justify-between">
                <div>
                  <div className="font-medium">{job.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {(job.city || "Unknown city") + (job.budget ? ` • ₹${job.budget}` : "")}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{job.category}</Badge>
                  {job._id ? (
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/dashboard/jobs/${job._id}`}>View</Link>
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" disabled>
                      View
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
