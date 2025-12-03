import { useState, type ReactNode } from "react";
import type { ArrowType, ShapeType, UndoEntry } from "../../components/types";
import { UndoRedoContext } from "./UndoRedoContext";
import { en } from "zod/v4/locales";

export function UndoRedoProvider({ children }: { children: ReactNode }) {
  const [undoStack, setUndoStack] = useState<UndoEntry[]>([]);
  const [redoStack, setRedoStack] = useState<UndoEntry[]>([]);

  function pushUndo(entry: UndoEntry) {
    setUndoStack(prev => [...prev, entry]);
    setRedoStack([]);

    console.log("test push undo");
  }

  function undo(shapes: ShapeType[], connectors: ArrowType[], setShapes: React.Dispatch<React.SetStateAction<ShapeType[]>>, setConnectors: React.Dispatch<React.SetStateAction<ArrowType[]>>) {
    const last = undoStack.at(-1);
    if (!last) return;

    // TODO: undo changes to shape
    if (last.action === "add") {
      last.items.forEach(element => {
        if (element.shape === "connector") {
          setConnectors(prev =>
            prev.filter(conn => conn.id !== element.id)
          );
        } else {
          setShapes(prev => prev.filter(shape => shape.id !== element.id));
        }
      });
      setUndoStack(prev => prev.slice(0, -1));
      setRedoStack(prev => [...prev, last]);
      return;
    }
    if (last.action === "update" && last.id) {
      console.log(last.id);
      let tempStack = [...undoStack];
      let collected = [];
      collected = [];

      while (tempStack.length > 0) {
        const entry = tempStack.at(-1);
        if (!entry || entry.id !== last.id) return;
        entry.items.forEach(item => {
          if (item.shape === "connector") return;
          setShapes(prev =>
            prev.map(shape => shape.id === item.id ? { ...shape, ...item } : shape)
          )
        })
        collected.push(entry);
        tempStack = tempStack.slice(0, -1);
        setUndoStack(prev => prev.slice(0, -1));
      }

      setRedoStack(prev => [...prev, ...collected]);
      return;
    }

    if (last.action === "update" && !last.id) {
      last.items.forEach(item => {
        if (item.shape === "connector") return;
        setShapes(prev =>
          prev.map(shape => shape.id === item.id ? { ...shape, ...item } : shape)
        )
      })
      setUndoStack(prev => prev.slice(0, -1));
      setRedoStack(prev => [...prev, last]);
    }

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
