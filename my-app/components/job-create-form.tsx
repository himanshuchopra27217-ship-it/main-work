"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface JobCreateFormProps {
  userId: string
  userCategory: string
}

export function JobCreateForm({ userId, userCategory }: JobCreateFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: userCategory,
    subCategory: "",
    budget: "",
    mobile: "",
    city: "",
    status: "open" as "open" | "closed",
    workDate: "",
    location: "",
    workPhoto: "",
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError("Please select a valid image file")
        return
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB")
        return
      }

      setSelectedFile(file)
      setError("")

      // Create preview URL
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setPreviewUrl(result)
        setFormData({ ...formData, workPhoto: result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/jobs/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          budget: formData.budget ? parseFloat(formData.budget) : undefined,
          userId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create job")
      }

      router.push("/dashboard/my-jobs")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="category">
          Category <span className="text-destructive">*</span>
        </Label>
        <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Plumber">Plumber</SelectItem>
            <SelectItem value="Electrician">Electrician</SelectItem>
            <SelectItem value="Carpenter">Carpenter</SelectItem>
            <SelectItem value="Web Developer">Web Developer</SelectItem>
            <SelectItem value="Mobile Developer">Mobile Developer</SelectItem>
            <SelectItem value="UI/UX Designer">UI/UX Designer</SelectItem>
            <SelectItem value="Graphic Designer">Graphic Designer</SelectItem>
            <SelectItem value="Content Writer">Content Writer</SelectItem>
            <SelectItem value="Digital Marketer">Digital Marketer</SelectItem>
            <SelectItem value="Accountant">Accountant</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subCategory">Sub-Category</Label>
        <Input
          id="subCategory"
          type="text"
          placeholder="e.g., Kitchen Plumbing, Residential Wiring"
          value={formData.subCategory}
          onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">
          Job Title <span className="text-destructive">*</span>
        </Label>
        <Input
          id="title"
          type="text"
          placeholder="e.g., Fix leaking kitchen sink"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">
          Work Description <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="description"
          placeholder="Describe the job requirements, location, timeline, and any other relevant details..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
          rows={6}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="budget">
            Amount / Budget <span className="text-destructive">*</span>
          </Label>
          <Input
            id="budget"
            type="number"
            placeholder="5000"
            value={formData.budget}
            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
            min="0"
            step="100"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="mobile">
            Mobile Number <span className="text-destructive">*</span>
          </Label>
          <Input
            id="mobile"
            type="tel"
            placeholder="+1 (555) 000-0000"
            value={formData.mobile}
            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">
            City <span className="text-destructive">*</span>
          </Label>
          <Input
            id="city"
            type="text"
            placeholder="New York"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Job Status</Label>
          <Select value={formData.status} onValueChange={(value: "open" | "closed") => setFormData({ ...formData, status: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="workPhoto">Upload Work Photo</Label>
        <div className="space-y-4">
          <Input
            id="workPhoto"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
          />
          {previewUrl && (
            <div className="flex items-center space-x-4">
              <img
                src={previewUrl}
                alt="Work preview"
                className="w-16 h-16 rounded-full object-cover border"
              />
              <div className="text-sm text-muted-foreground">
                <p>Preview of work photo</p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null)
                    setPreviewUrl("")
                    setFormData({ ...formData, workPhoto: "" })
                  }}
                  className="text-destructive hover:underline"
                >
                  Remove photo
                </button>
              </div>
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground">Upload a work photo (max 5MB, JPG/PNG)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="workDate">
            Work Date <span className="text-destructive">*</span>
          </Label>
          <Input
            id="workDate"
            type="date"
            value={formData.workDate}
            onChange={(e) => setFormData({ ...formData, workDate: e.target.value })}
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location (Optional)</Label>
          <Input
            id="location"
            type="text"
            placeholder="Specific address or area"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />
        </div>
      </div>

      {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? "Creating..." : "Post Your Work"}
        </Button>
      </div>
    </form>
  )
}
