import Link from "next/link";

import type { SocialLink } from "@/lib/types";

export default function Footer({
  name,
  socials,
}: {
  name: string;
  socials: SocialLink[];
}) {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line">
      <div className="container-editorial flex flex-col gap-8 py-12 md:flex-row md:items-center md:justify-between">
        <div>
          <Link href="/" className="font-display text-2xl text-bone">
            {name || "Portfolio"}
            <span className="text-accent">.</span>
          </Link>
          <p className="mt-2 text-sm text-bone-muted">
            © {year} — Crafted with words & care.
          </p>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {socials.map((s) => (
            <a
              key={s.id}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-bone-dim transition-colors hover:text-accent"
            >
              {s.platform}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
