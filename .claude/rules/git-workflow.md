# Git Workflow Rules

## 보호 브랜치

`main`과 `develop`에 직접 커밋/푸시 절대 금지.
위반 시 즉시 중단하고 feature 브랜치 생성을 안내.

## 브랜치 전략

```
main ← develop ← feat/<name>
                ← fix/<name>
                ← test/<name>
                ← chore/<name>
                ← refactor/<name>
                ← perf/<name>
                ← design/<name>
                ← docs/<name>
```

- 모든 feature 브랜치는 `develop`에서 생성
- `<name>`: lowercase + kebab-case
- 성능 작업은 반드시 `perf/<name>` 브랜치 사용

## 긴급 운영 장애 (hotfix)

실제 운영(main) 서비스가 지금 장애 중이라 develop을 거칠 시간이 없는 경우에만 예외적으로 사용.

```
main ← hotfix/<name>   (PR base: main)
```

- 브랜치: `hotfix/<name>`, **`origin/main` 기준**으로 생성
- PR: base `main`으로 직접 생성 (이 경우에 한해 "main으로 직접 PR 금지" 규칙의 예외)
- 머지 직후 반드시 후속 조치: `origin/develop` 기준 `fix/sync-<hotfix-name>` 브랜치를 새로 만들어 동일 커밋을 cherry-pick하고, base `develop`으로 별도 PR을 올려 두 브랜치를 동기화한다
- 장애가 아닌 일반 작업에는 사용 금지 — 애매하면 기본 워크플로우(develop 기준)를 따른다

## 커밋 규칙

- 포맷: `<type>: <한국어 주제>`
- 주제는 **반드시 한국어**
- 마침표 없음
- 하나의 커밋 = 하나의 변경 단위
- 변경 영역이 다르면 커밋 분리:
  - Feature 코드 / 테스트 / 설정 → 별도 커밋
  - 다른 FSD 도메인 (user + team) → 별도 커밋

## PR 규칙

- 제목: `type: 한국어 설명` (70자 이내)
- **모든 PR 내용은 한국어** (제목, 요약, 작업 내용, 참고사항)
- Base 브랜치: 항상 `develop` (main으로 직접 PR 금지)
- 본문: 프로젝트 템플릿 필수 (`skills/pr-template.md` 참조)
- CI 통과 후에만 머지 가능

## 워크플로우

1. `git fetch origin develop`
2. `git checkout -b <type>/<name> origin/develop`
3. 작업 + 커밋 (granularity 규칙 준수)
4. PR 생성 (base: develop, 한국어 내용)
5. CI 통과 확인 후 머지
