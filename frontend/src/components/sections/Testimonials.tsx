"use client";

import type { Testimonial } from "@/lib/types";
import { resolveImage } from "@/lib/utils";
import { Reveal } from "@/components/motion/Reveal";
import SectionHeading from "@/components/site/SectionHeading";

export default function Testimonials({ items }: { items: Testimonial[] }) {
  if (items.length === 0) return null;
  return (
    <section className="scroll-mt-24 border-t border-line py-28 md:py-36">
      <div className="container-editorial">
        <SectionHeading label="Kind Words" title="Trusted by brands and founders." />

        <div className="grid gap-6 md:grid-cols-2">
          {items.map((t, i) => {
            const img = resolveImage(t.profile_image);
            return (
              <Reveal key={t.id} delay={(i % 2) * 0.08}>
                <figure className="flex h-full flex-col rounded-2xl border border-line bg-ink-soft p-8">
                  <blockquote className="flex-1 font-display text-xl leading-relaxed text-bone">
                    “{t.message}”
                  </blockquote>
                  <figcaption className="mt-8 flex items-center gap-4">
                    {img ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={img} alt={t.client_name} className="h-12 w-12 rounded-full object-cover" />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ink-card font-display text-bone">
                        {t.client_name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="text-bone">{t.client_name}</p>
                      <p className="text-sm text-bone-muted">
                        {[t.role, t.company].filter(Boolean).join(", ")}
                      </p>
                    </div>
                  </figcaption>
                </figure>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
