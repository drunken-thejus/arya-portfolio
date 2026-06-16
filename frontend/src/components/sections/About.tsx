"use client";

import { animate, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import type { About as AboutType } from "@/lib/types";
import { resolveImage } from "@/lib/utils";
import { Reveal } from "@/components/motion/Reveal";
import SectionHeading from "@/components/site/SectionHeading";

function Counter({ value, suffix = "+" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

export default function About({ about }: { about: AboutType }) {
  const img = resolveImage(about.profile_image);
  const stats = [
    { value: about.years_experience, label: "Years of experience" },
    { value: about.articles_published, label: "Articles published" },
    { value: about.clients_count, label: "Clients worked with" },
  ];

  return (
    <section id="about" className="container-editorial scroll-mt-24 py-28 md:py-36">
      <SectionHeading label="About Me" title="I turn ideas into stories worth reading." />

      <div className="grid gap-14 md:grid-cols-12">
        <div className="md:col-span-7 lg:col-span-7">
          <Reveal>
            <p className="text-xl leading-relaxed text-bone md:text-2xl">{about.biography}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-10 border-l-2 border-accent pl-6">
              <p className="label-mono mb-2">Writing philosophy</p>
              <p className="text-lg italic leading-relaxed text-bone-dim">
                “{about.philosophy}”
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-8 leading-relaxed text-bone-muted">{about.experience_summary}</p>
          </Reveal>
        </div>

        <div className="md:col-span-5">
          {img && (
            <Reveal>
              <div className="overflow-hidden rounded-2xl border border-line">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt="Portrait" className="aspect-[4/5] w-full object-cover" />
              </div>
            </Reveal>
          )}
          <div className="mt-10 grid grid-cols-3 gap-4">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={0.1 + i * 0.08}>
                <div>
                  <div className="font-display text-4xl text-bone md:text-5xl">
                    <Counter value={s.value} />
                  </div>
                  <p className="mt-2 text-xs leading-snug text-bone-muted">{s.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
