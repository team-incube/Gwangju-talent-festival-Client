import { describe, it, expect } from "vitest"
import { getSectionFromLabel, SECTIONS } from "../types"

describe("getSectionFromLabel - 섹션 라벨 변환", () => {
  it("A를 RED로 변환한다", () => {
    expect(getSectionFromLabel("A")).toBe("RED")
  })

  it("모든 유효한 섹션 라벨을 올바르게 변환한다", () => {
    const cases = [
      ["A", "RED"],
      ["B", "YELLOW"],
      ["C", "TEAL"],
      ["D", "BLUE"],
      ["E", "GREEN"],
      ["F", "PURPLE"],
      ["W", "WHEELCHAIR"],
    ] as const

    cases.forEach(([label, expected]) => {
      expect(getSectionFromLabel(label)).toBe(expected)
    })
  })

  it("레이아웃에 없는 라벨은 null을 반환한다", () => {
    expect(getSectionFromLabel("Z")).toBeNull()
  })

  it("반환값은 null이 아니면 항상 SECTIONS 배열에 속한다", () => {
    const validLabels = ["A", "B", "C", "D", "E", "F", "W"]
    validLabels.forEach(label => {
      expect(SECTIONS).toContain(getSectionFromLabel(label))
    })
  })
})
