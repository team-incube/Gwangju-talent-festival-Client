import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, act } from "@testing-library/react";
import { useCommentCellRefetch } from "../useCommentCellRefetch";

vi.mock("@/entities/judging/api/getJudgeMonitorComment", () => ({
  getJudgeMonitorComment: vi.fn(),
}));

import { getJudgeMonitorComment } from "@/entities/judging/api/getJudgeMonitorComment";
import { Stroke } from "@/entities/judging/model/handwriting";

type IntersectionCallback = (entries: { isIntersecting: boolean }[]) => void;

let ioInstances: { callback: IntersectionCallback }[] = [];

class IntersectionObserverMock {
  callback: IntersectionCallback;

  constructor(callback: IntersectionCallback) {
    this.callback = callback;
    ioInstances.push(this);
  }

  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

const setVisible = (index: number, isIntersecting: boolean) => {
  act(() => {
    ioInstances[index].callback([{ isIntersecting }]);
  });
};

type TestCellProps = {
  teamId: number;
  judgeId: number;
  dirtyVersion: number | undefined;
  onResolved: (teamId: number, judgeId: number, strokes: Stroke[], version: number) => void;
};

const TestCell = ({ teamId, judgeId, dirtyVersion, onResolved }: TestCellProps) => {
  const ref = useCommentCellRefetch(teamId, judgeId, dirtyVersion, onResolved);
  return <button ref={ref}>cell</button>;
};

const flushMicrotasks = () => act(() => Promise.resolve());

beforeEach(() => {
  vi.clearAllMocks();
  ioInstances = [];
  vi.stubGlobal("IntersectionObserver", IntersectionObserverMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("useCommentCellRefetch", () => {
  it("dirty가 아니면 화면에 보여도 조회하지 않는다", async () => {
    const onResolved = vi.fn();
    render(<TestCell teamId={1} judgeId={2} dirtyVersion={undefined} onResolved={onResolved} />);

    setVisible(0, true);
    await flushMicrotasks();

    expect(getJudgeMonitorComment).not.toHaveBeenCalled();
  });

  it("dirty여도 화면 밖(offscreen)이면 조회하지 않는다", async () => {
    const onResolved = vi.fn();
    render(<TestCell teamId={1} judgeId={2} dirtyVersion={1} onResolved={onResolved} />);

    await flushMicrotasks();

    expect(getJudgeMonitorComment).not.toHaveBeenCalled();
  });

  it("dirty + viewport 진입 시 개별 조회하고 성공하면 onResolved를 호출한다", async () => {
    const strokes = [{ color: "#000", points: [{ x: 0, y: 0 }] }];
    vi.mocked(getJudgeMonitorComment).mockResolvedValue({ teamId: 1, strokes });
    const onResolved = vi.fn();

    render(<TestCell teamId={1} judgeId={2} dirtyVersion={5} onResolved={onResolved} />);
    setVisible(0, true);
    await flushMicrotasks();

    expect(getJudgeMonitorComment).toHaveBeenCalledWith(1, 2);
    expect(onResolved).toHaveBeenCalledWith(1, 2, strokes, 5);
  });

  it("같은 version에 대해서는 재조회하지 않는다", async () => {
    vi.mocked(getJudgeMonitorComment).mockResolvedValue({ teamId: 1, strokes: [] });
    const onResolved = vi.fn();

    const { rerender } = render(
      <TestCell teamId={1} judgeId={2} dirtyVersion={5} onResolved={onResolved} />,
    );
    setVisible(0, true);
    await flushMicrotasks();
    expect(getJudgeMonitorComment).toHaveBeenCalledTimes(1);

    // 화면 밖으로 나갔다가 같은 version을 유지한 채 다시 들어와도 중복 조회하지 않는다
    setVisible(0, false);
    rerender(<TestCell teamId={1} judgeId={2} dirtyVersion={5} onResolved={onResolved} />);
    setVisible(0, true);
    await flushMicrotasks();

    expect(getJudgeMonitorComment).toHaveBeenCalledTimes(1);
  });

  it("조회 실패 시 기존 값을 유지하고, 다음 Delta(version 갱신)에서 재시도한다", async () => {
    vi.mocked(getJudgeMonitorComment).mockRejectedValueOnce(new Error("network"));
    const onResolved = vi.fn();

    const { rerender } = render(
      <TestCell teamId={1} judgeId={2} dirtyVersion={5} onResolved={onResolved} />,
    );
    setVisible(0, true);
    await flushMicrotasks();

    expect(onResolved).not.toHaveBeenCalled();

    vi.mocked(getJudgeMonitorComment).mockResolvedValue({ teamId: 1, strokes: [] });
    rerender(<TestCell teamId={1} judgeId={2} dirtyVersion={6} onResolved={onResolved} />);
    await flushMicrotasks();

    expect(getJudgeMonitorComment).toHaveBeenCalledTimes(2);
    expect(onResolved).toHaveBeenCalledWith(1, 2, [], 6);
  });

  it("조회 실패 후 같은 version이라도 뷰포트에 재진입하면 재시도한다", async () => {
    vi.mocked(getJudgeMonitorComment).mockRejectedValueOnce(new Error("network"));
    const onResolved = vi.fn();

    render(<TestCell teamId={1} judgeId={2} dirtyVersion={5} onResolved={onResolved} />);
    setVisible(0, true);
    await flushMicrotasks();
    expect(getJudgeMonitorComment).toHaveBeenCalledTimes(1);

    vi.mocked(getJudgeMonitorComment).mockResolvedValue({ teamId: 1, strokes: [] });
    setVisible(0, false);
    setVisible(0, true);
    await flushMicrotasks();

    expect(getJudgeMonitorComment).toHaveBeenCalledTimes(2);
    expect(onResolved).toHaveBeenCalledWith(1, 2, [], 5);
  });
});
