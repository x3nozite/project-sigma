import { useEffect, useRef } from "react";
import Konva from "konva";

interface TextAreaProps {
  textNode: Konva.Text;
  onClose: () => void;
  onChange: (value: string) => void;
}

const TextArea = ({ textNode, onClose, onChange }: TextAreaProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const textPosition = textNode.position();
    const areaPosition = {
      x: textPosition.x,
      y: textPosition.y,
    };

    // Match styles with the text node
    textarea.style.position = "absolute";
    textarea.value = textNode.text();
    textarea.style.top = `${areaPosition.y}px`;
    textarea.style.left = `${areaPosition.x}px`;
    textarea.style.width = `${textNode.width() - textNode.padding() * 2}px`;
    textarea.style.height = `${textNode.height()}px`;
    textarea.style.fontSize = `${textNode.fontSize()}px`;
    textarea.style.border = "1px solid #ccc";
    textarea.style.borderRadius = "4px";
    textarea.style.padding = "0px";
    textarea.style.margin = "0px";
    textarea.style.overflow = "hidden";
    textarea.style.background = "none";
    textarea.style.outline = "none";
    textarea.style.resize = "none";
    textarea.style.lineHeight = String(textNode.lineHeight());
    textarea.style.fontFamily = textNode.fontFamily();
    textarea.style.transformOrigin = "left top";
    textarea.style.textAlign = textNode.align();
    textarea.style.boxSizing = "border-box";

    const rotation = textNode.rotation();
    let transform = "";
    if (rotation) {
      transform += `rotateZ(${rotation}deg)`;
    }
    textarea.style.transform = transform;

    textarea.focus();

    const handleOutsideClick = (e: MouseEvent) => {
      if (e.target !== textarea) {
        onChange(textarea.value);
        onClose();
      }
    };

    // Add event listeners
    const handleKeyDown = (e: KeyboardEvent) => {
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
      textarea.style.width = `${textNode.width() - textNode.padding() * 2}px`;
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

const TextEditor = (props: TextAreaProps) => {
  return (
    <Html>
      <TextArea {...props} />
    </Html>
  );
};

export default TextEditor;
