import { describe, it, expect, beforeEach, vi } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useSeatSelection } from "../useSeatSelection"
import { Seat, Section, SeatStatus, SEAT_STATUS } from "@/entities/booking/model/types"

const makeSeat = (
  seatNumber: string,
  status: SeatStatus = SEAT_STATUS.AVAILABLE,
  row: string = "B",
): Seat => ({
  seatNumber,
  row,
  status,
  section: "RED",
})

beforeEach(() => {
  vi.clearAllMocks()
})

describe("useSeatSelection - 섹션 변경", () => {
  it("섹션 변경 시 선택된 좌석이 초기화된다", () => {
    const { result } = renderHook(() => useSeatSelection())

    act(() => { result.current.setSelectedSection("RED") })
    act(() => { result.current.selectSeat(makeSeat("1")) })
    expect(result.current.selectedSeat).not.toBeNull()

    act(() => { result.current.setSelectedSection("YELLOW") })

    expect(result.current.selectedSeat).toBeNull()
    expect(result.current.selectedSection).toBe("YELLOW")
  })

  it("섹션을 null로 변경하면 좌석도 초기화된다", () => {
    const { result } = renderHook(() => useSeatSelection())

    act(() => { result.current.setSelectedSection("RED") })
    act(() => { result.current.selectSeat(makeSeat("1")) })
    act(() => { result.current.setSelectedSection(null) })

    expect(result.current.selectedSection).toBeNull()
    expect(result.current.selectedSeat).toBeNull()
  })
})

describe("useSeatSelection - 단일 좌석 선택·토글", () => {
  it("AVAILABLE 좌석을 선택할 수 있다", () => {
    const { result } = renderHook(() => useSeatSelection())
    const seat = makeSeat("1", SEAT_STATUS.AVAILABLE)

    act(() => { result.current.selectSeat(seat) })

    expect(result.current.selectedSeat).toEqual(seat)
  })

  it("같은 좌석을 다시 선택하면 선택이 해제된다", () => {
    const { result } = renderHook(() => useSeatSelection())
    const seat = makeSeat("1")

    act(() => { result.current.selectSeat(seat) })
    act(() => { result.current.selectSeat(seat) })

    expect(result.current.selectedSeat).toBeNull()
  })

  it("OCCUPIED 좌석은 선택되지 않는다", () => {
    const { result } = renderHook(() => useSeatSelection())

    act(() => { result.current.selectSeat(makeSeat("1", SEAT_STATUS.OCCUPIED)) })

    expect(result.current.selectedSeat).toBeNull()
  })

  it("다른 좌석 선택 시 이전 좌석이 교체된다", () => {
    const { result } = renderHook(() => useSeatSelection())

    act(() => { result.current.selectSeat(makeSeat("1")) })
    act(() => { result.current.selectSeat(makeSeat("2")) })

    expect(result.current.selectedSeat?.seatNumber).toBe("2")
  })
})

describe("useSeatSelection - canSelectSeat", () => {
  it("AVAILABLE 좌석은 선택 가능하다", () => {
    const { result } = renderHook(() => useSeatSelection())
    expect(result.current.canSelectSeat(makeSeat("1", SEAT_STATUS.AVAILABLE))).toBe(true)
  })

  it("OCCUPIED 좌석은 선택 불가하다", () => {
    const { result } = renderHook(() => useSeatSelection())
    expect(result.current.canSelectSeat(makeSeat("1", SEAT_STATUS.OCCUPIED))).toBe(false)
  })

  it("SELECTED 좌석은 선택 불가하다", () => {
    const { result } = renderHook(() => useSeatSelection())
    expect(result.current.canSelectSeat(makeSeat("1", SEAT_STATUS.SELECTED))).toBe(false)
  })
})

describe("useSeatSelection - 좌석 선택 엣지 케이스", () => {
  it("같은 번호지만 다른 섹션의 좌석은 토글되지 않고 교체된다", () => {
    const { result } = renderHook(() => useSeatSelection())
    const seatA: Seat = { seatNumber: "1", row: "B", status: SEAT_STATUS.AVAILABLE, section: "RED" as Section }
    const seatB: Seat = { seatNumber: "1", row: "B", status: SEAT_STATUS.AVAILABLE, section: "YELLOW" as Section }

    act(() => { result.current.selectSeat(seatA) })
    act(() => { result.current.selectSeat(seatB) })

    expect(result.current.selectedSeat).toEqual(seatB)
  })

  it("같은 번호·섹션이지만 다른 열의 좌석은 토글되지 않고 교체된다", () => {
    const { result } = renderHook(() => useSeatSelection())
    const seatB = makeSeat("1", SEAT_STATUS.AVAILABLE, "B")
    const seatC = makeSeat("1", SEAT_STATUS.AVAILABLE, "C")

    act(() => { result.current.selectSeat(seatB) })
    act(() => { result.current.selectSeat(seatC) })

    expect(result.current.selectedSeat).toEqual(seatC)
  })

  it("출연팀 좌석인 A열은 선택되지 않는다", () => {
    const { result } = renderHook(() => useSeatSelection())

    act(() => { result.current.selectSeat(makeSeat("1", SEAT_STATUS.AVAILABLE, "A")) })

    expect(result.current.selectedSeat).toBeNull()
  })

  it("섹션을 같은 값으로 다시 설정해도 선택 좌석이 초기화된다", () => {
    const { result } = renderHook(() => useSeatSelection())

    act(() => { result.current.setSelectedSection("RED") })
    act(() => { result.current.selectSeat(makeSeat("1")) })
    act(() => { result.current.setSelectedSection("RED") })

    expect(result.current.selectedSeat).toBeNull()
  })
})

