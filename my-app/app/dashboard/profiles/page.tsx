import { redirect } from "next/navigation"
import { getSession, getUserProfile } from "@/lib/auth"
import { getAllProfiles } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, Star, MapPin } from "lucide-react"

export default async function BrowseProfilesPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  const profile = await getUserProfile(session.userId)

  if (!profile) {
    redirect("/dashboard/my-jobs/setup")
  }

  // Only workers can browse profiles
  if (profile.role !== "worker" && profile.role !== "admin") {
    redirect("/dashboard")
  }

  // Fetch profiles
  const profiles = await getAllProfiles()

  // Filter profiles to show other workers in the same category
  const relevantProfiles = profiles.filter((p: any) => 
    p.userId !== session.userId && 
    p.role === 'worker' && 
    p.category === profile.category
  )

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Worker Profiles</h1>
        <p className="text-muted-foreground mt-2">
          Browse profiles of other workers in your category: <strong>{profile.category}</strong>
        </p>
      </div>

      {relevantProfiles.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Users className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Profiles Found</h3>
            <p className="text-muted-foreground text-center max-w-md">
              There are currently no other worker profiles in the <strong>{profile.category}</strong> category.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {relevantProfiles.map((workerProfile: any) => (
            <Card key={workerProfile._id} className="hover:shadow-md transition-shadow">
              <CardHeader className="text-center">
                <Avatar className="w-20 h-20 mx-auto mb-4">
                  <AvatarImage src={workerProfile.profilePhoto} alt="Profile" />
                  <AvatarFallback>
                    {workerProfile.category?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-lg">{workerProfile.category} Worker</CardTitle>
                <CardDescription>
                  {workerProfile.age ? `${workerProfile.age} years old` : 'Age not specified'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {workerProfile.skills && workerProfile.skills.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Skills</p>
                      <div className="flex flex-wrap gap-1">
                        {workerProfile.skills.slice(0, 3).map((skill: string, index: number) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {workerProfile.skills.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{workerProfile.skills.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {workerProfile.experience && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Star className="h-4 w-4" />
                      <span>{workerProfile.experience} years experience</span>
                    </div>
                  )}

                  {workerProfile.rating && (
                    <div className="flex items-center gap-2 text-sm">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{workerProfile.rating.toFixed(1)} ({workerProfile.reviewCount || 0} reviews)</span>
                    </div>
                  )}

                  {workerProfile.isVerified && (
                    <Badge variant="default" className="w-full justify-center">
                      Verified Worker
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}