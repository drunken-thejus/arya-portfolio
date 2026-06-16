"use client";

import { useState } from "react";

import { api } from "@/lib/api";
import type { SocialLink } from "@/lib/types";
import { Reveal } from "@/components/motion/Reveal";
import SectionHeading from "@/components/site/SectionHeading";

interface FormState {
  name: string;
  email: string;
  subject: string;
  body: string;
}

const empty: FormState = { name: "", email: "", subject: "", body: "" };

export default function Contact({
  socials,
  email = "arya.suresh@example.com",
  location = "Mangaluru, Karnataka, India",
}: {
  socials: SocialLink[];
  email?: string;
  location?: string;
}) {
  const [form, setForm] = useState<FormState>(empty);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const validate = (): boolean => {
    const next: Partial<FormState> = {};
    if (!form.name.trim()) next.name = "Please enter your name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Enter a valid email";
    if (form.body.trim().length < 10) next.body = "Tell me a little more (min 10 chars)";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus("loading");
    try {
      await api.submitContact({
        name: form.name,
        email: form.email,
        subject: form.subject || undefined,
        body: form.body,
      });
      setStatus("success");
      setForm(empty);
    } catch {
      setStatus("error");
    }
  };

  const field = (key: keyof FormState) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value })),
  });

  return (
    <section id="contact" className="scroll-mt-24 border-t border-line py-28 md:py-36">
      <div className="container-editorial grid gap-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <SectionHeading label="Contact" title="Let's create something worth reading." />
          <Reveal>
            <div className="space-y-6">
              <div>
                <p className="label-mono mb-1">Email</p>
                <a href={`mailto:${email}`} className="text-xl text-bone hover:text-accent">
                  {email}
                </a>
              </div>
              <div>
                <p className="label-mono mb-1">Location</p>
                <p className="text-xl text-bone">{location}</p>
              </div>
              {socials.length > 0 && (
                <div>
                  <p className="label-mono mb-2">Elsewhere</p>
                  <div className="flex flex-wrap gap-x-5 gap-y-2">
                    {socials.map((s) => (
                      <a
                        key={s.id}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-bone-dim hover:text-accent"
                      >
                        {s.platform}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Reveal>
        </div>

        <div className="md:col-span-7">
          <Reveal>
            {status === "success" ? (
              <div className="flex h-full min-h-[300px] flex-col items-center justify-center rounded-2xl border border-line bg-ink-soft p-10 text-center">
                <span className="mb-4 text-4xl text-accent">✓</span>
                <h3 className="font-display text-2xl text-bone">Message sent</h3>
                <p className="mt-2 text-bone-muted">
                  Thanks for reaching out — I&apos;ll get back to you shortly.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="btn-outline mt-6"
                >
                  Send another
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-6" noValidate>
                <div className="grid gap-6 sm:grid-cols-2">
                  <Field label="Name" error={errors.name}>
                    <input className="input" placeholder="Your name" {...field("name")} />
                  </Field>
                  <Field label="Email" error={errors.email}>
                    <input className="input" type="email" placeholder="you@email.com" {...field("email")} />
                  </Field>
                </div>
                <Field label="Subject">
                  <input className="input" placeholder="What's this about?" {...field("subject")} />
                </Field>
                <Field label="Message" error={errors.body}>
                  <textarea className="input min-h-[160px] resize-y" placeholder="Tell me about your project…" {...field("body")} />
                </Field>

                {status === "error" && (
                  <p className="text-sm text-red-400">
                    Something went wrong. Please try again or email me directly.
                  </p>
                )}

                <button type="submit" disabled={status === "loading"} className="btn-primary disabled:opacity-60">
                  {status === "loading" ? "Sending…" : "Send message"}
                </button>
              </form>
            )}
          </Reveal>
        </div>
      </div>

      <style jsx>{`
        :global(.input) {
          width: 100%;
          background: #201e20;
          border: 1px solid #363636;
          border-radius: 0.75rem;
          padding: 0.9rem 1rem;
          color: #ebebeb;
          font-size: 0.95rem;
          transition: border-color 0.3s ease;
        }
        :global(.input::placeholder) {
          color: #7a7a7a;
        }
        :global(.input:focus) {
          outline: none;
          border-color: #0099ff;
        }
      `}</style>
    </section>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="label-mono mb-2 block">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-400">{error}</span>}
    </label>
  );
}
