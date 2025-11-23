import { Line } from "react-konva"
import Konva from "konva";
import type { LineType } from "./types";

interface Props {
  lines: LineType[];
  onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => void;
  onTransformEnd: (e: Konva.KonvaEventObject<DragEvent>) => void;
}

const LineLayer = ({ lines, onDragEnd, onTransformEnd }: Props) => {

  return (
    <>
      {lines.map(ln => (
        <Line
          key={ln.id}
          id={"group-" + ln.id}
          points={ln.points}
          stroke={ln.stroke}
          strokeWidth={ln.strokeWidth}
          lineCap="round"
          lineJoin="round"
          globalCompositeOperation="source-over"
          draggable
          onDragEnd={onDragEnd}
          onTransformEnd={onTransformEnd}
        />
      ))}
    </>
  )
}


export default LineLayer
