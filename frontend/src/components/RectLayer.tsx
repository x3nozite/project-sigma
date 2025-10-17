import Konva from "konva";
import type { RectType } from "./types";
import Rectangle from "./Rectangle";

interface Props {
  rects: RectType[];
  setRects: React.Dispatch<React.SetStateAction<RectType[]>>;
  collapseChild: (rect: RectType, currentlyCollapsed: boolean) => void;
  onDragStart: (e: Konva.KonvaEventObject<DragEvent>) => void;
  onDragMove: (e: Konva.KonvaEventObject<DragEvent>) => void;
  onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => void;
  tool: "select" | "eraser";
  handleClick: (rectId: string) => void;
}

const RectLayer = ({ rects, setRects, onDragStart, onDragMove, onDragEnd, tool, collapseChild, handleClick }: Props) => {

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
          handleClick={handleClick}
        />
      ))}
    </>
  )
}

export default RectLayer
