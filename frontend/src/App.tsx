import "./App.css";
import BottomNav from "./components/BottomNav";
import { useEffect, useState } from "react";
import ShapeCanvas from "./components/ShapeCanvas";
import type {
  RectType,
  ArrowType,
  ToolType,
  ShapeType,
  TodoType,
} from "./components/types";
import { MainButton, SecondButton } from "./components/ui/buttons";
import TaskForm from "./components/forms/TaskForm";
import TodoForm, { type todoFields } from "./components/forms/TodoForm";
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
  HiOutlineChevronDown,
  HiOutlineLogout,
  HiOutlineLogin,
  HiOutlineChatAlt2,
  HiOutlineFolderOpen,
  HiOutlineCheck,
  HiOutlinePlus,
} from "react-icons/hi";
import { DropdownMenu, AlertDialog } from "radix-ui";
import AppToolbar from "./components/ui/buttons/tools/AppToolbar";
import {
  deleteCanvas,
  loadCanvas,
  saveCanvas,
  getUserProfile,
  getUserCanvases,
  createNewCanvas,
} from "./services/DBFunction";
import { useIndexedDBInit } from "./services/useIndexedDb";
import { useAutosaveCanvas } from "./services/autosaveCanvas";
import Konva from "konva";

function App() {
  const { init } = useIndexedDBInit();

  const { session } = useSession();
  const [instruments, _setInstruments] = useState<any[]>([]);
  const [zoomValue, setZoomValue] = useState(100);
  const [showForm, setShowForm] = useState(false);
  const [showTodoForm, setShowTodoForm] = useState(false);
  const [shapes, setShapes] = useState<ShapeType[]>([]);
  const [connectors, setConnectors] = useState<ArrowType[]>([]);
  const [tool, setTool] = useState<ToolType>("hand");
  const [strokeColor, setStrokeColor] = useState<string>("#000000");
  const navigate = useNavigate();
  const [selectedShape, setSelectedShape] = useState<ShapeType | null>(null);
  const [selectedParent, setSelectedParent] = useState<RectType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [currentCanvasId, setCurrentCanvasId] = useState<string | null>(null);
  const [canvasList, setCanvasList] = useState<any[]>([]);
  //  const [showCanvasList, setShowCanvasList] = useState(false);
  // console.log(currentCanvasId);

  // console.log("App render - avatarUrl:", avatarUrl);

  useAutosaveCanvas({ shapes, connectors }, 600, () =>
    saveCanvas({ shapes, connectors }, currentCanvasId)
  );

  useEffect(() => {
    // console.log("This session:", session);
    let mounted = true;

    (async () => {
      await init();

      const canvasRes = await loadCanvas(null);
      if (!mounted) return;

      if (canvasRes.success) {
        setShapes(canvasRes.data.shapes);
        setCurrentCanvasId(canvasRes.canvasId);
        setConnectors(canvasRes.data.connectors);
        // console.log("canvas id: ", canvasRes.canvasId);
        // console.log("shapes: ", canvasRes.data.shapes);
      } else {
        console.error("Failed to load canvas:", canvasRes.error);
      }

      if (!session) return;
      const listRes = await getUserCanvases(session.user.id);
      if (!mounted) return;

      if (listRes.success) {
        setCanvasList(listRes.canvases || []);
        // console.log("Canvas list loaded:", listRes.canvases?.length);
      } else {
        console.error("Failed to load canvas list:", listRes.error);
      }

      const profileRes = await getUserProfile();
      if (!mounted) return;

      // console.log("Profile Response:", profileRes);

      if (profileRes.success) {
        // console.log("Avatar URL:", profileRes.data.avatar_url);
        setAvatarUrl(profileRes.data.avatar_url);
      } else {
        console.error("Failed to load user profile:", profileRes.error);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [init, session]);

  // async function getInstruments() {
  //   const { data } = await supabase.from("instruments").select();
  //   setInstruments(data ?? []);
  // }

  const openTodoForm = (parent: RectType | null) => {
    setSelectedParent(parent);
    setShowTodoForm(true);
  };

  const closeTodoForm = () => {
    setShowTodoForm(false);
  };

  const openForm = (shape: ShapeType | null) => {
    setSelectedShape(shape);
    setShowForm(true);
  };

  const closeForm = () => {
    setSelectedShape(null);
    setShowForm(false);
  };

  const addTodo = (newFields: todoFields, parent: RectType | null) => {

    const iso = new Date(newFields.date).toISOString();

    const newTodo: TodoType = {
      id: "todo-" + Date.now().toString(),
      x: parent ? parent.x + 600 : 100,
      y: parent ? parent.y : 100,
      color: parent ? parent.color : newFields.color, // default is green
      isCollapsed: false,
      scaleX: 1,
      scaleY: 1,
      shape: "todo",
      behavior: "node",
      width: 400,
      height: 75,
      title: newFields.title,
      description: "",
      dueDate: iso,
      completed: newFields.completed,
      // assignee: session ? session.user.user_metadata.name : "Guest",
      assignee: newFields.assignee,
      status: "Something",
      parents: parent ? parent.id : "",
    };
    setShapes([...shapes, newTodo]);

    if (parent) {
      addConnector(newTodo, parent);
    }
  };

  const addRect = (newTask: taskFields) => {
    setTool("hand");

    const newRect: RectType = {
      shape: "rect",
      id: "rect-" + Date.now().toString(),
      behavior: "node",
      x: 100,
      y: 100,
      width: 300,
      height: 200,
      color: newTask.color,
      title: newTask.title,
      description: newTask.description,
      dueDate: newTask.date,
      status: "In Progress",
      isCollapsed: false,
      children: [],
      parents: "",
      scaleX: 1,
      scaleY: 1,
    };

    setShapes([...shapes, newRect]);
  };

  const addConnector = (from: Konva.Node | ShapeType, to: Konva.Node | ShapeType) => {

    const fromId = (from instanceof Konva.Node) ? from.id() : "group-" + from.id;
    const toId = (to instanceof Konva.Node) ? to.id() : "group-" + to.id;

    setConnectors([
      ...connectors,
      {
        shape: "connector",
        id: "connector-" + Date.now().toString(),
        from: fromId,
        to: toId,
      },
    ]);
  };

  const updateRect = (shape: ShapeType, newData: taskFields) => {
    setShapes((prev) =>
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
    setTool(tool === "draw" ? "hand" : "draw");
  };

  const toggleEraser = () => {
    setTool(tool === "eraser" ? "hand" : "eraser");
  };

  const toggleSelect = () => {
    setTool(tool === "select" ? "hand" : "select");
  };

  const clearCanvas = async () => {
    setShapes([]);
    setConnectors([]);
    const response = await deleteCanvas(currentCanvasId);
    if (!response.success) {
      console.error("Failed to delete canvas from supabase", response.error);
    }
  };
  // if (!session) {
  //   return <Auth supabase={supabase} appearance={{ theme: ThemeSupa }}></Auth>
  // }

  const signOut = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (error) {
      // console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    // console.log("saving to: ", currentCanvasId);
    setIsLoading(true);
    try {
      await saveCanvas({ shapes, connectors }, currentCanvasId || null);
    } catch (error) {
      // console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoad = async (canvasId?: string) => {
    setIsLoading(true);
    // console.log("Loading canvas:", canvasId || "default");
    try {
      if (currentCanvasId && canvasId && canvasId !== currentCanvasId) {
        // console.log("Saving current canvas");
        await saveCanvas({ shapes, connectors }, currentCanvasId);
      }
      const result = await loadCanvas(canvasId || null);
      if (result.success) {
        setShapes(result.data.shapes);
        setConnectors(result.data.connectors);
        console.log("after setting connectors: ", connectors);
        setCurrentCanvasId(result.canvasId);
        // console.log("Loaded", result.data.shapes.length, "shapes");
      } else {
        console.error("Load failed:", result.error);
      }
    } catch (error) {
      console.error("Load error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNewCanvas = async () => {
    if (!session) {
      console.warn("No session");
      return;
    }

    setIsLoading(true);

    try {
      if (currentCanvasId) {
        await saveCanvas({ shapes, connectors }, currentCanvasId);
      }

      const result = await createNewCanvas(
        session.user.id,
        `Canvas ${canvasList.length + 1}`
      );

      if (result.success && result.canvasId) {
        setShapes([]);
        setCurrentCanvasId(result.canvasId);

        const listRes = await getUserCanvases(session.user.id);
        if (listRes.success) {
          setCanvasList(listRes.canvases || []);
        }

        // console.log("New canvas created:", result.canvasId);
      } else {
        console.error("Create failed:", result.error);
      }
    } catch (error) {
      console.error("Create canvas error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchCanvas = async (canvasId: string) => {
    if (canvasId === currentCanvasId) {
      // console.log("Already on this canvas");
      return;
    }

    await handleLoad(canvasId);
  };
  return (
    <>
      <div className="relative w-full h-screen overflow-hidden ">
        <nav className="top-nav absolute w-full z-50 flex flex-wrap justify-between items-center p-5">
          <div className="more-options ">
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="p-2.5 bg-blue-200 border-blue-300 border-2 rounded-lg hover:cursor-pointer">
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
                  <DropdownMenu.Item
                    className="py-1 pl-2  hover:bg-sky-200 rounded-lg hover:text-blue-700"
                    onSelect={(event: Event) => event.preventDefault()}
                  >
                    <AlertDialog.Root>
                      <AlertDialog.Trigger asChild>
                        <div className="flex items-center gap-2 w-full">
                          <HiOutlineFolderOpen />
                          My Canvases ({canvasList.length})
                        </div>
                      </AlertDialog.Trigger>
                      <AlertDialog.Portal>
                        <AlertDialog.Overlay className="fixed bg-black opacity-50 inset-0 z-100" />
                        <AlertDialog.Content className="bg-white min-w-md max-w-2xl fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-6 rounded-lg z-101 max-h-96 overflow-y-auto">
                          <AlertDialog.Title className="text-xl font-bold mb-4 flex items-center gap-2">
                            <HiOutlineFolderOpen />
                            My Canvases
                          </AlertDialog.Title>
                          <AlertDialog.Description className="my-4">
                            <div className="grid grid-cols-1 gap-3">
                              {canvasList.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">
                                  No canvases yet. Create your first one!
                                </p>
                              ) : (
                                canvasList.map((canvas) => (
                                  <div
                                    key={canvas.canvas_id}
                                    onClick={() => {
                                      handleSwitchCanvas(canvas.canvas_id);
                                    }}
                                    className={`
                                        flex items-center justify-between p-4 rounded-lg border-2 
                                        hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition-all
                                        ${currentCanvasId === canvas.canvas_id
                                        ? "bg-blue-100 border-blue-400"
                                        : "bg-gray-50 border-gray-200"
                                      }
                                      `}
                                  >
                                    <div className="flex items-center gap-3">
                                      <HiOutlineFolder className="w-5 h-5 text-blue-600" />
                                      <div>
                                        <span className="font-medium text-gray-800">
                                          {canvas.canvas_name || "Untitled"}
                                        </span>
                                        {canvas.created_at && (
                                          <p className="text-xs text-gray-500 mt-1">
                                            Created:{" "}
                                            {new Date(
                                              canvas.created_at
                                            ).toLocaleDateString()}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                    {currentCanvasId === canvas.canvas_id && (
                                      <div className="flex items-center gap-2">
                                        <span className="text-xs text-blue-600 font-medium">
                                          Current
                                        </span>
                                        <HiOutlineCheck className="w-5 h-5 text-blue-600" />
                                      </div>
                                    )}
                                  </div>
                                ))
                              )}
                            </div>
                          </AlertDialog.Description>
                          <div className="flex justify-end mt-6">
                            <AlertDialog.Cancel asChild>
                              <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
                                Close
                              </button>
                            </AlertDialog.Cancel>
                          </div>
                        </AlertDialog.Content>
                      </AlertDialog.Portal>
                    </AlertDialog.Root>
                  </DropdownMenu.Item>

                  <DropdownMenu.Item className="py-1 pl-2  hover:bg-sky-200 rounded-lg hover:text-blue-700">
                    <div className="flex items-center gap-2">
                      <HiOutlineDocument />
                      Export PDF
                    </div>
                  </DropdownMenu.Item>

                  <DropdownMenu.Separator />

                  <DropdownMenu.Item className="py-1 pl-2  hover:bg-sky-200 rounded-lg hover:text-blue-700">
                    <div
                      className="flex items-center gap-2"
                      onClick={handleCreateNewCanvas}
                    >
                      <HiOutlinePlus />
                      <span>{isLoading ? "Creating" : "New Canvas"}</span>
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
                        <AlertDialog.Overlay className="fixed bg-black opacity-50 inset-0 z-100" />
                        <AlertDialog.Content className="bg-white min-w-md max-w-lg fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-5 rounded-lg z-101">
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
              onTodoClick={() => openTodoForm(null)}
              onEraserClick={toggleEraser}
              onClearClick={clearCanvas}
              onDrawClick={togglePencil}
              onSelectClick={toggleSelect}
              onColorSelect={setStrokeColor}
              isActive={tool === "eraser" || tool === "draw"}
              tool={tool}
              setTool={setTool}
            />
          </div>
          <div className="user-account">
            <div className="big-buttons hidden gap-2 lg:flex">
              {/* <p>{session?.user?.email}</p> */}
              {session && (
                <div>
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                      <button>
                        <div className="inline-flex text-center items-center justify-center px-5 py-2.5 gap-2 text-black font-medium bg-purple-100 rounded-lg">
                          <HiUserCircle className="text-lg" />
                          <div className="inline-flex gap-1 text-center items-center justify-center">
                            <span className="text-xs">Manage Account</span>
                            <HiOutlineChevronDown className="text-xs" />
                          </div>
                        </div>
                      </button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Portal>
                      <DropdownMenu.Content
                        sideOffset={10}
                        align="center"
                        className="min-w-56 rounded-lg shadow-lg p-5 text-black hover:cursor-default hover:border-none bg-purple-100"
                      >
                        <div className="flex flex-col items-center justify-center gap-2">
                          <div>
                            {/* <img
                              src={session?.user?.user_metadata.picture}
                              alt="user_profile"
                            /> */}
                            {avatarUrl ? (
                              <img
                                src={avatarUrl}
                                alt="profile avatar"
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <HiUserCircle className="text-3xl text-blue-500" />
                            )}
                          </div>
                          <div className="flex flex-col items-center justify-center">
                            <span className="text-sm font-medium">
                              {session?.user?.user_metadata.name}
                            </span>
                            <span className="text-xs font-light">
                              {session?.user?.email}
                            </span>
                          </div>
                        </div>
                        <DropdownMenu.Separator className="h-[2px] my-2 bg-gray-500" />
                        <DropdownMenu.Item
                          onSelect={(event: Event) => event.preventDefault()}
                        >
                          <AlertDialog.Root>
                            <AlertDialog.Trigger asChild>
                              <div className="inline-flex gap-2 items-center text-center justify-start text-sm hover:border-none hover:bg-purple-300 w-full h-full px-2 py-1 rounded-lg">
                                <HiOutlineLogout />
                                <span>Sign Out</span>
                              </div>
                            </AlertDialog.Trigger>
                            <AlertDialog.Portal>
                              <AlertDialog.Overlay className="fixed bg-black opacity-50 inset-0 z-100" />
                              <AlertDialog.Content className="bg-white min-w-md max-w-lg fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-5 rounded-lg z-101">
                                <AlertDialog.Title className="text-xl font-bold mb-2">
                                  Oh no! You're Leaving!
                                </AlertDialog.Title>
                                <AlertDialog.Description className="my-3 text-gray-700">
                                  Are you sure? You will be logged out from this
                                  session
                                </AlertDialog.Description>
                                <div className="flex justify-end gap-4">
                                  <AlertDialog.Cancel asChild>
                                    <button className="hover:underline decoration-1 hover:cursor-pointer">
                                      Cancel
                                    </button>
                                  </AlertDialog.Cancel>

                                  <AlertDialog.Action asChild>
                                    <button
                                      className="bg-red-300 text-red-500 px-2.5 py-1 rounded-lg hover:cursor-pointer hover:bg-red-500 hover:text-white inline-flex items-center justify-center text-center gap-1"
                                      onClick={async () => {
                                        await signOut();
                                      }}
                                    >
                                      <HiOutlineLogout />
                                      Sign Out
                                    </button>
                                  </AlertDialog.Action>
                                </div>
                              </AlertDialog.Content>
                            </AlertDialog.Portal>
                          </AlertDialog.Root>
                        </DropdownMenu.Item>
                        <DropdownMenu.Arrow className="fill-purple-100" />
                      </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                  </DropdownMenu.Root>
                </div>
              )}
              {isLoading && (
                <div>
                  <div className="flex items-center justify-center w-screen h-screen bg-black dark:bg-gray-800 dark:border-gray-700 absolute z-9999 inset-0 opacity-40">
                    <div role="status">
                      <svg
                        aria-hidden="true"
                        className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                </div>
              )}
              {!session && (
                <SecondButton
                  title="Sign In"
                  onClick={async () => {
                    navigate("/signin");
                  }}
                />
              )}
              {!session && (
                <MainButton
                  title="Create Account"
                  onClick={() => navigate("/create-acc")}
                />
              )}
            </div>
            <div className="account-mobile flex lg:hidden">
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <button className="p-2.5 bg-purple-200 rounded-lg hover:bg-purple-100 hover:cursor-pointer">
                    <HiUserCircle />
                  </button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    sideOffset={10}
                    align="center"
                    className="min-w-56 rounded-lg shadow-lg p-5 text-black hover:cursor-default hover:border-none bg-purple-100"
                  >
                    {!session && (
                      <div>
                        <DropdownMenu.Item>
                          <div
                            onClick={async () => {
                              navigate("/signin");
                            }}
                            className="inline-flex w-full items-center justify-start gap-2"
                          >
                            <HiOutlineLogin />
                            <span>Sign In</span>
                          </div>
                        </DropdownMenu.Item>
                        <DropdownMenu.Item>
                          <div
                            onClick={() => navigate("/create-acc")}
                            className="inline-flex w-full items-center justify-start gap-2"
                          >
                            <HiUserCircle />
                            <span>Create Account</span>
                          </div>
                        </DropdownMenu.Item>
                      </div>
                    )}
                    {session && (
                      <div>
                        <div className="mob-user-info flex flex-col items-start justify-center">
                          <div className="pb-2">
                            {avatarUrl ? (
                              <img
                                src={avatarUrl}
                                alt="user profile"
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <HiUserCircle className="text-2xl" />
                            )}
                          </div>
                          <div className="flex flex-col items-start justify-start text-center">
                            <span className="text-xs font-semibold">
                              {session?.user?.user_metadata.name}
                            </span>
                            <span className="text-xs font-light">
                              {session?.user?.email}
                            </span>
                          </div>
                        </div>
                        <DropdownMenu.Separator className="h-px my-2 bg-gray-500" />
                        <DropdownMenu.Item>
                          <div
                            onClick={async () => {
                              await signOut();
                            }}
                            className="inline-flex items-center justify-start gap-2 "
                          >
                            <HiOutlineLogout className="text-sm font-semibold" />
                            <span className="text-sm font-semibold">
                              Sign Out
                            </span>
                          </div>
                        </DropdownMenu.Item>
                      </div>
                    )}
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
              {isLoading && (
                <div>
                  <div className="flex items-center justify-center w-screen h-screen bg-black dark:bg-gray-800 dark:border-gray-700 absolute z-9999 inset-0 opacity-40">
                    <div role="status">
                      <svg
                        aria-hidden="true"
                        className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                </div>
              )}
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
        <div className="absolute bottom-4 left-4  items-center z-10 bg-amber-100 border-2 border-amber-200 rounded-xl w-fit hidden sm:inline-flex">
          <button
            className="hover:bg-orange-200 hover:cursor-pointer px-4 py-2 rounded-l-lg"
            onClick={() => setZoomValue(Math.max(zoomValue - 10, 10))}
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
            onClick={() => setZoomValue(Math.min(zoomValue + 10, 500))}
          >
            <HiOutlineZoomIn />
          </button>
        </div>
        <a href="https://forms.gle/5s7W6VNtgeGiRFyL8">
          <button className="absolute bottom-4 right-4 items-center z-10 bg-red-100 border-2 border-red-200 rounded-xl w-fit p-2.5 hover:bg-red-200 hover:cursor-pointer group">
            <HiOutlineChatAlt2 />
            <span className="absolute right-12 -top-5 translate-x-1/2 text-nowrap px-2 py-1 rounded-sm bg-gray-700 text-sm text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-500 ">
              RectUp Form
            </span>
          </button>
        </a>
        {showTodoForm && (
          <TodoForm
            parent={selectedParent}
            onAddTodo={addTodo}
            onCloseForm={closeTodoForm}
          />
        )}
        {showForm && (
          <TaskForm
            onAddTask={addRect}
            onUpdateTask={updateRect}
            onCloseForm={closeForm}
            initialData={selectedShape}
          />
        )}
        <ShapeCanvas
          shapes={shapes}
          setShapes={setShapes}
          tool={tool}
          setTool={setTool}
          setZoomValue={setZoomValue}
          zoom={zoomValue}
          connectors={connectors}
          addConnector={addConnector}
          setConnectors={setConnectors}
          strokeColor={strokeColor}
          onShapeClick={openForm}
          onAddTodo={openTodoForm}
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
