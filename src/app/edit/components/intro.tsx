
'use client'

import { CirclePlusIcon } from "lucide-react";
import { useRef } from 'react'
import { toast } from 'sonner'
import { editPageHelpers, useEditPageStore } from "../store";
import { nanoid } from 'nanoid'
import { useRouter } from "next/navigation";

export default function Intro() {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const sessionList = useEditPageStore((s) => s.sessionList)
  const addSession = useEditPageStore((s) => s.addSession)

  const handleUpload = () => {
    const file = inputRef.current?.files?.[0]

    if (!file) {
      toast('Please select a image file')
      return
    }

    const id = nanoid(10)

    addSession({
      id,
      title: `Web Application Image Edit - ${sessionList.length + 1}`,
      createdAt: Date.now(),
      thumb: editPageHelpers.getOgUrl('Welcome', 'Kare', id),
    })

    router.replace(`/edit?project=${id}`)
  }

  return (
    <div className="w-full h-full flex justify-center items-center">
      <label htmlFor="upload-image" className="rounded-3xl bg-gray-100 w-[420px] h-[500px] flex flex-col items-center justify-center p-4 gap-2" onClick={() => {
        inputRef.current?.click()
      }}>
        <h3 className="text-4xl font-bold">Edit</h3>
        <span className="mt-4 max-w-[340px] text-center leading-5 font-medium text-pretty text-black/40 dark:text-white/40 svelte-1h0p8mr">Rearrange objects in your scene, blend objects from multiple images, place characters, or
			expand edges.</span>
        <button className="mt-8 bg-blue-600 rounded-2xl flex gap-2 items-center py-4 px-6 text-white hover:bg-blue-500 transition-all cursor-pointer active:scale-95 outline-none border-none">
          <CirclePlusIcon size={18} />
          <span>Upload Image</span>
        </button>
      </label>
      <input id="upload-image" className="hidden" type="file" accept="image/*" ref={inputRef} onChange={handleUpload} />
    </div>
  )
}