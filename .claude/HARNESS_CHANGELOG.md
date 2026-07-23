# 하네스 개선 이력

Claude가 작업 중 발견한 패턴을 반영한 변경 내역.
새 항목은 맨 위에 추가.

---

## 2026-07-14 — coding-standards.md
- **변경**: "인라인 스타일 절대 금지" 규칙에 예외 조항 추가 — 외부 스타일시트 로드 전 `:root` CSS 변수가 아직 정의되지 않아 above-the-fold 엘리먼트에 레이아웃 점프(FOUC)가 생기는 경우, `var(--x, fallback)` 폴백값을 인라인 style로 주는 건 허용
- **이유**: fix/font-flash-on-refresh 작업 중 Header의 `h-[var(--header-height)]`가 globals.css 로드 전 `height:auto`(123px)로 그렸다가 74px로 스냅되는 실제 레이아웃 점프를 Playwright로 실측. Tailwind 임의값 클래스로는 같은 외부 스타일시트에 정의가 있어 해결이 안 되고, 인라인 style만이 SSR HTML에 값을 즉시 박아넣을 수 있어 불가피한 예외였음
- **효과**: 향후 코드 리뷰/린트 과정에서 이런 케이스의 인라인 style을 규칙 위반으로 잘못 플래그하지 않음

<!-- 항목 형식:
## YYYY-MM-DD — [대상 파일]
- **변경**: 무엇을
- **이유**: 왜 (어떤 케이스가 트리거였는가)
- **효과**: 앞으로 무엇이 자동화/방지되는가
-->

## 2026-05-07 — harness-self-improve.md, CLAUDE.md
- **변경**: 개선 프로세스에 Verify 단계 추가, 수정 금지 목록에 harness-self-improve.md 추가, CLAUDE.md 수정 후 절차에 검증 단계 추가
- **이유**: PR #190 리뷰 — .sh 파일 수정 시 문법 오류로 워크플로우 전체가 깨질 위험, 자가 개선 규칙 파일 자체가 수정되면 제약이 무력화될 위험 지적
- **효과**: 파일 수정 후 문법 검증 강제화, 자가 개선 규칙 본체 보호
