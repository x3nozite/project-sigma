import { useState, type ReactNode } from "react";
import type { ArrowType, ShapeType, UndoEntry } from "../../components/types";
import { UndoRedoContext } from "./UndoRedoContext";

export function UndoRedoProvider({ children }: { children: ReactNode }) {
  const [undoStack, setUndoStack] = useState<UndoEntry[]>([]);
  const [redoStack, setRedoStack] = useState<UndoEntry[]>([]);

  function pushUndo(entry: UndoEntry) {
    setUndoStack(prev => [...prev, entry]);
    setRedoStack([]);
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
      const element = entry.before;

      if (entry.action === "add") {
        if (element.shape === "connector") {
          setShapes(prev =>
            prev.map(shape => {
              if (shape.shape === "todo") {
                return { ...shape, parents: (shape.parents === element.to) ? "" : shape.parents }
              };
              if (shape.shape !== "rect") return shape;
              return {
                ...shape,
                children: shape.children.filter(child => child !== element.from),
                parents: (shape.parents === element.to) ? "" : shape.parents
              };
            })
          );
          setConnectors(prev =>
            prev.filter(conn => conn.id !== element.id)
          );
        } else {
          setShapes(prev => prev.filter(shape => shape.id !== element.id));
        }
      } else if (entry.action === "update") {
        if (element.shape === "connector") return;
        setShapes(prev =>
          prev.map(shape => shape.id === element.id ? { ...shape, ...element } : shape)
        )
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

  function redo(setShapes: React.Dispatch<React.SetStateAction<ShapeType[]>>, setConnectors: React.Dispatch<React.SetStateAction<ArrowType[]>>) {
    const last = redoStack.at(-1);
    if (!last) return;

    let tempStack = [...redoStack];
    let collected: UndoEntry[] = [];
    collected = [];

    while (tempStack.length > 0) {
      const entry = tempStack.at(-1);
      if (!entry) break;
      const element = entry.after;

      // FORWARD REPLAY
      if (entry.action === "add") {
        if (element.shape === "connector") {
          setConnectors(prev => [...prev, element]);

          setShapes(prev =>
            prev.map(shape => {
              if (shape.shape === "todo") {
                return {
                  ...shape,
                  parents: (shape.id === element.to) ? element.from : shape.parents
                };
              }
              if (shape.shape !== "rect") return shape;

              return {
                ...shape,
                children: shape.id === element.to
                  ? [...shape.children, element.from]
                  : shape.children
              };
            })
          );

        } else {
          // node
          setShapes(prev => [...prev, element]);
        }

      } else if (entry.action === "update") {
        if (element.shape === "connector") return;

        setShapes(prev =>
          prev.map(shape =>
            shape.id === element.id ? { ...shape, ...element } : shape
          )
        );

      } else if (entry.action === "delete") {
        if (element.shape === "connector") {
          // delete → redo means add connector back
          setConnectors(prev => [...prev, element]);
        } else {
          setShapes(prev => [...prev, element]);
        }
      }

      collected.push(entry);
      tempStack = tempStack.slice(0, -1);

      const next = tempStack.at(-1);
      if (!next || !next.id || next.id !== last.id) break;
    }

    // move batch back to undo
    setRedoStack(tempStack);
    setUndoStack(prev => [...prev, ...collected]);
  }
  // function redo() {
  //   const last = redoStack.at(-1);
  //   if (!last) return;
  //
  //   // TODO: redo changes
  //
  //   setRedoStack(prev => prev.slice(0, -1));
  //   setUndoStack(prev => [...prev, last]);
  // }

  return (
    <UndoRedoContext.Provider value={{ undoStack, redoStack, pushUndo, undo, redo }}>
      {children}
    </UndoRedoContext.Provider>
  )
}
