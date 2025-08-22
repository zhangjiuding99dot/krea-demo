"use client";

import { CSSProperties, useRef, useState } from "react";
import { useActiveAsset } from "../store";
import { cn } from "@/lib/utils";

export default function ImagePanel() {
  const dragArgs = useRef({
    sx: 0,
    sy: 0,
    dragging: false,
  });
  const [panelArgs, setPanelArgs] = useState({
    offsetX: 0,
    offsetY: 0,
    ratio: 1,
  });

  const style: CSSProperties = {
    width: "auto",
    height: '65%',
    objectFit: "contain",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };

  const dragStart = (evt: React.MouseEvent) => {
    dragArgs.current.dragging = true;
    dragArgs.current.sx = evt.clientX;
    dragArgs.current.sy = evt.clientY;
  };

  const dragging = (evt: React.MouseEvent) => {
    if (!dragArgs.current.dragging) {
      return;
    }

    const deltaX = evt.clientX - dragArgs.current.sx;
    const deltaY = evt.clientY - dragArgs.current.sy;

    setPanelArgs((args) => {
      return {
        ...args,
        offsetX: args.offsetX + deltaX,
        offsetY: args.offsetY + deltaY,
      };
    });

    dragArgs.current.sx = evt.clientX;
    dragArgs.current.sy = evt.clientY;
  };

  const dragEnd = () => {
    dragArgs.current.dragging = false;
    dragArgs.current.sx = 0;
    dragArgs.current.sy = 0;
  };

  const makeScale = (evt: React.WheelEvent) => {
    let step = 0.04
    if (evt.deltaY > 0) {
      step = -step
    }
    setPanelArgs((args) => {
      return {
        ...args,
        ratio: args.ratio + step
      };
    });
  }

  const activeAsset = useActiveAsset()

  return (
    <div
      className="w-full h-full relative cursor-grab z-[1]"
      onMouseDown={dragStart}
      onMouseMove={dragging}
      onMouseUp={dragEnd}
      onWheel={makeScale}
      style={{
        transform: `translate(${panelArgs.offsetX}px, ${panelArgs.offsetY}px) scale(${panelArgs.ratio})`,
      }}
    >
      {
        activeAsset.pic && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={activeAsset.pic}
            src={activeAsset.pic}
            className={cn('absolute select-none')}
            style={style}
            draggable="false"
            alt={'edit image'}
          />
        )
      }
    </div>
  );
}