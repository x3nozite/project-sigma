import { useCallback, useEffect, useRef } from "react"
import { Text } from "react-konva";
import type { ShapeType, TextType } from "../types";
import Konva from "konva";
import { Html } from "react-konva-utils";

interface Props {
  initialText: TextType;
  onEraserClick: (id: string) => void;
  onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => void;
  onTransformEnd: (e: Konva.KonvaEventObject<DragEvent>) => void;
  setShapes: React.Dispatch<React.SetStateAction<ShapeType[]>>;
  setIsEditingText: React.Dispatch<React.SetStateAction<boolean>>;
  isEditingText: boolean;
}

const TextArea = ({ textNode, onClose, onChange }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const stage = textNode.getStage();
    const textPosition = textNode.position();
    const stageBox = stage.container().getBoundingClientRect();
    const areaPosition = {
      x: textPosition.x,
      y: textPosition.y,
    };

    // Match styles with the text node
    textarea.value = textNode.text();
    textarea.style.position = "absolute";
    textarea.style.top = `${areaPosition.y}px`;
    textarea.style.left = `${areaPosition.x}px`;
    textarea.style.width = `${textNode.width() - textNode.padding() * 2}px`;
    textarea.style.height = `${textNode.height() - textNode.padding() * 2 + 5
      }px`;
    textarea.style.fontSize = `${textNode.fontSize()}px`;
    textarea.style.border = "none";
    textarea.style.padding = "0px";
    textarea.style.margin = "0px";
    textarea.style.overflow = "hidden";
    textarea.style.background = "none";
    textarea.style.outline = "none";
    textarea.style.resize = "none";
    textarea.style.lineHeight = textNode.lineHeight();
    textarea.style.fontFamily = textNode.fontFamily();
    textarea.style.transformOrigin = "left top";
    textarea.style.textAlign = textNode.align();
    textarea.style.color = textNode.fill();

    const rotation = textNode.rotation();
    let transform = "";
    if (rotation) {
      transform += `rotateZ(${rotation}deg)`;
    }
    textarea.style.transform = transform;

    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight + 3}px`;

    textarea.focus();

    const handleOutsideClick = (e) => {
      if (e.target !== textarea) {
        onChange(textarea.value);
        onClose();
      }
    };

    // Add event listeners
    const handleKeyDown = (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        onChange(textarea.value);
        onClose();
      }
      if (e.key === "Escape") {
        onClose();
      }
    };

    const handleInput = () => {
      const scale = textNode.getAbsoluteScale().x;
      textarea.style.width = `${textNode.width() * scale}px`;
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight + textNode.fontSize()
        }px`;
    };

    textarea.addEventListener("keydown", handleKeyDown);
    textarea.addEventListener("input", handleInput);
    setTimeout(() => {
      window.addEventListener("click", handleOutsideClick);
    });

    return () => {
      textarea.removeEventListener("keydown", handleKeyDown);
      textarea.removeEventListener("input", handleInput);
      window.removeEventListener("click", handleOutsideClick);
    };
  }, [textNode, onChange, onClose]);

  return (
    <textarea
      ref={textareaRef}
      style={{
        minHeight: "1em",
        position: "absolute",
      }}
    />
  );
};

const TextEditor = (props) => {
  return (
    <Html>
      <TextArea {...props} />
    </Html>
  );
};

const EditableText = ({ initialText, onEraserClick, onDragEnd, onTransformEnd, setShapes, setIsEditingText, isEditingText }: Props) => {
  const textRef = useRef(null);

  const handleTextDblClick = useCallback(() => {
    setIsEditingText(true);
  }, [setIsEditingText]);

  const handleTextChange = useCallback((newText: string) => {
    setShapes(prev => prev.map(shape => shape.id === initialText.id ? { ...shape, text: newText } : shape))
  }, [initialText.id, setShapes])

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
        fontSize={initialText.fontSize}
        fontFamily="Inter"
        fontStyle="normal"
        fill="black"
        align="justify"
        ellipsis={true}
        lineHeight={1.25}
        text={initialText.text}
        draggable
        onClick={() => onEraserClick(initialText.id)}
        onDragEnd={onDragEnd}
        onTransformEnd={onTransformEnd}
        onDblClick={handleTextDblClick}
        onDblTap={handleTextDblClick}
        visible={!isEditingText}
      />
      {isEditingText && (
        <TextEditor
          textNode={textRef.current}
          onChange={handleTextChange}
          onClose={() => { setIsEditingText(false) }}
        />
      )}
    </>
  )
}

export default EditableText
