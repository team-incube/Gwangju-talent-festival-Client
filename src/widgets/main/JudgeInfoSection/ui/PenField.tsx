"use client";

import { useEffect, useRef } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

type Point = { x: number; y: number };
type Stroke = Point[];

const LINE_WIDTH = 2;
const PEN_COLOR = "#121212";
const MIN_POINT_DISTANCE = 0.003;

const PenField = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const strokesRef = useRef<Stroke[]>([]);
  const currentStroke = useRef<Stroke | null>(null);
  const activePointerId = useRef<number | null>(null);
  const activePointerType = useRef<string | null>(null);

  const draw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = "round";
    ctx.lineWidth = LINE_WIDTH * (window.devicePixelRatio || 1);
    ctx.strokeStyle = PEN_COLOR;

    strokesRef.current.forEach(stroke => {
      if (stroke.length === 0) return;
      ctx.beginPath();
      stroke.forEach((point, index) => {
        const x = point.x * canvas.width;
        const y = point.y * canvas.height;
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      draw();
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  // iOS는 passive 리스너로 preventDefault가 막히지 않아 필기 중 페이지가 스크롤되고 pointercancel로 획이 끊긴다. 네이티브 non-passive 리스너로 기본동작을 직접 막는다
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const prevent = (e: TouchEvent) => e.preventDefault();
    canvas.addEventListener("touchstart", prevent, { passive: false });
    canvas.addEventListener("touchmove", prevent, { passive: false });
    return () => {
      canvas.removeEventListener("touchstart", prevent);
      canvas.removeEventListener("touchmove", prevent);
    };
  }, []);

  const getPoint = (e: ReactPointerEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    };
  };

  const handlePointerDown = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    if (activePointerId.current !== null) {
      // 손가락으로 쓰던 중 펜이 닿으면 손바닥으로 판단해 진행 중이던 터치 획을 버리고 펜에 우선권을 준다
      const penTakesOver = e.pointerType === "pen" && activePointerType.current === "touch";
      if (!penTakesOver) return;
      if (canvas.hasPointerCapture(activePointerId.current))
        canvas.releasePointerCapture(activePointerId.current);
      currentStroke.current = null;
      draw();
    }

    activePointerId.current = e.pointerId;
    activePointerType.current = e.pointerType;
    canvas.setPointerCapture(e.pointerId);

    const point = getPoint(e);
    currentStroke.current = [point];

    ctx.lineCap = "round";
    ctx.lineWidth = LINE_WIDTH * (window.devicePixelRatio || 1);
    ctx.strokeStyle = PEN_COLOR;
    ctx.beginPath();
    ctx.moveTo(point.x * canvas.width, point.y * canvas.height);
  };

  const handlePointerMove = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (e.pointerId !== activePointerId.current) return;
    e.preventDefault();

    const stroke = currentStroke.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!stroke || !canvas || !ctx) return;

    const point = getPoint(e);
    const last = stroke[stroke.length - 1];
    if (Math.hypot(point.x - last.x, point.y - last.y) < MIN_POINT_DISTANCE) return;

    stroke.push(point);
    ctx.lineTo(point.x * canvas.width, point.y * canvas.height);
    ctx.stroke();
  };

  const handlePointerEnd = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (e.pointerId !== activePointerId.current) return;
    const canvas = canvasRef.current;
    if (canvas?.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
    activePointerId.current = null;
    activePointerType.current = null;

    const stroke = currentStroke.current;
    currentStroke.current = null;
    if (stroke && stroke.length > 0) strokesRef.current = [...strokesRef.current, stroke];
  };

  const handleClear = () => {
    currentStroke.current = null;
    strokesRef.current = [];
    draw();
  };

  return (
    <div className="relative h-[160px] w-full mobile:h-[132px]">
      <button
        type="button"
        onClick={handleClear}
        className="absolute right-12 top-12 z-10 rounded-md border border-gray-300 bg-white px-16 py-8 text-body3b text-gray-600"
      >
        지우기
      </button>
      <canvas
        ref={canvasRef}
        className="h-full w-full touch-none select-none bg-white"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        onLostPointerCapture={handlePointerEnd}
      />
    </div>
  );
};

export default PenField;
