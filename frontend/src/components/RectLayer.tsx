import { useState } from "react";
import type { RectType } from "./types";
import Rectangle from "./Rectangle";

interface Props {
  rects: RectType[];
  setRects: React.Dispatch<React.SetStateAction<RectType[]>>;
  onDragStart: (e) => void;
  onDragMove: (e) => void;
  onDragEnd: (e) => void;
  tool: "select" | "eraser";
}

const RectLayer = ({ rects, setRects, onDragStart, onDragMove, onDragEnd, tool }: Props) => {

  return (
    <>
      {rects.map((rect, i) => (
        <Rectangle
          rect={rect}
          i={i}
          setRects={setRects}
          onDragStart={onDragStart}
          onDragMove={onDragMove}
          onDragEnd={onDragEnd}
          tool={tool}
        />
      ))}
    </>
  )
}

export default RectLayer
