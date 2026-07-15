const DEFAULT_FILENAME = "judging-summary.xlsx";

const decodeQEncodedWord = (text: string): string => {
  const bytes: number[] = [];
  for (let i = 0; i < text.length; ) {
    if (text[i] === "=" && i + 2 < text.length) {
      bytes.push(parseInt(text.slice(i + 1, i + 3), 16));
      i += 3;
    } else if (text[i] === "_") {
      bytes.push(0x20);
      i += 1;
    } else {
      bytes.push(text.charCodeAt(i));
      i += 1;
    }
  }
  return new TextDecoder("utf-8").decode(Uint8Array.from(bytes));
};

const decodeBase64EncodedWord = (text: string): string => {
  const binary = atob(text);
  return new TextDecoder("utf-8").decode(Uint8Array.from(binary, char => char.charCodeAt(0)));
};

// 백엔드가 Content-Disposition의 filename에 RFC 2047 MIME 인코디드 워드(=?UTF-8?Q?...?=)를
// 그대로 내려주는 경우가 있어, 브라우저가 기본 다운로드로 처리할 때와 동일하게 직접 디코딩한다.
const decodeMimeEncodedWords = (value: string): string =>
  value.replace(/=\?[^?]+\?([BbQq])\?([^?]*)\?=/g, (match, encoding: string, text: string) => {
    try {
      return encoding.toUpperCase() === "Q" ? decodeQEncodedWord(text) : decodeBase64EncodedWord(text);
    } catch {
      return match;
    }
  });

const extractFilename = (contentDisposition: string | null): string => {
  if (!contentDisposition) return DEFAULT_FILENAME;

  const extendedMatch = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (extendedMatch) {
    try {
      return decodeURIComponent(extendedMatch[1]);
    } catch {
      // 잘못된 percent-encoding이면 아래 일반 filename 파싱으로 대체
    }
  }

  const quotedMatch = contentDisposition.match(/filename="([^"]+)"/i);
  if (quotedMatch) return decodeMimeEncodedWords(quotedMatch[1]);

  const unquotedMatch = contentDisposition.match(/filename=([^;]+)/i);
  return unquotedMatch ? decodeMimeEncodedWords(unquotedMatch[1]) : DEFAULT_FILENAME;
};

export const downloadJudgingSummary = async (): Promise<void> => {
  const response = await fetch("/api/excel/summary");

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.message ?? "심사 집계표를 다운로드하지 못했습니다.");
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = extractFilename(response.headers.get("content-disposition"));
  document.body.appendChild(link);
  link.click();
  link.remove();
  // 일부 브라우저는 다운로드 트리거가 비동기로 처리돼 즉시 revoke하면 다운로드가 실패할 수 있다
  setTimeout(() => URL.revokeObjectURL(url), 100);
};
