import "./App.css";
import BottomNav from "./components/BottomNav";
import { useRef, useState, useEffect } from "react";
import ShapeCanvas from "./components/ShapeCanvas";
import type { RectType, ArrowType, ToolType } from "./components/types";
import { MainButton, SecondButton } from "./components/ui/buttons";
import TaskForm from "./components/forms/TaskForm";
import type { taskFields } from "./components/forms/TaskForm";
import { useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import { Auth } from "@supabase/auth-ui-react";
import { useSession } from "./context/SessionContext";
import { supabase } from "./supabase-client";
import DescriptionForm from "./components/forms/DescriptionForm";

function App() {
  const { session } = useSession();
  const [instruments, setInstruments] = useState<any[]>([]);
  const [zoomValue, setZoomValue] = useState(100);
  const [showForm, setShowForm] = useState(false);
  const [rects, setRects] = useState<RectType[]>([]);
  const [connectors, setConnectors] = useState<ArrowType[]>([]);
  const [tool, setTool] = useState<ToolType>("select");
  const [strokeColor, setStrokeColor] = useState<string>("#000000");
  const idCounter = useRef(0);
  const navigate = useNavigate();
  const [showDescription, setShowDescription] = useState(false);



  async function getInstruments() {
    const { data } = await supabase.from("instruments").select();
    setInstruments(data ?? []);
  }

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
        color: newTask.color,
        id: "rect-" + newId,
        title: newTask.title + " #" + newId,
        description: newTask.description,
        dueDate: newTask.date,
        status: "In Progress",
        isCollapsed: false,
        children: [],
        parents: "",
      },
    ]);
  };

  const togglePencil = () => {
    setTool(tool === "pencil" ? "select" : "pencil");
  };

  const toggleEraser = () => {
    setTool(tool === "eraser" ? "select" : "eraser");
  };

  const toggleSelect = () => {
    setTool("select");
  };

  const clearCanvas = () => {
    setRects([]);
    setConnectors([]);
    idCounter.current = 0;
  };
  // if (!session) {
  //   return <Auth supabase={supabase} appearance={{ theme: ThemeSupa }}></Auth>
  // }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
  };
  console.log(session);
  return (
    <>
      <div className="relative w-full h-screen overflow-hidden">
        <div className="account-buttons absolute flex flex-row top-1.5 right-0 gap-2 m-4 z-51">
          <SecondButton
            title={session ? "Sign Out" : "Sign In"}
            onClick={async () => {
              if (session) await signOut();
              else navigate("/signin");
            }}
          />
          {!session &&
            (<MainButton
              title="Create Account"
              onClick={() => navigate("/create-acc")}
            />)}
        </div>
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 w-xs rounded-md shadow-md/15 shadow-gray-600">
          <BottomNav
            onShapeClick={openForm}
            onEraserClick={toggleEraser}
            onClearClick={clearCanvas}
            onDrawClick={togglePencil}
            onColorSelect={setStrokeColor}
            isActive={tool === "eraser" || tool === "pencil"}
          />
        </div>
        <div className="absolute bottom-4 left-4 inline-flex items-center z-100 bg-purple-100 rounded-xl w-fit">
          <button
            className="hover:bg-purple-200 hover:cursor-pointer px-4 py-2 rounded-l-lg"
            onClick={() => setZoomValue(Math.max(zoomValue - 10, 50))}
          >
            -
          </button>
          <button
            onClick={() => setZoomValue(100)}
            className="relative w-20 py-2 hover:cursor-pointer text-center group"
          >
            {zoomValue}%
            <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-nowrap px-2 py-1 rounded-sm bg-gray-700 text-sm text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-500 ">
              Reset Value
            </span>
          </button>
          <button
            className="hover:bg-purple-200 hover:cursor-pointer px-4 py-2 rounded-r-lg"
            onClick={() => setZoomValue(Math.min(zoomValue + 10, 200))}
          >
            +
          </button>
        </div>
        {showForm && <TaskForm onAddTask={addRect} onCloseForm={closeForm} />}
        {showDescription && <DescriptionForm onclick={() => setShowDescription(false)} />}
        <ShapeCanvas
          rects={rects}
          setRects={setRects}
          tool={tool}
          setZoomValue={setZoomValue}
          zoom={zoomValue}
          connectors={connectors}
          setConnectors={setConnectors}
          strokeColor={strokeColor}
          onShapeClick={() => setShowDescription(true)}
        />
      </div>

      <ul>
        {instruments.map((instrument) => (
          <li key={instrument.name}>{instrument.name}</li>
        ))}
      </ul>
    </>
  );
}

export default App;
export { supabase };
