import Link from 'next/link'
import type { ReactNode } from 'react'

type DashboardLayoutProps = {
  children: ReactNode
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen">
      <header className="border-b p-4">
        <nav className="flex gap-4">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/dashboard/products">Products</Link>
          <Link href="/dashboard/analytics">Analytics</Link>
          <Link href="/dashboard/settings">Settings</Link>
        </nav>
      </header>

      <main className="p-8">{children}</main>
    </div>
  )
}
