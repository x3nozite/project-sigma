import "./App.css";
import BottomNav from "./components/BottomNav";
import { useState } from "react";
import ShapeCanvas from "./components/ShapeCanvas";

function App() {
  //const [rects, setRects] = useState<{ x: number, y: number, width: number, height: number, id: string }[]>([]);
  const [rects, setRects] = useState<{ x: number, y: number, width: number, height: number, id: string }[]>([]);

  const addRect = () => {
    setRects([...rects, { x: 100, y: 100, width: 100, height: 200, id: "rect-" + rects.length }]);
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
