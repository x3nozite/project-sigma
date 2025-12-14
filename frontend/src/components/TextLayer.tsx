import Konva from "konva";
import type { ShapeType, TextType, ToolType } from "./types";
import EditableText from "./Shapes/EditableText";
import TextEditor from "./Shapes/TextEditor";
import { useCallback, useState } from "react";
import { useUndoRedo } from "../context/UndoRedo/UndoRedoHelper";

interface Props {
  texts: TextType[];
  onEraserClick: (id: string) => void;
  onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => void;
  onTransformEnd: (e: Konva.KonvaEventObject<DragEvent>) => void;
  setShapes: React.Dispatch<React.SetStateAction<ShapeType[]>>;
  setIsEditingText: React.Dispatch<React.SetStateAction<boolean>>;
  isEditingText: boolean;
  tool: ToolType;
}

const TextLayer = ({ texts, onEraserClick, onDragEnd, onTransformEnd, setShapes, setIsEditingText, isEditingText, tool }: Props) => {
  const [editingRef, setEditingRef] = useState<Konva.Text | null>(null);
  const { pushUndo } = useUndoRedo();

  const handleTextChange = useCallback((newText: string) => {
    if (!editingRef) return;
    if (newText === "") {
      setShapes(prev => {
        const deletedShape = prev.find(s => "group-" + s.id === editingRef.id());
        if (deletedShape) {
          pushUndo({ action: "delete", before: deletedShape, after: deletedShape });
        }
        return prev.filter(s => "group-" + s.id !== editingRef.id());
      });
      return;
    }

    setShapes(prev => {
      return prev.map(shape => {
        if ("group-" + shape.id === editingRef.id()) {
          if (shape.shape === "text")
            pushUndo({
              action: "update",
              before: shape,      // previous shape
              after: { ...shape, text: newText }, // new shape
            });
          return { ...shape, text: newText }; // apply change
        }
        return shape;
      });
    });
  }, [setShapes, editingRef, pushUndo])


  return (
    <>
      {texts.map(text => (
        <EditableText
          key={text.id}
          initialText={text}
          onEraserClick={onEraserClick}
          onDragEnd={onDragEnd}
          onTransformEnd={onTransformEnd}
          setShapes={setShapes}
          setIsEditingText={setIsEditingText}
          isEditingText={isEditingText}
          tool={tool}
          editingRef={editingRef}
          setEditingRef={setEditingRef}
        />
      ))}
      {isEditingText && editingRef && (
        <TextEditor
          textNode={editingRef}
          onChange={handleTextChange}
          onClose={() => { setIsEditingText(false) }}
        />
      )}
    </>
  )
}

export default TextLayer
