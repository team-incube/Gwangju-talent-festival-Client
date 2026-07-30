import { describe, it, expect } from "vitest";
import { parsePartialJson } from "../partialJson";

describe("parsePartialJson", () => {
  it("완결된 JSON은 그대로 파싱하고 recovered를 false로 반환한다", () => {
    const raw = JSON.stringify({ items: [{ id: 1 }, { id: 2 }] });

    expect(parsePartialJson(raw)).toEqual({
      data: { items: [{ id: 1 }, { id: 2 }] },
      recovered: false,
    });
  });

  it("배열 마지막 요소가 중간에 잘려도 이전까지 완결된 요소는 복구한다", () => {
    const raw = '{"items":[{"id":1},{"id":2},{"id":3,"name":"a';

    expect(parsePartialJson(raw)).toEqual({
      data: { items: [{ id: 1 }, { id: 2 }, { id: 3 }] },
      recovered: true,
    });
  });

  it("문자열 안의 이스케이프된 따옴표/중괄호는 구조 인식에 영향을 주지 않는다", () => {
    const complete = JSON.stringify({ a: 'say "hi" {not a brace}', b: 2 });
    const raw = `${complete.slice(0, -1)},"c":3`;

    expect(parsePartialJson(raw)).toEqual({
      data: { a: 'say "hi" {not a brace}', b: 2 },
      recovered: true,
    });
  });

  it("복구 가능한 완결된 값이 하나도 없으면 null을 반환한다", () => {
    expect(parsePartialJson('{"a":1')).toBeNull();
  });

  it("애초에 JSON 구조가 아니면 null을 반환한다", () => {
    expect(parsePartialJson("invalid{{{json")).toBeNull();
  });
});
