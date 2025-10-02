import "./App.css";
import BottomNav from "./components/BottomNav";
import { useState } from "react";
import ShapeCanvas from "./components/ShapeCanvas";
import type { RectType, TextType } from "./components/types";

function App() {
  const [rects, setRects] = useState<RectType[]>([]);
  const [tool, setTool] = useState<'select' | 'eraser'>('select');

  const placeholderText = {
    id: "text-" + rects.length,
    value: "placeholdertext " + rects.length,
    fontSize: 16,
  };

  const addRect = () => {
    setTool("select");
    setRects([
      ...rects,
      {
        x: 100,
        y: 100,
        width: 200,
        height: 200,
        color: "white",
        id: "rect-" + rects.length,
        texts: [placeholderText],
        isCollapsed: false,
      },
    ]);
  };

  const toggleEraser = () => {
    setTool(tool === 'eraser' ? 'select' : 'eraser');
  };

  return (
    <>
      <div className="relative w-full h-screen overflow-hidden">
        <div className="bottom-nav">
          <BottomNav onShapeClick={addRect} onEraserClick={toggleEraser} isActive={tool === "eraser"} />
        </div>
        <ShapeCanvas rects={rects} setRects={setRects} tool={tool} />
      </div>
    </>
  );
}

export default App;
