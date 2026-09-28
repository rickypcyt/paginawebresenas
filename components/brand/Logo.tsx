interface LogoProps {
  /** default: tinta sobre fondo claro · dark: blanco sobre fondo oscuro · mono: monocromo blanco */
  variant?: "default" | "dark" | "mono";
  /** Solo el isotipo (punto + onda NFC), sin wordmark */
  markOnly?: boolean;
  /** Tamaño del wordmark en px (el isotipo escala proporcional) */
  size?: number;
  className?: string;
}

function ToqueMark({ size, color }: { size: number; color: string }) {
  return (
    <svg
      viewBox="0 0 36 44"
      width={(size * 36) / 44}
      height={size}
      aria-hidden="true"
      className="shrink-0"
    >
      <circle cx="11" cy="22" r="7" fill={color} />
      <path
        d="M19.3 11.4 A13.5 13.5 0 0 1 19.3 32.6"
        fill="none"
        stroke={color}
        strokeWidth="4.2"
        strokeLinecap="round"
      />
      <path
        d="M23.6 5.9 A20.5 20.5 0 0 1 23.6 38.1"
        fill="none"
        stroke={color}
        strokeWidth="4.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Logo({ variant = "default", markOnly = false, size = 22, className }: LogoProps) {
  const mark = variant === "mono" ? "#ffffff" : "#22c55e";
  const ink = variant === "default" ? "#1d1d1f" : "#ffffff";

  if (markOnly) {
    return (
      <span role="img" aria-label="Toque" className={className}>
        <ToqueMark size={size * 1.6} color={mark} />
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-[0.45em] leading-none ${className ?? ""}`}
      style={{ fontSize: size, color: ink }}
    >
      <ToqueMark size={size * 1.55} color={mark} />
      <span style={{ fontWeight: 700, letterSpacing: "-0.02em" }}>toque</span>
    </span>
  );
}
