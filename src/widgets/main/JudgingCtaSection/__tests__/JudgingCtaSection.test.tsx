import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import JudgingCtaSection from "../index";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

vi.mock("@/shared/utils/auth", () => ({
  getTokenFromCookie: vi.fn(),
}));

import { useRouter } from "next/navigation";
import { getTokenFromCookie } from "@/shared/utils/auth";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("JudgingCtaSection - 노출 및 이동 경로", () => {
  it("ADMIN role이면 심사 모니터링 버튼을 보여주고 모니터링 페이지로 이동한다", async () => {
    const push = vi.fn();
    vi.mocked(useRouter).mockReturnValue({ push } as unknown as ReturnType<typeof useRouter>);
    vi.mocked(getTokenFromCookie).mockReturnValue("ADMIN");
    const user = userEvent.setup();

    render(<JudgingCtaSection />);
    const button = await screen.findByText("심사 모니터링");
    await user.click(button);

    expect(push).toHaveBeenCalledWith("/admin/judging-result");
  });

  it("JUDGE role이면 심사하러 가기 버튼을 보여주고 채점 페이지로 이동한다", async () => {
    const push = vi.fn();
    vi.mocked(useRouter).mockReturnValue({ push } as unknown as ReturnType<typeof useRouter>);
    vi.mocked(getTokenFromCookie).mockReturnValue("JUDGE");
    const user = userEvent.setup();

    render(<JudgingCtaSection />);
    const button = await screen.findByText("심사하러 가기");
    await user.click(button);

    expect(push).toHaveBeenCalledWith("/admin/evaluation");
  });

  it("PERFORMER role이면 예매하러 가기 버튼을 보여주고 예매 페이지로 이동한다", async () => {
    const push = vi.fn();
    vi.mocked(useRouter).mockReturnValue({ push } as unknown as ReturnType<typeof useRouter>);
    vi.mocked(getTokenFromCookie).mockReturnValue("PERFORMER");
    const user = userEvent.setup();

    render(<JudgingCtaSection />);
    const button = await screen.findByText("예매하러 가기");
    await user.click(button);

    expect(push).toHaveBeenCalledWith("/booking");
  });

  it("USER role이면 출연진 인증 버튼을 보여주고 인증 페이지로 이동한다", async () => {
    const push = vi.fn();
    vi.mocked(useRouter).mockReturnValue({ push } as unknown as ReturnType<typeof useRouter>);
    vi.mocked(getTokenFromCookie).mockReturnValue("USER");
    const user = userEvent.setup();

    render(<JudgingCtaSection />);
    const button = await screen.findByText("출연진 인증하기");
    await user.click(button);

    expect(push).toHaveBeenCalledWith("/performer");
    expect(screen.getByText("만약 출연진이라면?")).toBeInTheDocument();
    expect(screen.queryByText("심사하러 가기")).not.toBeInTheDocument();
    expect(screen.queryByText("심사 모니터링")).not.toBeInTheDocument();
  });

  it("role이 없으면 버튼을 보여주지 않는다", () => {
    vi.mocked(useRouter).mockReturnValue({ push: vi.fn() } as unknown as ReturnType<
      typeof useRouter
    >);
    vi.mocked(getTokenFromCookie).mockReturnValue(null);

    render(<JudgingCtaSection />);

    expect(screen.queryByText("심사하러 가기")).not.toBeInTheDocument();
    expect(screen.queryByText("심사 모니터링")).not.toBeInTheDocument();
    expect(screen.queryByText("출연진 인증하기")).not.toBeInTheDocument();
  });
});
