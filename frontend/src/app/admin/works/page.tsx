"use client";

import { useEffect, useState } from "react";

import { api } from "@/lib/api";
import type { Category, Work, WorkImage } from "@/lib/types";
import { formatDate, resolveImage } from "@/lib/utils";
import {
  Button,
  Card,
  Field,
  Input,
  Label,
  PageHeader,
  Textarea,
  Toggle,
} from "@/components/admin/ui";
import ImageUpload from "@/components/admin/ImageUpload";
import RichTextEditor from "@/components/admin/RichTextEditor";

type Draft = Partial<Work> & { images: WorkImage[] };

const blankDraft: Draft = {
  title: "",
  description: "",
  content: "",
  cover_image: null,
  external_link: "",
  published_date: null,
  tags: "",
  is_featured: false,
  is_published: true,
  category_id: null,
  images: [],
};

export default function WorksAdminPage() {
  const [works, setWorks] = useState<Work[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [newCat, setNewCat] = useState("");

  const refresh = () => {
    setLoading(true);
    Promise.all([api.adminGetWorks(), api.getCategories()])
      .then(([w, c]) => {
        setWorks(w);
        setCategories(c);
      })
      .finally(() => setLoading(false));
  };

  useEffect(refresh, []);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((d) => (d ? { ...d, [key]: value } : d));

  const edit = (w: Work) =>
    setDraft({ ...w, images: w.images, published_date: w.published_date });

  const save = async () => {
    if (!draft?.title) return;
    setSaving(true);
    try {
      const payload: Partial<Work> = {
        ...draft,
        images: draft.images.map((img, i) => ({ ...img, order: i })),
      } as Partial<Work>;
      if (draft.id) await api.updateWork(draft.id, payload);
      else await api.createWork(payload);
      setDraft(null);
      refresh();
    } finally {
      setSaving(false);
    }
  };

  const del = async (id: number) => {
    if (!confirm("Delete this work?")) return;
    await api.deleteWork(id);
    setWorks((prev) => prev.filter((w) => w.id !== id));
  };

  const addCategory = async () => {
    if (!newCat.trim()) return;
    const cat = await api.createCategory(newCat.trim());
    setCategories((prev) => (prev.find((c) => c.id === cat.id) ? prev : [...prev, cat]));
    set("category_id", cat.id);
    setNewCat("");
  };

  const addExtraImage = (url: string | null) => {
    if (!url || !draft) return;
    set("images", [...draft.images, { id: Date.now(), url, caption: null, order: draft.images.length }]);
  };

  // ── Editor view ──
  if (draft) {
    return (
      <div>
        <PageHeader
          title={draft.id ? "Edit work" : "New work"}
          action={
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setDraft(null)}>Cancel</Button>
              <Button onClick={save} loading={saving}>Save work</Button>
            </div>
          }
        />

        <div className="space-y-6">
          <Card className="space-y-5">
            <Field label="Title">
              <Input value={draft.title ?? ""} onChange={(e) => set("title", e.target.value)} />
            </Field>
            <Field label="Short description">
              <Textarea value={draft.description ?? ""} onChange={(e) => set("description", e.target.value)} />
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label>Category</Label>
                <select
                  value={draft.category_id ?? ""}
                  onChange={(e) => set("category_id", e.target.value ? Number(e.target.value) : null)}
                  className="w-full rounded-lg border border-line bg-ink px-3.5 py-2.5 text-bone focus:border-accent focus:outline-none"
                >
                  <option value="">Uncategorised</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <div className="mt-2 flex gap-2">
                  <Input value={newCat} placeholder="New category" onChange={(e) => setNewCat(e.target.value)} />
                  <Button variant="outline" onClick={addCategory}>Add</Button>
                </div>
              </div>
              <Field label="Published date">
                <Input
                  type="date"
                  value={draft.published_date ?? ""}
                  onChange={(e) => set("published_date", e.target.value || null)}
                />
              </Field>
            </div>

            <Field label="Tags (comma separated)">
              <Input value={draft.tags ?? ""} placeholder="seo, editorial, strategy" onChange={(e) => set("tags", e.target.value)} />
            </Field>
            <Field label="External link (optional)">
              <Input value={draft.external_link ?? ""} placeholder="https://…" onChange={(e) => set("external_link", e.target.value)} />
            </Field>

            <div className="flex flex-wrap gap-8">
              <Toggle checked={!!draft.is_featured} onChange={(v) => set("is_featured", v)} label="Featured" />
              <Toggle checked={!!draft.is_published} onChange={(v) => set("is_published", v)} label="Published" />
            </div>
          </Card>

          <Card>
            <ImageUpload label="Cover image" folder="works" value={draft.cover_image ?? null} onChange={(url) => set("cover_image", url)} />
          </Card>

          <Card>
            <RichTextEditor label="Full article" value={draft.content ?? ""} onChange={(html) => set("content", html)} />
          </Card>

          <Card>
            <Label>Gallery images</Label>
            <div className="mb-4 flex flex-wrap gap-3">
              {draft.images.map((img, i) => (
                <div key={img.id} className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={resolveImage(img.url) ?? ""} alt="" className="h-20 w-20 rounded-lg border border-line object-cover" />
                  <button
                    onClick={() => set("images", draft.images.filter((_, idx) => idx !== i))}
                    className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <ImageUpload label="Add gallery image" folder="works" value={null} onChange={addExtraImage} />
          </Card>
        </div>
      </div>
    );
  }

  // ── List view ──
  return (
    <div>
      <PageHeader
        title="Works"
        description="Your writing samples and case studies."
        action={<Button onClick={() => setDraft({ ...blankDraft })}>+ New work</Button>}
      />

      {loading && <p className="label-mono animate-pulse">Loading…</p>}

      <div className="space-y-3">
        {works.map((w) => (
          <Card key={w.id} className="flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-display text-lg text-bone">{w.title}</p>
                {w.is_featured && <span className="rounded-full bg-accent/20 px-2 py-0.5 text-xs text-accent">Featured</span>}
                {!w.is_published && <span className="rounded-full bg-line px-2 py-0.5 text-xs text-bone-muted">Draft</span>}
              </div>
              <p className="text-sm text-bone-muted">
                {w.category?.name ?? "Uncategorised"} · {formatDate(w.published_date) || "No date"}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button variant="outline" onClick={() => edit(w)}>Edit</Button>
              <Button variant="danger" onClick={() => del(w.id)}>Delete</Button>
            </div>
          </Card>
        ))}
        {!loading && works.length === 0 && <p className="text-bone-muted">No works yet. Create your first one.</p>}
      </div>
    </div>
  );
}
