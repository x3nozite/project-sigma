import { useCallback, useRef } from "react"
import { Text } from "react-konva";
import type { ShapeType, TextType, ToolType } from "../types";
import Konva from "konva";

interface Props {
  initialText: TextType;
  onEraserClick: (id: string) => void;
  onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => void;
  onTransformEnd: (e: Konva.KonvaEventObject<DragEvent>) => void;
  setShapes: React.Dispatch<React.SetStateAction<ShapeType[]>>;
  setIsEditingText: React.Dispatch<React.SetStateAction<boolean>>;
  isEditingText: boolean;
  tool: ToolType;
  setEditingRef: React.Dispatch<React.SetStateAction<Konva.Text | null>>;
  editingRef: Konva.Text | null;
}

const EditableText = ({ initialText, onEraserClick, onDragEnd, onTransformEnd, setShapes, setIsEditingText, isEditingText, tool, setEditingRef, editingRef }: Props) => {
  const textRef = useRef<Konva.Text | null>(null);

  const handleTextDblClick = useCallback(() => {
    if (tool !== "hand") return;
    setIsEditingText(true);
    setEditingRef(textRef.current);

  }, [setIsEditingText, tool, setEditingRef]);


  const handleTransform = useCallback(() => {
    const node = textRef.current;
    if (!node) return;

    const transformer = node.getStage()?.findOne("#transformer") as Konva.Transformer;
    if (!transformer) return;
    const anchor = transformer?.getActiveAnchor();

    // Horizontal resize only
    if (anchor === "middle-right" || anchor === "middle-left") {
      const newWidth = node.width() * node.scaleX();

      node.setAttrs({
        width: newWidth,
        scaleX: 1,
      });

      return;
    }
    // Vertical-only or diagonal → treat as scaling
    if (anchor) {
      const newFontSize = node.fontSize() * node.scaleY();
      const newWidth = node.width() * node.scaleX();

      node.setAttrs({
        width: newWidth,
        fontSize: newFontSize,
        scaleX: 1,
        scaleY: 1,
      });
      return;
    }
  }, []);

  return (
    <>
      <Text
        ref={textRef}
        key={"key-" + initialText.id}
        id={"group-" + initialText.id}
        shapeId={initialText.id}
        name="shape"
        x={initialText.x}
        y={initialText.y}
        scaleX={initialText.scaleX}
        scaleY={initialText.scaleY}
        width={initialText.width}
        fontSize={initialText.fontSize}
        fontFamily="Inter"
        fontStyle="normal"
        fill="black"
        align="left"
        lineHeight={1}
        text={initialText.text}
        draggable
        onClick={() => onEraserClick(initialText.id)}
        onDragEnd={onDragEnd}
        onTransform={handleTransform}
        onTransformEnd={onTransformEnd}
        onDblClick={handleTextDblClick}
        onDblTap={handleTextDblClick}

        visible={!(isEditingText && editingRef && editingRef?.id() === "group-" + initialText.id)}
      />
    </>
  )
}

export default EditableText
