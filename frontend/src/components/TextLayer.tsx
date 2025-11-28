import { Text } from "react-konva";
import type { TextType } from "./types";

interface Props {
  texts: TextType[];
}

const TextLayer = ({ texts }: Props) => {
  return (
    <>
      {texts.map(text => (
        <Text
          id={text.id}
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
        />
      ))}
    </>
  )
}

export default TextLayer
