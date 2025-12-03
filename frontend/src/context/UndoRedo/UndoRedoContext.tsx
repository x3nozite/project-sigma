import { createContext } from "react";
import type { ArrowType, ShapeType, UndoEntry } from "../../components/types";

interface UndoRedoType {
  undoStack: UndoEntry[];
  redoStack: UndoEntry[];
  pushUndo: (entry: UndoEntry) => void;
  undo: (shapes: ShapeType[], connectors: ArrowType[], setShapes: React.Dispatch<React.SetStateAction<ShapeType[]>>, setConnectors: React.Dispatch<React.SetStateAction<ArrowType[]>>) => void;
  redo: () => void;
}

export const UndoRedoContext = createContext<UndoRedoType | null>(null)

