import { Group, Rect, Text } from "react-konva";
import type { RectType } from "./types";
import Konva from "konva";
import { useEffect, useReducer, useRef } from "react";

interface Props {
  rect: RectType;
  setRects: React.Dispatch<React.SetStateAction<RectType[]>>;

  onDragStart: (e: Konva.KonvaEventObject<DragEvent>) => void;
  onDragMove: (e: Konva.KonvaEventObject<DragEvent>) => void;
  onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => void;
  tool: "select" | "eraser";
}

const Rectangle = ({
  rect,
  setRects,
  onDragStart,
  onDragMove,
  onDragEnd,
  tool,
}: Props) => {
  const handleClick = (rectId: string) => {
    if (tool === "eraser") {
      setRects((prev) => prev.filter((r) => r.id !== rectId));
    }
  };

  return (
    <Group
      key={"key-" + rect.id}
      id={"group-" + rect.id}
      x={rect.x}
      y={rect.y}
      draggable={tool !== "eraser"}
      onDragStart={onDragStart}
      onDragMove={onDragMove}
      onDragEnd={onDragEnd}
      onClick={() => handleClick(rect.id)}
    >
      <Group
        visible={rect.isCollapsed}
      >
        <Rect
          id={rect.id}
          width={Math.round(rect.width)}
          height={Math.round(rect.height)}
          fill="white"
          shadowBlur={10}
          shadowOpacity={0.5}
          shadowColor="black"
          shadowOffset={{ x: 0, y: 4 }}
          cornerRadius={[16, 4, 4, 4]}
        />
        <Text
          x={0}
          y={50}
          text={rect.description}
          fontSize={14}
          fontFamily="Inter"
          fontStyle="normal"
          fill="gray"
          align="justify"
          ellipsis={true}
          lineHeight={1.25}
          padding={10}
          width={rect.width}
          height={rect.height}
          listening={false}
        />
        <Text
          text={rect.dueDate}
          x={0}
          y={rect.height - 35}
          width={rect.width}
          height={rect.height}
          fontFamily="Inter"
          fontSize={12}
          fontStyle="light"
          padding={5}
          align="right"
          fill="blue"
          opacity={0.8}
          listening={false}
        ></Text>
        <Group>
          <Rect
            fill="#efb100"
            width={100}
            height={30}
            x={10}
            y={rect.height - 40}
            cornerRadius={10}
          ></Rect>
          <Text
            text={rect.status}
            width={100}
            height={30}
            fontFamily="Inter"
            align="left"
            fill="white"
            x={17}
            y={rect.height - 42}
            padding={10}
          ></Text>
        </Group>
      </Group>
      <Group>
        <Rect
          x={0}
          y={0}
          width={rect.width}
          height={rect.height * 0.25}
          cornerRadius={[16, 4, 4, 4]}
          fill={rect.color}
          shadowBlur={10}
          shadowOpacity={0.5}
          shadowColor="black"
          shadowOffset={{ x: 0, y: 4 }}
          visible={!rect.isCollapsed}
        />
        <Rect
          x={0}
          y={0}
          width={rect.width}
          height={rect.height * 0.25}
          cornerRadius={[16, 4, 4, 4]}
          fill={rect.color}
        ></Rect>
        <Text
          x={10}
          y={15}
          text={rect.title}
          fontFamily="Inter"
          fill="white"
          fontStyle="bold"
          fontSize={16}
        ></Text>
        <Text
          x={rect.width * 0.9}
          y={5}
          fill="white"
          text={rect.isCollapsed ? "+" : "-"}
          fontSize={32}
          align="right"
          verticalAlign="top"
          onClick={(e) => {
            if (tool !== "eraser") {
              e.cancelBubble = true;
              setRects((prev) => {
                return prev.map((r) => {
                  if (r.id === rect.id) {
                    return { ...r, isCollapsed: !r.isCollapsed };
                  } else {
                    return r;
                  }
                });
              });
            }
          }}
        ></Text>
      </Group>
    </Group>
  );
};

export default Rectangle;
