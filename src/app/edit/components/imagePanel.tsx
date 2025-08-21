"use client";

import clsx from "clsx";
import { CSSProperties, useRef, useState } from "react";

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
    height: '80%',
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
      <img
        src="https://www.krea.ai/api/img?f=webp&i=https%3A%2F%2Fgen.krea.ai%2Fimages%2F515e4899-7c6a-4ef2-8aee-974f6f29bb6b.png&s=1024"
        className="absolute select-none"
        style={style}
        draggable="false"
      />
    </div>
  );
}