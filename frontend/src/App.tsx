import "./App.css";
import BottomNav from "./components/BottomNav";
import { useEffect, useRef, useState } from "react";
import ShapeCanvas from "./components/ShapeCanvas";
import type {
  RectType,
  ArrowType,
  ToolType,
  ShapeType,
  LineType,
  TodoType,
} from "./components/types";
import { MainButton, SecondButton } from "./components/ui/buttons";
import TaskForm from "./components/forms/TaskForm";
import type { taskFields } from "./components/forms/TaskForm";
import { useNavigate } from "react-router-dom";
import { useSession } from "./context/SessionContext";
import { supabase } from "./supabase-client";
import {
  HiMenu,
  HiUserCircle,
  HiOutlineZoomIn,
  HiOutlineZoomOut,
  HiOutlineFolder,
  HiOutlineDocument,
  HiOutlineTrash,
} from "react-icons/hi";
import { DropdownMenu, AlertDialog } from "radix-ui";
import AppToolbar from "./components/ui/buttons/tools/AppToolbar";
import { deleteCanvas, loadCanvas, saveCanvas } from "./services/DBFunction";

function App() {
  const { session } = useSession();
  const [instruments, setInstruments] = useState<any[]>([]);
  const [zoomValue, setZoomValue] = useState(100);
  const [showForm, setShowForm] = useState(false);
  const [rects, setRects] = useState<RectType[]>([]);
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [lines, setLines] = useState<LineType[]>([]);
  const [connectors, setConnectors] = useState<ArrowType[]>([]);
  const [tool, setTool] = useState<ToolType>("select");
  const [strokeColor, setStrokeColor] = useState<string>("#000000");
  const idCounter = useRef(0);
  const navigate = useNavigate();
  const [selectedShape, setSelectedShape] = useState<ShapeType | null>(null);

  useEffect(() => {
    if (!session) return;
    let mounted = true;
    (async () => {
      const response = await loadCanvas();
      if (!mounted) return;
      if (response.success) {
        setRects(response.data.rects);
      } else {
        console.error("Failed to load canvas:", response.error);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [session]);

  async function getInstruments() {
    const { data } = await supabase.from("instruments").select();
    setInstruments(data ?? []);
  }

  const openForm = (shape: ShapeType | null) => {
    setSelectedShape(shape);
    setShowForm(true);
  };

  const closeForm = () => {
    setSelectedShape(null);
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

  const updateRect = (shape: ShapeType, newData: taskFields) => {
    setRects((prev) =>
      prev.map((r) =>
        r.id === shape.id
          ? {
              ...r,
              title: newData.title,
              description: newData.description,
              color: newData.color,
              dueDate: newData.date,
            }
          : r
      )
    );
  };

  const togglePencil = () => {
    setTool(tool === "draw" ? "select" : "draw");
  };

  const toggleEraser = () => {
    setTool(tool === "eraser" ? "select" : "eraser");
    console.log("aa");
  };

  const clearCanvas = async () => {
    setRects([]);
    setConnectors([]);
    setLines([]);

    const response = await deleteCanvas();
    if (!response.success) {
      console.error("Failed to delete canvas from supabase", response.error);
    }

    idCounter.current = 0;
  };
  // if (!session) {
  //   return <Auth supabase={supabase} appearance={{ theme: ThemeSupa }}></Auth>
  // }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
  };

  const handleSave = async () => {
    await saveCanvas({ rects });
  };
  return (
    <>
      <div className="relative w-full h-screen overflow-hidden ">
        <nav className="top-nav absolute w-full z-50 flex flex-wrap justify-between items-center p-5">
          <div className="more-options ">
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="p-2.5 bg-blue-200 rounded-lg hover:cursor-pointer">
                  <HiMenu />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  sideOffset={5}
                  align="start"
                  alignOffset={5}
                  className="min-w-56 rounded-lg shadow-lg p-5 text-blue-700 hover:cursor-default hover:border-none bg-white"
                >
                  <DropdownMenu.Item className="group py-1 pl-2 hover:bg-sky-200 rounded-lg hover:text-blue-700 flex items-center">
                    <div
                      className="flex items-center gap-2"
                      onClick={handleSave}
                    >
                      <HiOutlineFolder />
                      Save
                    </div>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item className="py-1 pl-2  hover:bg-sky-200 rounded-lg hover:text-blue-700">
                    <div className="flex items-center gap-2">
                      <HiOutlineDocument />
                      Export PDF
                    </div>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    onSelect={(event: Event) => event.preventDefault()}
                    className="py-1 pl-2  hover:bg-sky-200 rounded-lg hover:text-blue-700"
                  >
                    <AlertDialog.Root>
                      <AlertDialog.Trigger asChild>
                        <button className="flex items-center gap-2">
                          <HiOutlineTrash />
                          Clear Canvas
                        </button>
                      </AlertDialog.Trigger>
                      <AlertDialog.Portal>
                        <AlertDialog.Overlay className="fixed bg-black opacity-50 inset-0" />
                        <AlertDialog.Content className="bg-white min-w-md max-w-lg fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-5 rounded-lg">
                          <AlertDialog.Title className="text-xl font-bold mb-2">
                            Are you sure?
                          </AlertDialog.Title>
                          <AlertDialog.Description className="my-3 text-gray-700">
                            This action cannot be undone. This will permanently
                            clear the canvas.
                          </AlertDialog.Description>
                          <div className="flex justify-end gap-4">
                            <AlertDialog.Cancel asChild>
                              <button className="hover:underline decoration-1 hover:cursor-pointer">
                                Cancel
                              </button>
                            </AlertDialog.Cancel>

                            <AlertDialog.Action asChild>
                              <button
                                className="bg-red-300 text-red-500 px-2.5 py-1 rounded-lg hover:cursor-pointer hover:bg-red-500 hover:text-white"
                                onClick={clearCanvas}
                              >
                                Yes, clear canvas
                              </button>
                            </AlertDialog.Action>
                          </div>
                        </AlertDialog.Content>
                      </AlertDialog.Portal>
                    </AlertDialog.Root>
                  </DropdownMenu.Item>
                  <DropdownMenu.Separator className="h-[2px] my-2 bg-gray-500" />
                  <DropdownMenu.Label className="py-0.5 pl-2 text-sm text-gray-400">
                    Canvas Theme
                  </DropdownMenu.Label>
                  <DropdownMenu.Item className="py-1 pl-2  hover:bg-sky-200 rounded-lg hover:text-blue-700">
                    Change Color Here
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>
          <div className="tool-bar-tab absolute left-1/2 transform -translate-x-1/2 hidden sm:flex">
            {/* <BottomNav
              onShapeClick={openForm}
              onEraserClick={toggleEraser}
              onClearClick={clearCanvas}
              onDrawClick={togglePencil}
              onColorSelect={setStrokeColor}
              isActive={tool === "eraser" || tool === "draw"}
            /> */}
            <AppToolbar
              onShapeClick={() => openForm(null)}
              onEraserClick={toggleEraser}
              onClearClick={clearCanvas}
              onDrawClick={togglePencil}
              onColorSelect={setStrokeColor}
              isActive={tool === "eraser" || tool === "draw"}
              tool={tool}
              setTool={setTool}
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
            isActive={tool === "eraser" || tool === "draw"}
          />
        </div>
        <div className="account-buttons absolute flex flex-row top-1.5 right-0 gap-2 m-4 z-51"></div>
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 w-xs rounded-md shadow-md/15 shadow-gray-600"></div>
        <div className="absolute bottom-4 left-4  items-center z-10 bg-amber-100 rounded-xl w-fit hidden sm:inline-flex">
          <button
            className="hover:bg-orange-200 hover:cursor-pointer px-4 py-2 rounded-l-lg"
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
            className="hover:bg-orange-200 hover:cursor-pointer px-4 py-2 rounded-r-lg h-full"
            onClick={() => setZoomValue(Math.min(zoomValue + 10, 200))}
          >
            <HiOutlineZoomIn />
          </button>
        </div>
        {showForm && (
          <TaskForm
            onAddTask={addRect}
            onUpdateTask={updateRect}
            onCloseForm={closeForm}
            initialData={selectedShape}
          />
        )}
        <ShapeCanvas
          rects={rects}
          setRects={setRects}
          todos={todos}
          setTodos={setTodos}
          lines={lines}
          setLines={setLines}
          tool={tool}
          setZoomValue={setZoomValue}
          zoom={zoomValue}
          connectors={connectors}
          setConnectors={setConnectors}
          strokeColor={strokeColor}
          onShapeClick={openForm}
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
