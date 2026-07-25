import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ResultTable from "../index";
import { JudgeHeader, ScoreRow } from "@/entities/judging/model/monitoring";

const JUDGES: JudgeHeader[] = [
  { judgeId: 1, label: "심사위원 A" },
  { judgeId: 2, label: "심사위원 B" },
];

const ROWS: ScoreRow[] = [
  {
    teamId: 1,
    performOrder: 1,
    teamName: "댄스팀",
    scores: [
      { judgeId: 1, score: 90 },
      { judgeId: 2, score: null },
    ],
    calculatedScore: 88,
    rank: 1,
  },
  {
    teamId: 2,
    performOrder: 2,
    teamName: "밴드팀",
    scores: [
      { judgeId: 1, score: 80 },
      { judgeId: 2, score: 85 },
    ],
    calculatedScore: 83,
    rank: 2,
  },
];

describe("ResultTable - 렌더링", () => {
  it("심사위원 헤더와 팀별 점수, 산출점수, 순위를 표시한다", () => {
    render(<ResultTable judges={JUDGES} rows={ROWS} />);

    expect(screen.getByText("심사위원 A")).toBeInTheDocument();
    expect(screen.getByText("심사위원 B")).toBeInTheDocument();
    expect(screen.getByText("댄스팀")).toBeInTheDocument();
    expect(screen.getByText("밴드팀")).toBeInTheDocument();
    expect(screen.getByText("90")).toBeInTheDocument();
    expect(screen.getByText("83")).toBeInTheDocument();
  });

  it("아직 점수가 없는 셀은 -로 표시한다", () => {
    render(<ResultTable judges={JUDGES} rows={ROWS} />);

    expect(screen.getByText("-")).toBeInTheDocument();
  });

  it("행이 없으면 안내 문구를 표시한다", () => {
    render(<ResultTable judges={JUDGES} rows={[]} />);

    expect(screen.getByText("집계된 심사 데이터가 없습니다.")).toBeInTheDocument();
  });
});

describe("ResultTable - 로딩 상태", () => {
  it("isLoading이면 스켈레톤을 보여주고 안내 문구나 테이블은 보여주지 않는다", () => {
    render(<ResultTable judges={[]} rows={[]} isLoading />);

    expect(screen.queryByText("집계된 심사 데이터가 없습니다.")).not.toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });
});
