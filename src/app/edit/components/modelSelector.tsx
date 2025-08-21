import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { PopoverContent } from "@radix-ui/react-popover";
import { ChevronDownIcon, CircleCheckIcon, PaletteIcon } from "lucide-react";
import { useState } from "react";

function ModelInfo({
  name,
  desc,
  active,
  onClick,
}: {
  name: string;
  desc: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      className="p-3 cursor-pointer hover:bg-gray-100 rounded-xl pr-[40px] relative active:opacity-80 transition-all"
      onClick={onClick}
    >
      <h6 className="mb-0.5 flex items-center gap-1 text-lg font-semibold capitalize dark:text-white/100">
        <PaletteIcon size={16} className="mr-1" />
        <span>{name}</span>
      </h6>
      <p className="text-gray-600 dark:text-primary-400 pr-1 text-xs font-medium">
        {desc}
      </p>
      {active && (
        <CircleCheckIcon
          className="absolute top-1/2 right-[8px] -translate-y-1/2"
          size={24}
        />
      )}
    </div>
  );
}

export default function ModelSelector() {
  const [modelList] = useState([
    {
      id: "flux",
      name: "Flux",
      desc:
        "More tools, more control. Define exact regions to change, or expand your image",
    },
    {
      id: "flux_kontext_dev",
      name: "Flux Kontext Dev",
      desc: "New frontier model designed for image editing",
    },
    {
      id: "flux_kontext_pro",
      name: "Flux Kontext Pro",
      desc:
        "Fast iterative editing with character consistency and local edits across scenes",
    },
  ]);

  const [activeModel, setActiveModel] = useState("flux_kontext_dev");

  const activeModelInfo = modelList.find(item => item.id === activeModel)

  return (
    <div className="absolute left-4 z-[11] bottom-[24px]">
      <Popover>
        <PopoverTrigger asChild>
          <div className="bg-gray-100 rounded-2xl px-4 py-2 flex flex-row gap-2 items-center cursor-pointer hover:bg-gray-300 transition-all group active:opacity-90 select-none">
            <span className="font-semibold truncate capitalize">
              {activeModelInfo?.name || '-'}
            </span>
            <ChevronDownIcon
              className="group-hover:rotate-180 transition-all"
              size={18}
            />
          </div>
        </PopoverTrigger>
        <PopoverContent asChild side="top" align="start" sideOffset={10}>
          <div className="bg-white shadow-2xl rounded-xl z-[11]">
            <div
              className="w-[300px] max-h-[80vh] p-2 overflow-y-auto overflow-x-hidden"
              style={{ scrollbarWidth: "none" }}
            >
              <div className="flex flex-col gap-1 min-h-0">
                {modelList.map((info) => {
                  return (
                    <ModelInfo
                      key={info.id}
                      name={info.name}
                      desc={info.desc}
                      active={info.id === activeModel}
                      onClick={() => {
                        setActiveModel(info.id);
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
