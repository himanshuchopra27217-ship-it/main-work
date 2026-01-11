"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, User, Briefcase, FileText, Plus, Settings, Users } from "lucide-react"

interface DashboardNavProps {
  userRole?: string
}

export function DashboardNav({ userRole }: DashboardNavProps) {
  const pathname = usePathname()

  const getNavItems = () => {
    const baseItems = [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Profile",
        href: "/dashboard/profile",
        icon: User,
      },
    ]

    switch (userRole) {
      case "worker":
        return [
          ...baseItems,
          {
            title: "Browse Jobs",
            href: "/dashboard/jobs",
            icon: Briefcase,
          },
          {
            title: "Worker Profiles",
            href: "/dashboard/profiles",
            icon: Users,
          },
        ]
      case "hiring":
        return [
          ...baseItems,
          {
            title: "My Jobs",
            href: "/dashboard/my-jobs",
            icon: FileText,
          },
          {
            title: "Create Job",
            href: "/dashboard/jobs/create",
            icon: Plus,
          },
        ]
      case "admin":
        return [
          ...baseItems,
          {
            title: "My Jobs",
            href: "/dashboard/my-jobs",
            icon: FileText,
          },
          {
            title: "Browse Jobs",
            href: "/dashboard/jobs",
            icon: Briefcase,
          },
          {
            title: "Create Job",
            href: "/dashboard/jobs/create",
            icon: Plus,
          },
          {
            title: "Admin",
            href: "/dashboard/admin",
            icon: Settings,
          },
        ]
      default:
        return baseItems
    }
  }

  const navItems = getNavItems()

  return (
    <aside className="w-64 border-r bg-card hidden lg:block">
      <nav className="flex flex-col gap-2 p-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.title}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
