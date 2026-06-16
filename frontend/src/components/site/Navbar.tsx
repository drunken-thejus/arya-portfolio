"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils";

const links = [
  { label: "About", href: "/#about" },
  { label: "Services", href: "/#services" },
  { label: "Work", href: "/#works" },
  { label: "Experience", href: "/#experience" },
  { label: "Contact", href: "/#contact" },
];

export default function Navbar({ name }: { name: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
        scrolled
          ? "border-b border-line/80 bg-ink/80 backdrop-blur-md"
          : "border-b border-transparent"
      )}
    >
      <nav className="container-editorial flex h-16 items-center justify-between">
        <Link href="/" className="font-display text-lg tracking-tight text-bone">
          {name || "Portfolio"}
          <span className="text-accent">.</span>
        </Link>

        <ul className="hidden items-center gap-9 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="text-sm text-bone-dim transition-colors hover:text-bone"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link href="/#contact" className="btn-primary hidden md:inline-flex">
          Let&apos;s talk
        </Link>

        <button
          aria-label="Toggle menu"
          className="flex h-10 w-10 items-center justify-center md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          <div className="space-y-1.5">
            <span
              className={cn(
                "block h-px w-6 bg-bone transition-transform",
                open && "translate-y-[7px] rotate-45"
              )}
            />
            <span className={cn("block h-px w-6 bg-bone transition-opacity", open && "opacity-0")} />
            <span
              className={cn(
                "block h-px w-6 bg-bone transition-transform",
                open && "-translate-y-[7px] -rotate-45"
              )}
            />
          </div>
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-line bg-ink md:hidden"
          >
            <ul className="container-editorial flex flex-col gap-1 py-6">
              {links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block py-3 font-display text-2xl text-bone"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
