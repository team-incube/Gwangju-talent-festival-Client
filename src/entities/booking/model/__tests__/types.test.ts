import { describe, it, expect } from "vitest"
import { getSectionFromKey, SECTIONS } from "../types"

describe("getSectionFromKey - 섹션 키 변환", () => {
  it("section_red를 RED로 변환한다", () => {
    expect(getSectionFromKey("section_red")).toBe("RED")
  })

  it("모든 유효한 섹션 키를 올바르게 변환한다", () => {
    const cases = [
      ["section_red", "RED"],
      ["section_yellow", "YELLOW"],
      ["section_teal", "TEAL"],
      ["section_blue", "BLUE"],
      ["section_green", "GREEN"],
      ["section_purple", "PURPLE"],
    ] as const

    cases.forEach(([key, expected]) => {
      expect(getSectionFromKey(key)).toBe(expected)
    })
  })

  it("유효하지 않은 섹션 키면 에러를 던진다", () => {
    expect(() =>
      getSectionFromKey("section_z" as Parameters<typeof getSectionFromKey>[0]),
    ).toThrow("Invalid section key: section_z")
  })

  it("에러 메시지에 잘못된 키 이름이 포함된다", () => {
    expect(() =>
      getSectionFromKey("section_k" as Parameters<typeof getSectionFromKey>[0]),
    ).toThrow("Invalid section key: section_k")
  })

  it("반환값은 항상 SECTIONS 배열에 속한다", () => {
    const validKeys = [
      "section_red", "section_yellow", "section_teal",
      "section_blue", "section_green", "section_purple",
    ] as const
    validKeys.forEach(key => {
      expect(SECTIONS).toContain(getSectionFromKey(key))
    })
  })
})
