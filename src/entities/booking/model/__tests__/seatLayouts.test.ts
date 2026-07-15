import { describe, it, expect } from "vitest"
import { getSeatLayout, findSeatById, getAvailableSeatsCount, getSeatPattern } from "../seatLayouts"
import { SEAT_STATUS, SEAT_INFO, SECTIONS } from "../types"

describe("getSeatLayout - 레이아웃 생성", () => {
  it("반환된 레이아웃의 section 필드가 요청한 섹션과 일치한다", () => {
    const layout = getSeatLayout("RED")
    expect(layout.section).toBe("RED")
  })

  it("각 섹션의 좌석 수는 SEAT_INFO의 total과 일치한다", () => {
    SECTIONS.forEach(section => {
      const layout = getSeatLayout(section)
      expect(layout.seats).toHaveLength(SEAT_INFO[section].total)
    })
  })

  it("모든 좌석의 초기 상태는 AVAILABLE이다", () => {
    SECTIONS.forEach(section => {
      const layout = getSeatLayout(section)
      layout.seats.forEach(seat => {
        expect(seat.status).toBe(SEAT_STATUS.AVAILABLE)
      })
    })
  })

  it("각 좌석의 section 필드가 해당 섹션으로 설정된다", () => {
    const layout = getSeatLayout("YELLOW")
    layout.seats.forEach(seat => {
      expect(seat.section).toBe("YELLOW")
    })
  })

  it("휠체어석을 제외한 각 섹션의 좌석은 두 개 이상의 열(row)에 걸쳐 분포한다", () => {
    SECTIONS.filter(section => section !== "WHEELCHAIR").forEach(section => {
      const layout = getSeatLayout(section)
      const rows = new Set(layout.seats.map(seat => seat.row))
      expect(rows.size).toBeGreaterThan(1)
    })
  })
})

describe("findSeatById - ID로 좌석 조회", () => {
  it("존재하는 좌석 번호·열로 조회하면 해당 좌석을 반환한다", () => {
    const seat = findSeatById("4", "A", "RED")
    expect(seat).toBeDefined()
    expect(seat?.seatNumber).toBe("4")
    expect(seat?.row).toBe("A")
    expect(seat?.section).toBe("RED")
  })

  it("존재하지 않는 좌석 번호로 조회하면 undefined를 반환한다", () => {
    const seat = findSeatById("9999", "A", "RED")
    expect(seat).toBeUndefined()
  })

  it("같은 좌석 번호라도 열이 다르면 조회되지 않는다", () => {
    const seat = findSeatById("4", "Z", "RED")
    expect(seat).toBeUndefined()
  })

  it("RED 구역 A열의 좌석 번호 범위를 초과하면 undefined를 반환한다", () => {
    const seat = findSeatById("11", "A", "RED")
    expect(seat).toBeUndefined()
  })

  it("PURPLE 구역 S열의 마지막 좌석 번호로 조회할 수 있다", () => {
    const seat = findSeatById("32", "S", "PURPLE")
    expect(seat).toBeDefined()
    expect(seat?.seatNumber).toBe("32")
  })
})

describe("getAvailableSeatsCount - 빈 좌석 카운트", () => {
  it("초기 상태에서 빈 좌석 수는 전체 좌석 수와 같다", () => {
    const count = getAvailableSeatsCount("RED")
    expect(count).toBe(SEAT_INFO["RED"].total)
  })

  it("모든 섹션의 초기 빈 좌석 수가 SEAT_INFO total과 일치한다", () => {
    SECTIONS.forEach(section => {
      const count = getAvailableSeatsCount(section)
      expect(count).toBe(SEAT_INFO[section].total)
    })
  })
})

describe("getSeatPattern - 섹션 패턴 조회", () => {
  it("2차원 배열을 반환한다", () => {
    const pattern = getSeatPattern("RED")
    expect(Array.isArray(pattern)).toBe(true)
    expect(pattern.every(row => Array.isArray(row))).toBe(true)
  })

  it("패턴의 숫자 요소 수는 SEAT_INFO.total과 일치한다", () => {
    SECTIONS.forEach(section => {
      const count = getSeatPattern(section).flat().filter(n => n !== null).length
      expect(count).toBe(SEAT_INFO[section].total)
    })
  })

  it("RED·TEAL·BLUE·PURPLE 섹션 패턴에는 null이 포함된다", () => {
    const sectionsWithNulls = ["RED", "TEAL", "BLUE", "PURPLE"] as const
    sectionsWithNulls.forEach(section => {
      const hasNull = getSeatPattern(section).flat().some(n => n === null)
      expect(hasNull).toBe(true)
    })
  })

  it("YELLOW·GREEN 섹션 패턴에는 null이 없다", () => {
    const sectionsWithoutNulls = ["YELLOW", "GREEN"] as const
    sectionsWithoutNulls.forEach(section => {
      const hasNull = getSeatPattern(section).flat().some(n => n === null)
      expect(hasNull).toBe(false)
    })
  })
})

describe("getSeatLayout - 좌석 번호 형식", () => {
  it("좌석 번호는 문자열 타입이다", () => {
    const layout = getSeatLayout("RED")
    layout.seats.forEach(seat => {
      expect(typeof seat.seatNumber).toBe("string")
    })
  })

  it("같은 섹션 내에서 같은 열의 좌석 번호끼리는 중복되지 않는다", () => {
    SECTIONS.forEach(section => {
      const layout = getSeatLayout(section)
      const rows = new Set(layout.seats.map(seat => seat.row))
      rows.forEach(row => {
        const numbers = layout.seats.filter(seat => seat.row === row).map(seat => seat.seatNumber)
        expect(new Set(numbers).size).toBe(numbers.length)
      })
    })
  })

  it("같은 섹션 내 (열, 좌석 번호) 조합은 중복되지 않는다", () => {
    SECTIONS.forEach(section => {
      const layout = getSeatLayout(section)
      const keys = layout.seats.map(seat => `${seat.row}-${seat.seatNumber}`)
      expect(new Set(keys).size).toBe(keys.length)
    })
  })
})

describe("findSeatById - 엣지 케이스", () => {
  it("좌석 번호 '0'은 존재하지 않는다", () => {
    expect(findSeatById("0", "A", "RED")).toBeUndefined()
  })

  it("섹션이 다르면 같은 열·번호도 해당 섹션 기준으로 독립적으로 조회된다", () => {
    const seatRed = findSeatById("11", "A", "YELLOW")
    const seatTeal = findSeatById("23", "A", "TEAL")
    expect(seatRed?.section).toBe("YELLOW")
    expect(seatTeal?.section).toBe("TEAL")
  })
})
