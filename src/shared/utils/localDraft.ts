"use client";

export const readLocalDraft = <T>(key: string): T | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
};

export const writeLocalDraft = <T>(key: string, value: T) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    return;
  }
};

export const removeLocalDraft = (key: string) => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(key);
};

// 팀별로 키가 나뉘는 draft(judge-score-draft-1, judge-score-draft-2 ...)를 한 번에 복원할 때 사용
export const readLocalDraftsByPrefix = <T>(prefix: string): Record<string, T> => {
  if (typeof window === "undefined") return {};
  const result: Record<string, T> = {};
  for (let i = 0; i < window.localStorage.length; i += 1) {
    const key = window.localStorage.key(i);
    if (!key || !key.startsWith(prefix)) continue;
    const value = readLocalDraft<T>(key);
    if (value !== null) result[key.slice(prefix.length)] = value;
  }
  return result;
};
