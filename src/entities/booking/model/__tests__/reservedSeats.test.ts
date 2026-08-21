import { describe, it, expect } from "vitest"
import { isReservedSeat } from "../reservedSeats"
import { SEAT_LAYOUTS } from "../seatLayouts"
import { SECTIONS } from "../types"

describe("isReservedSeat - 확보석 판별", () => {
  it("GREEN 구역 L·M·R·S열은 확보석이다", () => {
    ;["L", "M", "R", "S"].forEach(row => {
      expect(isReservedSeat({ section: "GREEN", row })).toBe(true)
    })
  })

  it("GREEN 구역 N·O·P·Q열은 예매 가능석이다", () => {
    ;["N", "O", "P", "Q"].forEach(row => {
      expect(isReservedSeat({ section: "GREEN", row })).toBe(false)
    })
  })

  it("다른 구역의 같은 열 이름은 확보석이 아니다", () => {
    expect(isReservedSeat({ section: "BLUE", row: "L" })).toBe(false)
    expect(isReservedSeat({ section: "PURPLE", row: "L" })).toBe(false)
  })

  it("BLUE·PURPLE 구역 뒤 3열(R·S·T)은 확보석이다", () => {
    ;(["BLUE", "PURPLE"] as const).forEach(section => {
      ;["R", "S", "T"].forEach(row => {
        expect(isReservedSeat({ section, row })).toBe(true)
      })
    })
  })

  it("BLUE·PURPLE 구역 Q열까지는 예매 가능석이다", () => {
    ;(["BLUE", "PURPLE"] as const).forEach(section => {
      ;["N", "O", "P", "Q"].forEach(row => {
        expect(isReservedSeat({ section, row })).toBe(false)
      })
    })
  })

  it("무대 최전열 A열은 출연팀 좌석이라 예매 불가다", () => {
    ;(["RED", "YELLOW", "TEAL"] as const).forEach(section => {
      expect(isReservedSeat({ section, row: "A" })).toBe(true)
    })
  })

  it("A열 다음 B열부터는 예매 가능석이다", () => {
    ;(["RED", "YELLOW", "TEAL"] as const).forEach(section => {
      expect(isReservedSeat({ section, row: "B" })).toBe(false)
    })
  })

  it("확보석은 좌석배치도 기준 90석이다", () => {
    const reserved = SECTIONS.flatMap(section =>
      SEAT_LAYOUTS[section].seats.filter(isReservedSeat),
    )
    expect(reserved).toHaveLength(134)
  })
})
