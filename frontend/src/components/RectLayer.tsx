import Konva from "konva";
import type { RectType, ShapeType, ToolType } from "./types";
import Rectangle from "./Rectangle";

interface Props {
  rects: RectType[];
  setRects: React.Dispatch<React.SetStateAction<RectType[]>>;
  collapseChild: (rect: RectType, currentlyCollapsed: boolean) => void;
  onDragStart: (e: Konva.KonvaEventObject<DragEvent>) => void;
  onDragMove: (e: Konva.KonvaEventObject<DragEvent>) => void;
  onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => void;
  tool: ToolType;
  handleEraserClick: (rectId: string) => void;
  onShapeClick: (shape: ShapeType | null) => void;
}

const RectLayer = ({ rects, setRects, onDragStart, onDragMove, onDragEnd, tool, collapseChild, handleEraserClick, onShapeClick }: Props) => {

  return (
    <>
      {rects.map((rect) => (
        <Rectangle
          rect={rect}
          key={"ket-" + rect.id}
          setRects={setRects}
          onDragStart={onDragStart}
          onDragMove={onDragMove}
          onDragEnd={onDragEnd}
          tool={tool}
          collapseChild={collapseChild}
          handleEraserClick={handleEraserClick}
          onShapeClick={onShapeClick}
        />
      ))}
    </>
  )
}

export default RectLayer
