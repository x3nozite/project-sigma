import { Group, Rect, Text } from "react-konva";
import type { RectType } from "./types";

interface Props {
  rects: RectType[];
  setRects: React.Dispatch<React.SetStateAction<RectType[]>>;

  onDragStart: (e) => void;
  onDragMove: (e) => void;
  onDragEnd: (e) => void;
}

const Rectangle = ({
  rects,
  setRects,
  onDragStart,
  onDragMove,
  onDragEnd,
}: Props) => {
  return (
    <>
      {rects.map((rect, i) => (
        <Group
          id={rect.id}
          key={i}
          x={rect.x}
          y={rect.y}
          draggable
          onDragStart={onDragStart}
          onDragMove={onDragMove}
          onDragEnd={onDragEnd}
        >
          <Rect
            width={rect.width}
            height={rect.height}
            fill={rect.color}
            shadowBlur={2}
            stroke="black"
            strokeWidth={1}
            isCollapsed={false}
          />
          {rect.texts.map((text, j) => (
            <Text
              x={0}
              y={0}
              key={j}
              id={text.id}
              text={text.value}
              fontSize={16}
              fontFamily="Calibri"
              fill="black"
              width={rect.width}
              height={rect.height}
              align="center"
              verticalAlign="middle"
            />
          ))}
          <Text
            x={0}
            y={0}
            text={rect.isCollapsed ? "+" : "-"}
            fontSize={32}
            width={rect.width}
            height={rect.height}
            align="right"
            verticalAlign="top"
            onClick={() => {
              setRects((prev) => {
                return prev.map((r) => {
                  if (r.id === rect.id) {
                    return { ...r, isCollapsed: !r.isCollapsed };
                  } else {
                    return r;
                  }
                });
              });
            }}
          ></Text>
        </Group>
      ))}
    </>
  );
};

export default Rectangle;
