import List from "./components/List";
import { Stage, Layer } from "react-konva";
import "./App.css";
import BottomNav from "./components/BottomNav";

function App() {
  return (
    <>
      <div className="bottom-nav">
        <BottomNav />
      </div>
      <div className="canvas">
        <Stage width={window.innerWidth} height={window.innerHeight}>
          <Layer></Layer>
        </Stage>
      </div>
    </>
  );
}

export default App;
