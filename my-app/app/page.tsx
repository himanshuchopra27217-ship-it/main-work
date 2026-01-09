import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, Users, CheckCircle2, ArrowRight } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-primary" />
            <span className="font-semibold text-xl">Kaamwork</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center space-y-6 mb-16">
              <h1 className="text-5xl font-bold tracking-tight text-balance">
                Find the Right Talent for Your Category
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
                Connect skilled professionals with opportunities in their field. Whether you're hiring or looking for
                work, we make category-based hiring simple.
              </p>
              <div className="flex items-center justify-center gap-4 pt-4">
                <Button size="lg" asChild>
                  <Link href="/signup">
                    Start Hiring <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/login">Find Work</Link>
                </Button>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-8 mt-20">
              <Card>
                <CardHeader>
                  <Briefcase className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Post Jobs</CardTitle>
                  <CardDescription>
                    Create job posts specific to your industry category and reach qualified professionals instantly.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <Users className="h-10 w-10 text-accent mb-2" />
                  <CardTitle>Category Matching</CardTitle>
                  <CardDescription>
                    Workers only see jobs in their category, ensuring relevant opportunities for everyone.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <CheckCircle2 className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Quick Hiring</CardTitle>
                  <CardDescription>
                    Accept jobs instantly. Once assigned, jobs are hidden from others for seamless workflow.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Kaamwork. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
