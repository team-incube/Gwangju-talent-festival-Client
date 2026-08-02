import { describe, it, expect } from "vitest"
import { nextZoomIndex, ZOOM_LEVELS } from "../useSeatMapZoom"

describe("nextZoomIndex - 확대 단계 계산", () => {
  it("단계를 올리고 내린다", () => {
    expect(nextZoomIndex(3, 1)).toBe(4)
    expect(nextZoomIndex(3, -1)).toBe(2)
  })

  it("최소 단계 아래로는 안 내려간다", () => {
    expect(nextZoomIndex(0, -1)).toBe(0)
  })

  it("최대 단계 위로는 안 올라간다", () => {
    const last = ZOOM_LEVELS.length - 1
    expect(nextZoomIndex(last, 1)).toBe(last)
  })

  it("모든 단계는 셀 크기와 글자 크기를 함께 지정한다", () => {
    ZOOM_LEVELS.forEach(level => {
      expect(level).toMatch(/^w-\[\d+px\] h-\[\d+px\] text-\[\d+px\]$/)
    })
  })
})
