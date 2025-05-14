export function getRandomSubset<T>(
  arr: ReadonlyArray<T>,
  count: number,
): [ReadonlyArray<T>, ReadonlyArray<T>] {
  const shuffled = [...arr]
    .map((item, index) => ({
      item,
      index,
    }))
    .sort(() => 0.5 - Math.random());

  const selected = shuffled.slice(0, count);
  const selectedItems = selected.map(({ item }) => item);

  const selectedIndices = new Set(selected.map(({ index }) => index));

  const remaining = arr.filter((_, idx) => !selectedIndices.has(idx));

  return [selectedItems, remaining] as const;
}
