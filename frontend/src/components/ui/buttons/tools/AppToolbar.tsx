import { Toolbar } from "radix-ui";
import {
  HiOutlineCube,
  HiOutlineHand,
  HiOutlinePencil,
  HiOutlineAnnotation,
  //HiOutlinePhotograph,
  HiOutlineBookOpen,
  HiOutlineCursorClick,
} from "react-icons/hi";
import { BsEraser } from "react-icons/bs";
import type { RectType, TodoType, ToolType } from "../../../types";

interface Props {
  onEraserClick: () => void;
  onShapeClick: () => void;
  onTodoClick: (parent?: RectType, currTodo?: TodoType) => void;
  onTextClick: () => void;
  onClearClick: () => void;
  onDrawClick: () => void;
  onSelectClick: () => void;
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
  onTextClick,
  onEraserClick,
  // isActive,
  tool,
  setTool,
}: Props) {
  return (
    <Toolbar.Root className="flex px-6 py-3 md:px-5 w-full mx-5 sm:px-5 sm:w-fit sm:py-2 rounded-lg bg-white border-2 border-zinc-300 shadow-sm  justify-center max-sm:gap-3 ">
      <Toolbar.ToggleGroup type="single" className="flex gap-2 sm:gap-0.5">
        <Toolbar.ToggleItem value="task">
          <div
            className="add-shape relative group flex flex-col justify-center items-center  rounded-l-sm border-none w-10 h-10 p-1 text-gray-700 transition-colors duration-50 hover:bg-blue-50 hover:text-gray-900 focus:z-10 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white focus:outline-none disabled:pointer-events-auto disabled:opacity-50 max-sm:w-8 max-sm:h-8 max-sm:p-[2px]"
            onClick={onShapeClick}
          >
            <HiOutlineCube className="text-2xl" />
            <span className="absolute pointer-events-none -top-3 text-nowrap px-2 py-1 rounded-sm bg-gray-700 text-sm text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-500 ">
              Add Task — Q
            </span>
            <span className="hidden xl:inline absolute text-xs right-0 bottom-0 font-bold text-gray-300 group-data-[state=on]:text-blue-500">
              Q
            </span>
          </div>
        </Toolbar.ToggleItem>
        <Toolbar.ToggleItem value="todo">
          <div
            className="add-shape relative group flex flex-col justify-center items-center  rounded-l-sm border-none w-10 h-10 p-1 text-gray-700 transition-colors duration-50 hover:bg-blue-50 hover:text-gray-900 focus:z-10 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white focus:outline-none disabled:pointer-events-auto disabled:opacity-50 max-sm:w-8 max-sm:h-8 max-sm:p-[2px]"
            onClick={() => onTodoClick()}
          >
            <HiOutlineBookOpen className="text-2xl md:text-xl" />
            <span className="absolute pointer-events-none -top-3 text-nowrap px-2 py-1 rounded-sm bg-gray-700 text-sm text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-500 ">
              Add To-do — W
            </span>
            <span className="hidden xl:inline absolute text-xs right-0 bottom-0 font-bold text-gray-300 group-data-[state=on]:text-blue-500">
              W
            </span>
          </div>
        </Toolbar.ToggleItem>
        <Toolbar.ToggleItem value="annotate">
          <div
            onClick={() => onTextClick()}
            className="add-annotate relative group flex flex-col justify-center items-center  rounded-sm border-none w-10 h-10 p-1 text-gray-700 transition-colors duration-50 hover:bg-blue-50 hover:text-gray-900 focus:z-10 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white focus:outline-none disabled:pointer-events-auto disabled:opacity-50 max-sm:w-8 max-sm:h-8 max-sm:p-[2px]"
          >
            <HiOutlineAnnotation className="text-2xl md:text-xl" />
            <span className="absolute pointer-events-none -top-3 text-nowrap px-2 py-1 rounded-sm bg-gray-700 text-sm text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-500 ">
              Add Text — E
            </span>
            <span className="hidden xl:inline absolute text-xs right-0 bottom-0 font-bold text-gray-300 group-data-[state=on]:text-blue-500">
              E
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
        className="flex gap-2 sm:gap-0.5"
      >
        <Toolbar.ToggleItem value="hand" className="group">
          <div className="pan-canvas relative flex flex-col justify-center items-center  rounded-sm border-none w-10 h-10 p-1 text-gray-700 transition-colors duration-50 hover:bg-blue-50 hover:text-gray-900 focus:z-10 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white focus:outline-none disabled:pointer-events-auto disabled:opacity-50  max-sm:w-8 max-sm:h-8 max-sm:p-[2px]">
            <HiOutlineHand className="-rotate-[45deg] text-2xl md:text-xl group-data-[state=on]:stroke-blue-500 sm:text-xl" />
            <span className="absolute pointer-events-none -top-3 text-nowrap px-2 py-1 rounded-sm bg-gray-700 text-sm text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-500 ">
              Hand — 1 or Z
            </span>
            <span className="hidden xl:inline absolute text-xs right-0 bottom-0 font-bold text-gray-300 group-data-[state=on]:text-blue-500">
              1
            </span>
          </div>
        </Toolbar.ToggleItem>
        <Toolbar.ToggleItem
          value="select"
          className="group"
          onClick={onSelectClick}
        >
          <div className="select-canvas relative flex flex-col justify-center items-center  rounded-sm border-none w-10 h-10 p-1 text-gray-700 transition-colors duration-50 hover:bg-blue-50 hover:text-gray-900 focus:z-10 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white focus:outline-none disabled:pointer-events-auto disabled:opacity-50  max-sm:w-8 max-sm:h-8 max-sm:p-[2px]">
            {/* <HiSelector className="-rotate-[45deg] text-xl  group-data-[state=on]:blue-500" /> */}
            <HiOutlineCursorClick className="text-2xl md:text-xl group-data-[state=on]:stroke-blue-500" />
            <span className="absolute pointer-events-none -top-3 text-nowrap px-2 py-1 rounded-sm bg-gray-700 text-sm text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-500 ">
              Select — 2 or X
            </span>
            <span className="hidden xl:inline absolute text-xs right-0 bottom-0 font-bold text-gray-300 group-data-[state=on]:text-blue-500">
              2
            </span>
          </div>
        </Toolbar.ToggleItem>
        <Toolbar.ToggleItem
          value="draw"
          className="group"
          onClick={onDrawClick}
        >
          <div className="draw-canvas relative flex flex-col justify-center items-center rounded-sm border-none w-10 h-10 p-1 duration-50 text-gray-700 transition-colors hover:bg-blue-50 hover:text-gray-900 focus:z-10 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2  focus:ring-offset-white focus:outline-none  disabled:pointer-events-auto disabled:opacity-50 max-sm:w-8 max-sm:h-8 max-sm:p-[2px]">
            <HiOutlinePencil className="text-2xl md:text-xl group-data-[state=on]:stroke-blue-500" />
            <span className="absolute pointer-events-none -top-3 text-nowrap px-2 py-1 rounded-sm bg-gray-700 text-sm text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-500 ">
              Draw — 3 or C
            </span>
            <span className="hidden xl:inline absolute text-xs right-0 bottom-0 font-bold text-gray-300 group-data-[state=on]:text-blue-500">
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
              "add-shape relative group flex flex-col justify-center items-center rounded-sm border-none w-10 h-10 p-1 transition-colors duration-50 hover:text-red-500 focus:z-10 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white focus:outline-none  disabled:pointer-events-auto disabled:opacity-50 max-sm:w-8 max-sm:h-8 max-sm:p-[2px]"
            }
          >
            <BsEraser
              className="text-2xl md:text-xl group-data-[state=on]:stroke-red-500 group-data-[state=on]:stroke-2"
              style={{ strokeWidth: 0.5 }}
            />
            <span className="absolute pointer-events-none -top-3 text-nowrap px-2 py-1 rounded-sm bg-gray-700 text-sm text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-500 ">
              Eraser — 4 or V
            </span>
            <span className="hidden xl:inline absolute text-xs right-0 bottom-0 font-bold text-gray-300 group-data-[state=on]:text-red-500">
              4
            </span>
          </div>
        </Toolbar.ToggleItem>
      </Toolbar.ToggleGroup>
    </Toolbar.Root>
  );
}

export default AppToolbar;
