type StackToken = "{" | "[";

const closingFor = (token: StackToken) => (token === "{" ? "}" : "]");

export type PartialJsonResult<T> = {
  data: T;
  // 원본 그대로 파싱되지 않고 뒷부분을 잘라내는 복구를 거쳤는지 여부
  recovered: boolean;
};

// SSE 전송 도중 끊겨 JSON 뒷부분이 잘려도, 마지막으로 완결된 값까지는 복구해 반영한다
export const parsePartialJson = <T>(raw: string): PartialJsonResult<T> | null => {
  try {
    return { data: JSON.parse(raw) as T, recovered: false };
  } catch {
    // 아래 복구 로직으로 폴백
  }

  const stack: StackToken[] = [];
  let inString = false;
  let escaped = false;
  let safeEnd = -1;

  for (let i = 0; i < raw.length; i += 1) {
    const char = raw[i];

    if (inString) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === '"') inString = false;
      continue;
    }

    if (char === '"') {
      inString = true;
      continue;
    }

    if (char === "{" || char === "[") {
      stack.push(char);
      continue;
    }

    if (char === "}" || char === "]") {
      stack.pop();
      if (stack.length > 0) safeEnd = i + 1;
      continue;
    }

    if (char === "," && stack.length > 0) {
      safeEnd = i;
    }
  }

  if (safeEnd === -1 || stack.length === 0) return null;

  const closing = stack
    .slice()
    .reverse()
    .map(closingFor)
    .join("");

  try {
    return { data: JSON.parse(raw.slice(0, safeEnd) + closing) as T, recovered: true };
  } catch {
    return null;
  }
};
