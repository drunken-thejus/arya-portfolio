"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import type { Service } from "@/lib/types";
import { Reveal } from "@/components/motion/Reveal";
import SectionHeading from "@/components/site/SectionHeading";

export default function Services({ services }: { services: Service[] }) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section id="services" className="scroll-mt-24 border-t border-line py-28 md:py-36">
      <div className="container-editorial">
        <SectionHeading
          label="What I Do"
          title="Services built around clarity, voice, and results."
        />

        <div className="border-t border-line">
          {services.map((s, i) => (
            <Reveal key={s.id} delay={i * 0.04}>
              <div
                onMouseEnter={() => setHovered(s.id)}
                onMouseLeave={() => setHovered(null)}
                className="group relative grid grid-cols-12 items-center gap-4 border-b border-line py-8 transition-colors"
              >
                <span className="col-span-2 font-mono text-sm text-bone-faint md:col-span-1">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="col-span-10 font-display text-2xl text-bone transition-transform duration-500 ease-editorial group-hover:translate-x-2 md:col-span-4 md:text-3xl">
                  {s.title}
                </h3>
                <p className="col-span-12 pl-[calc(2/12*100%)] text-bone-muted md:col-span-6 md:pl-0">
                  {s.description}
                </p>
                <motion.span
                  className="pointer-events-none absolute inset-0 -z-10 bg-ink-soft"
                  initial={false}
                  animate={{ opacity: hovered === s.id ? 1 : 0 }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
