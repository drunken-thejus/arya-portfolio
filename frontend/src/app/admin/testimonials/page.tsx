"use client";

import { useState } from "react";

import { api } from "@/lib/api";
import type { Testimonial } from "@/lib/types";
import { Button, Card, Field, Input, PageHeader, Textarea } from "@/components/admin/ui";
import Modal from "@/components/admin/Modal";
import ImageUpload from "@/components/admin/ImageUpload";
import { useCrud } from "@/components/admin/useCrud";

const crudApi = {
  list: api.getTestimonials,
  create: api.createTestimonial,
  update: api.updateTestimonial,
  remove: api.deleteTestimonial,
};

const blank: Partial<Testimonial> = { client_name: "", company: "", role: "", message: "", order: 0 };

export default function TestimonialsAdminPage() {
  const { items, loading, save, remove } = useCrud<Testimonial>(crudApi);
  const [editing, setEditing] = useState<Partial<Testimonial> | null>(null);
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!editing?.client_name || !editing.message) return;
    setSaving(true);
    try {
      await save(editing, editing.id);
      setEditing(null);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Testimonials"
        description="Kind words from clients."
        action={<Button onClick={() => setEditing({ ...blank, order: items.length })}>+ New testimonial</Button>}
      />

      {loading && <p className="label-mono animate-pulse">Loading…</p>}

      <div className="space-y-3">
        {items.map((t) => (
          <Card key={t.id} className="flex items-start justify-between gap-4">
            <div>
              <p className="line-clamp-2 text-bone">“{t.message}”</p>
              <p className="mt-2 text-sm text-bone-muted">
                {t.client_name}
                {t.company ? ` · ${t.company}` : ""}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button variant="outline" onClick={() => setEditing(t)}>Edit</Button>
              <Button variant="danger" onClick={() => remove(t.id)}>Delete</Button>
            </div>
          </Card>
        ))}
        {!loading && items.length === 0 && <p className="text-bone-muted">No testimonials yet.</p>}
      </div>

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing?.id ? "Edit testimonial" : "New testimonial"}>
        {editing && (
          <div className="space-y-5">
            <Field label="Message">
              <Textarea value={editing.message ?? ""} onChange={(e) => setEditing({ ...editing, message: e.target.value })} />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Client name">
                <Input value={editing.client_name ?? ""} onChange={(e) => setEditing({ ...editing, client_name: e.target.value })} />
              </Field>
              <Field label="Company">
                <Input value={editing.company ?? ""} onChange={(e) => setEditing({ ...editing, company: e.target.value })} />
              </Field>
              <Field label="Role">
                <Input value={editing.role ?? ""} onChange={(e) => setEditing({ ...editing, role: e.target.value })} />
              </Field>
            </div>
            <ImageUpload label="Profile image" folder="profile" value={editing.profile_image ?? null} onChange={(url) => setEditing({ ...editing, profile_image: url })} />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
              <Button onClick={submit} loading={saving}>Save</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
