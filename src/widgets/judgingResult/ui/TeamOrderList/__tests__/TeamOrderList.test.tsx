import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import TeamOrderList from "../index";
import { Team } from "@/entities/team/model/types";

const makeTeam = (teamId: number, teamName: string, performOrder: number): Team => ({
  teamId,
  teamName,
  school: "광주고",
  teamGenre: "DANCE",
  applicantName: `신청자${teamId}`,
  performOrder,
  status: "PENDING",
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe("TeamOrderList - 렌더링", () => {
  it("전달된 순서대로 팀 행을 렌더링한다", () => {
    const teams = [
      makeTeam(1, "댄스팀", 1),
      makeTeam(2, "밴드팀", 2),
      makeTeam(3, "합창팀", 3),
    ];

    render(<TeamOrderList teams={teams} onReorder={vi.fn()} />);

    const rows = screen.getAllByText(/댄스팀|밴드팀|합창팀/);
    expect(rows.map(row => row.textContent)).toEqual(["댄스팀", "밴드팀", "합창팀"]);
  });

  it("팀이 없으면 안내 문구를 표시한다", () => {
    render(<TeamOrderList teams={[]} onReorder={vi.fn()} />);

    expect(screen.getByText("등록된 팀이 없습니다.")).toBeInTheDocument();
  });

  it("로딩 중이면 스켈레톤을 표시한다", () => {
    const { container } = render(<TeamOrderList teams={[]} onReorder={vi.fn()} isLoading />);

    expect(container.querySelectorAll(".animate-pulse").length).toBeGreaterThan(0);
  });
});
