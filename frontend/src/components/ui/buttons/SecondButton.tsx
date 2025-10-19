interface SecondProps {
  title: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  variant?: "normal" | "invert";
}

export default function SecondButton({
  title,
  onClick,
  variant = "normal",
}: SecondProps) {
  const baseStyle =
    "focus:outline-none whitespace-nowrap w-auto font-bold rounded-lg text-sm px-5 py-2.5 mb-2 transition hover:cursor-pointer";

  const variantStyle =
    variant === "invert"
      ? "text-purple-100 bg-purple-700 hover:bg-purple-800 focus:ring-purple-300 hover:cursor-pointer"
      : "text-purple-700 bg-purple-100 hover:bg-purple-200 focus:ring-purple-900 hover:cursor-pointer";

  return (
    <button
      type="button"
      className={`${baseStyle} ${variantStyle}`}
      onClick={onClick}
    >
      {title}
    </button>
  );
}
