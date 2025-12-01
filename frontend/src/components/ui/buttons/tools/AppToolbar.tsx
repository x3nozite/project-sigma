import { Toolbar } from "radix-ui";
import {
  HiOutlineCube,
  HiOutlineHand,
  HiOutlinePencil,
  HiOutlineAnnotation,
  HiOutlinePhotograph,
  HiSelector,
  HiOutlineBookOpen,
  HiOutlineCursorClick,
} from "react-icons/hi";
import { RiCursorFill } from "react-icons/ri";
import { BsEraser } from "react-icons/bs";
import type { RectType, ToolType } from "../../../types";

interface Props {
  onEraserClick: () => void;
  onShapeClick: () => void;
  onTodoClick: (parent?: RectType) => void;
  onTextClick: () => void;
  onClearClick: () => void;
  onDrawClick: () => void;
  onSelectClick: () => void;
  onColorSelect?: (color: string) => void;
  isActive: boolean;
  tool: ToolType;
  setTool: React.Dispatch<React.SetStateAction<ToolType>>;
}

function AppToolbar({
  // onClearClick,
  onShapeClick,
  onTodoClick,
  onDrawClick,
  onSelectClick,
  // onColorSelect,
  onTextClick,
  onEraserClick,
  // isActive,
  tool,
  setTool,
}: Props) {
  return (
    <Toolbar.Root className="flex w-100 max-w-100 rounded-lg bg-white border-2 border-zinc-300 shadow-sm p-2 justify-center">
      <Toolbar.ToggleGroup type="single">
        <Toolbar.ToggleItem value="task">
          <div
            className="add-shape relative group flex flex-col justify-center items-center  rounded-l-sm border-none w-10 h-10 p-1 text-gray-700 transition-colors duration-50 hover:bg-blue-50 hover:text-gray-900 focus:z-10 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white focus:outline-none disabled:pointer-events-auto disabled:opacity-50"
            onClick={onShapeClick}
          >
            <HiOutlineCube className="text-xl" />
            <span className="absolute -top-3 text-nowrap px-2 py-1 rounded-sm bg-gray-700 text-sm text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-500 ">
              Add Task — Q
            </span>
            <span className="absolute text-xs right-0 bottom-0 font-bold text-gray-300 group-data-[state=on]:text-blue-500">
              Q
            </span>
          </div>
        </Toolbar.ToggleItem>
        <Toolbar.ToggleItem value="todo">
          <div
            className="add-shape relative group flex flex-col justify-center items-center  rounded-l-sm border-none w-10 h-10 p-1 text-gray-700 transition-colors duration-50 hover:bg-blue-50 hover:text-gray-900 focus:z-10 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white focus:outline-none disabled:pointer-events-auto disabled:opacity-50"
            onClick={() => onTodoClick()}
          >
            <HiOutlineBookOpen className="text-xl" />
            <span className="absolute -top-3 text-nowrap px-2 py-1 rounded-sm bg-gray-700 text-sm text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-500 ">
              Add To-do — W
            </span>
            <span className="absolute text-xs right-0 bottom-0 font-bold text-gray-300 group-data-[state=on]:text-blue-500">
              W
            </span>
          </div>
        </Toolbar.ToggleItem>
      </Toolbar.ToggleGroup>
      <Toolbar.Separator className="w-px my-3 mx-2 bg-black" />
      <Toolbar.ToggleGroup type="single">
        <Toolbar.ToggleItem value="annotate">
          <div
            onClick={() => onTextClick()}
            className="add-annotate group flex flex-col justify-center items-center  rounded-sm border-none w-10 h-10 p-1 text-gray-700 transition-colors duration-50 hover:bg-blue-50 hover:text-gray-900 focus:z-10 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white focus:outline-none disabled:pointer-events-auto disabled:opacity-50"
          >
            <HiOutlineAnnotation className="text-xl" />
            <span className="absolute -top-3 text-nowrap px-2 py-1 rounded-sm bg-gray-700 text-sm text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-500 ">
              Annotate
            </span>
          </div>
        </Toolbar.ToggleItem>
        <Toolbar.ToggleItem value="image">
          <div className="add-image group relative border-none inline-flex flex-col items-center justify-center w-10 h-10 p-1 duration-50 text-gray-700 transition-colors hover:bg-blue-50 hover:text-gray-900 focus:z-10 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white focus:outline-none disabled:pointer-events-auto disabled:opacity-50">
            <HiOutlinePhotograph className="text-xl" />
            <span className="absolute -top-3 text-nowrap px-2 py-1 rounded-sm bg-gray-700 text-sm text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-500 ">
              Add Image
            </span>
          </div>
        </Toolbar.ToggleItem>
      </Toolbar.ToggleGroup>

      <Toolbar.Separator className="w-px my-3 mx-2 bg-black" />
      <Toolbar.ToggleGroup
        type="single"
        value={tool}
        onValueChange={(value) => {
          if (value) setTool(value as ToolType);
        }}
      >
        <Toolbar.ToggleItem value="hand" className="group">
          <div className="pan-canvas relative flex flex-col justify-center items-center  rounded-sm border-none w-10 h-10 p-1 text-gray-700 transition-colors duration-50 hover:bg-blue-50 hover:text-gray-900 focus:z-10 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white focus:outline-none disabled:pointer-events-auto disabled:opacity-50  ">
            <HiOutlineHand className="-rotate-[45deg] text-xl group-data-[state=on]:stroke-blue-500" />
            <span className="absolute -top-3 text-nowrap px-2 py-1 rounded-sm bg-gray-700 text-sm text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-500 ">
              Hand — 1 or Z
            </span>
            <span className="absolute text-xs right-0 bottom-0 font-bold text-gray-300 group-data-[state=on]:text-blue-500">
              1
            </span>
          </div>
        </Toolbar.ToggleItem>
        <Toolbar.ToggleItem
          value="select"
          className="group"
          onClick={onSelectClick}
        >
          <div className="select-canvas relative flex flex-col justify-center items-center  rounded-sm border-none w-10 h-10 p-1 text-gray-700 transition-colors duration-50 hover:bg-blue-50 hover:text-gray-900 focus:z-10 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white focus:outline-none disabled:pointer-events-auto disabled:opacity-50  ">
            {/* <HiSelector className="-rotate-[45deg] text-xl  group-data-[state=on]:blue-500" /> */}
            <HiOutlineCursorClick className="text-xl group-data-[state=on]:stroke-blue-500" />
            <span className="absolute -top-3 text-nowrap px-2 py-1 rounded-sm bg-gray-700 text-sm text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-500 ">
              Select — 2 or X
            </span>
            <span className="absolute text-xs right-0 bottom-0 font-bold text-gray-300 group-data-[state=on]:text-blue-500">
              2
            </span>
          </div>
        </Toolbar.ToggleItem>
        <Toolbar.ToggleItem
          value="draw"
          className="group"
          onClick={onDrawClick}
        >
          <div className="draw-canvas relative flex flex-col justify-center items-center rounded-sm border-none w-10 h-10 p-1 duration-50 text-gray-700 transition-colors hover:bg-blue-50 hover:text-gray-900 focus:z-10 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2  focus:ring-offset-white focus:outline-none  disabled:pointer-events-auto disabled:opacity-50">
            <HiOutlinePencil className="text-xl group-data-[state=on]:stroke-blue-500" />
            <span className="absolute -top-3 text-nowrap px-2 py-1 rounded-sm bg-gray-700 text-sm text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-500 ">
              Draw — 3 or C
            </span>
            <span className="absolute text-xs right-0 bottom-0 font-bold text-gray-300 group-data-[state=on]:text-blue-500">
              3
            </span>
          </div>
        </Toolbar.ToggleItem>
        <Toolbar.ToggleItem
          value="eraser"
          className="group"
          onClick={onEraserClick}
        >
          <div
            className={
              "add-shape relative group flex flex-col justify-center items-center rounded-sm border-none w-10 h-10 p-1 transition-colors duration-50 hover:text-red-500 focus:z-10 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white focus:outline-none  disabled:pointer-events-auto disabled:opacity-50"
            }
          >
            <BsEraser
              className="text-xl group-data-[state=on]:stroke-red-500 group-data-[state=on]:stroke-2"
              style={{ strokeWidth: 0.5 }}
            />
            <span className="absolute -top-3 text-nowrap px-2 py-1 rounded-sm bg-gray-700 text-sm text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-500 ">
              Eraser — 4 or V
            </span>
            <span className="absolute text-xs right-0 bottom-0 font-bold text-gray-300 group-data-[state=on]:text-red-500">
              4
            </span>
          </div>
        </Toolbar.ToggleItem>
      </Toolbar.ToggleGroup>
    </Toolbar.Root>
  );
}

export default AppToolbar;
