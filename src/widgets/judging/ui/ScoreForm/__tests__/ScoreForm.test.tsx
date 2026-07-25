import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ScoreForm from "../index";
import { EMPTY_SCORE } from "@/entities/judging/model/score";

describe("ScoreForm - 통계 표기", () => {
  it("내 점수, 실시간 통계 점수, 현재 순위를 모두 표시한다", () => {
    render(
      <ScoreForm
        teamId={1}
        teamName="댄스팀"
        score={{ ...EMPTY_SCORE, completenessExpressionScore: 20 }}
        onChange={vi.fn()}
        onSave={vi.fn()}
        isSaving={false}
        statScore={75}
        rank={2}
      />,
    );

    expect(screen.getByText("20점 / 100점")).toBeInTheDocument();
    expect(screen.getByText("75점")).toBeInTheDocument();
    expect(screen.getByText("2위")).toBeInTheDocument();
  });

  it("순위가 없으면 -로 표시한다", () => {
    render(
      <ScoreForm
        teamId={1}
        teamName="댄스팀"
        score={EMPTY_SCORE}
        onChange={vi.fn()}
        onSave={vi.fn()}
        isSaving={false}
        statScore={0}
        rank={null}
      />,
    );

    expect(screen.getByText("-")).toBeInTheDocument();
  });
});
