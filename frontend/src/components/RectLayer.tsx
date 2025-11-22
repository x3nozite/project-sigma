import Konva from "konva";
import type { RectType, ShapeType, ToolType } from "./types";
import Rectangle from "./Shapes/Rectangle";

interface Props {
  shapes: RectType[];
  setShapes: React.Dispatch<React.SetStateAction<ShapeType[]>>;
  collapseChild: (rect: RectType, currentlyCollapsed: boolean) => void;
  onDragStart: (e: Konva.KonvaEventObject<DragEvent>) => void;
  onDragMove: (e: Konva.KonvaEventObject<DragEvent>) => void;
  onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => void;
  tool: ToolType;
  handleEraserClick: (rectId: string) => void;
  onShapeClick: (shape: ShapeType | null) => void;
  onTransformEnd: (e: Konva.KonvaEventObject<DragEvent>) => void;
  // briant added these
  getBorder: (color: string) => string | undefined;
  addTodo: (parentId?: RectType) => void;
}

const RectLayer = ({
  shapes,
  setShapes,
  onDragStart,
  onDragMove,
  onDragEnd,
  tool,
  collapseChild,
  handleEraserClick,
  onShapeClick,
  onTransformEnd,
  getBorder,
  addTodo,
}: Props) => {
  return (
    <>
      {shapes.map((rect) => (
        <Rectangle
          rect={rect}
          key={"key-" + rect.id}
          setShapes={setShapes}
          onDragStart={onDragStart}
          onDragMove={onDragMove}
          onDragEnd={onDragEnd}
          onTransformEnd={onTransformEnd}
          tool={tool}
          collapseChild={collapseChild}
          handleEraserClick={handleEraserClick}
          onShapeClick={onShapeClick}
          getBorder={getBorder}
          addTodo={addTodo}
        />
      ))}
    </>
  );
};

export default RectLayer;
