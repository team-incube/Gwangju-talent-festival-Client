import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import HandwritingPreview from "../index";
import { Stroke } from "@/entities/judging/model/handwriting";

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubGlobal("ResizeObserver", ResizeObserverMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

const STROKE: Stroke = {
  color: "#121212",
  points: [
    { x: 0, y: 0 },
    { x: 0.5, y: 0.5 },
  ],
};

describe("HandwritingPreview", () => {
  it("코멘트가 없으면 빈 상태 문구를 보여준다", () => {
    render(<HandwritingPreview strokes={[]} />);

    expect(screen.getByText("코멘트 없음")).toBeInTheDocument();
  });

  it("strokes가 null이어도 빈 상태 문구를 보여준다", () => {
    render(<HandwritingPreview strokes={null} />);

    expect(screen.getByText("코멘트 없음")).toBeInTheDocument();
  });

  it("코멘트가 있으면 빈 상태 문구를 보여주지 않는다", () => {
    render(<HandwritingPreview strokes={[STROKE]} />);

    expect(screen.queryByText("코멘트 없음")).not.toBeInTheDocument();
  });

  it("emptyLabel을 전달하면 해당 문구로 대체한다", () => {
    render(<HandwritingPreview strokes={[]} emptyLabel="작성된 코멘트가 없습니다" />);

    expect(screen.getByText("작성된 코멘트가 없습니다")).toBeInTheDocument();
  });
});
