"use client";

import { useEffect, useState } from "react";

import { api } from "@/lib/api";
import type { About } from "@/lib/types";
import { Button, Card, Field, Input, PageHeader, Textarea } from "@/components/admin/ui";
import ImageUpload from "@/components/admin/ImageUpload";

export default function AboutAdminPage() {
  const [about, setAbout] = useState<About | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.getAbout().then(setAbout);
  }, []);

  const set = <K extends keyof About>(key: K, value: About[K]) =>
    setAbout((a) => (a ? { ...a, [key]: value } : a));

  const save = async () => {
    if (!about) return;
    setSaving(true);
    setSaved(false);
    try {
      setAbout(await api.updateAbout(about));
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  if (!about) return <p className="label-mono animate-pulse">Loading…</p>;

  return (
    <div>
      <PageHeader
        title="About Section"
        description="Your story and stats."
        action={
          <Button onClick={save} loading={saving}>
            {saved ? "Saved ✓" : "Save changes"}
          </Button>
        }
      />

      <Card className="space-y-6">
        <Field label="Biography">
          <Textarea value={about.biography} onChange={(e) => set("biography", e.target.value)} />
        </Field>
        <Field label="Writing philosophy">
          <Textarea value={about.philosophy} onChange={(e) => set("philosophy", e.target.value)} />
        </Field>
        <Field label="Experience summary">
          <Textarea value={about.experience_summary} onChange={(e) => set("experience_summary", e.target.value)} />
        </Field>

        <ImageUpload
          label="Profile image"
          folder="profile"
          value={about.profile_image}
          onChange={(url) => set("profile_image", url)}
        />

        <div className="grid gap-6 sm:grid-cols-3">
          <Field label="Years of experience">
            <Input
              type="number"
              value={about.years_experience}
              onChange={(e) => set("years_experience", Number(e.target.value))}
            />
          </Field>
          <Field label="Articles published">
            <Input
              type="number"
              value={about.articles_published}
              onChange={(e) => set("articles_published", Number(e.target.value))}
            />
          </Field>
          <Field label="Clients worked with">
            <Input
              type="number"
              value={about.clients_count}
              onChange={(e) => set("clients_count", Number(e.target.value))}
            />
          </Field>
        </div>
      </Card>
    </div>
  );
}
