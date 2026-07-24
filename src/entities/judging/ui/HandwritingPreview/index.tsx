"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/shared/utils/cn";
import { Stroke } from "../../model/handwriting";

type HandwritingPreviewProps = {
  strokes: Stroke[] | null | undefined;
  className?: string;
  emptyLabel?: string;
};

const LINE_WIDTH = 2;

const HandwritingPreview = ({
  strokes,
  className,
  emptyLabel = "코멘트 없음",
}: HandwritingPreviewProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const draw = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.lineCap = "round";
      ctx.lineWidth = LINE_WIDTH * dpr;

      (strokes ?? []).forEach(stroke => {
        if (stroke.points.length === 0) return;
        ctx.strokeStyle = stroke.color;
        ctx.beginPath();
        stroke.points.forEach((point, index) => {
          const x = point.x * canvas.width;
          const y = point.y * canvas.height;
          if (index === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();
      });
    };

    draw();

    const observer = new ResizeObserver(draw);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [strokes]);

  const hasStrokes = (strokes?.length ?? 0) > 0;

  return (
    <div className={cn("relative w-full h-full bg-white", className)}>
      <canvas ref={canvasRef} className="w-full h-full" />
      {!hasStrokes && (
        <span className="absolute inset-0 flex items-center justify-center text-caption2r text-gray-300 pointer-events-none">
          {emptyLabel}
        </span>
      )}
    </div>
  );
};

export default HandwritingPreview;
