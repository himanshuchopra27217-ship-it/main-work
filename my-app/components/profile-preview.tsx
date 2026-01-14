"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ProfilePreviewProps {
  profile: {
    userId: string
    role?: string
    category?: string
    categories?: string[]
    age?: number
    mobile?: string
    profilePhoto?: string
    bio?: string
    skills?: string[]
    experience?: number
  }
}

export function ProfilePreview({ profile }: ProfilePreviewProps) {
  const cats = profile.categories || (profile.category ? [profile.category] : [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Preview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Photo */}
        {profile.profilePhoto && (
          <div className="flex items-center gap-4">
            <img
              src={profile.profilePhoto}
              alt="Profile"
              className="w-16 h-16 rounded-full object-cover border"
            />
            <div className="text-sm text-muted-foreground">Your current profile photo</div>
          </div>
        )}

        {/* Basic info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-muted-foreground">Role</div>
            <div className="text-sm font-medium capitalize">{profile.role || "worker"}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Age</div>
            <div className="text-sm font-medium">{profile.age ?? "—"}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Mobile</div>
            <div className="text-sm font-medium">{profile.mobile ?? "—"}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Experience</div>
            <div className="text-sm font-medium">{profile.experience ?? "—"}</div>
          </div>
        </div>

        {/* Categories */}
        <div>
          <div className="text-xs text-muted-foreground mb-1">Categories</div>
          {cats.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {cats.map((cat) => (
                <span
                  key={cat}
                  className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-secondary text-secondary-foreground"
                >
                  {cat}
                </span>
              ))}
            </div>
          ) : (
            <div className="text-sm">—</div>
          )}
        </div>

        {/* Bio / Skills */}
        {profile.bio && (
          <div>
            <div className="text-xs text-muted-foreground mb-1">Bio</div>
            <div className="text-sm">{profile.bio}</div>
          </div>
        )}
        {profile.skills && profile.skills.length > 0 && (
          <div>
            <div className="text-xs text-muted-foreground mb-1">Skills</div>
            <div className="flex flex-wrap gap-1">
              {profile.skills.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Button asChild>
            <Link href="/dashboard/my-jobs/profile/edit">Edit Profile</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
