"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"

const categories = [
  "Plumber",
  "Electrician",
  "Carpenter",
  "Web Developer",
  "Mobile Developer",
  "UI/UX Designer",
  "Graphic Designer",
  "Content Writer",
  "Digital Marketer",
  "Accountant",
  "Other",
]

interface ProfileSetupFormProps {
  userId: string
}

export function ProfileSetupForm({ userId }: ProfileSetupFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    role: "worker" as "admin" | "worker" | "hiring",
    categories: [] as string[],
    age: "",
    mobile: "",
    profilePhoto: "",
  })
  const [birthDate, setBirthDate] = useState<Date | undefined>(undefined)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const calculateAge = (birthDate: Date) => {
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

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
        setFormData({ ...formData, profilePhoto: result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (formData.categories.length === 0) {
      setError("Please select at least one category")
      setLoading(false)
      return
    }

    if (!birthDate || !formData.mobile) {
      setError("Please fill in all required fields (birth date and mobile)")
      setLoading(false)
      return
    }

    const age = calculateAge(birthDate)

    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...formData,
          age,
          userId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create profile")
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
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="profilePhoto">Profile Photo (Optional)</Label>
            <div className="space-y-4">
              <Input
                id="profilePhoto"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              />
              {previewUrl && (
                <div className="flex items-center space-x-4">
                  <img
                    src={previewUrl}
                    alt="Profile preview"
                    className="w-16 h-16 rounded-full object-cover border"
                  />
                  <div className="text-sm text-muted-foreground">
                    <p>Preview of your profile photo</p>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null)
                        setPreviewUrl("")
                        setFormData({ ...formData, profilePhoto: "" })
                      }}
                      className="text-destructive hover:underline"
                    >
                      Remove photo
                    </button>
                  </div>
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">Upload a profile photo (max 5MB, JPG/PNG)</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">
              Role <span className="text-destructive">*</span>
            </Label>
            <Select value={formData.role} onValueChange={(value: "admin" | "worker" | "hiring") => setFormData({ ...formData, role: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="worker">Worker - Browse and accept jobs</SelectItem>
                <SelectItem value="hiring">Hiring - Post and manage jobs</SelectItem>
                <SelectItem value="admin">Admin - Full access</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">Choose your primary role on the platform</p>
          </div>

          <div className="space-y-2">
            <Label>
              Categories <span className="text-destructive">*</span>
            </Label>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((cat) => (
                <label key={cat} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.categories.includes(cat)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({
                          ...formData,
                          categories: [...formData.categories, cat]
                        })
                      } else {
                        setFormData({
                          ...formData,
                          categories: formData.categories.filter(c => c !== cat)
                        })
                      }
                    }}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm">{cat}</span>
                </label>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">Select one or more categories that match your skills</p>
          </div>
      

          <div className="space-y-2">
            <Label>
              Date of Birth <span className="text-destructive">*</span>
            </Label>
            <Calendar
              mode="single"
              selected={birthDate}
              onSelect={setBirthDate}
              disabled={(date) =>
                date > new Date() || date < new Date("1900-01-01")
              }
              className="rounded-md border"
            />
            {birthDate && (
              <p className="text-sm text-muted-foreground">
                Age: {calculateAge(birthDate)} years old
              </p>
            )}
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

          {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}

          <div className="flex gap-3">
            <Button type="submit" disabled={loading || formData.categories.length === 0 || !birthDate || !formData.mobile} className="flex-1">
              {loading ? "Saving..." : "Complete Profile"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
