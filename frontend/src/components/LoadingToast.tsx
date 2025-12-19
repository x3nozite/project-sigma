import type { LoadingToastType } from "./types";

type LoadingToastProps = {
  message: string;
  type: LoadingToastType;
};

export default function Toast({ message, type }: LoadingToastProps) {
  const colors: Record<LoadingToastType, string> = {
    loading: "#facc15", // yellow
    success: "#22c55e", // green
    empty: "#9ca3af",   // gray
    error: "#ef4444",   // red
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        padding: "10px 14px",
        background: colors[type],
        color: "#111",
        borderRadius: 8,
        fontSize: 14,
        fontWeight: 500,
        boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
        zIndex: 9999,
        transition: "background 0.25s ease",
      }}
    >
      {message}
    </div>
  );
}
