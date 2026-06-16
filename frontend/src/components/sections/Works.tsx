"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import type { Category, Work } from "@/lib/types";
import { cn, formatDate, parseTags, resolveImage } from "@/lib/utils";
import { Reveal } from "@/components/motion/Reveal";
import SectionHeading from "@/components/site/SectionHeading";

function WorkCard({ work, index }: { work: Work; index: number }) {
  const cover = resolveImage(work.cover_image);
  const tags = parseTags(work.tags);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: (index % 3) * 0.06 }}
      className={cn(work.is_featured && "md:col-span-2")}
    >
      <Link href={`/works/${work.slug}`} className="group block">
        <div className="relative overflow-hidden rounded-2xl border border-line bg-ink-soft">
          <div
            className={cn(
              "relative w-full overflow-hidden",
              work.is_featured ? "aspect-[16/9]" : "aspect-[4/3]"
            )}
          >
            {cover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={cover}
                alt={work.title}
                className="h-full w-full object-cover transition-transform duration-700 ease-editorial group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-ink-card">
                <span className="font-display text-5xl text-line">{work.title.charAt(0)}</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            {work.is_featured && (
              <span className="absolute left-4 top-4 rounded-full bg-accent px-3 py-1 text-xs font-medium text-ink">
                Featured
              </span>
            )}
          </div>
        </div>

        <div className="mt-5 flex items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-3 text-xs text-bone-muted">
              {work.category && <span className="text-accent">{work.category.name}</span>}
              {work.published_date && <span>· {formatDate(work.published_date)}</span>}
            </div>
            <h3 className="font-display text-2xl text-bone transition-colors group-hover:text-accent">
              {work.title}
            </h3>
            <p className="mt-2 line-clamp-2 text-bone-muted">{work.description}</p>
          </div>
          <span className="mt-2 shrink-0 text-bone-faint transition-transform duration-500 group-hover:translate-x-1 group-hover:text-bone">
            ↗
          </span>
        </div>

        {tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {tags.slice(0, 4).map((t) => (
              <span key={t} className="rounded-full border border-line px-3 py-1 text-xs text-bone-muted">
                {t}
              </span>
            ))}
          </div>
        )}
      </Link>
    </motion.article>
  );
}

export default function Works({
  works,
  categories,
}: {
  works: Work[];
  categories: Category[];
}) {
  const [active, setActive] = useState<string>("all");

  const filtered = useMemo(() => {
    if (active === "all") return works;
    return works.filter((w) => w.category?.slug === active);
  }, [active, works]);

  return (
    <section id="works" className="scroll-mt-24 border-t border-line py-28 md:py-36">
      <div className="container-editorial">
        <SectionHeading label="Selected Work" title="Writing samples & case studies." />

        <Reveal>
          <div className="mb-12 flex flex-wrap gap-2">
            <FilterPill active={active === "all"} onClick={() => setActive("all")}>
              All
            </FilterPill>
            {categories.map((c) => (
              <FilterPill key={c.id} active={active === c.slug} onClick={() => setActive(c.slug)}>
                {c.name}
              </FilterPill>
            ))}
          </div>
        </Reveal>

        <motion.div layout className="grid gap-x-8 gap-y-14 md:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {filtered.map((w, i) => (
              <WorkCard key={w.id} work={w} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <p className="py-16 text-center text-bone-muted">No work in this category yet.</p>
        )}
      </div>
    </section>
  );
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-5 py-2 text-sm transition-all duration-300",
        active
          ? "border-bone bg-bone text-ink"
          : "border-line text-bone-dim hover:border-bone-faint hover:text-bone"
      )}
    >
      {children}
    </button>
  );
}
