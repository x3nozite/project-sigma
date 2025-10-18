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
    <div className="grid grid-cols-8 px-2 py-2 border-gray-200 justify-center items-center bg-white rounded-xl">
      <button
        onClick={onShapeClick}
        className="add-shape group flex flex-col justify-center items-center  rounded-l-sm border-none w-10 h-10 p-1 text-gray-700 transition-colors duration-50 hover:bg-blue-50 hover:text-gray-900 focus:z-10 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white focus:outline-none disabled:pointer-events-auto disabled:opacity-50"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M6 4h11a3 3 0 0 1 3 3v11a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3m0 1a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-8h-8V5zm13 2a2 2 0 0 0-2-2h-5v4h7zM8 18v-2H6v-1h2v-2h1v2h2v1H9v2z"
          />
        </svg>
        <span className="absolute -top-3 text-nowrap px-2 py-1 rounded-sm bg-gray-700 text-sm text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-500 ">
          Add Task
        </span>
      </button>
      <button className="pan-canvas group flex flex-col justify-center items-center  rounded-l-sm border-none w-10 h-10 p-1 text-gray-700 transition-colors duration-50 hover:bg-blue-50 hover:text-gray-900 focus:z-10 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white focus:outline-none disabled:pointer-events-auto disabled:opacity-50">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="w-4 h-4 text-gray-800 rotate-[-45deg]"
          viewBox="0 0 16 16"
        >
          <path d="M6.75 1a.75.75 0 0 1 .75.75V8a.5.5 0 0 0 1 0V5.467l.086-.004c.317-.012.637-.008.816.027.134.027.294.096.448.182.077.042.15.147.15.314V8a.5.5 0 1 0 1 0V6.435l.106-.01c.316-.024.584-.01.708.04.118.046.3.207.486.43.081.096.15.19.2.259V8.5a.5.5 0 0 0 1 0v-1h.342a1 1 0 0 1 .995 1.1l-.271 2.715a2.5 2.5 0 0 1-.317.991l-1.395 2.442a.5.5 0 0 1-.434.252H6.035a.5.5 0 0 1-.416-.223l-1.433-2.15a1.5 1.5 0 0 1-.243-.666l-.345-3.105a.5.5 0 0 1 .399-.546L5 8.11V9a.5.5 0 0 0 1 0V1.75A.75.75 0 0 1 6.75 1M8.5 4.466V1.75a1.75 1.75 0 1 0-3.5 0v5.34l-1.2.24a1.5 1.5 0 0 0-1.196 1.636l.345 3.106a2.5 2.5 0 0 0 .405 1.11l1.433 2.15A1.5 1.5 0 0 0 6.035 16h6.385a1.5 1.5 0 0 0 1.302-.756l1.395-2.441a3.5 3.5 0 0 0 .444-1.389l.271-2.715a2 2 0 0 0-1.99-2.199h-.581a5 5 0 0 0-.195-.248c-.191-.229-.51-.568-.88-.716-.364-.146-.846-.132-1.158-.108l-.132.012a1.26 1.26 0 0 0-.56-.642 2.6 2.6 0 0 0-.738-.288c-.31-.062-.739-.058-1.05-.046zm2.094 2.025" />
        </svg>
        <span className="absolute -top-3 text-nowrap px-2 py-1 rounded-sm bg-gray-700 text-sm text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-500 ">
          Pan Canvas
        </span>
      </button>
      <button className="cursor-canvas group flex flex-col justify-center items-center  rounded-l-sm border-none w-10 h-10 p-1 text-gray-700 transition-colors duration-50 hover:bg-blue-50 hover:text-gray-900 focus:z-10 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white focus:outline-none disabled:pointer-events-auto disabled:opacity-50">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="w-4 h-4 text-gray-800 rotate-[-90deg]"
          viewBox="0 0 16 16"
        >
          <path d="M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103zM2.25 8.184l3.897 1.67a.5.5 0 0 1 .262.263l1.67 3.897L12.743 3.52z" />
        </svg>

        <span className="absolute -top-3 text-nowrap px-2 py-1 rounded-sm bg-gray-700 text-sm text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-500 ">
          Selection
        </span>
      </button>
      <div className="relative group">
        <button
          onClick={onDrawClick}
          className="draw-canvas flex flex-col justify-center items-center rounded-l-sm border-none w-10 h-10 p-1 duration-50 text-gray-700 transition-colors hover:bg-blue-50 hover:text-gray-900 focus:z-10 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white focus:outline-none disabled:pointer-events-auto disabled:opacity-50"
        >
          <svg
            className="w-6 h-6 text-gray-800 rotate-[90deg]"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1"
              d="M10.779 17.779 4.36 19.918 6.5 13.5m4.279 4.279 8.364-8.643a3.027 3.027 0 0 0-2.14-5.165 3.03 3.03 0 0 0-2.14.886L6.5 13.5m4.279 4.279L6.499 13.5m2.14 2.14 6.213-6.504M12.75 7.04 17 11.28"
            />
          </svg>
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
            "#ff2d55",
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
      <button className="add-annotate group flex flex-col justify-center items-center  rounded-l-sm border-none w-10 h-10 p-1 text-gray-700 transition-colors duration-50 hover:bg-blue-50 hover:text-gray-900 focus:z-10 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white focus:outline-none disabled:pointer-events-auto disabled:opacity-50">
        <svg
          className="w-6 h-6 text-gray-800"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1"
            d="M7.556 8.5h8m-8 3.5H12m7.111-7H4.89a.896.896 0 0 0-.629.256.868.868 0 0 0-.26.619v9.25c0 .232.094.455.26.619A.896.896 0 0 0 4.89 16H9l3 4 3-4h4.111a.896.896 0 0 0 .629-.256.868.868 0 0 0 .26-.619v-9.25a.868.868 0 0 0-.26-.619.896.896 0 0 0-.63-.256Z"
          />
        </svg>

        <span className="absolute -top-3 text-nowrap px-2 py-1 rounded-sm bg-gray-700 text-sm text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-500 ">
          Annotate
        </span>
      </button>
      <button className="add-image group relative border-none inline-flex flex-col items-center justify-center w-10 h-10 p-1 duration-50 text-gray-700 transition-colors hover:bg-blue-50 hover:text-gray-900 focus:z-10 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white focus:outline-none disabled:pointer-events-auto disabled:opacity-50">
        <svg
          className="w-6 h-6 text-gray-800"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1"
            d="m3 16 5-7 6 6.5m6.5 2.5L16 13l-4.286 6M14 10h.01M4 19h16a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Z"
          />
        </svg>

        <span className="absolute -top-3 text-nowrap px-2 py-1 rounded-sm bg-gray-700 text-sm text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-500 ">
          Add Image
        </span>
      </button>
      <button
        onClick={onEraserClick}
        className={`add-shape group flex flex-col justify-center items-center rounded-l-sm border-none w-10 h-10 p-1 transition-colors duration-50 hover:text-gray-900 focus:z-10 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white focus:outline-none disabled:pointer-events-auto disabled:opacity-50 ${
                    isActive ? "bg-red-100 text-red-500" : "text-gray-700 hover:bg-red-50"}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="currentColor"
          className=""
          viewBox="0 0 16 16"
        >
          <path d="M8.086 2.207a2 2 0 0 1 2.828 0l3.879 3.879a2 2 0 0 1 0 2.828l-5.5 5.5A2 2 0 0 1 7.879 15H5.12a2 2 0 0 1-1.414-.586l-2.5-2.5a2 2 0 0 1 0-2.828zm2.121.707a1 1 0 0 0-1.414 0L4.16 7.547l5.293 5.293 4.633-4.633a1 1 0 0 0 0-1.414zM8.746 13.547 3.453 8.254 1.914 9.793a1 1 0 0 0 0 1.414l2.5 2.5a1 1 0 0 0 .707.293H7.88a1 1 0 0 0 .707-.293z" />
        </svg>
        <span className="absolute -top-3 text-nowrap px-2 py-1 rounded-sm bg-gray-700 text-sm text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-500 ">
          Delete Task
        </span>
      </button>
      <button
        onClick={onClearClick}
        className="add-shape group flex flex-col justify-center items-center  rounded-l-sm border-none w-10 h-10 p-1 text-gray-700 transition-colors duration-50 hover:bg-red-50 hover:text-gray-900 focus:z-10 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white focus:outline-none disabled:pointer-events-auto disabled:opacity-50"
      >
        <svg
          className="w-6 h-6 text-gray-800"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1"
            d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"
          />
        </svg>

        <span className="absolute -top-3 text-nowrap px-2 py-1 rounded-sm bg-gray-700 text-sm text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-500 ">
          Clear Canvas
        </span>
      </button>
    </div>
  );
}

export default BottomNav;
