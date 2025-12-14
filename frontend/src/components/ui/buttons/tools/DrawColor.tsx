import { DropdownMenu } from "radix-ui";
import { useState } from "react";

function DrawColor() {
  const [penCol, setPenCol] = useState<string>("#ffffff");
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Content className="h-[40dvh]">
        <DropdownMenu.RadioGroup
          value={penCol}
          onValueChange={setPenCol}
          className="p-5"
        >
          <div className="flex flex-col gap-2">
            <DropdownMenu.RadioItem value="#ffffff" className="group">
              <div className="p-4 relative bg-white border-2 border-slate-200 rounded-lg group-data-[state=checked]:ring-2 group-data-[state=checked]:ring-slate-400"></div>
            </DropdownMenu.RadioItem>
            <DropdownMenu.RadioItem value="#fff7ed" className="group">
              <div className="p-4 bg-orange-50 border-orange-200 border-2 rounded-lg group-data-[state=checked]:ring-2 group-data-[state=checked]:ring-orange-400"></div>
              <DropdownMenu.ItemIndicator></DropdownMenu.ItemIndicator>
            </DropdownMenu.RadioItem>
            <DropdownMenu.RadioItem value="#f5f3ff" className="group">
              <div className="p-4 bg-violet-50 border-2 border-indigo-200 rounded-lg group-data-[state=checked]:ring-2 group-data-[state=checked]:ring-violet-400"></div>
              <DropdownMenu.ItemIndicator></DropdownMenu.ItemIndicator>
            </DropdownMenu.RadioItem>
            <DropdownMenu.RadioItem value="#f0fdfa" className="group">
              <div className="p-4 bg-teal-50 border-2 border-cyan-200 rounded-lg group-data-[state=checked]:ring-2 group-data-[state=checked]:ring-teal-400"></div>
              <DropdownMenu.ItemIndicator></DropdownMenu.ItemIndicator>
            </DropdownMenu.RadioItem>
          </div>
        </DropdownMenu.RadioGroup>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
export default DrawColor;

<DropdownMenu.Root>
  <DropdownMenu.Trigger asChild>
    <div className="draw-canvas relative flex flex-col justify-center items-center rounded-sm border-none w-10 h-10 p-1 duration-50 text-gray-700 transition-colors hover:bg-blue-50 hover:text-gray-900 focus:z-10 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2  focus:ring-offset-white focus:outline-none  disabled:pointer-events-auto disabled:opacity-50 max-sm:w-8 max-sm:h-8 max-sm:p-[2px]">
      <HiOutlinePencil className="text-2xl md:text-xl group-data-[state=on]:stroke-blue-500" />
      <span className="absolute pointer-events-none -top-3 text-nowrap px-2 py-1 rounded-sm bg-gray-700 text-sm text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-500 ">
        Draw — 3 or C
      </span>
      <span className="hidden xl:inline absolute text-xs right-0 bottom-0 font-bold text-gray-300 group-data-[state=on]:text-blue-500">
        3
      </span>
    </div>
  </DropdownMenu.Trigger>
  <DropdownMenu.Portal>
    <DropdownMenu.Content
      sideOffset={20}
      className="p-5 max-h-[30dvh] bg-white border-2 rounded-lg"
    >
      <DropdownMenu.RadioGroup value={penCol} onValueChange={setPenCol}>
        <div className="flex flex-col gap-2">
          <DropdownMenu.RadioItem value="#ffffff" className="group">
            <div className="p-4 relative bg-white border-2 border-slate-200 rounded-lg group-data-[state=checked]:ring-2 group-data-[state=checked]:ring-slate-400"></div>
          </DropdownMenu.RadioItem>
          <DropdownMenu.RadioItem value="#fff7ed" className="group">
            <div className="p-4 bg-orange-50 border-orange-200 border-2 rounded-lg group-data-[state=checked]:ring-2 group-data-[state=checked]:ring-orange-400"></div>
            <DropdownMenu.ItemIndicator></DropdownMenu.ItemIndicator>
          </DropdownMenu.RadioItem>
          <DropdownMenu.RadioItem value="#f5f3ff" className="group">
            <div className="p-4 bg-violet-50 border-2 border-indigo-200 rounded-lg group-data-[state=checked]:ring-2 group-data-[state=checked]:ring-violet-400"></div>
            <DropdownMenu.ItemIndicator></DropdownMenu.ItemIndicator>
          </DropdownMenu.RadioItem>
          <DropdownMenu.RadioItem value="#f0fdfa" className="group">
            <div className="p-4 bg-teal-50 border-2 border-cyan-200 rounded-lg group-data-[state=checked]:ring-2 group-data-[state=checked]:ring-teal-400"></div>
            <DropdownMenu.ItemIndicator></DropdownMenu.ItemIndicator>
          </DropdownMenu.RadioItem>
        </div>
      </DropdownMenu.RadioGroup>
    </DropdownMenu.Content>
  </DropdownMenu.Portal>
</DropdownMenu.Root>;
