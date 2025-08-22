import { cn } from "@/lib/utils";
import { BotMessageSquareIcon, LoaderIcon, SparklesIcon } from "lucide-react";
import { useState } from "react";
import { useActiveAsset, useActiveSession, useEditPageStore } from "../store";
import { toast } from "sonner";
import { nanoid } from "nanoid";

export default function ChatInput() {
  const [userInput, setUserInput] = useState("");
  const [genTotal, setGenTotal] = useState(1);
  const generateImage = useEditPageStore((s) => s.generateImage);
  const activeAsset = useActiveAsset();
  const [generating, setGenerating] = useState(false);

  const setPreset = () => {
    setUserInput("hello, this is a preset prompt");
  };

  const activeSession = useActiveSession();

  if (!activeSession) {
    return null;
  }

  const goGenerate = async (id: string, imageUrl: string, prompt: string) => {
    const formData = new FormData();

    const imageRes = await fetch(imageUrl)
    const imageBlob = await imageRes.blob()
    const imageFile = new File([imageBlob], id, { type: imageBlob.type })

    console.log(' imageBlob.type',  imageBlob.type)

    formData.append("image", imageFile);
    formData.append("id", id);
    formData.append("prompt", prompt);

    const response = await fetch("/api/generate", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("处理失败");
    }

    // 将响应转换为 Blob URL
    const data = await response.json();
    if (!data.success) {
      throw new Error("处理失败");
    }

    return data.data.fileUrl;
  };

  const handleGenerate = async () => {
    if (!userInput.trim().length) {
      return null;
    }
    if (generating) {
      return;
    }

    const assetId = nanoid(10);
    setGenerating(true);

    try {
      const resultUrl = await goGenerate(assetId, activeAsset.pic, userInput);
      setUserInput("");

      generateImage(activeSession.id, userInput, genTotal, {
        parentPic: activeAsset.pic,
        prefix: activeAsset.assetId || activeAsset.oprationId,
        currentPic: resultUrl,
        assetId: assetId,
      });
    } catch (err) {
      toast(`生成失败: ${err}`);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="absolute left-1/2 bottom-[24px] -translate-x-1/2 z-[10] flex w-[60vw] max-w-[800px] gap-2 p-3 bg-gray-100 rounded-2xl">
      <div className="h-full flex-1">
        <div className="flex h-full gap-2">
          <textarea
            className="h-full w-full resize-none rounded-xl border-0 bg-black/5 text-base! transition-[background-color] duration-400 ease-out placeholder:text-black/40 hover:bg-black/10 focus:ring-0 sm:text-lg dark:bg-white/5 dark:placeholder:text-white/30 dark:hover:bg-white/5 p-2 border-none outline-0"
            rows={3}
            maxLength={2000}
            placeholder="Write what you want to change in your image and click generate, or pick a preset and choose from many options!"
            value={userInput}
            disabled={generating}
            onChange={(e) => {
              setUserInput(e.target.value);
            }}
          />
          <div className="flex h-full">
            <div className="group relative h-fit w-fit">
              <button
                className="bg-centergroup relative mr-auto flex aspect-square h-[88px] w-fit cursor-pointer flex-col items-center items-center justify-center rounded-lg rounded-xl bg-black/5 bg-black/5 bg-cover bg-cover bg-center text-black transition-transform duration-300 ease-[cubic-bezier(0,1.2,.68,1)] hover:scale-[1.05] hover:bg-black/10 active:scale-100 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                disabled={generating}
                onClick={setPreset}
              >
                <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-2xl">
                  <BotMessageSquareIcon size={22} />
                </div>
              </button>
              <div
                className="tooltip invisible absolute -top-10 left-1/2 z-20 w-max max-w-[250px] -translate-x-1/2 rounded-lg bg-black px-3 py-2 text-sm font-medium text-white opacity-0 backdrop-blur-2xl transition-all delay-500 duration-250 ease-out
										group-hover:visible group-hover:opacity-100! after:absolute after:top-full after:left-1/2 after:-translate-x-1/2
										after:border-x-[6px] after:border-t-[6px] after:border-x-transparent after:border-t-black after:content-['']"
              >
                Need inspiration? Try a preset
              </div>
            </div>
          </div>
          <div className="flex h-full gap-2"></div>
        </div>
      </div>
      <div className="mt-auto flex h-full flex-col items-end justify-end gap-2">
        <div className="flex h-6 w-full">
          {[1, 2].map((optionItem) => {
            return (
              <button
                key={optionItem}
                className={cn(
                  "h-full flex-1 cursor-pointer text-xs font-medium transition-[scale] duration-400 ease-[cubic-bezier(0,1.2,.68,1)] active:scale-95 bg-white text-black",
                  {
                    "rounded-l-full": optionItem === 1,
                    "rounded-r-full": optionItem === 2,
                    "bg-black text-white": optionItem === genTotal,
                  }
                )}
                onClick={() => {
                  setGenTotal(optionItem);
                }}
              >
                {optionItem}
              </button>
            );
          })}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            aria-label="Generate"
            className={cn(
              "group/generate cursor-pointer dark:disabled:bg-primary-700 relative flex h-[56px] w-34 flex-shrink-0 items-center justify-center gap-1.5 self-end rounded-xl bg-white text-sm font-medium text-black shadow-sm transition-[box-shadow,background-color,scale,opacity] duration-200 ease-out hover:scale-[1.025] hover:shadow-lg active:scale-95! active:shadow-sm! disabled:pointer-events-none disabled:opacity-50 lg:w-32 dark:bg-white dark:text-black dark:hover:bg-gray-200 dark:disabled:text-white",
              {
                "cursor-not-allowed": userInput.length === 0,
              }
            )}
            disabled={userInput.length === 0 || generating}
            onClick={handleGenerate}
          >
            {generating ? (
              <LoaderIcon className="animate-spin" size={20} />
            ) : (
              <SparklesIcon size={20} />
            )}
            <span className="hidden lg:inline">{generating ? 'Generating' : 'Generate'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
