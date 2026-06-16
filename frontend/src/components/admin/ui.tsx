"use client";

import { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-xl border border-line bg-ink-soft p-6", className)}>
      {children}
    </div>
  );
}

export function Label({ children }: { children: ReactNode }) {
  return <span className="mb-1.5 block text-sm font-medium text-bone-dim">{children}</span>;
}

const inputClass =
  "w-full rounded-lg border border-line bg-ink px-3.5 py-2.5 text-bone placeholder:text-bone-faint " +
  "transition-colors focus:border-accent focus:outline-none";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(inputClass, props.className)} />;
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn(inputClass, "min-h-[110px] resize-y", props.className)} />;
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <Label>{label}</Label>
      {children}
    </label>
  );
}

type Variant = "primary" | "outline" | "danger" | "ghost";

export function Button({
  variant = "primary",
  className,
  loading,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  loading?: boolean;
}) {
  const styles: Record<Variant, string> = {
    primary: "bg-accent text-ink hover:bg-accent-soft",
    outline: "border border-line text-bone hover:border-bone",
    danger: "border border-red-500/40 text-red-400 hover:bg-red-500/10",
    ghost: "text-bone-muted hover:text-bone",
  };
  return (
    <button
      {...props}
      disabled={props.disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-50",
        styles[variant],
        className
      )}
    >
      {loading ? "Saving…" : children}
    </button>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center gap-3 text-sm text-bone-dim"
    >
      <span
        className={cn(
          "relative h-6 w-11 rounded-full transition-colors",
          checked ? "bg-accent" : "bg-line"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-bone transition-transform",
            checked ? "translate-x-5" : "translate-x-0.5"
          )}
        />
      </span>
      {label}
    </button>
  );
}

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-3xl text-bone">{title}</h1>
        {description && <p className="mt-1 text-bone-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}
