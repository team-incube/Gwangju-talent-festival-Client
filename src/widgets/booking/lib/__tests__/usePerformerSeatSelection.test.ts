import { describe, it, expect, beforeEach, vi } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { usePerformerSeatSelection } from "../usePerformerSeatSelection"
import { Seat, Section, SeatStatus, SEAT_STATUS } from "@/entities/booking/model/types"

const makeSeat = (
  seatNumber: string,
  section: Section = "RED",
  status: SeatStatus = SEAT_STATUS.AVAILABLE,
  row: string = "A",
): Seat => ({
  seatNumber,
  row,
  status,
  section,
})

beforeEach(() => {
  vi.clearAllMocks()
})

describe("usePerformerSeatSelection - 초기 상태", () => {
  it("selectedSection의 초기값은 null이다", () => {
    const { result } = renderHook(() => usePerformerSeatSelection(0))
    expect(result.current.selectedSection).toBeNull()
  })

  it("selectedSeats의 초기값은 빈 배열이다", () => {
    const { result } = renderHook(() => usePerformerSeatSelection(0))
    expect(result.current.selectedSeats).toHaveLength(0)
  })

  it("isComplete의 초기값은 false다", () => {
    const { result } = renderHook(() => usePerformerSeatSelection(0))
    expect(result.current.isComplete).toBe(false)
  })

  it("canBook의 초기값은 false다", () => {
    const { result } = renderHook(() => usePerformerSeatSelection(0))
    expect(result.current.canBook).toBe(false)
  })
})

describe("usePerformerSeatSelection - maxSelectableSeats", () => {
  it("existingSeatsCount가 0이면 최대 2석 선택 가능하다", () => {
    const { result } = renderHook(() => usePerformerSeatSelection(0))
    expect(result.current.maxSelectableSeats).toBe(2)
  })

  it("existingSeatsCount가 1이면 최대 1석 선택 가능하다", () => {
    const { result } = renderHook(() => usePerformerSeatSelection(1))
    expect(result.current.maxSelectableSeats).toBe(1)
  })

  it("existingSeatsCount가 2이면 최대 0석 선택 가능하다", () => {
    const { result } = renderHook(() => usePerformerSeatSelection(2))
    expect(result.current.maxSelectableSeats).toBe(0)
  })

  it("이미 2석을 예매했으면 선택된 구역의 좌석을 눌러도 선택되지 않는다", () => {
    const { result } = renderHook(() => usePerformerSeatSelection(2))

    act(() => {
      result.current.setSelectedSection("RED")
    })
    act(() => {
      result.current.selectSeat(makeSeat("1"))
    })

    expect(result.current.selectedSeats).toHaveLength(0)
  })

  it("existingSeatsCount가 2를 초과해도 maxSelectableSeats는 0이다", () => {
    const { result } = renderHook(() => usePerformerSeatSelection(5))
    expect(result.current.maxSelectableSeats).toBe(0)
  })

  it("인수 없이 호출하면 기본값 0이 적용되어 최대 2석이다", () => {
    const { result } = renderHook(() => usePerformerSeatSelection())
    expect(result.current.maxSelectableSeats).toBe(2)
  })
})

describe("usePerformerSeatSelection - 다중 좌석 선택", () => {
  it("최대 좌석 수 미만일 때 좌석이 추가된다", () => {
    const { result } = renderHook(() => usePerformerSeatSelection(0))

    act(() => { result.current.selectSeat(makeSeat("1")) })
    act(() => { result.current.selectSeat(makeSeat("2")) })

    expect(result.current.selectedSeats).toHaveLength(2)
  })

  it("OCCUPIED 좌석은 선택되지 않는다", () => {
    const { result } = renderHook(() => usePerformerSeatSelection(0))

    act(() => { result.current.selectSeat(makeSeat("1", "RED", SEAT_STATUS.OCCUPIED)) })

    expect(result.current.selectedSeats).toHaveLength(0)
  })

  it("이미 선택된 좌석을 다시 선택하면 제거된다", () => {
    const { result } = renderHook(() => usePerformerSeatSelection(0))
    const seat = makeSeat("1")

    act(() => { result.current.selectSeat(seat) })
    act(() => { result.current.selectSeat(seat) })

    expect(result.current.selectedSeats).toHaveLength(0)
  })
})

