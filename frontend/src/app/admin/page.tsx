"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { api } from "@/lib/api";
import type { DashboardStats } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Card, PageHeader } from "@/components/admin/ui";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.getDashboard().then(setStats).catch(() => setError("Failed to load stats"));
  }, []);

  const cards = stats
    ? [
        { label: "Total Works", value: stats.total_works, href: "/admin/works" },
        { label: "Services", value: stats.total_services, href: "/admin/services" },
        { label: "Testimonials", value: stats.total_testimonials, href: "/admin/testimonials" },
        { label: "Experience", value: stats.total_experience, href: "/admin/experience" },
        { label: "Messages", value: stats.total_messages, href: "/admin/messages" },
        { label: "Unread", value: stats.unread_messages, href: "/admin/messages" },
      ]
    : [];

  return (
    <div>
      <PageHeader title="Dashboard" description="Overview of your portfolio content." />

      {error && <p className="text-red-400">{error}</p>}
      {!stats && !error && <p className="label-mono animate-pulse">Loading…</p>}

      {stats && (
        <>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {cards.map((c) => (
              <Link key={c.label} href={c.href}>
                <Card className="transition-colors hover:border-bone-faint">
                  <p className="text-sm text-bone-muted">{c.label}</p>
                  <p className="mt-2 font-display text-4xl text-bone">{c.value}</p>
                </Card>
              </Link>
            ))}
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <Card>
              <h2 className="mb-4 font-display text-xl text-bone">Recent messages</h2>
              {stats.recent_messages.length === 0 ? (
                <p className="text-sm text-bone-muted">No messages yet.</p>
              ) : (
                <ul className="space-y-3">
                  {stats.recent_messages.map((m) => (
                    <li key={m.id} className="border-b border-line pb-3 last:border-0">
                      <div className="flex items-center justify-between">
                        <p className="text-bone">{m.name}</p>
                        <span className="text-xs text-bone-muted">{formatDate(m.created_at)}</span>
                      </div>
                      <p className="line-clamp-1 text-sm text-bone-muted">{m.body}</p>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            <Card>
              <h2 className="mb-4 font-display text-xl text-bone">Recent works</h2>
              {stats.recent_works.length === 0 ? (
                <p className="text-sm text-bone-muted">No works yet.</p>
              ) : (
                <ul className="space-y-3">
                  {stats.recent_works.map((w) => (
                    <li key={w.id} className="border-b border-line pb-3 last:border-0">
                      <Link href="/admin/works" className="text-bone hover:text-accent">
                        {w.title}
                      </Link>
                      <p className="text-sm text-bone-muted">{w.category?.name ?? "Uncategorised"}</p>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
