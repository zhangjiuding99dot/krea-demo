import clsx from "clsx";
import { PlusIcon, TrashIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { PropsWithChildren, useState } from "react";

function SlideButton(
  props: PropsWithChildren & { className?: string; slide?: React.ReactNode, onClick?: () => void }
) {
  return (
    <button
      className={clsx(
        "cursor-pointer relative group hover:scale-105 active:scale-95 select-none transition-all",
        props.className
      )}
      onClick={props.onClick}
    >
      <div className="relative z-[2] bg-white shadow-md rounded-md transition-all hover:shadow-xl">
        {props.children}
      </div>
      <div className="h-[54px] hidden group-hover:flex group-hover:animate-popup-right flex-col justify-center items-start absolute z-[1] left-[44px] top-1/2 -translate-y-1/2 pl-[16px] pr-3 py-2 max-w-[180px] overflow-hidden bg-gray-100 rounded-md group/slide">
        {props.slide}
      </div>
    </button>
  );
}

export function SessionManager() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("project");
  const router = useRouter()

  const [sessionList] = useState([
    {
      id: "0198cbe0-b56b-7555-8cc5-4b064ec27b81",
      title: "Web Application User Upload",
      createAt: "Today",
      thumb: 'https://www.krea.ai/api/img?f=webp&i=https%3A%2F%2Fgen.krea.ai%2Fimages%2F515e4899-7c6a-4ef2-8aee-974f6f29bb6b.png&s=1024',
    },
  ]);

  return (
    <div className="bg-gray-100 rounded-2xl p-2 flex flex-col items-center gap-3 absolute z-[5] left-2 top-1/2 -translate-y-1/2">
      <SlideButton
        slide={
          <p className="font-medium text-sm whitespace-nowrap max-w-full overflow-hidden text-ellipsis">
            New Session
          </p>
        }
        onClick={() => {
          router.replace('/edit')
        }}
      >
        <div className="p-4 inline-flex justify-center items-center">
          <PlusIcon size={16} />
        </div>
      </SlideButton>
      <span className="w-[20px] h-[2px] bg-gray-300"></span>
      <div className="min-h-[240px] max-h-[400px] overflow-visible">
        {sessionList.map((item) => {
          return (
            <SlideButton
              key={item.id}
              slide={
                <>
                  <p className="font-medium text-sm whitespace-nowrap max-w-full overflow-hidden text-ellipsis">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-500 whitespace-nowrap max-w-full overflow-hidden text-ellipsis">
                    {item.createAt}
                  </p>
                  <button className="hidden absolute bottom-1.5 right-1.5 size-[14px] cursor-pointer hover:opacity-80 transition-all hover:bg-red-500 rounded-[3px] p-[1px] group-hover/slide:inline-flex hover:text-[#fff] active:opacity-50">
                    <TrashIcon size={12} />
                  </button>
                </>
              }
              onClick={() => {
                router.replace(`/edit?project=${item.id}`)
              }}
            >
              <img
                className={clsx(
                  "w-[48px] h-[48px] rounded-md object-cover",
                  {
                    "border-2 border-solid border-sky-700": projectId === item.id,
                  }
                )}
                src={item.thumb}
              />
            </SlideButton>
          );
        })}
      </div>
    </div>
  );
}
