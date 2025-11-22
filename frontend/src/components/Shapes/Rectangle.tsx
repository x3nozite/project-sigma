import { Circle, Group, Rect, Text } from "react-konva";
import type { RectType, ShapeType, ToolType } from "../types";
import { useState } from "react";
import Konva from "konva";

interface Props {
  rect: RectType;
  setShapes: React.Dispatch<React.SetStateAction<ShapeType[]>>;
  collapseChild: (rect: RectType, currentlyCollapsed: boolean) => void;
  onDragStart: (e: Konva.KonvaEventObject<DragEvent>) => void;
  onDragMove: (e: Konva.KonvaEventObject<DragEvent>) => void;
  onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => void;
  onShapeClick: (shape: ShapeType | null) => void;
  tool: ToolType;
  handleEraserClick: (rectId: string) => void;
  onTransformEnd: (e: Konva.KonvaEventObject<DragEvent>) => void;
}

const Rectangle = ({
  rect,
  setShapes,
  onDragStart,
  onDragMove,
  onDragEnd,
  tool,
  collapseChild,
  handleEraserClick,
  onShapeClick,
  onTransformEnd,
}: Props) => {
  // hover to show todo
  const [isHovered, setisHovered] = useState(false);

  // change border color
  function getBorder(color: string) {
    let border;

    if (color === "#ff2056") border = "#f6339a"; // rose-400
    else if (color === "#2b7fff") border = "#00a6f4"; // sky-500
    else if (color === "#00bc7d") border = "#00c951"; // emerald-600
    else if (color === "#ad46ff") border = "#8e51ff"; // violet-500
    else if (color === "#ff6900") border = "#fd9a00"; // orange-600

    return border;
  }
  const borderColor = getBorder(rect.color);

  return (
    <Group
      key={"key-" + rect.id}
      id={"group-" + rect.id}
      shapeId={rect.id}
      x={rect.x}
      y={rect.y}
      name="shape"
      scalingX={rect.scaleX ?? 1}
      scalingY={rect.scaleY ?? 1}
      scaleX={rect.scaleX ?? 1}
      scaleY={rect.scaleY ?? 1}
      draggable={tool !== "eraser"}
      onDragStart={onDragStart}
      onDragMove={onDragMove}
      onDragEnd={onDragEnd}
      onTransformEnd={onTransformEnd}
      onMouseEnter={() => {
        if (tool === "hand") setisHovered(true);
      }}
      onMouseLeave={() => {
        if (tool === "hand") setisHovered(false);
      }}
      onClick={() => {
        handleEraserClick(rect.id);
        if (tool === "hand") {
          onShapeClick(rect);
        }
      }}
    >
      <Group visible={!rect.isCollapsed}>
        <Rect
          className="mainRect"
          id={rect.id}
          width={Math.round(rect.width)}
          height={Math.round(rect.height)}
          fill="white"
          shadowBlur={6}
          shadowOpacity={0.5}
          shadowColor="black"
          shadowOffset={{ x: 0, y: 4 }}
          cornerRadius={[16, 8, 8, 8]}
          stroke={borderColor}
          strokeWidth={2.5}
          shadowForStrokeEnabled={false}
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
          height={rect.height * 0.7}
          listening={false}
        />
        <Text
          text={rect.dueDate}
          x={0}
          y={rect.height - 35}
          width={rect.width}
          height={16}
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
        {isHovered && (
          <Group x={rect.width + 5} y={rect.height / 2}>
            <Circle radius={16} fill="blue" />
          </Group>
        )}
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
          visible={rect.isCollapsed}
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
              const isCurrentlyCollapsed = rect.isCollapsed;
              if (isCurrentlyCollapsed) {
                collapseChild(rect, true);
              } else {
                collapseChild(rect, false);
              }

              e.cancelBubble = true;
              setShapes((prev) => {
                return prev.map((r) => {
                  if (r.shape === "rect" && r.id === rect.id) {
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
