"use client";

import { useState } from "react";

import { api } from "@/lib/api";
import type { Service } from "@/lib/types";
import { Button, Card, Field, Input, PageHeader, Textarea } from "@/components/admin/ui";
import Modal from "@/components/admin/Modal";
import { useCrud } from "@/components/admin/useCrud";

const crudApi = {
  list: api.getServices,
  create: api.createService,
  update: api.updateService,
  remove: api.deleteService,
};

const blank: Partial<Service> = { title: "", description: "", order: 0 };

export default function ServicesAdminPage() {
  const { items, loading, save, remove } = useCrud<Service>(crudApi);
  const [editing, setEditing] = useState<Partial<Service> | null>(null);
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!editing?.title) return;
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
        title="Services"
        description="Add, edit, reorder and remove services."
        action={<Button onClick={() => setEditing({ ...blank, order: items.length })}>+ New service</Button>}
      />

      {loading && <p className="label-mono animate-pulse">Loading…</p>}

      <div className="space-y-3">
        {items.map((s) => (
          <Card key={s.id} className="flex items-center justify-between">
            <div>
              <p className="font-display text-lg text-bone">{s.title}</p>
              <p className="line-clamp-1 text-sm text-bone-muted">{s.description}</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button variant="outline" onClick={() => setEditing(s)}>
                Edit
              </Button>
              <Button variant="danger" onClick={() => remove(s.id)}>
                Delete
              </Button>
            </div>
          </Card>
        ))}
        {!loading && items.length === 0 && (
          <p className="text-bone-muted">No services yet. Create your first one.</p>
        )}
      </div>

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing?.id ? "Edit service" : "New service"}>
        {editing && (
          <div className="space-y-5">
            <Field label="Title">
              <Input value={editing.title ?? ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
            </Field>
            <Field label="Description">
              <Textarea
                value={editing.description ?? ""}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
              />
            </Field>
            <Field label="Order">
              <Input
                type="number"
                value={editing.order ?? 0}
                onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) })}
              />
            </Field>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setEditing(null)}>
                Cancel
              </Button>
              <Button onClick={submit} loading={saving}>
                Save
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
