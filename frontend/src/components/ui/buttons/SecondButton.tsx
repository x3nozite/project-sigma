interface SecondProps {
  title: string;
}

export default function SecondButton({ title }: SecondProps) {
  return (
    <button
      type="button"
      className="focus:outline-none whitespace-nowrap w-auto text-purple-700 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 bg-purple-100 hover:bg-purple-200 focus:ring-purple-900"
    >
      {title}
    </button>
  );
}
