import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TicketOpenPopup from "../index";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

vi.mock("@/shared/utils/auth", () => ({
  getTokenFromCookie: vi.fn(),
  isLoggedIn: vi.fn(),
}));

vi.mock("@/shared/config/dateConfig", () => ({
  isTicketOpen: vi.fn(),
}));

import { useRouter } from "next/navigation";
import { getTokenFromCookie, isLoggedIn } from "@/shared/utils/auth";
import { isTicketOpen } from "@/shared/config/dateConfig";

const mockRouter = () => {
  const push = vi.fn();
  vi.mocked(useRouter).mockReturnValue({ push } as unknown as ReturnType<typeof useRouter>);
  return push;
};

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  mockRouter();
  vi.mocked(isTicketOpen).mockReturnValue(true);
  vi.mocked(isLoggedIn).mockReturnValue(false);
  vi.mocked(getTokenFromCookie).mockReturnValue(null);
});

describe("TicketOpenPopup", () => {
  it("예매 기간이면 로그인 전 방문자에게 회원가입 안내를 보여준다", async () => {
    render(<TicketOpenPopup />);

    expect(await screen.findByText("좌석 예매가 시작됐어요")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "회원가입" })).toBeInTheDocument();
  });

  it("예매 기간이 아니면 아무것도 보여주지 않는다", () => {
    vi.mocked(isTicketOpen).mockReturnValue(false);

    render(<TicketOpenPopup />);

    expect(screen.queryByText("좌석 예매가 시작됐어요")).toBeNull();
  });

  it("현장 선착순 안내를 함께 보여준다", async () => {
    render(<TicketOpenPopup />);

    expect(await screen.findByText(/선착순\(13:00~\)/)).toBeInTheDocument();
  });

  it("로그인 상태면 예매 페이지로 바로 이동한다", async () => {
    vi.mocked(isLoggedIn).mockReturnValue(true);
    const push = mockRouter();
    const user = userEvent.setup();

    render(<TicketOpenPopup />);
    await user.click(await screen.findByText("예매하러 가기"));

    expect(push).toHaveBeenCalledWith("/booking");
  });

  it("다시 보지 않기를 체크하고 닫으면 다음 방문에는 뜨지 않는다", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<TicketOpenPopup />);

    await user.click(await screen.findByLabelText("다시 보지 않기"));
    await user.click(screen.getByRole("button", { name: "회원가입" }));
    unmount();

    render(<TicketOpenPopup />);

    expect(screen.queryByText("좌석 예매가 시작됐어요")).toBeNull();
  });
});
