"use client";

import EditIcon from "@/components/Icon/EditIcon";
import HomeIcon from "@/components/Icon/HomeIcon";
import Logo from "@/components/Logo/Logo";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";

export default function Header() {
  return (
    <div className="flex justify-between items-center gap-1 absolute t-0 r-0 w-full mt-2 px-2 z-[5]">
      <Logo width={22} height={22} />
      <nav className="inline-flex list-none flex-row gap-1 rounded-2xl bg-gray-100 px-2 py-1 text-[0px]">
        <Tooltip>
          <TooltipTrigger>
            <li className="bg-transparent transition-all hover:bg-gray-200 active:opacity-60 px-4 py-2.5 rounded-2xl cursor-pointer">
              <Link className="inline-block" href="/">
                <HomeIcon />
              </Link>
            </li>
            <TooltipContent>
              <span>Home</span>
            </TooltipContent>
          </TooltipTrigger>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger>
            <li
              className="bg-white transition-all hover:opacity-80 shadow-sm px-4 py-2.5 rounded-2xl cursor-pointer"
              data-tooltip-id="nav-edit"
              data-tooltip-content="Edit"
              data-tooltip-place="bottom"
            >
              <EditIcon />
            </li>
          </TooltipTrigger>
          <TooltipContent>
            <span>Edit</span>
          </TooltipContent>
        </Tooltip>
      </nav>
      <div>
        <div className="w-[32px] h-[32px] bg-blue-200 rounded-full"></div>
      </div>
    </div>
  );
}
