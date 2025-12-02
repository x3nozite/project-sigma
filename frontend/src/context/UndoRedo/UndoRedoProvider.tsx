import { useState, type ReactNode } from "react";
import type { UndoEntry } from "../../components/types";
import { UndoRedoContext } from "./UndoRedoContext";

export function UndoRedoProvider({ children }: { children: ReactNode }) {
  const [undoStack, setUndoStack] = useState<UndoEntry[]>([]);
  const [redoStack, setRedoStack] = useState<UndoEntry[]>([]);

  function pushUndo(entry: UndoEntry) {
    setUndoStack(prev => [...prev, entry]);
    setRedoStack([]);

    console.log("test push undo");
  }

  function undo() {
    const last = undoStack.at(-1);
    if (!last) return;

    // TODO: undo changes to shape

    setUndoStack(prev => prev.slice(0, -1));
    setRedoStack(prev => [...prev, last]);
  }

  function redo() {
    const last = redoStack.at(-1);
    if (!last) return;

    // TODO: redo changes

    setRedoStack(prev => prev.slice(0, -1));
    setUndoStack(prev => [...prev, last]);
  }

  return (
    <UndoRedoContext.Provider value={{ undoStack, redoStack, pushUndo, undo, redo }}>
      {children}
    </UndoRedoContext.Provider>
  )
}
