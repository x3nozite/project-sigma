import { createContext } from "react";
import type { UndoEntry } from "../../components/types";

interface UndoRedoType {
  undoStack: UndoEntry[];
  redoStack: UndoEntry[];
  pushUndo: (entry: UndoEntry) => void;
  undo: () => void;
  redo: () => void;
}

export const UndoRedoContext = createContext<UndoRedoType | null>(null)

