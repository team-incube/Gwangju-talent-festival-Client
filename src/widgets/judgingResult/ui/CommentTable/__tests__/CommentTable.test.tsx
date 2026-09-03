import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CommentTable from "../index";
import { JudgeHeader, CommentRow, dirtyCommentKey } from "@/entities/judging/model/monitoring";

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

class IntersectionObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubGlobal("ResizeObserver", ResizeObserverMock);
  vi.stubGlobal("IntersectionObserver", IntersectionObserverMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

const JUDGES: JudgeHeader[] = [{ judgeId: 1, label: "심사위원 A" }];

const ROWS: CommentRow[] = [
  {
    teamId: 1,
    performOrder: 1,
    teamName: "댄스팀",
    comments: [
      {
        judgeId: 1,
        strokes: [{ color: "#121212", points: [{ x: 0, y: 0 }] }],
      },
    ],
  },
];

describe("CommentTable - 렌더링", () => {
  it("심사위원 헤더와 팀명을 표시한다", () => {
    render(<CommentTable judges={JUDGES} rows={ROWS} />);

    expect(screen.getByText("심사위원 A")).toBeInTheDocument();
    expect(screen.getByText("댄스팀")).toBeInTheDocument();
  });

  it("행이 없으면 안내 문구를 표시한다", () => {
    render(<CommentTable judges={JUDGES} rows={[]} />);

    expect(screen.getByText("집계된 코멘트가 없습니다.")).toBeInTheDocument();
  });
});

describe("CommentTable - 로딩 상태", () => {
  it("isLoading이면 스켈레톤을 보여주고 안내 문구나 테이블은 보여주지 않는다", () => {
    render(<CommentTable judges={[]} rows={[]} isLoading />);

    expect(screen.queryByText("집계된 코멘트가 없습니다.")).not.toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });
});

describe("CommentTable - 코멘트 확대", () => {
  it("코멘트 셀을 클릭하면 해당 팀·심사위원의 상세 모달이 열린다", async () => {
    const user = userEvent.setup();
    render(<CommentTable judges={JUDGES} rows={ROWS} />);

    await user.click(screen.getByRole("button", { name: "댄스팀 심사위원 A 코멘트 확대 보기" }));

    expect(screen.getByText("댄스팀 · 심사위원 A")).toBeInTheDocument();
  });

  it("모달이 열려 있는 동안 rows가 갱신되면(개별 조회 완료) 모달도 최신 필기를 보여준다", async () => {
    const user = userEvent.setup();
    const { rerender } = render(<CommentTable judges={JUDGES} rows={ROWS} />);

    await user.click(screen.getByRole("button", { name: "댄스팀 심사위원 A 코멘트 확대 보기" }));
    expect(screen.getByText("댄스팀 · 심사위원 A")).toBeInTheDocument();
    expect(screen.queryByText("작성된 코멘트가 없습니다")).not.toBeInTheDocument();

    const updatedRows: CommentRow[] = [
      { ...ROWS[0], comments: [{ judgeId: 1, strokes: null }] },
    ];
    rerender(<CommentTable judges={JUDGES} rows={updatedRows} />);

    expect(screen.getByText("작성된 코멘트가 없습니다")).toBeInTheDocument();
  });
});

describe("CommentTable - dirty 셀", () => {
  it("dirtyCells가 전달돼도 뷰포트 진입 전까지는 기존 필기를 그대로 보여준다", () => {
    const dirtyCells = new Map([[dirtyCommentKey(1, 1), 2]]);
    render(
      <CommentTable
        judges={JUDGES}
        rows={ROWS}
        dirtyCells={dirtyCells}
        onResolveComment={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("button", { name: "댄스팀 심사위원 A 코멘트 확대 보기" }),
    ).toBeInTheDocument();
  });
});
