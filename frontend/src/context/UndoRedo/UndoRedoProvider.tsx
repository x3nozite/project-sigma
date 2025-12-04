import { useState, type ReactNode } from "react";
import type { ArrowType, ShapeType, UndoEntry } from "../../components/types";
import { UndoRedoContext } from "./UndoRedoContext";

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

    let tempStack;
    let collected = [];
    tempStack = [...undoStack];
    collected = [];

    // TODO: undo changes to shape
    while (tempStack.length > 0) {
      const entry = tempStack.at(-1);
      if (!entry) return;

      if (entry.action === "add") {
        entry.items.forEach(element => {
          if (element.shape === "connector") {
            setShapes(prev =>
              prev.map(shape => {
                if (shape.shape === "todo") {
                  console.log("parent: " + shape.parents);
                  console.log(element.to);
                  return { ...shape, parents: (shape.parents === element.to) ? "" : shape.parents }
                };
                if (shape.shape !== "rect") return shape;
                console.log("test");
                return {
                  ...shape,
                  children: shape.children.filter(child => child !== element.from),
                  parents: ("group-" + shape.parents === element.to) ? "" : shape.parents
                };
              })
            );
            setConnectors(prev =>
              prev.filter(conn => conn.id !== element.id)
            );
          } else {
            setShapes(prev => prev.filter(shape => shape.id !== element.id));
          }
        });
      } else if (entry.action === "update") {
        entry.items.forEach(item => {
          if (item.shape === "connector") return;
          setShapes(prev =>
            prev.map(shape => shape.id === item.id ? { ...shape, ...item } : shape)
          )
        })
      }

      collected.push(entry);
      tempStack = tempStack.slice(0, -1);
      const nextElement = tempStack.at(-1);

      if (!nextElement || !nextElement.id || !last.id || nextElement.id !== last.id) break;
    }
    setUndoStack(tempStack);
    setRedoStack(prev => [...prev, ...collected]);

    if (last.action === "delete") return;

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
