import { Layer, Line } from "react-konva"
import Konva from "konva";
import type { LineType } from "./types";
import { forwardRef } from "react";

interface Props {
  lines: LineType[];
  onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => void;
  onTransformEnd: (e: Konva.KonvaEventObject<DragEvent>) => void;
}

const LineLayer = forwardRef<Konva.Layer, Props>(
  ({ lines, onDragEnd, onTransformEnd }, ref) => {

    return (
      <Layer
        ref={ref}
      >
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
      </Layer>
    )
  }
)

export default LineLayer
