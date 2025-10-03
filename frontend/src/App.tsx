import "./App.css";
import BottomNav from "./components/BottomNav";
import { useState } from "react";
import ShapeCanvas from "./components/ShapeCanvas";
import type { RectType, TextType } from "./components/types";
import { MainButton, SecondButton } from "./components/ui/buttons";

function App() {
  const [rects, setRects] = useState<RectType[]>([]);
  const [tool, setTool] = useState<"select" | "eraser">("select");

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
        width: 100,
        height: 100,
        color: "white",
        id: "rect-" + rects.length,
        texts: [placeholderText],
        isCollapsed: false,
        children: [],
        parents: [],
      },
    ]);
  };

  const toggleEraser = () => {
    setTool(tool === "eraser" ? "select" : "eraser");
  };

  return (
    <>
      <div className="relative w-full h-screen overflow-hidden">
        <div className="top-nav absolute flex flex-row top-0 right-0 gap-2 m-4">
          <SecondButton title="Sign-Up" />
          <MainButton title="Login" />
        </div>
        <div className="bottom-nav absolute bottom-4 left-1/2 -translate-x-1/2 z-50 w-xs rounded-md shadow-lg/30 shadow-gray-600">
          <BottomNav
            onShapeClick={addRect}
            onEraserClick={toggleEraser}
            isActive={tool === "eraser"}
          />
        </div>
        <ShapeCanvas rects={rects} setRects={setRects} tool={tool} />
      </div>
    </>
  );
}

export default App;
