"use client";

import { useEffect, useState } from "react";

import { api } from "@/lib/api";
import type { Hero } from "@/lib/types";
import { Button, Card, Field, Input, PageHeader, Textarea } from "@/components/admin/ui";
import ImageUpload from "@/components/admin/ImageUpload";

export default function HeroAdminPage() {
  const [hero, setHero] = useState<Hero | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.getHero().then(setHero);
  }, []);

  const set = <K extends keyof Hero>(key: K, value: Hero[K]) =>
    setHero((h) => (h ? { ...h, [key]: value } : h));

  const save = async () => {
    if (!hero) return;
    setSaving(true);
    setSaved(false);
    try {
      const updated = await api.updateHero(hero);
      setHero(updated);
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  if (!hero) return <p className="label-mono animate-pulse">Loading…</p>;

  return (
    <div>
      <PageHeader
        title="Hero Section"
        description="The first thing visitors see."
        action={
          <Button onClick={save} loading={saving}>
            {saved ? "Saved ✓" : "Save changes"}
          </Button>
        }
      />

      <Card className="space-y-6">
        <Field label="Name">
          <Input value={hero.name} onChange={(e) => set("name", e.target.value)} />
        </Field>
        <Field label="Main headline">
          <Textarea value={hero.headline} onChange={(e) => set("headline", e.target.value)} />
        </Field>
        <Field label="Short introduction">
          <Textarea value={hero.intro} onChange={(e) => set("intro", e.target.value)} />
        </Field>

        <div className="grid gap-6 sm:grid-cols-2">
          <ImageUpload
            label="Profile image"
            folder="profile"
            value={hero.profile_image}
            onChange={(url) => set("profile_image", url)}
          />
          <ImageUpload
            label="Background image"
            folder="media"
            value={hero.background_image}
            onChange={(url) => set("background_image", url)}
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Primary CTA label">
            <Input value={hero.cta_primary_label ?? ""} onChange={(e) => set("cta_primary_label", e.target.value)} />
          </Field>
          <Field label="Primary CTA link">
            <Input value={hero.cta_primary_href ?? ""} onChange={(e) => set("cta_primary_href", e.target.value)} />
          </Field>
          <Field label="Secondary CTA label">
            <Input value={hero.cta_secondary_label ?? ""} onChange={(e) => set("cta_secondary_label", e.target.value)} />
          </Field>
          <Field label="Secondary CTA link">
            <Input value={hero.cta_secondary_href ?? ""} onChange={(e) => set("cta_secondary_href", e.target.value)} />
          </Field>
        </div>
      </Card>
    </div>
  );
}
