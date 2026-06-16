"use client";

import { useState } from "react";

import { api } from "@/lib/api";
import type { Experience } from "@/lib/types";
import { Button, Card, Field, Input, PageHeader, Textarea } from "@/components/admin/ui";
import Modal from "@/components/admin/Modal";
import ImageUpload from "@/components/admin/ImageUpload";
import { useCrud } from "@/components/admin/useCrud";

const crudApi = {
  list: api.getExperience,
  create: api.createExperience,
  update: api.updateExperience,
  remove: api.deleteExperience,
};

const blank: Partial<Experience> = { company: "", role: "", description: "", start_date: "", end_date: "", order: 0 };

export default function ExperienceAdminPage() {
  const { items, loading, save, remove } = useCrud<Experience>(crudApi);
  const [editing, setEditing] = useState<Partial<Experience> | null>(null);
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!editing?.company || !editing.role) return;
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
        title="Experience"
        description="Your career timeline."
        action={<Button onClick={() => setEditing({ ...blank, order: items.length })}>+ New entry</Button>}
      />

      {loading && <p className="label-mono animate-pulse">Loading…</p>}

      <div className="space-y-3">
        {items.map((e) => (
          <Card key={e.id} className="flex items-center justify-between">
            <div>
              <p className="font-display text-lg text-bone">{e.role}</p>
              <p className="text-sm text-accent">{e.company}</p>
              <p className="text-xs text-bone-muted">
                {e.start_date} {e.end_date ? `— ${e.end_date}` : ""}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button variant="outline" onClick={() => setEditing(e)}>Edit</Button>
              <Button variant="danger" onClick={() => remove(e.id)}>Delete</Button>
            </div>
          </Card>
        ))}
        {!loading && items.length === 0 && <p className="text-bone-muted">No experience entries yet.</p>}
      </div>

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing?.id ? "Edit entry" : "New entry"}>
        {editing && (
          <div className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Company / Publication">
                <Input value={editing.company ?? ""} onChange={(e) => setEditing({ ...editing, company: e.target.value })} />
              </Field>
              <Field label="Role">
                <Input value={editing.role ?? ""} onChange={(e) => setEditing({ ...editing, role: e.target.value })} />
              </Field>
              <Field label="Start date">
                <Input value={editing.start_date ?? ""} placeholder="2022" onChange={(e) => setEditing({ ...editing, start_date: e.target.value })} />
              </Field>
              <Field label="End date">
                <Input value={editing.end_date ?? ""} placeholder="Present" onChange={(e) => setEditing({ ...editing, end_date: e.target.value })} />
              </Field>
            </div>
            <Field label="Description">
              <Textarea value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
            </Field>
            <ImageUpload label="Logo" folder="logos" value={editing.logo ?? null} onChange={(url) => setEditing({ ...editing, logo: url })} />
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
