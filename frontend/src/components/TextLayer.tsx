import Konva from "konva";
import type { ShapeType, TextType, ToolType } from "./types";
import EditableText from "./Shapes/EditableText";
import TextEditor from "./Shapes/TextEditor";
import { useCallback, useState } from "react";

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

  const handleTextChange = useCallback((newText: string) => {
    if (!editingRef) return;
    if (newText === "") {
      setShapes(prev => prev.filter(s => "group-" + s.id !== editingRef.id()));
    }
    setShapes(prev => prev.map(shape => "group-" + shape.id === editingRef.id() ? { ...shape, text: newText } : shape))
  }, [setShapes, editingRef])

  return (
    <>
      {texts.map(text => (
        <EditableText
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
