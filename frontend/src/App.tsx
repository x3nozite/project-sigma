import List from "./components/List";
import { Stage, Layer } from "react-konva";
import "./App.css";
import BottomNav from "./components/BottomNav";
import Rectangle from "./components/Rectangle";
import { useState } from "react";

function App() {
  //const [rects, setRects] = useState<{ x: number, y: number, width: number, height: number, id: string }[]>([]);
  const initialRects = [
    { x: 50, y: 50, width: 100, height: 60, id: "rect1" },
    { x: 200, y: 120, width: 120, height: 80, id: "rect2" },
  ];
  const [rects, setRects] = useState(initialRects);

  const addRect = () => {
    setRects([...rects, { x: 100, y: 100, width: 100, height: 200, id: "rect-" + rects.length }]);
  }
  return (
    <>
      <div className="bottom-nav">
        <BottomNav onClick={addRect} />
      </div>
      <div className="canvas">
        <Stage width={window.innerWidth} height={window.innerHeight}>
          <Layer>
            <Rectangle rects={rects} setRects={setRects} />
          </Layer>
        </Stage>
      </div>
    </>
  );
}

export default App;
