"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { api, getToken } from "@/lib/api";
import Sidebar from "@/components/admin/Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === "/admin/login";

  const [state, setState] = useState<"checking" | "authed" | "anon">("checking");
  const [email, setEmail] = useState<string>();

  useEffect(() => {
    if (isLogin) return;
    if (!getToken()) {
      router.replace("/admin/login");
      setState("anon");
      return;
    }
    api
      .me()
      .then((u) => {
        setEmail(u.email);
        setState("authed");
      })
      .catch(() => {
        router.replace("/admin/login");
        setState("anon");
      });
  }, [isLogin, router, pathname]);

  if (isLogin) return <>{children}</>;

  if (state !== "authed") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="label-mono animate-pulse">Loading dashboard…</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-ink">
      <Sidebar email={email} />
      <main className="flex-1 overflow-x-hidden">
        <div className="mx-auto max-w-5xl px-8 py-10">{children}</div>
      </main>
    </div>
  );
}
