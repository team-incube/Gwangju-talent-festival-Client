import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TeamDetailModal from "../index";

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

describe("TeamDetailModal", () => {
  it("isOpen이 false면 아무것도 렌더링하지 않는다", () => {
    render(
      <TeamDetailModal
        isOpen={false}
        onClose={vi.fn()}
        teamName="댄스팀"
        judgeLabel="심사위원 A"
        strokes={[]}
      />,
    );

    expect(screen.queryByText("댄스팀 · 심사위원 A")).not.toBeInTheDocument();
  });

  it("isOpen이 true면 팀명과 심사위원 라벨을 제목으로 표시한다", () => {
    render(
      <TeamDetailModal
        isOpen={true}
        onClose={vi.fn()}
        teamName="댄스팀"
        judgeLabel="심사위원 A"
        strokes={[]}
      />,
    );

    expect(screen.getByText("댄스팀 · 심사위원 A")).toBeInTheDocument();
  });

  it("닫기 버튼을 클릭하면 onClose가 호출된다", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <TeamDetailModal
        isOpen={true}
        onClose={onClose}
        teamName="댄스팀"
        judgeLabel="심사위원 A"
        strokes={[]}
      />,
    );

    await user.click(screen.getByRole("button"));

    expect(onClose).toHaveBeenCalledOnce();
  });

  it("코멘트가 없으면 안내 문구를 보여준다", () => {
    render(
      <TeamDetailModal
        isOpen={true}
        onClose={vi.fn()}
        teamName="댄스팀"
        judgeLabel="심사위원 A"
        strokes={null}
      />,
    );

    expect(screen.getByText("작성된 코멘트가 없습니다")).toBeInTheDocument();
  });
});
