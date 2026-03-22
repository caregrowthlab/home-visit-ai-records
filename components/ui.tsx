"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function buttonClassName(variant: "primary" | "secondary" | "ghost" = "primary") {
  return cn(
    "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50",
    variant === "primary" && "bg-accent text-white hover:bg-teal-700",
    variant === "secondary" &&
      "bg-white text-ink ring-1 ring-line hover:bg-slate-50",
    variant === "ghost" && "text-ink hover:bg-slate-100",
  );
}

export function Button(
  props: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "ghost";
  },
) {
  const { className, variant = "primary", type = "button", ...rest } = props;

  return (
    <button
      type={type}
      className={cn(buttonClassName(variant), className)}
      {...rest}
    />
  );
}

export function Input(
  props: React.InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
  },
) {
  const { className, label, ...rest } = props;

  return (
    <label className="grid gap-2 text-sm text-slate-700">
      {label ? <span className="font-medium">{label}</span> : null}
      <input
        className={cn(
          "min-h-11 rounded-xl border border-line bg-white px-3 py-2 outline-none ring-0 transition placeholder:text-slate-400 focus:border-accent",
          className,
        )}
        {...rest}
      />
    </label>
  );
}

export function Textarea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label?: string;
  },
) {
  const { className, label, ...rest } = props;

  return (
    <label className="grid gap-2 text-sm text-slate-700">
      {label ? <span className="font-medium">{label}</span> : null}
      <textarea
        className={cn(
          "min-h-32 rounded-xl border border-line bg-white px-3 py-3 outline-none transition placeholder:text-slate-400 focus:border-accent",
          className,
        )}
        {...rest}
      />
    </label>
  );
}

export function Select(
  props: React.SelectHTMLAttributes<HTMLSelectElement> & {
    label?: string;
  },
) {
  const { className, label, children, ...rest } = props;

  return (
    <label className="grid gap-2 text-sm text-slate-700">
      {label ? <span className="font-medium">{label}</span> : null}
      <select
        className={cn(
          "min-h-11 rounded-xl border border-line bg-white px-3 py-2 outline-none transition focus:border-accent",
          className,
        )}
        {...rest}
      >
        {children}
      </select>
    </label>
  );
}

export function Card(
  props: React.HTMLAttributes<HTMLDivElement> & {
    title?: string;
    description?: string;
  },
) {
  const { className, title, description, children, ...rest } = props;

  return (
    <section
      className={cn(
        "rounded-xl2 border border-white/60 bg-white/90 p-5 shadow-panel backdrop-blur",
        className,
      )}
      {...rest}
    >
      {title || description ? (
        <header className="mb-4">
          {title ? <h2 className="text-lg font-semibold text-ink">{title}</h2> : null}
          {description ? (
            <p className="mt-1 text-sm text-slate-600">{description}</p>
          ) : null}
        </header>
      ) : null}
      {children}
    </section>
  );
}
