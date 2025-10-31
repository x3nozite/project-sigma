import { Toolbar } from "radix-ui";
import {
  HiOutlineCube,
  HiOutlineHand,
  HiOutlineCursorClick,
  HiOutlinePencil,
  HiOutlineAnnotation,
  HiOutlinePhotograph,
  HiOutlineTrash,
} from "react-icons/hi";
import { BsEraser } from "react-icons/bs";
import type { ToolType } from "../../../types";

interface Props {
  onEraserClick: () => void;
  onShapeClick: () => void;
  onClearClick: () => void;
  onDrawClick: () => void;
  onColorSelect?: (color: string) => void;
  isActive: boolean;
  tool: ToolType;
  setTool: React.Dispatch<React.SetStateAction<ToolType>>;
}

function AppToolbar({
  onClearClick,
  onShapeClick,
  onDrawClick,
  onColorSelect,
  onTextClick,
  onEraserClick,
  isActive,
  tool,
  setTool,
}: Props) {
  return (
    <Toolbar.Root className="flex w-fit max-w-xl rounded-lg bg-white shadow-lg p-2">
      <Toolbar.ToggleGroup type="single">
        <Toolbar.ToggleItem value="task">
          <div className="add-shape group flex flex-col justify-center items-center  rounded-l-sm border-none w-10 h-10 p-1 text-gray-700 transition-colors duration-50 hover:bg-blue-50 hover:text-gray-900 focus:z-10 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white focus:outline-none disabled:pointer-events-auto disabled:opacity-50" onClick={onShapeClick}>
            <HiOutlineCube className="text-xl" />
            <span className="absolute -top-3 text-nowrap px-2 py-1 rounded-sm bg-gray-700 text-sm text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-500 ">
              Add Task
            </span>
          </div>
        </Toolbar.ToggleItem>
        <Toolbar.ToggleItem value="annotate">
          <div className="add-annotate group flex flex-col justify-center items-center  rounded-sm border-none w-10 h-10 p-1 text-gray-700 transition-colors duration-50 hover:bg-blue-50 hover:text-gray-900 focus:z-10 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white focus:outline-none disabled:pointer-events-auto disabled:opacity-50">
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
        onValueChange={(value) => {
          if (value) setTool(value as ToolType);
        }}
      >
        <Toolbar.ToggleItem value="pan">
          <div className="pan-canvas group flex flex-col justify-center items-center  rounded-sm border-none w-10 h-10 p-1 text-gray-700 transition-colors duration-50 hover:bg-blue-50 hover:text-gray-900 focus:z-10 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white focus:outline-none disabled:pointer-events-auto disabled:opacity-50">
            <HiOutlineHand className="-rotate-[45deg] text-xl" />
            <span className="absolute -top-3 text-nowrap px-2 py-1 rounded-sm bg-gray-700 text-sm text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-500 ">
              Pan Canvas
            </span>
          </div>
        </Toolbar.ToggleItem>
        <Toolbar.ToggleItem value="draw" className="relative group" onClick={onDrawClick}>
          <div className="draw-canvas flex flex-col justify-center items-center rounded-sm border-none w-10 h-10 p-1 duration-50 text-gray-700 transition-colors hover:bg-blue-50 hover:text-gray-900 focus:z-10 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2  focus:ring-offset-white focus:outline-none [data-state=on]:bg-violet-200 [data-state=on]:text-purple-700 disabled:pointer-events-auto disabled:opacity-50">
            <HiOutlinePencil className="text-xl" />
            <span className="absolute -top-3 text-nowrap px-2 py-1 rounded-sm bg-gray-700 text-sm text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-500 ">
              Draw
            </span>
          </div>
          {/* <div className="absolute top-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex gap-1 bg-white p-2 rounded-md shadow-lg">
            {[
              "#000000",
              "#ff3b30",
              "#ff9500",
              "#ffcc00",
              "#34c759",
              "#0a84ff",
              "#5856d6",
            ].map((c) => (
              <button
                key={c}
                onClick={() => onColorSelect?.(c)}
                aria-label={`Select ${c}`}
                className="w-6 h-6 rounded-full border-2 border-gray-200 hover:border-gray-500 focus:border-gray-500"
                style={{ background: c }}
              />
            ))}
          </div> */}
        </Toolbar.ToggleItem>
        <Toolbar.ToggleItem value="eraser" onClick={onEraserClick}>
          <div
            className={
              "add-shape group flex flex-col justify-center items-center rounded-sm border-none w-10 h-10 p-1 transition-colors duration-50 hover:text-red-500 focus:z-10 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white focus:outline-none [&[data-state='on']]:bg-blue-500 [data-state=on]:text-purple-700 disabled:pointer-events-auto disabled:opacity-50"
            }
          >
            <BsEraser className="text-xl" style={{ strokeWidth: 0.5 }} />
            <span className="absolute -top-3 text-nowrap px-2 py-1 rounded-sm bg-gray-700 text-sm text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-500 ">
              Delete Task
            </span>
          </div>
        </Toolbar.ToggleItem>
      </Toolbar.ToggleGroup>
    </Toolbar.Root>
  );
}

export default AppToolbar;
