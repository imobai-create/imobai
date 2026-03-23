

type Step = {
  label: string;
  done: boolean;
  current?: boolean;
};

type Props = {
  steps: Step[];
};

export default function NegotiationTimeline({ steps }: Props) {
  return (
    <div
      style={{
        marginTop: 22,
        padding: 18,
        borderRadius: 18,
        background: "rgba(255,255,255,0.88)",
        border: "1px solid rgba(15,23,42,0.08)",
      }}
    >
      <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 14 }}>
        Etapas da negociação
      </div>

      <div style={{ display: "grid", gap: 12 }}>
        {steps.map((step, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 12px",
              borderRadius: 12,
              background: step.current
                ? "rgba(15,23,42,0.04)"
                : "transparent",
              border: step.current
                ? "1px solid rgba(15,23,42,0.08)"
                : "1px solid transparent",
            }}
          >
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: 999,
                display: "grid",
                placeItems: "center",
                fontSize: 12,
                fontWeight: 800,
                background: step.done ? "#111827" : "#e5e7eb",
                color: step.done ? "#fff" : "#475569",
                flexShrink: 0,
              }}
            >
              {step.done ? "✓" : index + 1}
            </div>

            <div
              style={{
                fontWeight: step.current ? 800 : 600,
                color: "#111827",
              }}
            >
              {step.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

