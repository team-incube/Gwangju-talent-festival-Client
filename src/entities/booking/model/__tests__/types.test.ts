import { describe, it, expect } from "vitest"
import { getSectionFromLabel, formatSeatLabel, SECTIONS } from "../types"

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

describe("formatSeatLabel - 좌석 라벨 표기", () => {
  it("일반 섹션은 섹션라벨+행+번호로 표기한다", () => {
    expect(formatSeatLabel({ section: "RED", row: "A", seatNumber: "1" })).toBe("AA1")
  })

  it("휠체어석은 행을 생략해 WW1이 아닌 W1로 표기한다", () => {
    expect(formatSeatLabel({ section: "WHEELCHAIR", row: "W", seatNumber: "1" })).toBe("W1")
  })
})
