import type { TextType } from "../types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { registry, z } from "zod";

const schema = z.object({
  text: z.string(),
});

export type textFields = z.infer<typeof schema>;

interface Props {
  currText: TextType | null;
  onCloseEdit: () => void;
}

export default function EditTextForm({ currText, onCloseEdit }: Props) {
  //   const {
  //     register,
  //     handleSubmit,
  //     setError,
  //     formState: { errors, isSubmitting },
  //   } = useForm<textFields>({
  //     defaultValues:

  //     resolver: zodResolver(schema),
  //   });
  return (
    <>
      <div className="absolute h-full w-full bg-black opacity-50 backdrop z-99"></div>
      <div className="absolute bg-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-10 py-10 inset-0 flex flex-col justify-between w-150 h-fit max-h-200  items-start border-px rounded-lg shadow-2xl z-100">
        <div className="text-center mb-2 flex flex-row items-end justify-between h-fit w-full bg-red-100">
          <span className="text-lg p-2 h-full">Edit Text</span>
          <button
            onClick={onCloseEdit}
            className="hover:cursor-pointer p-2 h-full"
          >
            X
          </button>
        </div>
        <form action="" className="w-full h-full">
          <div>
            <input
              // {...register("text")}
              type="text"
              id="title"
              size={12}
              placeholder={currText?.text}
              className="text-sm max-w-lg h-full p-2 text-wrap break-normal"
            />
          </div>
        </form>
      </div>
    </>
  );
}
