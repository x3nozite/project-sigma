interface MainProps {
  title: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>
}

export default function MainButton({ title, onClick }: MainProps) {
  return (
    <div className="inline-flex items-center text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 px-3 py-2.5 mb-2 rounded-lg text-center">
      <span>
        <svg
          className="w-fill h-fill text-white"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            fill-rule="evenodd"
            d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4h-4Z"
            clip-rule="evenodd"
          />
        </svg>
      </span>
      <button
        type="button"
        className="focus:outline-none whitespace-nowrap font-bold text-sm hidden md:inline"
        onClick={onClick}
      >
        {title}
      </button>
    </div>
  );
}
