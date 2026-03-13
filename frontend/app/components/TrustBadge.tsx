

type Props = {
  score?: number | null;
  riskLevel?: string | null;
};

function riskColors(riskLevel?: string | null) {
  const risk = (riskLevel || '').toUpperCase();

  if (risk === 'LOW') {
    return {
      bg: '#ecfdf5',
      border: '1px solid #a7f3d0',
      text: '#065f46',
      dot: '#10b981',
      label: 'Risco LOW',
    };
  }

  if (risk === 'MEDIUM') {
    return {
      bg: '#fffbeb',
      border: '1px solid #fde68a',
      text: '#92400e',
      dot: '#f59e0b',
      label: 'Risco MEDIUM',
    };
  }

  return {
    bg: '#fef2f2',
    border: '1px solid #fecaca',
    text: '#991b1b',
    dot: '#ef4444',
    label: 'Risco HIGH',
  };
}

export default function TrustBadge({ score, riskLevel }: Props) {
  const palette = riskColors(riskLevel);

  const wrap: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 14px',
    borderRadius: 999,
    background: palette.bg,
    border: palette.border,
    color: palette.text,
    fontSize: 13,
    fontWeight: 800,
    lineHeight: 1,
  };

  const dot: React.CSSProperties = {
    width: 10,
    height: 10,
    borderRadius: 999,
    background: palette.dot,
    flexShrink: 0,
  };

  return (
    <div style={wrap}>
      <span style={dot} />
      <span>
        Trust Score {score ?? '--'} • {palette.label}
      </span>
    </div>
  );
}
