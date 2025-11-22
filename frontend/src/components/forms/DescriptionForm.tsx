import type { ShapeType } from "../types";

interface Props {
  onclick: () => void;
  shape: ShapeType | null;
}

const DescriptionForm = ({ onclick, shape }: Props) => {
  return (
    <div>
      <div className="absolute h-full w-full bg-black opacity-50 backdrop z-99"></div>
      <div className="absolute bg-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-10 py-10 inset-0 flex flex-col justify-between w-150 h-fit max-h-200  items-start border-px rounded-lg shadow-2xl z-100">
        <div
          className="absolute top-0 left-0 rounded-t-lg w-full h-5 "
        ></div>
        <form className="w-full h-full">
          <div className="mb-2 flex flex-row items-end justify-between h-15  w-full">
            <input
              type="text"
              id="title"
              size={11}
              // placeholder={shape?.title}
              className="text-3xl h-full p-2 font-bold rounded-lg"
            ></input>
            <button
              onClick={onclick}
              className="hover:cursor-pointer p-2 h-full"
            >
              X
            </button>
          </div>
          <div className="mb-8 flex flex-col gap-5 w-full items-start">
            <div className="inline-flex gap-2">
              <svg
                className="w-6 h-6 text-gray-800"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-width="2"
                  d="M5 7h14M5 12h14M5 17h10"
                />
              </svg>

              <label className="text-md font-semibold">Description</label>
            </div>
            <textarea
              // placeholder={shape?.description}
              className="border border-gray-300 bg-gray-50 rounded-lg p-2 shadow-xs ml-8 w-[calc(100%-2rem)] items-start h-25 resize-none"
            ></textarea>
          </div>
          <hr className="h-px w-full my-2 bg-gray-200 border-0" />
        </form>
      </div>
    </div>
  )
}

export default DescriptionForm
