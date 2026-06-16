import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { api } from "@/lib/api";
import { formatDate, parseTags, resolveImage } from "@/lib/utils";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import { Reveal } from "@/components/motion/Reveal";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  try {
    const work = await api.getWork(params.slug);
    return { title: `${work.title} — Arya Suresh`, description: work.description };
  } catch {
    return { title: "Article not found" };
  }
}

export default async function WorkDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const work = await api.getWork(params.slug).catch(() => null);
  if (!work) notFound();

  const [hero, socials] = await Promise.all([
    api.getHero().catch(() => null),
    api.getSocials().catch(() => []),
  ]);
  const cover = resolveImage(work.cover_image);
  const tags = parseTags(work.tags);
  const name = hero?.name ?? "Portfolio";

  return (
    <SmoothScroll>
      <Navbar name={name} />
      <main className="pt-28">
        <article className="container-editorial max-w-3xl py-12 md:py-16">
          <Reveal>
            <Link href="/#works" className="label-mono mb-8 inline-flex items-center gap-2 hover:text-bone">
              ← Back to work
            </Link>
          </Reveal>

          <Reveal delay={0.05}>
            <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-bone-muted">
              {work.category && <span className="text-accent">{work.category.name}</span>}
              {work.published_date && <span>· {formatDate(work.published_date)}</span>}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="font-display text-display text-bone">{work.title}</h1>
          </Reveal>

          <Reveal delay={0.15}>
            <p className="mt-6 text-xl leading-relaxed text-bone-dim">{work.description}</p>
          </Reveal>
        </article>

        {cover && (
          <Reveal>
            <div className="container-editorial max-w-5xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cover}
                alt={work.title}
                className="aspect-[16/9] w-full rounded-2xl border border-line object-cover"
              />
            </div>
          </Reveal>
        )}

        <div className="container-editorial max-w-3xl py-12 md:py-16">
          <Reveal>
            <div
              className="prose-editorial"
              dangerouslySetInnerHTML={{ __html: work.content }}
            />
          </Reveal>

          {work.images.length > 0 && (
            <div className="mt-12 space-y-8">
              {work.images.map((img) => (
                <figure key={img.id}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={resolveImage(img.url) ?? ""}
                    alt={img.caption ?? ""}
                    className="w-full rounded-xl border border-line"
                  />
                  {img.caption && (
                    <figcaption className="mt-2 text-sm text-bone-muted">{img.caption}</figcaption>
                  )}
                </figure>
              ))}
            </div>
          )}

          {tags.length > 0 && (
            <div className="mt-12 flex flex-wrap gap-2 border-t border-line pt-8">
              {tags.map((t) => (
                <span key={t} className="rounded-full border border-line px-3 py-1 text-xs text-bone-muted">
                  {t}
                </span>
              ))}
            </div>
          )}

          {work.external_link && (
            <a
              href={work.external_link}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline mt-10"
            >
              Read the original ↗
            </a>
          )}
        </div>
      </main>
      <Footer name={name} socials={socials} />
    </SmoothScroll>
  );
}
