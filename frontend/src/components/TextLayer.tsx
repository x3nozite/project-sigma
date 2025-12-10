import Konva from "konva";
import type { ShapeType, TextType } from "./types";
import EditableText from "./Shapes/EditableText";

interface Props {
  texts: TextType[];
  onEraserClick: (id: string) => void;
  onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => void;
  onTransformEnd: (e: Konva.KonvaEventObject<DragEvent>) => void;
  setShapes: React.Dispatch<React.SetStateAction<ShapeType[]>>;
  setIsEditingText: React.Dispatch<React.SetStateAction<boolean>>;
  isEditingText: boolean;
}

const TextLayer = ({ texts, onEraserClick, onDragEnd, onTransformEnd, setShapes, setIsEditingText, isEditingText }: Props) => {
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
        />
      ))}
    </>
  )
}

export default TextLayer
