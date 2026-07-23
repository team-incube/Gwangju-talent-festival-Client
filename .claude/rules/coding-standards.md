# Coding Standards

## 절대 금지

- `any` 타입 사용
- `console.log` 프로덕션 코드 잔재
- 인라인 스타일 (Tailwind only)
  - 예외: 외부 스타일시트 로드 전 FOUC/레이아웃 점프를 막기 위해 `:root` CSS 변수에 즉시 폴백값을 줘야 하는 above-the-fold 엘리먼트 (`style={{ height: "var(--x, 4.625rem)" }}`). Tailwind 임의값 클래스는 같은 외부 스타일시트에 정의되므로 이 경우엔 해결책이 안 됨 — SSR HTML에 값 자체가 박혀 있어야 함
- URL / API 키 하드코딩 (환경 변수 사용)
- `eslint-disable` (명확한 이유 없이)
- FSD 역방향 import
- TanStack Query 훅을 `hooks/`에 배치 (`model/` 폴더만 허용)
- auth API에 axios 사용 (signin, signup, verify, refresh는 native fetch)
- 측정 없이 성능 최적화 (병목 확인 후 적용)
- 컴포넌트 내 `new Date()` 직접 사용 금지 (테스트 가능성을 위해 공통 시간 유틸리티나 서버 타임 사용 권장)

## 네이밍

| 대상 | 컨벤션 |
|------|--------|
| 컴포넌트 | `PascalCase.tsx`, default export |
| 유틸/훅 | `camelCase.ts` |
| 상수 | `UPPER_SNAKE_CASE` |
| 타입/인터페이스 | `PascalCase` |
| API 함수 | 동사 + 명사 (`get*`, `post*`, `cancel*`) |
| Query 훅 | `use` 접두사, `model/` 폴더 내 |
| API URL | lowercase + kebab-case, 단수형 |

## 테스트 규칙

- 테스트 파일 위치: `__tests__/` 폴더 (소스 파일 옆)
  - `foo.ts` → `__tests__/foo.test.ts`
- `vi.clearAllMocks()`를 모든 `beforeEach`에서 호출
- 테스트 설명은 한국어 (`it("전화번호 형식이 잘못되면 API를 호출하지 않는다", ...)`)
- `globals: false` — vitest에서 명시적 import 필수
- 동작(behavior)을 검증, 구현 세부사항 검증 금지

## 출력 언어

- 코드 리뷰 결과: 한국어
- PR 리뷰 답글: 한국어
- 커밋 메시지 주제: 한국어

## 주석

- WHY가 명확하지 않을 때만 작성
- WHAT 설명 금지 (잘 지어진 이름으로 대체)
- 멀티라인 주석 블록 금지
