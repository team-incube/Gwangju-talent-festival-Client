import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TeamGrid from "../index";
import { Score } from "@/entities/judging/model/score";

const makeScore = (teamId: number, teamName: string): Score => ({
  judgementId: null,
  teamId,
  teamName,
  completenessExpressionScore: 0,
  creativityCompositionScore: 0,
  stagePerformanceTeamworkScore: 0,
  totalScore: 0,
  isPerformed: false,
  isJudged: false,
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe("TeamGrid - 렌더링", () => {
  it("전달된 순서대로 팀 카드를 렌더링한다", () => {
    const teams = [makeScore(1, "댄스팀"), makeScore(2, "밴드팀"), makeScore(3, "합창팀")];

    render(<TeamGrid teams={teams} selectedTeamId={1} onSelect={vi.fn()} />);

    const buttons = screen.getAllByRole("button");
    expect(buttons.map(button => button.textContent)).toEqual([
      expect.stringContaining("댄스팀"),
      expect.stringContaining("밴드팀"),
      expect.stringContaining("합창팀"),
    ]);
  });

  it("선택된 팀 이름이 화면에 표시된다", () => {
    const teams = [makeScore(1, "댄스팀"), makeScore(2, "밴드팀")];

    render(<TeamGrid teams={teams} selectedTeamId={2} onSelect={vi.fn()} />);

    expect(screen.getByText("밴드팀")).toBeInTheDocument();
  });
});

describe("TeamGrid - 카드 클릭", () => {
  it("팀 카드를 클릭하면 onSelect가 해당 teamId와 함께 호출된다", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const teams = [makeScore(1, "댄스팀"), makeScore(2, "밴드팀")];

    render(<TeamGrid teams={teams} selectedTeamId={1} onSelect={onSelect} />);

    await user.click(screen.getByText("밴드팀"));

    expect(onSelect).toHaveBeenCalledWith(2);
  });
});
