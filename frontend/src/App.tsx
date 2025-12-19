import "./App.css";
//import BottomNav from "./components/BottomNav";
import { useEffect, useState } from "react";
import ShapeCanvas from "./components/ShapeCanvas";
import type {
  RectType,
  ArrowType,
  ToolType,
  ShapeType,
  TodoType,
  LoadingToastType,
  // CanvasStatus,
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
  HiOutlineTrash,
  HiOutlineChevronDown,
  HiOutlineLogout,
  HiOutlineLogin,
  HiOutlineFolderOpen,
  HiOutlineCheck,
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineGlobeAlt,
  HiOutlineX,
} from "react-icons/hi";
import { HiMiniArrowUturnLeft, HiMiniArrowUturnRight } from "react-icons/hi2";
import { FaGithub } from "react-icons/fa";
import { DropdownMenu, AlertDialog } from "radix-ui";
import AppToolbar from "./components/ui/buttons/tools/AppToolbar";
import {
  deleteCanvas,
  loadCanvas,
  saveCanvas,
  getUserProfile,
  getUserCanvases,
  createNewCanvas,
  updateCanvasName,
  deleteCanvasById,
  updateCanvasColor,
  getCanvasColor,
} from "./services/DBFunction";
import { useIndexedDBInit } from "./services/useIndexedDb";
import { useAutosaveCanvas } from "./services/autosaveCanvas";
import Konva from "konva";
import { useUndoRedo } from "./context/UndoRedo/UndoRedoHelper";
import Toast from "./components/LoadingToast";

