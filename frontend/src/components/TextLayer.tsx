import { Text } from "react-konva";
import Konva from "konva";
import type { TextType } from "./types";

interface Props {
  texts: TextType[];
  onEraserClick: (id: string) => void;
  onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => void;
  onTransformEnd: (e: Konva.KonvaEventObject<DragEvent>) => void;
}

const TextLayer = ({ texts, onEraserClick, onDragEnd, onTransformEnd }: Props) => {
  return (
    <>
      {texts.map(text => (
        <Text
          id={"group-" + text.id}
          x={text.x}
          y={text.y}
          scaleX={text.scaleX}
          scaleY={text.scaleY}
          fontSize={text.fontSize}
          fontFamily="Inter"
          fontStyle="normal"
          fill="black"
          align="justify"
          ellipsis={true}
          lineHeight={1.25}
          text={text.text}
          draggable
          onClick={() => onEraserClick(text.id)}
          onDragEnd={onDragEnd}
          onTransformEnd={onTransformEnd}
        />
      ))}
    </>
  )
}

export default TextLayer
