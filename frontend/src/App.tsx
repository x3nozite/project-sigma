import "./App.css";
import BottomNav from "./components/BottomNav";
import { useRef, useState } from "react";
import ShapeCanvas from "./components/ShapeCanvas";
import type { RectType } from "./components/types";
import { MainButton, SecondButton } from "./components/ui/buttons";
import TaskForm from "./components/forms/TaskForm";
import type { taskFields } from "./components/forms/TaskForm";

function App() {
  const [zoomValue, setZoomValue] = useState(100);
  const [showForm, setShowForm] = useState(false);
  const [rects, setRects] = useState<RectType[]>([]);
  const [tool, setTool] = useState<"select" | "eraser">("select");
  const idCounter = useRef(0);

  const openForm = () => {
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
  };

  const addRect = (newTask: taskFields) => {
    const newId = idCounter.current;
    idCounter.current += 1;

    setTool("select");
    setRects([
      ...rects,
      {
        x: 100,
        y: 100,
        width: 300,
        height: 200,
        color: "white",
        id: "rect-" + newId,
        title: newTask.title + " #" + newId,
        description: newTask.description,
        dueDate: newTask.date,
        status: "In Progress",
        isCollapsed: false,
        children: [],
        parents: [],
      },
    ]);
  };

  const toggleEraser = () => {
    setTool(tool === "eraser" ? "select" : "eraser");
  };

  const clearCanvas = () => {
    setRects([]);
    idCounter.current = 0;
  };

  return (
    <>
      <div className="relative w-full h-screen overflow-hidden">
        <div className="account-buttons absolute flex flex-row top-1.5 right-0 gap-2 m-4 z-51">
          <SecondButton title="Sign-Up" />
          <MainButton title="Create Account" />
        </div>
        <div className="bottom-nav absolute top-4 left-1/2 -translate-x-1/2 z-50 w-xs rounded-md shadow-md/15 shadow-gray-600">
          <BottomNav
            onShapeClick={openForm}
            onEraserClick={toggleEraser}
            onClearClick={clearCanvas}
            isActive={tool === "eraser"}
          />
        </div>
        <div>
          <h1>{zoomValue}</h1>
          <button onClick={() => setZoomValue(Math.max(zoomValue - 10, 50))}>zoom out</button>
          <button onClick={() => setZoomValue(Math.min(zoomValue + 10, 200))}>zoom in</button>
        </div>
        {showForm && <TaskForm onAddTask={addRect} onCloseForm={closeForm} />}
        <ShapeCanvas rects={rects} setRects={setRects} tool={tool} setZoomValue={setZoomValue} zoom={zoomValue} />
      </div>
    </>
  );
}

export default App;