function App() {
  const { init } = useIndexedDBInit();

  const { session } = useSession();
  const [instruments, _setInstruments] = useState<any[]>([]);
  const [zoomValue, setZoomValue] = useState(100);
  const [stageCoor, setStageCoor] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [showForm, setShowForm] = useState(false);
  const [showTodoForm, setShowTodoForm] = useState(false);
  const [isFormOpen, setisFormOpen] = useState(false);
  const [shapes, setShapes] = useState<ShapeType[]>([]);
  const [connectors, setConnectors] = useState<ArrowType[]>([]);
  const [tool, setTool] = useState<ToolType>("hand");
  const navigate = useNavigate();
  const [selectedShape, setSelectedShape] = useState<ShapeType | null>(null);
  const [selectedTodo, setSelectedTodo] = useState<TodoType | null>(null);
  const [selectedParent, setSelectedParent] = useState<RectType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [currentCanvasId, setCurrentCanvasId] = useState<string | null>(null);
  const [canvasList, setCanvasList] = useState<any[]>([]);
  // const [canvasUsers, setCanvasUsers] = useState<CanvasUsers[]>([]);
  const { pushUndo, undo, redo } = useUndoRedo();
  const [showNameModal, setShowNameModal] = useState(false);
  const [newCanvasName, setNewCanvasName] = useState("");
  const [editingCanvasId, setEditingCanvasId] = useState<string | null>(null);
  const [editingCanvasName, setEditingCanvasName] = useState("");
  const [toolVis, setToolVis] = useState(true);
  // canvas color
  const [canvasCol, setcanvasCol] = useState<string>("#ffffff");
  const [drawCol, setDrawCol] = useState<string>("#000");
  // Tambah state ini
  const [hasShownLocalReminder, setHasShownLocalReminder] = useState(false);
  const [showLocalReminder, setShowLocalReminder] = useState(false);
  // const [status, setStatus] = useState<CanvasStatus>("idle");
  // const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: LoadingToastType;
  } | null>(null);

  const showToast = (message: string, type: LoadingToastType) => {
    setToast({ message, type });

    if (type !== "loading") {
      setTimeout(() => setToast(null), 3000);
    }
  };

  useAutosaveCanvas({ shapes, connectors }, 1000, () => {
    if (!currentCanvasId || shapes.length === 0) return;
    saveCanvas(
      {
        shapes,
        connectors,
        viewport: { x: stageCoor.x, y: stageCoor.y, scale: zoomValue / 100 },
      },
      currentCanvasId
    );
  });

  useEffect(() => {
    let mounted = true;

    (async () => {
      await init();
      showToast("Loading objects...", "loading");
      if (!session) {
        const local = await loadCanvas("local");
        if (!mounted) return;

        if (local.success) {
          setShapes(local.data.shapes);
          setConnectors(local.data.connectors);
          setStageCoor({
            x: local.data.viewport.x,
            y: local.data.viewport.y,
          });
          setZoomValue(Math.round(local.data.viewport.scale * 100));
          setCurrentCanvasId("local");
          const shapeCount = local.data.shapes.length + local.data.connectors.length

          if (shapeCount === 0) {
            showToast("No objects found.", "empty");
          } else {
            showToast(`Loaded ${shapeCount} objects`, "success");
          }

          // timeout for toast
          setTimeout(() => setToast(null), 3000);


        } else {
          setConnectors([]);
          setShapes([]);
        }

        setCurrentCanvasId("local");
        setCanvasList([]);
        return;
      }
      const canvasRes = await loadCanvas(currentCanvasId);
      if (!mounted) return;

      if (canvasRes.success) {
        setShapes(canvasRes.data.shapes);
        setCurrentCanvasId(canvasRes.canvasId);
        setConnectors(canvasRes.data.connectors);
        setStageCoor({
          x: canvasRes.data.viewport.x,
          y: canvasRes.data.viewport.y,
        });
        setZoomValue(Math.round(canvasRes.data.viewport.scale * 100));


        const shapeCount = canvasRes.data.shapes.length + canvasRes.data.connectors.length

        if (shapeCount === 0) {
          showToast("No objects found.", "empty");
        } else {
          showToast(`Loaded ${shapeCount} object(s)`, "success");
        }

        // timeout for toast
        setTimeout(() => setToast(null), 3000);

        // console.log("canvas id: ", canvasRes.canvasId);
        // console.log("shapes: ", canvasRes.data.shapes);
      } else {
        console.error("Failed to load canvas:", canvasRes.error);
      }
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
  }, [init, session, currentCanvasId]);

  // async function getInstruments() {
  //   const { data } = await supabase.from("instruments").select();
  //   setInstruments(data ?? []);
  // }

  // useeffect for autosaving canvas color
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!currentCanvasId) {
        updateCanvasColor("local", canvasCol);
      } else {
        updateCanvasColor(currentCanvasId, canvasCol);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [canvasCol, currentCanvasId]);

  // useeffect for getting canvas color for every canvas change
  useEffect(() => {
    (async () => {
      if (!currentCanvasId) {
        const localColor = await getCanvasColor("local");
        if (localColor) setcanvasCol(localColor);
      } else {
        const savedColor = await getCanvasColor(currentCanvasId);
        if (savedColor) setcanvasCol(savedColor);
      }
    })();
  }, [currentCanvasId]);

  //useeffect for showing local canvas save reminder
  useEffect(() => {
    if (
      !session &&
      currentCanvasId === "local" &&
      shapes.length >= 5 &&
      !hasShownLocalReminder
    ) {
      setShowLocalReminder(true);
      setHasShownLocalReminder(true);
    }

    if (session || shapes.length < 5) {
      setHasShownLocalReminder(false);
    }
  }, [session, shapes.length, currentCanvasId, hasShownLocalReminder]);

  const openTodoForm = (parent: RectType | null, currTodo: TodoType | null) => {
    setSelectedParent(parent);
    //console.log("parent: " + parent);
    setSelectedTodo(currTodo);
    setisFormOpen(true);
    setShowTodoForm(true);
  };

  const closeTodoForm = () => {
    setSelectedParent(null);
    setSelectedTodo(null);
    setisFormOpen(false);
    setShowTodoForm(false);
  };

  const openForm = (shape: ShapeType | null) => {
    setSelectedShape(shape);
    // console.log("shape: " + shape);
    setShowForm(true);
    setisFormOpen(true);
  };

  const closeForm = () => {
    setSelectedShape(null);
    setShowForm(false);
    setisFormOpen(false);
  };

  const addTodo = (newFields: todoFields, parent: RectType | null) => {
    const iso = new Date(newFields.date).toISOString();
    // console.log("Current parent is: " + parent?.id);
    const newTodo: TodoType = {
      id: "todo-" + Date.now().toString(),
      x: parent
        ? parent.x + 400
        : (stageCoor.x * -1 + (window.innerWidth - 200) / 2) *
        (100 / zoomValue),
      y: parent
        ? parent.y
        : (stageCoor.y * -1 + (window.innerHeight - 200) / 2) *
        (100 / zoomValue),
      color: newFields.color, // default is green
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
      assignee: session?.user.email ?? "Guest",
      status: "Something",
      parents: parent ? parent.id : "",
    };

    setShapes([...shapes, newTodo]);
    if (parent) {
      setShapes((prev) =>
        prev.map((s) =>
          s.shape === "rect" && s.id === parent.id
            ? { ...s, children: [...s.children, "group-" + newTodo.id] }
            : s
        )
      );
      addConnector(newTodo, parent, newTodo.id);
    }

    pushUndo({
      before: newTodo,
      after: newTodo,
      action: "add",
      id: newTodo.id,
    });
  };

  const addRect = (newTask: taskFields) => {
    setTool("hand");

    const newRect: RectType = {
      shape: "rect",
      id: "rect-" + Date.now().toString(),
      behavior: "node",
      x: (stageCoor.x * -1 + (window.innerWidth - 200) / 2) * (100 / zoomValue),
      y:
        (stageCoor.y * -1 + (window.innerHeight - 200) / 2) * (100 / zoomValue),
      width: 300,
      height: 200,
      color: newTask.color,
      title: newTask.title,
      description: newTask.description,
      dueDate: newTask.date,
      completed: false,
      isCollapsed: false,
      children: [],
      parents: "",
      scaleX: 1,
      scaleY: 1,
    };

    setShapes([...shapes, newRect]);

    pushUndo({ before: newRect, after: newRect, action: "add" });
  };

  const addConnector = (
    from: Konva.Node | ShapeType,
    to: Konva.Node | ShapeType,
    pushId?: string
  ) => {
    const fromId = from instanceof Konva.Node ? from.id() : "group-" + from.id;
    const toId = to instanceof Konva.Node ? to.id() : "group-" + to.id;

    const newConnector: ArrowType = {
      shape: "connector",
      id: "connector-" + Date.now().toString(),
      from: fromId,
      to: toId,
    };

    setConnectors([...connectors, newConnector]);

    pushUndo({
      before: newConnector,
      after: newConnector,
      action: "add",
      id: pushId ? pushId : undefined,
    });
  };

  const addText = () => {
    const newText = {
      id: "text-" + Date.now().toString(),
      x: (stageCoor.x * -1 + (window.innerWidth - 200) / 2) * (100 / zoomValue),
      y:
        (stageCoor.y * -1 + (window.innerHeight - 200) / 2) * (100 / zoomValue),
      fontSize: 20,
      text: "Insert your text here",
      shape: "text",
      behavior: "decor",
      scaleX: 1,
      scaleY: 1,
      width: 200,
      color: "black",
    } as const;
    setShapes([...shapes, newText]);
    pushUndo({ before: newText, after: newText, action: "add" });
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

  const updateTodo = (shape: ShapeType, newData: todoFields) => {
    setShapes((prev) =>
      prev.map((t) =>
        t.id === shape.id
          ? {
            ...t,
            title: newData.title,
            dueDate: newData.date,
            completed: newData.completed,
            color: newData.color,
          }
          : t
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

  const clearIndexedDBShapes = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("CanvasDB");

      request.onsuccess = () => {
        const db = request.result;
        const tx = db.transaction("Canvas", "readwrite");
        const store = tx.objectStore("Canvas");

        store.clear();

        tx.oncomplete = () => {
          // console.log("IndexedDB shapes cleared");
          resolve();
        };
        tx.onerror = () => {
          console.error("Failed to clear IndexedDB shapes");
          reject();
        };
      };

      request.onerror = () => reject();
    });
  };

  const clearCanvas = async () => {
    setShapes([]);
    setConnectors([]);

    if (currentCanvasId === "local") {
      await clearIndexedDBShapes();
    } else if (currentCanvasId) {
      const response = await deleteCanvas(currentCanvasId);
      if (!response.success) {
        console.error("Failed to delete canvas from supabase", response.error);
      }
    }
  };
  // if (!session) {
  //   return <Auth supabase={supabase} appearance={{ theme: ThemeSupa }}></Auth>
  // }

  const signOut = async () => {
    setIsLoading(true);
    try {
      // setConnectors([]);
      // setShapes([]);
      // setCurrentCanvasId(null);
      // await clearIndexedDBShapes();
      await supabase.auth.signOut();

      const local = await loadCanvas("local");
      if (local.success) {
        setShapes(local.data.shapes);
        setConnectors(local.data.connectors);
        setStageCoor(local.data.viewport);
        setZoomValue(Math.round(local.data.viewport.scale * 100));
        setCurrentCanvasId("local");
      } else {
        setShapes([]);
        setConnectors([]);
        setCurrentCanvasId(null);
      }

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
      await saveCanvas(
        {
          shapes,
          connectors,
          viewport: { x: stageCoor.x, y: stageCoor.y, scale: zoomValue / 100 },
        },
        currentCanvasId || null
      );
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
        await saveCanvas(
          {
            shapes,
            connectors,
            viewport: {
              x: stageCoor.x,
              y: stageCoor.y,
              scale: zoomValue / 100,
            },
          },
          currentCanvasId
        );
      }
      const result = await loadCanvas(canvasId || null);
      if (result.success) {
        setShapes(result.data.shapes);
        setConnectors(result.data.connectors);
        setCurrentCanvasId(result.canvasId);

        // console.log("Loaded", result.data.shapes.length, "shapes");
      } else {
        showToast(result.error, "error");
        // console.error("Load failed:", result.error);
      }
    } catch (error) {

      console.error("Load error:", error);
    } finally {
      setIsLoading(false);
    }

  };

  const handleCreateNewCanvas = async (name: string) => {
    if (!session) {
      console.warn("No session");
      return;
    }

    setIsLoading(true);

    try {
      if (currentCanvasId) {
        await saveCanvas(
          {
            shapes,
            connectors,
            viewport: {
              x: stageCoor.x,
              y: stageCoor.y,
              scale: zoomValue / 100,
            },
          },
          currentCanvasId
        );
      }

      const result = await createNewCanvas(
        session.user.id,
        name || `Canvas ${canvasList.length + 1}`
      );

      if (result.success && result.canvasId) {
        setShapes([]);
        setConnectors([]);
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

  const handleEditCanvasName = async (canvasId: string) => {
    if (!editingCanvasName.trim()) {
      return;
    }

    setIsLoading(true);
    try {
      const result = await updateCanvasName(canvasId, editingCanvasName);

      if (result.success) {
        setCanvasList((prev) =>
          prev.map((canvas) =>
            canvas.canvas_id === canvasId
              ? { ...canvas, canvas_name: editingCanvasName }
              : canvas
          )
        );
        setEditingCanvasId(null);
        setEditingCanvasName("");
      } else {
        console.error("Failed to update canvas name:", result.error);
      }
    } catch (error) {
      console.error("Error updating canvas name:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCanvas = async (canvasId: string, canvasName: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${canvasName}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setIsLoading(true);
    try {
      const result = await deleteCanvasById(canvasId);

      if (result.success) {
        setCanvasList((prev) => prev.filter((c) => c.canvas_id !== canvasId));

        if (currentCanvasId === canvasId) {
          const remainingCanvases = canvasList.filter(
            (c) => c.canvas_id !== canvasId
          );
          if (remainingCanvases.length > 0) {
            await handleSwitchCanvas(remainingCanvases[0].canvas_id);
          } else {
            setShapes([]);
            setConnectors([]);
            setCurrentCanvasId(null);
          }
        }
      } else {
        console.error("Failed to delete canvas:", result.error);
      }
    } catch (error) {
      console.error("Error deleting canvas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  //const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <>
      <div className="relative w-screen h-100dvh overflow-hidden ">
        <nav className="top-nav absolute w-full z-50 flex flex-wrap justify-between items-center p-5">
          <div className="more-options">
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
                  className="min-w-56 max-h-[50dvh]  overflow-y-scroll rounded-lg shadow-lg p-5 text-blue-700 hover:cursor-default hover:border-none bg-white "
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
                        <AlertDialog.Content className="bg-white fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm sm:max-w-md lg:max-w-xl p-4 sm:p-6 rounded-lg z-101">
                          <AlertDialog.Title className="text-xl font-bold mb-4 flex items-center gap-2">
                            <HiOutlineFolderOpen />
                            My Canvases
                          </AlertDialog.Title>
                          <AlertDialog.Description asChild>
                            <div className="my-4">
                              <div className="grid grid-cols-1 gap-3">
                                {canvasList.length === 0 ? (
                                  <div className="text-gray-500 text-center py-8">
                                    No canvases yet. Create your first one!
                                  </div>
                                ) : (
                                  canvasList.map((canvas) => (
                                    <div
                                      key={canvas.canvas_id}
                                      className={`
                                        flex items-center justify-between p-4 rounded-lg border-2 
                                        transition-all
                                        ${currentCanvasId === canvas.canvas_id
                                          ? "bg-blue-100 border-blue-400"
                                          : "bg-gray-50 border-gray-200"
                                        }
                                      `}
                                    >
                                      <div
                                        className="flex items-center gap-3 flex-1 cursor-pointer hover:opacity-80"
                                        onClick={() => {
                                          if (
                                            editingCanvasId !== canvas.canvas_id
                                          ) {
                                            handleSwitchCanvas(
                                              canvas.canvas_id
                                            );
                                          }
                                        }}
                                      >
                                        <HiOutlineFolder className="w-5 h-5 text-blue-600" />
                                        <div className="flex-1">
                                          {editingCanvasId ===
                                            canvas.canvas_id ? (
                                            <input
                                              type="text"
                                              value={editingCanvasName}
                                              onChange={(e) =>
                                                setEditingCanvasName(
                                                  e.target.value
                                                )
                                              }
                                              onKeyDown={(e) => {
                                                if (e.key === " ") {
                                                  e.stopPropagation();
                                                }
                                                if (e.key === "Enter") {
                                                  handleEditCanvasName(
                                                    canvas.canvas_id
                                                  );
                                                } else if (e.key === "Escape") {
                                                  setEditingCanvasId(null);
                                                  setEditingCanvasName("");
                                                }
                                              }}
                                              className="font-medium text-gray-800 border-2 border-blue-400 rounded px-2 py-1 w-full"
                                              autoFocus
                                              onClick={(e) =>
                                                e.stopPropagation()
                                              }
                                            />
                                          ) : (
                                            <span className="font-medium text-gray-800">
                                              {canvas.canvas_name || "Untitled"}
                                            </span>
                                          )}
                                          {canvas.created_at && (
                                            <div className="text-xs text-gray-500 mt-1">
                                              Created:{" "}
                                              {new Date(
                                                canvas.created_at
                                              ).toLocaleDateString()}
                                            </div>
                                          )}
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-2">
                                        {currentCanvasId ===
                                          canvas.canvas_id && (
                                            <span className="text-xs text-blue-600 font-medium mr-2">
                                              Current
                                            </span>
                                          )}

                                        {editingCanvasId ===
                                          canvas.canvas_id ? (
                                          <>
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleEditCanvasName(
                                                  canvas.canvas_id
                                                );
                                              }}
                                              className="p-2 hover:bg-green-100 rounded transition-colors"
                                              title="Save"
                                            >
                                              <HiOutlineCheck className="w-4 h-4 text-green-600" />
                                            </button>
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setEditingCanvasId(null);
                                                setEditingCanvasName("");
                                              }}
                                              className="p-2 hover:bg-gray-200 rounded transition-colors"
                                              title="Cancel"
                                            >
                                              ✕
                                            </button>
                                          </>
                                        ) : (
                                          <>
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setEditingCanvasId(
                                                  canvas.canvas_id
                                                );
                                                setEditingCanvasName(
                                                  canvas.canvas_name || ""
                                                );
                                              }}
                                              className="p-2 hover:bg-blue-100 rounded transition-colors"
                                              title="Edit name"
                                            >
                                              <HiOutlinePencil className="w-4 h-4 text-blue-600" />
                                            </button>
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteCanvas(
                                                  canvas.canvas_id,
                                                  canvas.canvas_name
                                                );
                                              }}
                                              className="p-2 hover:bg-red-100 rounded transition-colors"
                                              title="Delete canvas"
                                            >
                                              <HiOutlineTrash className="w-4 h-4 text-red-600" />
                                            </button>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  ))
                                )}
                              </div>
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

                  <DropdownMenu.Separator />

                  <DropdownMenu.Item className="py-1 pl-2  hover:bg-sky-200 rounded-lg hover:text-blue-700">
                    <div
                      className="flex items-center gap-2"
                      onClick={() => setShowNameModal(true)}
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
                        <AlertDialog.Content className="bg-white fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] max-w-sm sm:max-w-md p-4 sm:p-6 rounded-lg z-101">
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
                  <DropdownMenu.Separator className="h-[0.1dvh] my-2 bg-gray-500" />
                  <DropdownMenu.Item className="py-1 pl-2  hover:bg-sky-200 rounded-lg hover:text-blue-700">
                    <a href="https://github.com/x3nozite/rect-up">
                      <div className="flex items-center gap-2">
                        <FaGithub />
                        Github
                      </div>
                    </a>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item className="py-1 pl-2  hover:bg-sky-200 rounded-lg hover:text-blue-700">
                    <a href="https://forms.gle/5s7W6VNtgeGiRFyL8">
                      <div className="flex items-center gap-2">
                        <HiOutlineGlobeAlt />
                        Feedback & Support
                      </div>
                    </a>
                  </DropdownMenu.Item>
                  <DropdownMenu.Separator className="h-[0.1dvh] my-2 bg-gray-500" />
                  <DropdownMenu.Label className="py-0.5 pl-2 text-sm text-gray-400">
                    Stroke Color
                  </DropdownMenu.Label>
                  <DropdownMenu.RadioGroup
                    value={drawCol}
                    onValueChange={setDrawCol}
                    className="py-1 pl-2 "
                  >
                    <div className="flex flex-row gap-2 items-center justify-around">
                      <DropdownMenu.RadioItem value="#000" className="group">
                        <div className="p-4 relative bg-[#000] border-2 border-slate-200 rounded-lg group-data-[state=checked]:ring-2 group-data-[state=checked]:ring-slate-400"></div>
                      </DropdownMenu.RadioItem>
                      <DropdownMenu.RadioItem value="#e7000b" className="group">
                        <div className="p-4 bg-[#e7000b] border-red-200 border-2 rounded-lg group-data-[state=checked]:ring-2 group-data-[state=checked]:ring-red-400"></div>
                        <DropdownMenu.ItemIndicator></DropdownMenu.ItemIndicator>
                      </DropdownMenu.RadioItem>
                      <DropdownMenu.RadioItem value="#155dfc" className="group">
                        <div className="p-4 bg-[#155dfc] border-2 border-blue-200 rounded-lg group-data-[state=checked]:ring-2 group-data-[state=checked]:ring-blue-400"></div>
                        <DropdownMenu.ItemIndicator></DropdownMenu.ItemIndicator>
                      </DropdownMenu.RadioItem>
                      <DropdownMenu.RadioItem value="#009966" className="group">
                        <div className="p-4 bg-[#009966] border-2 border-emerald-200 rounded-lg group-data-[state=checked]:ring-2 group-data-[state=checked]:ring-emerald-400"></div>
                        <DropdownMenu.ItemIndicator></DropdownMenu.ItemIndicator>
                      </DropdownMenu.RadioItem>
                    </div>
                  </DropdownMenu.RadioGroup>
                  <DropdownMenu.Separator className="h-[0.1dvh] my-2 bg-gray-500" />
                  <DropdownMenu.Label className="py-0.5 pl-2 text-sm text-gray-400">
                    Canvas Theme
                  </DropdownMenu.Label>
                  <DropdownMenu.RadioGroup
                    value={canvasCol}
                    onValueChange={setcanvasCol}
                    className="py-1 pl-2 "
                  >
                    <div className="flex flex-row gap-2 items-center justify-around">
                      <DropdownMenu.RadioItem value="#ffffff" className="group">
                        <div className="p-4 relative bg-white border-2 border-slate-200 rounded-lg group-data-[state=checked]:ring-2 group-data-[state=checked]:ring-slate-400"></div>
                      </DropdownMenu.RadioItem>
                      <DropdownMenu.RadioItem value="#fff7ed" className="group">
                        <div className="p-4 bg-orange-50 border-orange-200 border-2 rounded-lg group-data-[state=checked]:ring-2 group-data-[state=checked]:ring-orange-400"></div>
                        <DropdownMenu.ItemIndicator></DropdownMenu.ItemIndicator>
                      </DropdownMenu.RadioItem>
                      <DropdownMenu.RadioItem value="#f5f3ff" className="group">
                        <div className="p-4 bg-violet-50 border-2 border-indigo-200 rounded-lg group-data-[state=checked]:ring-2 group-data-[state=checked]:ring-violet-400"></div>
                        <DropdownMenu.ItemIndicator></DropdownMenu.ItemIndicator>
                      </DropdownMenu.RadioItem>
                      <DropdownMenu.RadioItem value="#f0fdfa" className="group">
                        <div className="p-4 bg-teal-50 border-2 border-cyan-200 rounded-lg group-data-[state=checked]:ring-2 group-data-[state=checked]:ring-teal-400"></div>
                        <DropdownMenu.ItemIndicator></DropdownMenu.ItemIndicator>
                      </DropdownMenu.RadioItem>
                    </div>
                  </DropdownMenu.RadioGroup>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>
          <div className="tool-bar absolute left-1/2 transform -translate-x-1/2 hidden sm:flex">
            {/* <BottomNav
              onShapeClick={openForm}
              onEraserClick={toggleEraser}
              onClearClick={clearCanvas}
              onDrawClick={togglePencil}
              onColorSelect={setStrokeColor}
              isActive={tool === "eraser" || tool === "draw"}
            /> */}
            {toolVis && (
              <AppToolbar
                onShapeClick={() => openForm(null)}
                onTodoClick={() => openTodoForm(null, null)}
                onTextClick={addText}
                onEraserClick={toggleEraser}
                onClearClick={clearCanvas}
                onDrawClick={togglePencil}
                onSelectClick={toggleSelect}
                isActive={tool === "eraser" || tool === "draw"}
                tool={tool}
                setTool={setTool}
              />
            )}
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
                              {session?.user?.user_metadata.name ||
                                session?.user.user_metadata.username}
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
        <div className="absolute pb-4 bottom-bar flex flex-col   inset-x-0 gap-2 w-full bottom-0">
          <div className="flex flex-row w-full justify-between px-5">
            <div className="flex flex-row gap-2">
              <div className=" items-center z-10 bg-amber-100 border-2 border-amber-200 rounded-xl w-fit inline-flex">
                <button
                  className="hover:bg-orange-200 active:bg-orange-200 hover:cursor-pointer p-2 sm:px-4 sm:py-2 rounded-l-lg h-full"
                  onClick={() => setZoomValue(Math.max(zoomValue - 10, 10))}
                >
                  <HiOutlineZoomOut />
                </button>
                <button
                  onClick={() => setZoomValue(100)}
                  className="relative w-20 py-2 hover:cursor-pointer text-center group"
                >
                  {zoomValue}%
                  <span className="absolute pointer-events-none -top-5 left-1/2 -translate-x-1/2 text-nowrap px-2 py-1 rounded-sm bg-gray-700 text-sm text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-500 ">
                    Reset Value
                  </span>
                </button>
                <button
                  className="hover:bg-orange-200 active:bg-orange-200 hover:cursor-pointer p-2 sm:px-4 sm:py-2 rounded-r-lg h-full"
                  onClick={() => setZoomValue(Math.min(zoomValue + 10, 500))}
                >
                  <HiOutlineZoomIn />
                </button>
              </div>
              <div className=" items-center z-10 gap-1 sm:gap-0 bg-green-100 border-2 border-emerald-200 rounded-xl w-fit inline-flex">
                <button
                  className="hover:bg-green-200 active:bg-green-200 group relative hover:cursor-pointer p-2 sm:px-4 sm:py-2 rounded-l-lg h-full"
                  onClick={() => undo(setShapes, setConnectors)}
                >
                  <HiMiniArrowUturnLeft />
                  <span className="absolute pointer-events-none -top-5 left-1/2 -translate-x-1/2 text-nowrap px-2 py-1 rounded-sm bg-gray-700 text-sm text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-500 ">
                    Undo
                  </span>
                </button>
                <button
                  className="hover:bg-green-200 active:bg-green-200 group relative hover:cursor-pointer p-2 sm:px-4 sm:py-2 rounded-r-lg h-full"
                  onClick={() => redo(setShapes, setConnectors)}
                >
                  <HiMiniArrowUturnRight />
                  <span className="absolute pointer-events-none -top-5 left-1/2 -translate-x-1/2 text-nowrap px-2 py-1 rounded-sm bg-gray-700 text-sm text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-500 ">
                    Redo
                  </span>
                </button>
              </div>
            </div>
            <div className="flex flex-row  bottom-20 md:bottom-4 right-4 gap-4">
              <button
                onClick={() => setToolVis((prev) => !prev)}
                className="items-center z-10 bg-red-100 border-2 border-red-200 rounded-xl w-fit p-2.5 hover:bg-red-200 active:bg-red-300 hover:cursor-pointer group"
              >
                {toolVis ? <HiOutlineEye /> : <HiOutlineEyeOff />}
                <span className="absolute pointer-events-none right-12 -top-5 translate-x-1/2 text-nowrap px-2 py-1 rounded-sm bg-gray-700 text-sm text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-500 ">
                  Toolbar Visibility
                </span>
              </button>
            </div>
          </div>
          <div className="toolbar-mob  flex sm:hidden z-100 w-full  justify-center  ">
            {toolVis && (
              <AppToolbar
                onShapeClick={() => openForm(null)}
                onTodoClick={() => openTodoForm(null, null)}
                onTextClick={addText}
                onEraserClick={toggleEraser}
                onClearClick={clearCanvas}
                onDrawClick={togglePencil}
                onSelectClick={toggleSelect}
                isActive={tool === "eraser" || tool === "draw"}
                tool={tool}
                setTool={setTool}
              />
            )}
          </div>
        </div>

        {showTodoForm && (
          <TodoForm
            parent={selectedParent}
            onUpdateTodo={updateTodo}
            onAddTodo={addTodo}
            onCloseForm={closeTodoForm}
            initialTodo={selectedTodo}
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
        <div style={{ background: canvasCol, touchAction: "none" }}>
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
            strokeColor={drawCol}
            onShapeClick={openForm}
            onAddTodo={openTodoForm}
            stageCoor={stageCoor}
            setStageCoor={setStageCoor}
            isFormOpen={isFormOpen}
            onTextClick={addText}
          />
        </div>
      </div>

      <ul>
        {instruments.map((instrument) => (
          <li key={instrument.name}>{instrument.name}</li>
        ))}
      </ul>
      <AlertDialog.Root open={showNameModal} onOpenChange={setShowNameModal}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="fixed bg-black opacity-50 inset-0 z-100" />

          <AlertDialog.Content className="bg-white fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm sm:max-w-md lg:max-w-lg p-4 sm:p-5 rounded-lg z-101">
            <AlertDialog.Title className="text-xl font-bold mb-2">
              New Canvas
            </AlertDialog.Title>

            <AlertDialog.Description className="my-3 text-gray-700">
              Enter a name for your new canvas.
            </AlertDialog.Description>

            <input
              autoFocus
              value={newCanvasName}
              onChange={(e) => setNewCanvasName(e.target.value)}
              placeholder="Canvas name..."
              className="w-full border border-gray-300 p-2 rounded-lg mb-4"
            />

            <div className="flex justify-end gap-4">
              <AlertDialog.Cancel asChild>
                <button className="hover:underline decoration-1 hover:cursor-pointer">
                  Cancel
                </button>
              </AlertDialog.Cancel>

              <AlertDialog.Action asChild>
                <button
                  className="bg-blue-200 text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-500 hover:text-white"
                  onClick={() => {
                    handleCreateNewCanvas(newCanvasName);
                    setNewCanvasName("");
                  }}
                >
                  Create Canvas
                </button>
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
      {showLocalReminder &&
        !session &&
        currentCanvasId === "local" &&
        shapes.length >= 5 && (
          <div className="fixed bottom-24 right-5 z-[200] max-w-sm animate-in slide-in-from-right">
            <div className="bg-white rounded-lg p-4 shadow-lg">
              <div className="flex items-start gap-3">
                <HiOutlineGlobeAlt className="text-blue-600 text-xl flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="font-semibold text-gray-900">
                      Local Storage Reminder
                    </h4>
                    <button
                      onClick={() => setShowLocalReminder(false)}
                      className="text-gray-400 hover:text-gray-600 -mt-1 -mr-1"
                    >
                      <HiOutlineX />
                    </button>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">
                    {shapes.length} shapes saved locally. Sign in to use across
                    different devices! (Local data will remain on this device and won’t be migrated after signing in.)
                  </p>
                  <button
                    onClick={() => navigate("/signin")}
                    className="bg-blue-500 text-white px-3 py-1.5 rounded-lg hover:bg-blue-600 text-sm font-medium w-full flex items-center justify-center gap-1"
                  >
                    <HiOutlineLogin />
                    Sign In Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </>
  );
}

export default App;
export { supabase };
