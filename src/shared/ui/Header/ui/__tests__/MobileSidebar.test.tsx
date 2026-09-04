import { describe, it, expect, beforeEach, vi } from "vitest";
import { render } from "@testing-library/react";
import { MobileSidebar } from "../MobileSidebar";

beforeEach(() => {
  vi.clearAllMocks();
});

const renderSidebar = (isOpen: boolean) =>
  render(
    <MobileSidebar
      isOpen={isOpen}
      onClose={() => {}}
      onLinkClick={() => {}}
      links={[{ label: "2026 광탈페 본선", section: "FinalsVenueSection" }]}
    />,
  );

describe("MobileSidebar", () => {
  it("닫혀 있으면 화면을 덮는 래퍼가 터치를 가로채지 않는다", () => {
    const { container } = renderSidebar(false);

    expect((container.firstChild as HTMLElement).className).toContain("pointer-events-none");
  });

  it("열려 있으면 래퍼가 터치를 받는다", () => {
    const { container } = renderSidebar(true);

    expect((container.firstChild as HTMLElement).className).toContain("pointer-events-auto");
  });
});
