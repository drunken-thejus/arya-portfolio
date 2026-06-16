"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { clearToken } from "@/lib/api";
import { cn } from "@/lib/utils";

const nav = [
  { label: "Dashboard", href: "/admin" },
  { label: "Hero", href: "/admin/hero" },
  { label: "About", href: "/admin/about" },
  { label: "Services", href: "/admin/services" },
  { label: "Works", href: "/admin/works" },
  { label: "Experience", href: "/admin/experience" },
  { label: "Testimonials", href: "/admin/testimonials" },
  { label: "Social Links", href: "/admin/social" },
  { label: "Messages", href: "/admin/messages" },
];

export default function Sidebar({ email }: { email?: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const logout = () => {
    clearToken();
    router.push("/admin/login");
  };

  return (
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-line bg-ink-soft">
      <div className="border-b border-line px-6 py-5">
        <Link href="/" className="font-display text-lg text-bone">
          Portfolio<span className="text-accent">.</span>
        </Link>
        <p className="mt-1 text-xs text-bone-muted">CMS Dashboard</p>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {nav.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "mb-1 block rounded-lg px-3 py-2.5 text-sm transition-colors",
                active ? "bg-ink text-bone" : "text-bone-muted hover:bg-ink hover:text-bone"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-line px-4 py-4">
        {email && <p className="mb-2 truncate px-2 text-xs text-bone-muted">{email}</p>}
        <button
          onClick={logout}
          className="w-full rounded-lg px-3 py-2 text-left text-sm text-bone-dim transition-colors hover:bg-ink hover:text-bone"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
