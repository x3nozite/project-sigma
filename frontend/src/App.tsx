import SideBar from "./components/Sidebar";
import List from "./components/List";
import { Stage, Layer } from "react-konva";
import "./App.css";

function App() {
  return (
    <>
      <SideBar />
      <div className="canvas">
        <Stage width={window.innerWidth} height={window.innerHeight}>
          <Layer></Layer>
        </Stage>
      </div>
    </>
  );
}

export default App;
