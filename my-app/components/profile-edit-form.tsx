"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { DateInput } from "./ui/DateInput"

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

interface ProfileEditFormProps {
  profile: any
}

export function ProfileEditForm({ profile }: ProfileEditFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    role: profile.role || "worker",
    categories: profile.categories || (profile.category ? [profile.category] : []),
    age: profile.age?.toString() || "",
    mobile: profile.mobile || "",
    profilePhoto: profile.profilePhoto || "",
  })

  // ✅ Single state for DOB
  const [birthDate, setBirthDate] = useState<Date | null>(
    profile.age ? new Date(new Date().getFullYear() - profile.age, 0, 1) : null
  )

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>(profile.profilePhoto || "")
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
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file")
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB")
        return
      }

      setSelectedFile(file)
      setError("")

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
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...formData,
          age,
          userId: profile.userId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile")
      }

      router.push("/dashboard/profile")
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
          {/* Profile Photo */}
          <div className="space-y-2">
            <Label htmlFor="profilePhoto">Profile Photo </Label>
            <div className="space-y-4">
              <Input
                id="profilePhoto"
                type="file"
                accept="image/*"
                required
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

          {/* Categories */}
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
                          categories: [...formData.categories, cat],
                        })
                      } else {
                        setFormData({
                          ...formData,
                          categories: formData.categories.filter((c: string) => c !== cat),
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

          {/* Date of Birth */}
          <DateInput
            label="Date of Birth"
            value={birthDate}
            onChange={setBirthDate}
            required
          />

          {/* Mobile Number */}
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

          {/* Error Message */}
          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              {error}
            </div>
          )}

          {/* Switch Role */}
          {profile.role === "worker" && (
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                Switch to Hiring Mode
              </h3>
              <p className="text-xs text-blue-700 dark:text-blue-300 mb-3">
                Want to post jobs instead of accepting them? Switch your role to hiring manager.
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setFormData({ ...formData, role: "hiring" })}
                className="border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-950/30"
              >
                Switch to Hiring
              </Button>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                loading ||
                formData.categories.length === 0 ||
                !birthDate ||
                !formData.mobile
              }
              className="flex-1"
            >
              {loading ? "Saving..." : "Update Profile"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
