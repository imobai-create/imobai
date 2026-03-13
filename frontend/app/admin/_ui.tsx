import Link from "next/link";
import type { ReactNode } from "react";

export function Card({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
}) {
  return (
    <div className="border-b border-neutral-200 px-5 py-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-neutral-900">{title}</div>
          {subtitle && <div className="mt-1 text-xs text-neutral-500">{subtitle}</div>}
        </div>
        {right}
      </div>
    </div>
  );
}

export function Button({
  children,
  onClick,
  variant = "secondary",
  type = "button",
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger";
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  const base =
    "rounded-xl px-4 py-2 text-sm font-medium shadow-sm transition disabled:opacity-50";
  const styles =
    variant === "primary"
      ? "bg-neutral-900 text-white hover:bg-neutral-800"
      : variant === "danger"
      ? "bg-red-600 text-white hover:bg-red-500"
      : "border border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-50";

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${styles}`}>
      {children}
    </button>
  );
}

export function ButtonLink({
  children,
  href,
  variant = "secondary",
}: {
  children: ReactNode;
  href: string;
  variant?: "primary" | "secondary";
}) {
  const base = "rounded-xl px-4 py-2 text-sm font-medium shadow-sm transition";
  const styles =
    variant === "primary"
      ? "bg-neutral-900 text-white hover:bg-neutral-800"
      : "border border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-50";
  return (
    <Link href={href} className={`${base} ${styles}`}>
      {children}
    </Link>
  );
}

export function Input({
  label,
  name,
  placeholder,
  defaultValue,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  placeholder?: string;
  defaultValue?: string | number;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <div className="mb-1 text-xs font-medium text-neutral-700">{label}</div>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue as any}
        required={required}
        className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:border-neutral-400"
      />
    </label>
  );
}

export function Textarea({
  label,
  name,
  placeholder,
  defaultValue,
}: {
  label: string;
  name: string;
  placeholder?: string;
  defaultValue?: string;
}) {
  return (
    <label className="block">
      <div className="mb-1 text-xs font-medium text-neutral-700">{label}</div>
      <textarea
        name={name}
        placeholder={placeholder}
        defaultValue={defaultValue}
        rows={4}
        className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:border-neutral-400"
      />
    </label>
  );
}