"use client";

import clsx from "clsx";
import ImagePanel from "./imagePanel";
import { SessionManager } from "./sessionManger";
import ChatInput from "./chatInput";
import OprRecords from "./oprRecords";
import ModelSelector from "./modelSelector";
import { useSearchParams } from "next/navigation";
import Intro from "./intro";

export default function WorkBox({ className }: { className?: string }) {
  const searchParams = useSearchParams()
  const projectId = searchParams.get('project')

  if (!projectId) {
    return (
      <div className={clsx(className, "w-full h-full relative")}>
        <SessionManager />

        <Intro />
  
        <ModelSelector />
      </div>
    );
  }


  return (
    <div className={clsx(className, "w-full h-full relative")}>
      <ImagePanel />

      <SessionManager />

      <ChatInput />

      <ModelSelector />

      <OprRecords />
    </div>
  );
}
