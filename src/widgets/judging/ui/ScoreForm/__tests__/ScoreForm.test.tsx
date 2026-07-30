import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ScoreForm from "../index";
import { EMPTY_SCORE } from "@/entities/judging/model/score";

describe("ScoreForm - 통계 표기", () => {
  it("내 점수를 표시한다", () => {
    render(
      <ScoreForm
        performOrder={1}
        teamName="댄스팀"
        score={{ ...EMPTY_SCORE, completenessExpressionScore: 20 }}
        onChange={vi.fn()}
        onSave={vi.fn()}
        isSaving={false}
      />,
    );

    expect(screen.getByText("20점 / 100점")).toBeInTheDocument();
  });
});
