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
  userCategories: string[]
}

export function JobCreateForm({ userId, userCategories }: JobCreateFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: userCategories[0] || "",
    subCategory: "",
    budget: "",
    mobile: "",
    state: "",
    city: "",
    workDate: "",
    location: "",
    workPhoto: "",
    workPhotos: [] as string[],
  })
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length) {
      const validImages = files.filter((file) => file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024)
      if (validImages.length !== files.length) {
        setError("Only image files up to 5MB are allowed")
      } else {
        setError("")
      }
      setSelectedFiles(validImages)
      const readers = validImages.map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader()
          reader.onload = (ev) => resolve(ev.target?.result as string)
          reader.readAsDataURL(file)
        })
      })
      Promise.all(readers).then((urls) => {
        setPreviewUrls(urls)
        setFormData({ ...formData, workPhoto: urls[0] || "", workPhotos: urls })
      })
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
          <Label htmlFor="state">
            State <span className="text-destructive">*</span>
          </Label>
          <Input
            id="state"
            list="state-list"
            placeholder="Select or type state"
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            required
          />
          <datalist id="state-list">
            <option value="Andhra Pradesh" />
            <option value="Arunachal Pradesh" />
            <option value="Assam" />
            <option value="Bihar" />
            <option value="Chhattisgarh" />
            <option value="Goa" />
            <option value="Gujarat" />
            <option value="Haryana" />
            <option value="Himachal Pradesh" />
            <option value="Jharkhand" />
            <option value="Karnataka" />
            <option value="Kerala" />
            <option value="Madhya Pradesh" />
            <option value="Maharashtra" />
            <option value="Manipur" />
            <option value="Meghalaya" />
            <option value="Mizoram" />
            <option value="Nagaland" />
            <option value="Odisha" />
            <option value="Punjab" />
            <option value="Rajasthan" />
            <option value="Sikkim" />
            <option value="Tamil Nadu" />
            <option value="Telangana" />
            <option value="Tripura" />
            <option value="Uttar Pradesh" />
            <option value="Uttarakhand" />
            <option value="West Bengal" />
            <option value="Delhi" />
            <option value="Jammu and Kashmir" />
            <option value="Ladakh" />
            <option value="Chandigarh" />
            <option value="Puducherry" />
            <option value="Andaman and Nicobar Islands" />
            <option value="Dadra and Nagar Haveli and Daman and Diu" />
            <option value="Lakshadweep" />
          </datalist>
        </div>
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
      </div>

      <div className="space-y-2">
        <Label htmlFor="workPhoto">Upload Work Photos</Label>
        <div className="space-y-4">
          <Input
            id="workPhoto"
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
          />
          {previewUrls.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Preview of selected photos</p>
              <div className="flex flex-wrap gap-2">
                {previewUrls.map((url, idx) => (
                  <img key={idx} src={url} alt={`Work preview ${idx + 1}`} className="w-20 h-20 rounded-md object-cover border" />
                ))}
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedFiles([])
                  setPreviewUrls([])
                  setFormData({ ...formData, workPhoto: "", workPhotos: [] })
                }}
                className="text-destructive hover:underline text-sm"
              >
                Remove all photos
              </button>
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground">Upload up to several photos (each max 5MB, JPG/PNG)</p>
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
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            type="text"
            placeholder="Specific address or area"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            required
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
