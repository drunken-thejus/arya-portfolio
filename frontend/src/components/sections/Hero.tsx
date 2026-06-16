"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

import type { Hero as HeroType } from "@/lib/types";
import { resolveImage } from "@/lib/utils";
import { RevealText } from "@/components/motion/RevealText";

export default function Hero({ hero }: { hero: HeroType }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const bg = resolveImage(hero.background_image);

  return (
    <section
      ref={ref}
      id="top"
      className="relative flex min-h-[100svh] items-end overflow-hidden pb-20 pt-32"
    >
      {bg && (
        <motion.div
          style={{ y: bgY }}
          className="pointer-events-none absolute inset-0 -z-10"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={bg} alt="" className="h-full w-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/40" />
        </motion.div>
      )}

      <motion.div style={{ opacity: fade }} className="container-editorial">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 1 }}
          className="label-mono mb-8 flex items-center gap-3"
        >
          <span className="inline-block h-px w-10 bg-bone-faint" />
          {hero.name || "Portfolio"} — Content Writer
        </motion.p>

        <h1 className="max-w-5xl font-display text-display-lg text-bone">
          <RevealText text={hero.headline || "Words that move people to act."} />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 max-w-xl text-lg leading-relaxed text-bone-dim"
        >
          {hero.intro}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          {hero.cta_primary_label && (
            <Link href={hero.cta_primary_href || "#works"} className="btn-primary">
              {hero.cta_primary_label}
            </Link>
          )}
          {hero.cta_secondary_label && (
            <Link href={hero.cta_secondary_href || "#contact"} className="btn-outline">
              {hero.cta_secondary_label}
            </Link>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
}
