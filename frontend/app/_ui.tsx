
import Link from "next/link";
import React from "react";

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        color: "var(--ink)",
      }}
    >
      {children}
    </div>
  );
}

export function Container({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 1180,
        margin: "0 auto",
        padding: "0 24px",
      }}
    >
      {children}
    </div>
  );
}

export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={className}
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: 20,
        boxShadow: "var(--shadow)",
      }}
    >
      {children}
    </div>
  );
}

export function SectionTitle({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 16,
        flexWrap: "wrap",
      }}
    >
      <div>
        <h1
          style={{
            fontSize: 36,
            lineHeight: 1.05,
            fontWeight: 700,
            letterSpacing: "-0.03em",
            margin: 0,
          }}
        >
          {title}
        </h1>
        {subtitle ? (
          <p
            style={{
              marginTop: 10,
              color: "var(--muted)",
              fontSize: 16,
              lineHeight: 1.5,
              maxWidth: 760,
            }}
          >
            {subtitle}
          </p>
        ) : null}
      </div>

      {right ? <div style={{ display: "flex", gap: 10 }}>{right}</div> : null}
    </div>
  );
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "ok" | "warn";
}) {
  const toneMap =
    tone === "ok"
      ? {
          background: "rgba(16,185,129,0.12)",
          color: "#065f46",
          border: "1px solid rgba(16,185,129,0.22)",
        }
      : tone === "warn"
      ? {
          background: "rgba(245,158,11,0.12)",
          color: "#92400e",
          border: "1px solid rgba(245,158,11,0.22)",
        }
      : {
          background: "rgba(15,23,42,0.05)",
          color: "rgba(15,23,42,0.75)",
          border: "1px solid rgba(15,23,42,0.10)",
        };

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        height: 30,
        padding: "0 12px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 600,
        whiteSpace: "nowrap",
        ...toneMap,
      }}
    >
      {children}
    </span>
  );
}

export function Button({
  children,
  href,
  onClick,
  variant = "secondary",
}: {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
}) {
  const common: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    height: 44,
    padding: "0 16px",
    borderRadius: 14,
    fontSize: 14,
    fontWeight: 600,
    textDecoration: "none",
    cursor: "pointer",
    transition: "all 0.15s ease",
  };

  const style: React.CSSProperties =
    variant === "primary"
      ? {
          ...common,
          background: "var(--btn)",
          color: "#fff",
          border: "1px solid rgba(0,0,0,0.08)",
        }
      : {
          ...common,
          background: "rgba(255,255,255,0.82)",
          color: "var(--ink)",
          border: "1px solid var(--border)",
        };

  if (href) {
    return (
      <Link href={href} style={style}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} style={style}>
      {children}
    </button>
  );
}
