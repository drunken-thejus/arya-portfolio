"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";
import Sidebar from "@/components/admin/Sidebar";

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === "/admin/login";

  const [state, setState] = useState<"checking" | "authed" | "anon">("checking");
  const [email, setEmail] = useState<string>();

  useEffect(() => {
    if (isLogin) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setEmail(session.user.email ?? "");
        setState("authed");
      } else {
        router.replace("/admin/login");
        setState("anon");
      }
    });

    // Listen for auth state changes (logout, token expiry)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        router.replace("/admin/login");
        setState("anon");
      }
    });

    return () => subscription.unsubscribe();
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
      <Sidebar email={email} onLogout={async () => {
        await supabase.auth.signOut();
        router.replace("/admin/login");
      }} />
      <main className="flex-1 overflow-x-hidden">
        <div className="mx-auto max-w-5xl px-8 py-10">{children}</div>
      </main>
    </div>
  );
}
