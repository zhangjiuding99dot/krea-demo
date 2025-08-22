import { useSearchParams } from "next/navigation";
import {
  editPageHelpers,
  useActiveAsset,
  useEditPageStore,
  useSessionOprs,
} from "../store";
import { cn } from "@/lib/utils";

export default function OprRecords() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("project") || "";
  const sessionOprs = useSessionOprs(sessionId);
  const { oprationId, assetId } = useActiveAsset();
  const setCurrentAsset = useEditPageStore((s) => s.setCurrentAsset);

  if (!sessionOprs) {
    return null;
  }

  return (
    <div
      className="absolute right-4 z-[9] top-1/2 -translate-y-1/2 flex max-h-[65vh] overflow-y-auto flex-col justify-center bg-gray-100  rounded-2xl min-h-0"
      style={{ scrollbarWidth: "none" }}
    >
      <div className="min-h-0 flex flex-col gap-2 p-2">
        {sessionOprs.map((opr, idx) => {
          return (
            <div
              key={opr.oprationId}
              className="flex flex-row gap-2 items-start"
            >
              <button
                className={cn(
                  "cursor-pointer active:scale-95 hover:scale-105 transition-all rounded-md overflow-hidden border-2 border-solid border-transparent",
                  {
                    "border-sky-700":
                      (!assetId && idx === 0) || oprationId === opr.oprationId,
                  }
                )}
                onClick={() => {
                  setCurrentAsset({
                    oprationId: opr.oprationId,
                    pic: opr.parentPic,
                    assetId: undefined,
                  });
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className={cn("w-[48px] h-[48px] object-cover")}
                  src={opr.parentPic}
                  alt={opr.prompt}
                />
              </button>
              {opr.output.map((item) => {
                const pic = editPageHelpers.getOgUrl("Krea/Edit", item.prompt, item.assetId)
                return (
                  <button
                    key={item.assetId}
                    className={cn(
                      "cursor-pointer active:scale-95 hover:scale-105 transition-all rounded-md overflow-hidden  border-2 border-solid border-transparent",
                      {
                        "border-sky-700":
                          assetId === item.assetId,
                      }
                    )}
                    onClick={() => {
                      setCurrentAsset({
                        oprationId: undefined,
                        assetId: item.assetId,
                        pic: pic,
                      });
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      className={cn(
                        "w-[64px] h-auto min-h-[48px] object-cover"
                      )}
                      src={pic}
                      alt={item.prompt}
                    />
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
