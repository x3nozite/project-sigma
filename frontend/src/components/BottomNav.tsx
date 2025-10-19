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

interface Props {
  onEraserClick: () => void;
  onShapeClick: () => void;
  onClearClick: () => void;
  onDrawClick: () => void;
  onColorSelect?: (color: string) => void;
  isActive: boolean;
}

function BottomNav({
  onClearClick,
  onShapeClick,
  onDrawClick,
  onColorSelect,
  onTextClick,
  onEraserClick,
  isActive,
}: Props) {
  return (
    <div className="grid grid-cols-8 px-2 py-2 border-gray-200 justify-center items-center bg-white rounded-lg shadow-lg">
      <button
        onClick={onShapeClick}
        className="add-shape group flex flex-col justify-center items-center  rounded-l-sm border-none w-10 h-10 p-1 text-gray-700 transition-colors duration-50 hover:bg-blue-50 hover:text-gray-900 focus:z-10 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white focus:outline-none disabled:pointer-events-auto disabled:opacity-50"
      >
        <HiOutlineCube className="text-xl" />
        <span className="absolute -top-3 text-nowrap px-2 py-1 rounded-sm bg-gray-700 text-sm text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-500 ">
          Add Task
        </span>
      </button>
      <button className="pan-canvas group flex flex-col justify-center items-center  rounded-sm border-none w-10 h-10 p-1 text-gray-700 transition-colors duration-50 hover:bg-blue-50 hover:text-gray-900 focus:z-10 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white focus:outline-none disabled:pointer-events-auto disabled:opacity-50">
        <HiOutlineHand className="-rotate-[45deg] text-xl" />
        <span className="absolute -top-3 text-nowrap px-2 py-1 rounded-sm bg-gray-700 text-sm text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-500 ">
          Pan Canvas
        </span>
      </button>
      <button className="cursor-canvas group flex flex-col justify-center items-center  rounded-sm border-none w-10 h-10 p-1 text-gray-700 transition-colors duration-50 hover:bg-blue-50 hover:text-gray-900 focus:z-10 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white focus:outline-none disabled:pointer-events-auto disabled:opacity-50">
        <HiOutlineCursorClick className="text-xl" />

        <span className="absolute -top-3 text-nowrap px-2 py-1 rounded-sm bg-gray-700 text-sm text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-500 ">
          Selection
        </span>
      </button>
      <div className="relative group">
        <button
          onClick={onDrawClick}
          className="draw-canvas flex flex-col justify-center items-center rounded-sm border-none w-10 h-10 p-1 duration-50 text-gray-700 transition-colors hover:bg-blue-50 hover:text-gray-900 focus:z-10 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white focus:outline-none disabled:pointer-events-auto disabled:opacity-50"
        >
          <HiOutlinePencil className="text-xl" />
          <span className="absolute -top-3 text-nowrap px-2 py-1 rounded-sm bg-gray-700 text-sm text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-500 ">
            Draw
          </span>
        </button>
        <div className="absolute top-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex gap-1 bg-white p-2 rounded-md shadow-lg">
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
        </div>
      </div>
      <button className="add-annotate group flex flex-col justify-center items-center  rounded-sm border-none w-10 h-10 p-1 text-gray-700 transition-colors duration-50 hover:bg-blue-50 hover:text-gray-900 focus:z-10 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white focus:outline-none disabled:pointer-events-auto disabled:opacity-50">
        <HiOutlineAnnotation className="text-xl" />
        <span className="absolute -top-3 text-nowrap px-2 py-1 rounded-sm bg-gray-700 text-sm text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-500 ">
          Annotate
        </span>
      </button>
      <button className="add-image group relative border-none inline-flex flex-col items-center justify-center w-10 h-10 p-1 duration-50 text-gray-700 transition-colors hover:bg-blue-50 hover:text-gray-900 focus:z-10 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white focus:outline-none disabled:pointer-events-auto disabled:opacity-50">
        <HiOutlinePhotograph className="text-xl" />
        <span className="absolute -top-3 text-nowrap px-2 py-1 rounded-sm bg-gray-700 text-sm text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-500 ">
          Add Image
        </span>
      </button>
      <button
        onClick={onEraserClick}
        className={`add-shape group flex flex-col justify-center items-center rounded-sm border-none w-10 h-10 p-1 transition-colors duration-50 hover:text-red-500 focus:z-10 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white focus:outline-none disabled:pointer-events-auto disabled:opacity-50 ${
          isActive ? "bg-red-100 text-red-500" : "text-gray-700 hover:bg-red-50"
        }`}
      >
        <BsEraser className="text-xl" style={{ strokeWidth: 0.5 }} />
        <span className="absolute -top-3 text-nowrap px-2 py-1 rounded-sm bg-gray-700 text-sm text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-500 ">
          Delete Task
        </span>
      </button>
      <button
        onClick={onClearClick}
        className="add-shape group flex flex-col justify-center items-center  rounded-r-sm border-none w-10 h-10 p-1 text-gray-700 transition-colors duration-50 hover:bg-red-50 hover:text-red-500 focus:z-10 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white focus:outline-none disabled:pointer-events-auto disabled:opacity-50"
      >
        <HiOutlineTrash className="text-xl" />
        <span className="absolute -top-3 text-nowrap px-2 py-1 rounded-sm bg-gray-700 text-sm text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-500 ">
          Clear Canvas
        </span>
      </button>
    </div>
  );
}

export default BottomNav;
