// /src/components/ui.jsx
import React from "react";

/* ---------------- Theme ---------------- */
export const THEME = {
  bg: "#f7fafc",
  text: "#0f172a",
  subtext: "#64748b",
  border: "#e2e8f0",
  primary: "#2563eb",
  primarySoft: "rgba(37, 99, 235, 0.08)",
  surface: "#ffffff",
};

/* ---------------- Primitives ---------------- */
export function Progress({ value = 0 }) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div style={{ background: "#eef2ff", height: 10, borderRadius: 999, overflow: "hidden" }}>
      <div style={{ width: pct + "%", height: 10, background: "#1d4ed8" }} />
    </div>
  );
}

export function Ring({ value = 0, size = 90 }) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  const r = Math.floor((size - 12) / 2);
  const c = Math.floor(size / 2);
  const circ = 2 * Math.PI * r;
  const dash = Math.round((pct / 100) * circ);
  const rest = circ - dash;
  return (
    <svg width={size} height={size}>
      <circle cx={c} cy={c} r={r} stroke="#e2e8f0" strokeWidth="10" fill="none" />
      <circle
        cx={c}
        cy={c}
        r={r}
        stroke="#6366f1"
        strokeWidth="10"
        fill="none"
        strokeDasharray={`${dash} ${rest}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${c} ${c})`}
      />
      <text x={c} y={c + 4} textAnchor="middle" fontSize="14" fontWeight="700">
        {pct + "%"}
      </text>
    </svg>
  );
}

/* ---------------- UI Kit ---------------- */
export function Card({ title, subtitle, right, children, style }) {
  return (
    <div
      style={{
        background: THEME.surface,
        border: `1px solid ${THEME.border}`,
        borderRadius: 12,
        padding: 12,
        boxShadow: "0 4px 14px rgba(2,6,23,0.04)",
        ...style,
      }}
    >
      {(title || subtitle || right) && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: 8,
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <div>
            {title && <div style={{ fontWeight: 800 }}>{title}</div>}
            {subtitle && <div style={{ color: THEME.subtext, fontSize: 12 }}>{subtitle}</div>}
          </div>
          {right && <div>{right}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

const BTN_VARIANTS = {
  primary: {
    bg: THEME.primary,
    color: "#fff",
    border: THEME.primary,
  },
  secondary: {
    bg: "#1f2937",
    color: "#fff",
    border: "#1f2937",
  },
  soft: {
    bg: THEME.primarySoft,
    color: THEME.primary,
    border: THEME.primary,
  },
  ghost: {
    bg: "#fff",
    color: THEME.text,
    border: THEME.border,
  },
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  onClick,
  disabled = false,
  style,
  ...rest
}) {
  const v = BTN_VARIANTS[variant] || BTN_VARIANTS.primary;
  const pad = size === "sm" ? "6px 10px" : size === "lg" ? "10px 14px" : "8px 12px";
  const font = size === "sm" ? 12 : 14;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        border: `1px solid ${v.border}`,
        background: v.bg,
        color: v.color,
        padding: pad,
        fontSize: font,
        borderRadius: 10,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
        ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  );
}

export function Tag({ children, tone = "info", style }) {
  const palette =
    tone === "success"
      ? { bg: "#ecfdf5", color: "#059669", bd: "#a7f3d0" }
      : tone === "warn"
      ? { bg: "#fff7ed", color: "#d97706", bd: "#fed7aa" }
      : tone === "danger"
      ? { bg: "#fef2f2", color: "#dc2626", bd: "#fecaca" }
      : tone === "neutral"
      ? { bg: "#f3f4f6", color: "#374151", bd: "#e5e7eb" }
      : { bg: "#eff6ff", color: "#2563eb", bd: "#bfdbfe" }; // info
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 8px",
        borderRadius: 999,
        fontSize: 12,
        border: `1px solid ${palette.bd}`,
        background: palette.bg,
        color: palette.color,
        ...style,
      }}
    >
      {children}
    </span>
  );
}

export function Divider({ style }) {
  return <div style={{ height: 1, background: THEME.border, margin: "8px 0", ...style }} />;
}

export function SectionTitle({ children, style }) {
  return (
    <div style={{ fontWeight: 700, marginBottom: 6, ...style }}>
      {children}
    </div>
  );
}

export function Input({ value, onChange, type = "text", placeholder, style, ...rest }) {
  const handle = (eOrVal) => {
    if (typeof onChange === "function") {
      if (eOrVal && eOrVal.target) onChange(eOrVal.target.value);
      else onChange(eOrVal);
    }
  };
  return (
    <input
      type={type}
      value={value}
      onChange={handle}
      placeholder={placeholder}
      style={{
        width: "100%",
        border: `1px solid ${THEME.border}`,
        background: "#fff",
        color: THEME.text,
        borderRadius: 10,
        padding: "8px 10px",
        fontSize: 14,
        ...style,
      }}
      {...rest}
    />
  );
}

export function Select({ value, onChange, options = [], style }) {
  const handle = (e) => {
    if (typeof onChange === "function") onChange(e.target.value);
  };
  return (
    <select
      value={value}
      onChange={handle}
      style={{
        width: "100%",
        border: `1px solid ${THEME.border}`,
        background: "#fff",
        color: THEME.text,
        borderRadius: 10,
        padding: "8px 10px",
        fontSize: 14,
        ...style,
      }}
    >
      {options.map((o) => (
        <option key={o.value ?? o.label} value={o.value ?? o.label}>
          {o.label ?? String(o.value)}
        </option>
      ))}
    </select>
  );
}

export function RadioRow({ value, onChange, items = [], style }) {
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", ...style }}>
      {items.map((it) => {
        const active = value === it.value;
        return (
          <button
            key={it.value}
            onClick={() => onChange && onChange(it.value)}
            style={{
              border: `1px solid ${active ? THEME.primary : THEME.border}`,
              background: active ? THEME.primarySoft : "#fff",
              color: active ? THEME.primary : THEME.text,
              padding: "6px 10px",
              borderRadius: 999,
              cursor: "pointer",
            }}
            type="button"
          >
            {it.label}
          </button>
        );
      })}
    </div>
  );
}
