"use client";

import { useState } from "react";

import { api } from "@/lib/api";
import type { SocialLink } from "@/lib/types";
import { Button, Card, Field, Input, PageHeader } from "@/components/admin/ui";
import Modal from "@/components/admin/Modal";
import { useCrud } from "@/components/admin/useCrud";

const crudApi = {
  list: api.getSocials,
  create: api.createSocial,
  update: api.updateSocial,
  remove: api.deleteSocial,
};

const blank: Partial<SocialLink> = { platform: "", url: "", order: 0 };

export default function SocialAdminPage() {
  const { items, loading, save, remove } = useCrud<SocialLink>(crudApi);
  const [editing, setEditing] = useState<Partial<SocialLink> | null>(null);
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!editing?.platform || !editing.url) return;
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
        title="Social Links"
        description="Where people can find you."
        action={<Button onClick={() => setEditing({ ...blank, order: items.length })}>+ New link</Button>}
      />

      {loading && <p className="label-mono animate-pulse">Loading…</p>}

      <div className="space-y-3">
        {items.map((s) => (
          <Card key={s.id} className="flex items-center justify-between">
            <div>
              <p className="font-display text-lg text-bone">{s.platform}</p>
              <p className="text-sm text-bone-muted">{s.url}</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button variant="outline" onClick={() => setEditing(s)}>Edit</Button>
              <Button variant="danger" onClick={() => remove(s.id)}>Delete</Button>
            </div>
          </Card>
        ))}
        {!loading && items.length === 0 && <p className="text-bone-muted">No social links yet.</p>}
      </div>

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing?.id ? "Edit link" : "New link"}>
        {editing && (
          <div className="space-y-5">
            <Field label="Platform">
              <Input value={editing.platform ?? ""} placeholder="Twitter" onChange={(e) => setEditing({ ...editing, platform: e.target.value })} />
            </Field>
            <Field label="URL">
              <Input value={editing.url ?? ""} placeholder="https://…" onChange={(e) => setEditing({ ...editing, url: e.target.value })} />
            </Field>
            <Field label="Icon name (optional)">
              <Input value={editing.icon ?? ""} placeholder="twitter" onChange={(e) => setEditing({ ...editing, icon: e.target.value })} />
            </Field>
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
