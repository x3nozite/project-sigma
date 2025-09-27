import { Rect } from "react-konva";

interface Props {
  rects: { x: number, y: number, width: number, height: number, id: string }[];
  setRects: React.Dispatch<React.SetStateAction<{ x: number, y: number, width: number, height: number, id: string }[]>>;
  onDragStart: (e) => void;
  onDragMove: (e) => void;
  onDragEnd: (e) => void;
}

const Rectangle = ({ rects, setRects, onDragStart, onDragMove, onDragEnd }: Props) => {
  return (
    <>
      {
        rects.map((rect, i) => (
          <Rect
            draggable
            id={rect.id}
            key={i}
            x={rect.x}
            y={rect.y}
            width={50}
            height={50}
            fill="white"
            shadowBlur={2}
            stroke="black"
            strokeWidth={1}
            onDragStart={onDragStart}
            onDragMove={onDragMove}
            onDragEnd={onDragEnd}
          />
        ))
      }
    </>
  )
}

export default Rectangle