describe("usePerformerSeatSelection - 링 버퍼 로직", () => {
  it("최대 좌석 수 초과 선택 시 가장 오래된 좌석이 교체된다", () => {
    const { result } = renderHook(() => usePerformerSeatSelection(0))

    act(() => { result.current.selectSeat(makeSeat("1")) })
    act(() => { result.current.selectSeat(makeSeat("2")) })
    act(() => { result.current.selectSeat(makeSeat("3")) })

    const seatNumbers = result.current.selectedSeats.map(s => s.seatNumber)
    expect(seatNumbers).not.toContain("1")
    expect(seatNumbers).toContain("2")
    expect(seatNumbers).toContain("3")
    expect(result.current.selectedSeats).toHaveLength(2)
  })

  it("링 버퍼가 연속으로 동작해도 항상 최근 2석을 유지한다", () => {
    const { result } = renderHook(() => usePerformerSeatSelection(0))

    act(() => { result.current.selectSeat(makeSeat("1")) })
    act(() => { result.current.selectSeat(makeSeat("2")) })
    act(() => { result.current.selectSeat(makeSeat("3")) })
    act(() => { result.current.selectSeat(makeSeat("4")) })
    act(() => { result.current.selectSeat(makeSeat("5")) })

    const seatNumbers = result.current.selectedSeats.map(s => s.seatNumber)
    expect(seatNumbers).toEqual(["4", "5"])
  })
})

describe("usePerformerSeatSelection - 섹션 변경", () => {
  it("섹션 변경 시 선택된 좌석이 초기화된다", () => {
    const { result } = renderHook(() => usePerformerSeatSelection(0))

    act(() => { result.current.setSelectedSection("RED") })
    act(() => { result.current.selectSeat(makeSeat("1")) })
    act(() => { result.current.selectSeat(makeSeat("2")) })

    act(() => { result.current.setSelectedSection("YELLOW") })

    expect(result.current.selectedSeats).toHaveLength(0)
    expect(result.current.selectedSection).toBe("YELLOW")
  })
})

describe("usePerformerSeatSelection - isSeatSelected", () => {
  it("선택된 좌석은 true를 반환한다", () => {
    const { result } = renderHook(() => usePerformerSeatSelection(0))
    const seat = makeSeat("1")

    act(() => { result.current.selectSeat(seat) })

    expect(result.current.isSeatSelected(seat)).toBe(true)
  })

  it("선택되지 않은 좌석은 false를 반환한다", () => {
    const { result } = renderHook(() => usePerformerSeatSelection(0))
    expect(result.current.isSeatSelected(makeSeat("99"))).toBe(false)
  })

  it("제거된 좌석은 false를 반환한다", () => {
    const { result } = renderHook(() => usePerformerSeatSelection(0))
    const seat = makeSeat("1")

    act(() => { result.current.selectSeat(seat) })
    act(() => { result.current.selectSeat(seat) })

    expect(result.current.isSeatSelected(seat)).toBe(false)
  })
})

describe("usePerformerSeatSelection - isComplete", () => {
  it("섹션 선택 + 2석 선택 시 true다", () => {
    const { result } = renderHook(() => usePerformerSeatSelection(0))

    act(() => { result.current.setSelectedSection("RED") })
    act(() => { result.current.selectSeat(makeSeat("1")) })
    act(() => { result.current.selectSeat(makeSeat("2")) })

    expect(result.current.isComplete).toBe(true)
  })

  it("좌석이 2석 미만이면 false다", () => {
    const { result } = renderHook(() => usePerformerSeatSelection(0))

    act(() => { result.current.setSelectedSection("RED") })
    act(() => { result.current.selectSeat(makeSeat("1")) })

    expect(result.current.isComplete).toBe(false)
  })

  it("섹션을 고르지 않고 좌석만 눌러도 좌석의 구역이 선택되어 true가 된다", () => {
    const { result } = renderHook(() => usePerformerSeatSelection(0))

    act(() => { result.current.selectSeat(makeSeat("1")) })
    act(() => { result.current.selectSeat(makeSeat("2")) })

    expect(result.current.selectedSection).toBe("RED")
    expect(result.current.isComplete).toBe(true)
  })
})

describe("usePerformerSeatSelection - canBook", () => {
  it("좌석이 1개 이상 선택되면 true다", () => {
    const { result } = renderHook(() => usePerformerSeatSelection(0))

    act(() => { result.current.selectSeat(makeSeat("1")) })

    expect(result.current.canBook).toBe(true)
  })

  it("좌석이 없으면 false다", () => {
    const { result } = renderHook(() => usePerformerSeatSelection(0))
    expect(result.current.canBook).toBe(false)
  })
})

describe("usePerformerSeatSelection - canSelectSeat", () => {
  it("AVAILABLE 좌석은 선택 가능하다", () => {
    const { result } = renderHook(() => usePerformerSeatSelection(0))
    expect(result.current.canSelectSeat(makeSeat("1", "RED", SEAT_STATUS.AVAILABLE))).toBe(true)
  })

  it("OCCUPIED 좌석은 선택 불가하다", () => {
    const { result } = renderHook(() => usePerformerSeatSelection(0))
    expect(result.current.canSelectSeat(makeSeat("1", "RED", SEAT_STATUS.OCCUPIED))).toBe(false)
  })

  it("SELECTED 좌석은 선택 불가하다", () => {
    const { result } = renderHook(() => usePerformerSeatSelection(0))
    expect(result.current.canSelectSeat(makeSeat("1", "RED", SEAT_STATUS.SELECTED))).toBe(false)
  })
})

