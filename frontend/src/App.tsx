import "./App.css";
import BottomNav from "./components/BottomNav";
import { useRef, useState, useEffect } from "react";
import ShapeCanvas from "./components/ShapeCanvas";
import type {
  RectType,
  ArrowType,
  ToolType,
  ShapeType,
} from "./components/types";
import { MainButton, SecondButton } from "./components/ui/buttons";
import TaskForm from "./components/forms/TaskForm";
import type { taskFields } from "./components/forms/TaskForm";
import { useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import { Auth } from "@supabase/auth-ui-react";
import { useSession } from "./context/SessionContext";
import { supabase } from "./supabase-client";
import DescriptionForm from "./components/forms/DescriptionForm";
import {
  HiMenu,
  HiUserCircle,
  HiOutlineZoomIn,
  HiOutlineZoomOut,
  HiOutlineFolder,
  HiOutlineDocument,
  HiOutlineTrash,
} from "react-icons/hi";
import { DropdownMenu } from "radix-ui";

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
  const [selectedShape, setSelectedShape] = useState<ShapeType | null>(null);

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

  const openDescription = (shape: ShapeType | null) => {
    setSelectedShape(shape);
    setShowDescription(true);
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
      title: newTask.title,
      description: newTask.description,
      dueDate: newTask.date,
      status: "In Progress",
      isCollapsed: false,
      children: [],
      parents: "",
      },
    ]);
  };

  //   try {
  //     const { data, error } = await supabase.from(" ").insert({
  //       x: newRect.x,
  //       y: newRect.y,
  //       width: newRect.width,
  //       height: newRect.height,
  //       color: newRect.color,
  //       rect_id: newRect.id,
  //       title: newRect.title,
  //       description: newRect.description,
  //       due_date: newRect.dueDate,
  //       status: newRect.status,
  //       is_collapsed: newRect.isCollapsed
  //       });
  //       if (data) {
  //         // a
  //       }
  //     } catch (error) {
  //     console.error("Error:", error);
  //     alert("Failed saving task");
  //     return;
  //   }
  // };
  
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
      <div className="relative w-full h-screen overflow-hidden ">
        <nav className="top-nav absolute w-full z-50 flex flex-wrap justify-between items-center p-5">
          <div className="more-options ">
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="p-2.5 bg-purple-200 rounded-lg hover:cursor-pointer">
                  <HiMenu />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  sideOffset={5}
                  align="start"
                  alignOffset={5}
                  className="min-w-56 rounded-lg shadow-lg p-5 text-violet-700 hover:cursor-default hover:border-none bg-white"
                >
                  <DropdownMenu.Item className="group py-1 pl-2 hover:bg-violet-200 rounded-lg hover:text-gray-700 flex items-center">
                    <div className="flex items-center gap-2">
                      <HiOutlineFolder />
                      Save
                    </div>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item className="py-1 pl-2  hover:bg-violet-200 rounded-lg hover:text-gray-700">
                    <div className="flex items-center gap-2">
                      <HiOutlineDocument />
                      Export PDF
                    </div>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item className="py-1 pl-2  hover:bg-violet-200 rounded-lg hover:text-gray-700">
                    <button
                      onClick={clearCanvas}
                      className="flex items-center gap-2"
                    >
                      <HiOutlineTrash />
                      Clear Canvas
                    </button>
                  </DropdownMenu.Item>
                  <DropdownMenu.Separator className="h-[2px] my-2 bg-gray-500" />
                  <DropdownMenu.Label className="py-0.5 pl-2 text-sm text-gray-400">
                    Canvas Theme
                  </DropdownMenu.Label>
                  <DropdownMenu.Item className="py-1 pl-2  hover:bg-violet-200 rounded-lg hover:text-gray-700">
                    Change Color Here
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>
          <div className="tool-bar-tab absolute left-1/2 transform -translate-x-1/2 hidden sm:flex">
            <BottomNav
              onShapeClick={openForm}
              onEraserClick={toggleEraser}
              onClearClick={clearCanvas}
              onDrawClick={togglePencil}
              onColorSelect={setStrokeColor}
              isActive={tool === "eraser" || tool === "pencil"}
            />
          </div>
          <div className="user-account">
            <div className="big-buttons hidden gap-2 lg:flex">
              {session && <p>{session?.user?.email}</p>}
              <SecondButton
                title={session ? "Sign Out" : "Sign In"}
                onClick={async () => {
                  if (session) await signOut();
                  else navigate("/signin");
                }}
              />
              {!session && (
                <MainButton
                  title="Create Account"
                  onClick={() => navigate("/create-acc")}
                />
              )}
            </div>
            <div className="hidden sm:max-lg:flex">
              <button className="p-2.5 bg-purple-200 rounded-lg hover:bg-purple-100 hover:cursor-pointer">
                <HiUserCircle />
              </button>
            </div>
          </div>
        </nav>
        <div className="absolute toolbar-mob flex sm:hidden z-100 w-full justify-center p-2 bottom-4">
          <BottomNav
            onShapeClick={openForm}
            onEraserClick={toggleEraser}
            onClearClick={clearCanvas}
            onDrawClick={togglePencil}
            onColorSelect={setStrokeColor}
            isActive={tool === "eraser" || tool === "pencil"}
          />
        </div>
        <div className="account-buttons absolute flex flex-row top-1.5 right-0 gap-2 m-4 z-51"></div>
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 w-xs rounded-md shadow-md/15 shadow-gray-600"></div>
        <div className="absolute bottom-4 left-4  items-center z-10 bg-purple-100 rounded-xl w-fit hidden sm:inline-flex">
          <button
            className="hover:bg-purple-200 hover:cursor-pointer px-4 py-2 rounded-l-lg"
            onClick={() => setZoomValue(Math.max(zoomValue - 10, 50))}
          >
            <HiOutlineZoomOut />
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
            className="hover:bg-purple-200 hover:cursor-pointer px-4 py-2 rounded-r-lg h-full"
            onClick={() => setZoomValue(Math.min(zoomValue + 10, 200))}
          >
            <HiOutlineZoomIn />
          </button>
        </div>
        {showForm && (
          <TaskForm
            onAddTask={addRect}
            onCloseForm={closeForm}
            initialData={null}
          />
        )}
        {showDescription && (
          <DescriptionForm
            onclick={() => setShowDescription(false)}
            shape={selectedShape}
          />
        )}
        <ShapeCanvas
          rects={rects}
          setRects={setRects}
          tool={tool}
          setZoomValue={setZoomValue}
          zoom={zoomValue}
          connectors={connectors}
          setConnectors={setConnectors}
          strokeColor={strokeColor}
          onShapeClick={openDescription}
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
