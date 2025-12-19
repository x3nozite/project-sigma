import type { LoadingToastType } from "./types";
import { IoMdCheckmark } from "react-icons/io";
import { FiLoader } from "react-icons/fi";
import { FiAlertCircle } from "react-icons/fi";
import { LuCircleHelp } from "react-icons/lu";
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
      {type === "success" && (
          <div className="flex items-center gap-2">
            <IoMdCheckmark color="#000000" />
            {message}
          </div>
      )}

      {type === "error" && (
          <div className="flex items-center gap-2">
            <FiAlertCircle color="#000000" />
            {message}
          </div>
      )}

      {type === "loading" && (
          <div className="flex items-center gap-2">
            <FiLoader color="#000000" />
            {message}
          </div>
      )}

      {type === "empty" && (
          <div className="flex items-center gap-2">
            <LuCircleHelp color="#000000" />
            {message}
          </div>
      )}
    </div>
  );
}
