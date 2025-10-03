interface Props {
  onEraserClick: () => void;
  onShapeClick: () => void;
  isActive: boolean;
}

function BottomNav({
  onShapeClick,
  onTextClick,
  onEraserClick,
  isActive,
}: Props) {
  return (
    <div className="grid grid-cols-3">
      <button
        onClick={onShapeClick}
        className="add-shape group inline-flex flex-col items-center justify-center rounded-l-sm border border-gray-200 p-5 text-gray-700 transition-colors hover:bg-blue-50 hover:text-gray-900 focus:z-10 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white focus:outline-none disabled:pointer-events-auto disabled:opacity-50"
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
      <button className="add-text group relative border inline-flex flex-col items-center justify-center border-gray-200 p-5 text-gray-700 transition-colors hover:bg-blue-50 hover:text-gray-900 focus:z-10 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white focus:outline-none disabled:pointer-events-auto disabled:opacity-50">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M5 3h13a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-4.59l-3.7 3.71c-.18.18-.43.29-.71.29a1 1 0 0 1-1-1v-3H5a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3m13 1H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h4v4l4-4h5a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2M5 7h13v1H5zm0 3h12v1H5zm0 3h8v1H5z"
          />
        </svg>
        <span className="absolute -top-3 text-nowrap px-2 py-1 rounded-sm bg-gray-700 text-sm text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-500 ">
          Add Text
        </span>
      </button>
      <div className="delete-dropup group inline-flex flex-col">
        <button
          className="delete-task group relative inline-flex flex-col items-center justify-center -ml-px rounded-r-sm border border-gray-200 p-5 text-gray-700 transition-colors hover:bg-red-100 hover:text-gray-900 focus:z-10 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-white focus:outline-none disabled:pointer-events-auto disabled:opacity-50"
          // isActive? .... : ....
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M18 19a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V7H4V4h4.5l1-1h4l1 1H19v3h-1zM6 7v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2V7zm12-1V5h-4l-1-1h-3L9 5H5v1zM8 9h1v10H8zm6 0h1v10h-1z"
            />
          </svg>
          <span className="absolute -top-3 text-nowrap px-2 py-1 rounded-sm bg-gray-700 text-sm text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-500 ">
            Delete Task
          </span>
        </button>
        <div className="absolute opacity-0 dropup-content grid grid-row-2 -top-20 max-w-lg rounded-md  outline-1 -outline-offset-1 outline-gray-200 group-hover:opacity-100">
          <button
            onClick={onEraserClick}
            className="block px-2.5 py-2.5 outline-red-100 text-sm text-gray-700 rounded-md hover:bg-red-100 ${tool}"
          >
            Delete Card
          </button>
          <button className="block px-2.5 py-2.5 rounded-md outline-red-100 text-sm text-white bg-red-500 hover:bg-red-600">
            Clear Canvas
          </button>
        </div>
      </div>
    </div>
  );
}

export default BottomNav;
