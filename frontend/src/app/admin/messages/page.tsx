"use client";

import { useEffect, useState } from "react";

import { api } from "@/lib/api";
import type { Message } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Button, Card, PageHeader } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

export default function MessagesAdminPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<Message | null>(null);

  useEffect(() => {
    api.getMessages().then(setMessages).finally(() => setLoading(false));
  }, []);

  const open = async (m: Message) => {
    setActive(m);
    if (!m.is_read) {
      await api.markMessageRead(m.id, true);
      setMessages((prev) => prev.map((x) => (x.id === m.id ? { ...x, is_read: true } : x)));
    }
  };

  const del = async (id: number) => {
    await api.deleteMessage(id);
    setMessages((prev) => prev.filter((m) => m.id !== id));
    if (active?.id === id) setActive(null);
  };

  return (
    <div>
      <PageHeader title="Messages" description="Submissions from your contact form." />

      {loading && <p className="label-mono animate-pulse">Loading…</p>}
      {!loading && messages.length === 0 && <p className="text-bone-muted">No messages yet.</p>}

      <div className="grid gap-6 md:grid-cols-12">
        <div className="space-y-2 md:col-span-5">
          {messages.map((m) => (
            <button
              key={m.id}
              onClick={() => open(m)}
              className={cn(
                "w-full rounded-lg border px-4 py-3 text-left transition-colors",
                active?.id === m.id ? "border-accent bg-ink-soft" : "border-line hover:border-bone-faint"
              )}
            >
              <div className="flex items-center justify-between">
                <span className={cn("text-bone", !m.is_read && "font-semibold")}>{m.name}</span>
                {!m.is_read && <span className="h-2 w-2 rounded-full bg-accent" />}
              </div>
              <p className="line-clamp-1 text-sm text-bone-muted">{m.subject || m.body}</p>
              <p className="mt-1 text-xs text-bone-faint">{formatDate(m.created_at)}</p>
            </button>
          ))}
        </div>

        <div className="md:col-span-7">
          {active ? (
            <Card>
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h2 className="font-display text-2xl text-bone">{active.name}</h2>
                  <a href={`mailto:${active.email}`} className="text-sm text-accent">
                    {active.email}
                  </a>
                </div>
                <Button variant="danger" onClick={() => del(active.id)}>Delete</Button>
              </div>
              {active.subject && <p className="mb-2 font-medium text-bone">{active.subject}</p>}
              <p className="whitespace-pre-wrap leading-relaxed text-bone-dim">{active.body}</p>
              <a href={`mailto:${active.email}`} className="btn-outline mt-6 inline-flex">
                Reply by email
              </a>
            </Card>
          ) : (
            messages.length > 0 && (
              <Card className="flex h-full items-center justify-center text-bone-muted">
                Select a message to read it.
              </Card>
            )
          )}
        </div>
      </div>
    </div>
  );
}
