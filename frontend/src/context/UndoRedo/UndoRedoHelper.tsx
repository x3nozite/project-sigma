import { useContext } from "react";
import { UndoRedoContext } from "./UndoRedoContext";

export function useUndoRedo() {
  const ctx = useContext(UndoRedoContext);
  if (!ctx) throw new Error("useUndo must be used inside a <UndoRedoProvider>")
  return ctx;
}
