"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { cn } from "@/shared/utils/cn";
import { CheckIcon } from "@/shared/asset/svg/CheckIcon";
import { LeftArrow } from "@/shared/asset/svg/LeftArrow";
import { RightArrow } from "@/shared/asset/svg/RightArrow";
import { Stroke, StrokePoint } from "@/entities/judging/model/handwriting";

type StylusTouch = Touch & { touchType?: "direct" | "stylus" };

type HandwritingCanvasProps = {
  teamId: number;
  value?: Stroke[];
  onChange: (strokes: Stroke[]) => void;
  onClear: () => void;
};

const PEN_COLORS = [
  { key: "black", hex: "#121212", swatchClass: "bg-black" },
  { key: "red", hex: "#E13A3A", swatchClass: "bg-red-500" },
  { key: "blue", hex: "#2563EB", swatchClass: "bg-blue-600" },
] as const;

const LINE_WIDTH = 2;
const MIN_POINT_DISTANCE = 0.003;

const HandwritingCanvas = ({ teamId, value, onChange, onClear }: HandwritingCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentStroke = useRef<Stroke | null>(null);
  const activePointerId = useRef<number | null>(null);
  const activePointerType = useRef<string | null>(null);
  const loadedTeamId = useRef<number | null>(null);
  const strokesRef = useRef<Stroke[]>([]);

  const [penColor, setPenColor] = useState<string>(PEN_COLORS[0].hex);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  // 지우기(Clear)도 한 번에 되돌릴 수 있도록, 되돌리기 스택은 "한 번의 동작으로 사라진 스트로크 묶음" 단위로 쌓는다
  const [redoStack, setRedoStack] = useState<Stroke[][]>([]);

  const drawStrokes = useCallback((list: Stroke[]) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = "round";
    ctx.lineWidth = LINE_WIDTH * (window.devicePixelRatio || 1);

    list.forEach(stroke => {
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
  }, []);

  useEffect(() => {
    strokesRef.current = strokes;
  }, [strokes]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      drawStrokes(strokesRef.current);
    };

    resize();

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [drawStrokes]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const prevent = (e: TouchEvent) => {
      const hasStylus = Array.from(e.touches).some(
        t => (t as StylusTouch).touchType === "stylus",
      );
      if (hasStylus) e.preventDefault();
    };
    canvas.addEventListener("touchstart", prevent, { passive: false });
    canvas.addEventListener("touchmove", prevent, { passive: false });
    return () => {
      canvas.removeEventListener("touchstart", prevent);
      canvas.removeEventListener("touchmove", prevent);
    };
  }, []);

  useEffect(() => {
    loadedTeamId.current = null;
    setStrokes([]);
    setRedoStack([]);
    drawStrokes([]);
  }, [teamId, drawStrokes]);

  useEffect(() => {
    if (loadedTeamId.current === teamId || value === undefined) return;
    // 서버 응답이 늦게 도착하는 사이 이미 손으로 쓰기 시작했다면, 로컬 획을 서버 값으로 덮어써 지우지 않는다
    if (strokesRef.current.length > 0) {
      loadedTeamId.current = teamId;
      return;
    }
    setStrokes(value);
    setRedoStack([]);
    drawStrokes(value);
    loadedTeamId.current = teamId;
  }, [teamId, value, drawStrokes]);

  const getPoint = (e: ReactPointerEvent<HTMLCanvasElement>): StrokePoint => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    };
  };

  const handlePointerDown = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (e.pointerType !== "pen") return;
    e.preventDefault();

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    if (activePointerId.current !== null) {
      // 손가락으로 쓰던 중 펜이 닿으면 손바닥으로 판단해 진행 중이던 터치 획을 버리고 펜에 우선권을 준다. 그 외 추가 포인터(손바닥/보조 손가락)는 무시해 선 섞임을 막는다
      const penTakesOver = e.pointerType === "pen" && activePointerType.current === "touch";
      if (!penTakesOver) return;
      if (canvas.hasPointerCapture(activePointerId.current))
        canvas.releasePointerCapture(activePointerId.current);
      currentStroke.current = null;
      drawStrokes(strokesRef.current);
    }

    activePointerId.current = e.pointerId;
    activePointerType.current = e.pointerType;
    canvas.setPointerCapture(e.pointerId);

    const point = getPoint(e);
    currentStroke.current = { color: penColor, points: [point] };

    ctx.lineCap = "round";
    ctx.lineWidth = LINE_WIDTH * (window.devicePixelRatio || 1);
    ctx.strokeStyle = penColor;
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
    const last = stroke.points[stroke.points.length - 1];
    const distance = Math.hypot(point.x - last.x, point.y - last.y);
    if (distance < MIN_POINT_DISTANCE) return;

    stroke.points.push(point);
    ctx.lineTo(point.x * canvas.width, point.y * canvas.height);
    ctx.stroke();
  };

  const commitCurrentStroke = () => {
    const stroke = currentStroke.current;
    currentStroke.current = null;
    if (!stroke || stroke.points.length === 0) return;

    if (stroke.points.length === 1) {
      stroke.points.push({ ...stroke.points[0] });
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (canvas && ctx) {
        ctx.lineTo(stroke.points[0].x * canvas.width, stroke.points[0].y * canvas.height);
        ctx.stroke();
      }
    }

    const next = [...strokes, stroke];
    setStrokes(next);
    setRedoStack([]);
    onChange(next);
  };

  const handlePointerEnd = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (e.pointerId !== activePointerId.current) return;
    const canvas = canvasRef.current;
    if (canvas?.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
    activePointerId.current = null;
    activePointerType.current = null;
    commitCurrentStroke();
  };

  const handleUndo = () => {
    if (strokes.length === 0) return;
    const removed = strokes[strokes.length - 1];
    const next = strokes.slice(0, -1);
    setStrokes(next);
    setRedoStack(prev => [...prev, [removed]]);
    drawStrokes(next);
    onChange(next);
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const restoredGroup = redoStack[redoStack.length - 1];
    const next = [...strokes, ...restoredGroup];
    setStrokes(next);
    setRedoStack(prev => prev.slice(0, -1));
    drawStrokes(next);
    onChange(next);
  };

  const handleClear = () => {
    currentStroke.current = null;
    if (strokes.length === 0) return;

    // 지우기 전 스트로크 전체를 하나의 묶음으로 보관해, "앞으로가기"로 한 번에 되돌릴 수 있게 한다
    setRedoStack(prev => [...prev, strokes]);
    setStrokes([]);
    drawStrokes([]);
    onClear();
  };

  return (
    <div className="w-full flex flex-col gap-16 bg-white border border-gray-100 rounded-xl p-22 select-none">
      <div className="flex items-center justify-between gap-10">
        <h2 className="text-body1b">심사 의견</h2>
        <button
          type="button"
          onClick={handleClear}
          className="text-body2b text-gray-600 px-24 py-12 rounded-lg border border-gray-200 hover:bg-gray-50 active:bg-gray-100 transition-colors"
        >
          지우기
        </button>
      </div>

      <div className="flex items-center justify-between gap-10 flex-wrap">
        <div className="flex items-center gap-10">
          <button
            type="button"
            onClick={handleUndo}
            disabled={strokes.length === 0}
            aria-label="뒤로가기"
            className="w-48 h-48 rounded-full border border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-200 hover:border-gray-400 active:bg-gray-300 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-gray-300 disabled:active:scale-100 transition"
          >
            <LeftArrow height={22} width={22} color="#121212" />
          </button>
          <button
            type="button"
            onClick={handleRedo}
            disabled={redoStack.length === 0}
            aria-label="앞으로가기"
            className="w-48 h-48 rounded-full border border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-200 hover:border-gray-400 active:bg-gray-300 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-gray-300 disabled:active:scale-100 transition"
          >
            <RightArrow height={22} width={22} color="#121212" />
          </button>
        </div>

        <div className="flex items-center gap-12">
          {PEN_COLORS.map(color => {
            const isSelected = penColor === color.hex;
            return (
              <button
                key={color.key}
                type="button"
                onClick={() => setPenColor(color.hex)}
                aria-label={`${color.key} 펜 선택`}
                aria-pressed={isSelected}
                className={cn(
                  "relative w-36 h-36 rounded-full flex items-center justify-center transition-transform",
                  color.swatchClass,
                  isSelected
                    ? "ring-2 ring-offset-2 ring-gray-500 scale-110"
                    : "opacity-50 hover:opacity-80",
                )}
              >
                {isSelected && <CheckIcon height={18} width={18} color="white" />}
              </button>
            );
          })}
        </div>
      </div>

      <canvas
        ref={canvasRef}
        width={640}
        height={320}
        className="w-full h-[400px] mobile:h-[390px] select-none border border-gray-200 rounded-lg bg-white bg-[repeating-linear-gradient(180deg,transparent_0px,transparent_124px,#e2e2e2_124px,#e2e2e2_125px)]"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        onLostPointerCapture={handlePointerEnd}
      />
    </div>
  );
};

export default HandwritingCanvas;
