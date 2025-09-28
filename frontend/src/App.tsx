import "./App.css";
import BottomNav from "./components/BottomNav";
import { useState } from "react";
import ShapeCanvas from "./components/ShapeCanvas";
import type { RectType, TextType } from "./components/types";

function App() {
  const [rects, setRects] = useState<RectType[]>([]);

  const placeholderText = {
    id: "text-" + rects.length,
    value: "placeholdertext " + rects.length,
    fontSize: 16
  }

  const addRect = () => {
    setRects([...rects, { x: 100, y: 100, width: 200, height: 200, id: "rect-" + rects.length, texts: [placeholderText] }]);
  }
  return (
    <>
      <div className="bottom-nav">
        <BottomNav onClick={addRect} />
      </div>
      <ShapeCanvas rects={rects} setRects={setRects} />
    </>
  );
}

export default App;
