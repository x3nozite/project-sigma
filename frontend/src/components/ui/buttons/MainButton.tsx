import { HiUser } from "react-icons/hi";

interface MainProps {
  title: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export default function MainButton({ title, onClick }: MainProps) {
  return (
    <div className="inline-flex gap-2 items-center text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 px-3 py-2.5 mb-2 rounded-lg text-center hover:cursor-pointer">
      <span>
        <HiUser />
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