describe("useSeatSelection - selectedSeatInfo", () => {
  it("섹션과 좌석이 모두 선택되면 selectedSeatInfo를 반환한다", () => {
    const { result } = renderHook(() => useSeatSelection())
    const seat = makeSeat("1")

    act(() => { result.current.setSelectedSection("RED") })
    act(() => { result.current.selectSeat(seat) })

    expect(result.current.selectedSeatInfo).toEqual({ seat, section: "RED" })
  })

  it("섹션 선택 없이 좌석만 선택해도 좌석의 섹션이 자동 지정된다", () => {
    const { result } = renderHook(() => useSeatSelection())
    const seat = makeSeat("1")

    act(() => { result.current.selectSeat(seat) })

    expect(result.current.selectedSection).toBe("RED")
    expect(result.current.selectedSeatInfo).toEqual({ seat, section: "RED" })
  })

  it("좌석이 없으면 selectedSeatInfo는 null이다", () => {
    const { result } = renderHook(() => useSeatSelection())

    act(() => { result.current.setSelectedSection("RED") })

    expect(result.current.selectedSeatInfo).toBeNull()
  })
})

describe("useSeatSelection - 초기 상태", () => {
  it("selectedSection의 초기값은 null이다", () => {
    const { result } = renderHook(() => useSeatSelection())
    expect(result.current.selectedSection).toBeNull()
  })

  it("selectedSeat의 초기값은 null이다", () => {
    const { result } = renderHook(() => useSeatSelection())
    expect(result.current.selectedSeat).toBeNull()
  })

  it("selectedSeatInfo의 초기값은 null이다", () => {
    const { result } = renderHook(() => useSeatSelection())
    expect(result.current.selectedSeatInfo).toBeNull()
  })

  it("isComplete의 초기값은 false다", () => {
    const { result } = renderHook(() => useSeatSelection())
    expect(result.current.isComplete).toBe(false)
  })
})

describe("useSeatSelection - 어드민 옵션", () => {
  it("allowOccupied가 true면 OCCUPIED 좌석도 선택할 수 있다", () => {
    const { result } = renderHook(() => useSeatSelection({ allowOccupied: true }))
    const seat = makeSeat("1", SEAT_STATUS.OCCUPIED)

    act(() => { result.current.selectSeat(seat) })

    expect(result.current.selectedSeat).toEqual(seat)
  })

  it("같은 좌석이라도 상태가 바뀌면 선택 해제 대신 상태만 갱신된다", () => {
    const { result } = renderHook(() => useSeatSelection({ allowOccupied: true }))

    act(() => { result.current.selectSeat(makeSeat("1", SEAT_STATUS.OCCUPIED)) })
    act(() => { result.current.selectSeat(makeSeat("1", SEAT_STATUS.AVAILABLE)) })

    expect(result.current.selectedSeat).toEqual(makeSeat("1", SEAT_STATUS.AVAILABLE))
  })
})

describe("useSeatSelection - isComplete", () => {
  it("섹션과 좌석이 모두 선택되면 true다", () => {
    const { result } = renderHook(() => useSeatSelection())

    act(() => { result.current.setSelectedSection("RED") })
    act(() => { result.current.selectSeat(makeSeat("1")) })

    expect(result.current.isComplete).toBe(true)
  })

  it("섹션만 선택되면 false다", () => {
    const { result } = renderHook(() => useSeatSelection())

    act(() => { result.current.setSelectedSection("RED") })

    expect(result.current.isComplete).toBe(false)
  })

  it("좌석만 선택해도 섹션이 자동 지정되어 true다", () => {
    const { result } = renderHook(() => useSeatSelection())

    act(() => { result.current.selectSeat(makeSeat("1")) })

    expect(result.current.isComplete).toBe(true)
  })
})
