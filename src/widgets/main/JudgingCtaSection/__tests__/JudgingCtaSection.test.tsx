import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import JudgingCtaSection from "../index";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("@/shared/utils/auth", () => ({
  getTokenFromCookie: vi.fn(),
}));

import { getTokenFromCookie } from "@/shared/utils/auth";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("JudgingCtaSection - 노출 권한", () => {
  it("ADMIN role이면 심사하러 가기 버튼을 보여준다", async () => {
    vi.mocked(getTokenFromCookie).mockReturnValue("ADMIN");

    render(<JudgingCtaSection />);

    expect(await screen.findByText("심사하러 가기")).toBeInTheDocument();
  });

  it("JUDGE role이면 심사하러 가기 버튼을 보여준다", async () => {
    vi.mocked(getTokenFromCookie).mockReturnValue("JUDGE");

    render(<JudgingCtaSection />);

    expect(await screen.findByText("심사하러 가기")).toBeInTheDocument();
  });

  it("USER role이면 버튼을 보여주지 않는다", () => {
    vi.mocked(getTokenFromCookie).mockReturnValue("USER");

    render(<JudgingCtaSection />);

    expect(screen.queryByText("심사하러 가기")).not.toBeInTheDocument();
  });

  it("role이 없으면 버튼을 보여주지 않는다", () => {
    vi.mocked(getTokenFromCookie).mockReturnValue(null);

    render(<JudgingCtaSection />);

    expect(screen.queryByText("심사하러 가기")).not.toBeInTheDocument();
  });
});