describe("usePerformerSeatSelection - isSeatSelected 엣지 케이스", () => {
  it("같은 번호지만 다른 섹션의 좌석은 선택된 것으로 보지 않는다", () => {
    const { result } = renderHook(() => usePerformerSeatSelection(0))

    act(() => { result.current.selectSeat(makeSeat("1", "RED")) })

    expect(result.current.isSeatSelected(makeSeat("1", "YELLOW"))).toBe(false)
  })

  it("같은 번호·섹션이지만 다른 열의 좌석은 선택된 것으로 보지 않는다", () => {
    const { result } = renderHook(() => usePerformerSeatSelection(0))

    act(() => { result.current.selectSeat(makeSeat("1", "RED", SEAT_STATUS.AVAILABLE, "A")) })

    expect(result.current.isSeatSelected(makeSeat("1", "RED", SEAT_STATUS.AVAILABLE, "B"))).toBe(false)
  })
})

describe("usePerformerSeatSelection - maxSelectableSeats = 0 경계 동작", () => {
  it("existingSeatsCount가 2일 때 좌석 선택 시도해도 canBook은 false다", () => {
    const { result } = renderHook(() => usePerformerSeatSelection(2))

    act(() => { result.current.selectSeat(makeSeat("1")) })

    expect(result.current.canBook).toBe(false)
  })

  it("섹션과 좌석이 있어도 existingSeatsCount가 2이면 isComplete는 false다", () => {
    const { result } = renderHook(() => usePerformerSeatSelection(2))

    act(() => { result.current.setSelectedSection("RED") })
    act(() => { result.current.selectSeat(makeSeat("1")) })

    expect(result.current.isComplete).toBe(false)
  })
})

describe("usePerformerSeatSelection - 섹션 null 변경", () => {
  it("섹션을 null로 변경하면 선택 좌석이 초기화된다", () => {
    const { result } = renderHook(() => usePerformerSeatSelection(0))

    act(() => { result.current.setSelectedSection("RED") })
    act(() => { result.current.selectSeat(makeSeat("1")) })
    act(() => { result.current.setSelectedSection(null) })

    expect(result.current.selectedSection).toBeNull()
    expect(result.current.selectedSeats).toHaveLength(0)
  })
})

describe("usePerformerSeatSelection - removeOccupiedSeat", () => {
  it("지정한 섹션·열·번호의 좌석을 선택 목록에서 제거한다", () => {
    const { result } = renderHook(() => usePerformerSeatSelection(0))

    act(() => { result.current.selectSeat(makeSeat("1", "RED")) })
    act(() => { result.current.removeOccupiedSeat("RED", "A", "1") })

    expect(result.current.selectedSeats).toHaveLength(0)
  })

  it("다른 좌석은 제거되지 않는다", () => {
    const { result } = renderHook(() => usePerformerSeatSelection(0))

    act(() => { result.current.selectSeat(makeSeat("1", "RED")) })
    act(() => { result.current.selectSeat(makeSeat("2", "RED")) })

    act(() => { result.current.removeOccupiedSeat("RED", "A", "99") })

    expect(result.current.selectedSeats).toHaveLength(2)
  })

  it("섹션이 다르면 같은 열·번호여도 제거되지 않는다", () => {
    const { result } = renderHook(() => usePerformerSeatSelection(0))

    act(() => { result.current.selectSeat(makeSeat("1", "RED")) })
    act(() => { result.current.removeOccupiedSeat("YELLOW", "A", "1") })

    expect(result.current.selectedSeats).toHaveLength(1)
  })

  it("열이 다르면 같은 섹션·번호여도 제거되지 않는다", () => {
    const { result } = renderHook(() => usePerformerSeatSelection(0))

    act(() => { result.current.selectSeat(makeSeat("1", "RED", SEAT_STATUS.AVAILABLE, "A")) })
    act(() => { result.current.removeOccupiedSeat("RED", "B", "1") })

    expect(result.current.selectedSeats).toHaveLength(1)
  })
})

describe("usePerformerSeatSelection - 전체 지도에서 좌석 직접 선택", () => {
  it("다른 구역 좌석을 누르면 구역이 바뀌고 그 좌석만 선택된다", () => {
    const { result } = renderHook(() => usePerformerSeatSelection(0))

    act(() => { result.current.setSelectedSection("RED") })
    act(() => { result.current.selectSeat(makeSeat("1", "RED")) })
    act(() => { result.current.selectSeat(makeSeat("5", "YELLOW")) })

    expect(result.current.selectedSection).toBe("YELLOW")
    expect(result.current.selectedSeats).toHaveLength(1)
    expect(result.current.selectedSeats[0].seatNumber).toBe("5")
  })

  it("남은 예매 가능 좌석이 0이면 다른 구역 좌석을 눌러도 선택되지 않는다", () => {
    const { result } = renderHook(() => usePerformerSeatSelection(2))

    act(() => { result.current.selectSeat(makeSeat("1", "YELLOW")) })

    expect(result.current.selectedSection).toBe("YELLOW")
    expect(result.current.selectedSeats).toHaveLength(0)
  })
})
