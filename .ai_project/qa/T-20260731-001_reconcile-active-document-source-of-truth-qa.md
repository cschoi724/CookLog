# T-20260731-001 Product QA 독립 검증 보고서

작성일: 2026-07-31
작성자: Product QA Agent
대상 Task: `T-20260731-001`
판정: `FAIL`
상태 인계: `verification_in_progress -> rework_requested`

## 1. 검증 범위

- T-20260731-001 Task 정의와 Product Lead 작업 보고서
- 루트 `agents.md`
- `.ai_project/` 운영 모델, Source of Truth, 현재 컨텍스트, Task/Team board와 활성 Team context
- iOS Agent 안내와 상태·계획·스펙·아키텍처·서비스·결정 문서
- Design README와 구현 핸드오프
- Project Status, Decisions, Changelog
- 최신 완료 Design·Backend·CI Task와 실제 산출물
- 변경 경로, Task schema, Task graph, 로컬 참조 경로와 `git diff --check`

제품 기능 구현, 외부 Provider 최신 정보, Figma 미러 실제 동기화와 GitHub branch protection 외부 설정은 이번 문서 Task의 검증 범위에 포함하지 않았다.

## 2. 성공 기준별 결과

| 성공 기준 | 결과 | 근거 |
|---|---|---|
| 루트 `agents.md`에서 변동 가능한 제품 세부 정책 제거 | 통과 | 역할·탐색 순서·책임 경계 중심으로 축소됐고 STT·핸즈프리·검색 세부 계약을 복제하지 않는다. |
| 활성 iOS 문서가 로컬 검색·진행 저장·첫 공개 출시 핸즈프리를 제외로 오인시키지 않음 | 통과 | 현재 범위를 Task·MVP Scope로 위임하고 과거 Core MVP 이력을 명시적으로 분리했다. |
| Design 문서가 Figma를 공식 원본으로 안내하지 않음 | 실패 | Design README·핸드오프는 수정됐지만 활성 Design Team context와 운영 문서가 계속 Figma 원본을 `unresolved`로 안내한다. |
| 운영 문서가 XCTest·CI 완료와 최신 Task 상태를 정확히 안내 | 실패 | 운영 이슈와 상위 Task board에 CI 미확정·하위 전체 승인 대기 문구가 남아 완료된 T-001~003과 충돌한다. |
| Backend T-020 완료와 provider·runtime 최종 승인 대기 구분 | 부분 통과 | Source of Truth와 Project Status는 구분하지만 Development Team context와 Ops Issues는 Backend 기준 문서·API 계약이 없다고 안내한다. |
| PDF와 Markdown PRD의 권위·시점 차이가 모든 활성 참조에서 명확함 | 실패 | migration plan의 현재 Source of Truth 표는 PDF를 역사적 스냅샷 표시 없이 보조 제품 기준으로 유지한다. |
| 링크·Task schema·Task graph·diff와 충돌 문구 scan | 실패 | 구조 검증은 통과했지만 잔여 활성 충돌 문구 0건 주장은 재현되지 않았다. |
| Product QA 독립 검증 | 완료 | 본 보고서에 결과를 기록했다. |

## 3. 필수 재작업

### PQA-HIGH-031-001: 활성 운영·Team context가 새 Source of Truth와 충돌함

- 심각도: 높음
- 분류: 문서 간 정합성 / Source of Truth 추적 실패

현재 기준:

- `.ai_project/source_of_truth.md`는 로컬 Prototype·Manifest를 UI/UX 원본으로 지정한다.
- 같은 문서는 T-020 추천안과 T-021 공통 API 계약 산출물을 Backend 기준으로 지정한다.
- `.ai_project/operating_model.md`도 Figma 기준과 Backend 계약 상태를 resolved/완료로 안내한다.

잔여 충돌:

- `.ai_project/teams/design/team_context.md`는 `Figma 원본 링크는 unresolved`라고 안내한다.
- `.ai_project/teams/development/team_context.md`는 Backend ownership을 `경로·API 계약 생성 후보`, Backend Source of Truth를 `unresolved, 생성 후보`로 안내한다.
- `.ai_project/ops_issues.md`의 열린 이슈 OI-20260727-005는 Backend 코드 경로·API 계약과 Figma 원본 링크가 아직 없다고 안내한다.
- `.ai_project/ops_migration_plan.md`의 현재 vNext 후속 결정표도 Backend Source of Truth와 Figma 원본 링크를 `unresolved`로 유지한다.
- `.ai_project/source_of_truth.md`의 Backend 검증 행은 계약이 확정된 뒤 정의한다고 남아 있지만 T-021에는 검증 script·schema·QA 계약이 이미 존재한다.

영향:

- Design 또는 Backend Team이 team context부터 읽으면 최신 원본과 계약을 사용할 수 없다.
- 이미 완료된 T-020·T-021 산출물이 다시 생성 후보로 해석될 수 있다.
- 작업 보고서의 “주요 구형 충돌 문구 scan: 잔여 활성 충돌 0”을 재현할 수 없다.

필수 조치:

1. 활성 Team context를 최신 Source of Truth와 동기화한다.
2. 해결된 Ops Issue를 닫힌 이슈로 이동하고 해결 Task·산출물을 연결한다.
3. migration plan의 vNext 후속 결정 상태를 현재 기준으로 갱신하거나 문서 전체를 역사적 스냅샷으로 명시한다.
4. Backend 검증 기준에 T-021 계약 검증 script와 후속 T-023~025 검증 경계를 기록한다.

### PQA-HIGH-031-002: Task Board가 완료된 Backend·CI 하위 Task를 동시에 승인 대기로 표시함

- 심각도: 높음
- 분류: 최신 상태 추적 / Team 인계 충돌

근거:

- Project Task Board는 T-020·T-021과 T-20260730-001~003을 `done`으로 정확히 나열한다.
- 같은 Board의 T-20260728-005 행은 하위 `T-20260729-020~025` 전체를 승인 대기로 안내한다.
- 같은 Board의 T-20260728-008 행은 하위 `T-20260730-001~006` 전체를 승인 대기로 안내한다.
- Development Team Board도 두 상위 Task의 다음 조치를 “각 하위 Task 실행 승인 대기”로 유지한다.
- Quality Board의 향후 검증 목록에는 이미 `done`인 T-20260730-007이 다시 포함돼 있다.

영향:

- 다음 Lead가 완료된 하위 Task를 다시 승인·실행 대상으로 판단할 수 있다.
- 상위 Task의 실제 잔여 범위와 다음 실행 후보가 표마다 달라진다.
- 보고서의 “개별 Task 파일 기준 집계와 최신 상태 동기화” 성공 기준을 충족하지 못한다.

필수 조치:

1. T-20260728-005는 T-020·021 완료와 T-022~025의 선행·승인 상태를 분리한다.
2. T-20260728-008은 T-001~003 완료와 T-004~006의 선행·승인 상태를 분리한다.
3. Quality Board의 완료 Task와 향후 검증 목록 중복을 제거한다.
4. Project/Development/Quality board를 개별 Task 상태에서 다시 생성·대조한다.

### PQA-MEDIUM-031-003: Product QA Team 인계가 운영 모델에 완전히 등록되지 않음

- 심각도: 중간
- 분류: Team 인계 완전성 / 역할 라우팅

근거:

- T-20260731-001은 Product QA Agent와 `product_documentation`, `cross_domain_reconciliation`, `source_of_truth_governance`, `independent_validation` capability를 요구한다.
- `.ai_project/teams/quality/team_context.md`의 활성 Verification Role에는 Design·iOS·Backend QA만 있고 Product QA가 없다.
- `.ai_project/agent_registry.md`에도 Product QA Agent와 위 capability가 등록돼 있지 않다.
- `.ai_project/current_context.md`의 활성 Agent 목록에서도 Product QA가 제외돼 있다.
- 후속 `T-20260729-007`이 이 운영 등록을 담당한다고 기록돼 있지만 T-20260731-001의 선행 조건에는 포함되지 않았다.

영향:

- Task 파일을 받기 전 운영 문서만 읽는 새 세션은 Product QA 검증의 소유자와 capability를 확인할 수 없다.
- 현재 Task는 실행 가능했지만 동일 유형의 후속 제품 QA를 일관되게 라우팅할 수 없다.

필수 조치:

1. T-20260729-007을 먼저 완료하거나, T-20260731-001의 잔여 위험·의존성으로 명시해 Product QA routing이 임시 예외임을 기록한다.
2. Product QA의 책임과 capability를 Agent Registry·Quality Team context·Current Context에 일치시킨다.

### PQA-HIGH-031-004: 검증 중 최신 develop에 CI T-004 완료가 추가돼 문서 기준이 다시 뒤처짐

- 심각도: 높음
- 분류: 최신 기준 정렬 / 통합 드리프트

근거:

- 독립 검증 종료 시점의 `origin/develop`은 `22fe75f`이며 T-20260730-004 CI concurrency·진단·artifact 통합 완료를 포함한다.
- 현재 Task 브랜치는 `origin/develop`보다 1커밋 뒤처져 있다.
- T-20260731-001 문서는 T-20260730-004를 실행 승인 대기 또는 다음 작업으로 안내한다.
- 새 develop 커밋은 Development·Quality board, CI workflow, iOS Testing 문서를 변경한다.

영향:

- 현재 브랜치를 그대로 통합하면 최신 CI 상태와 board 변경의 충돌 해결이 필요하다.
- Task의 핵심 목적인 “최신 완료 결과를 활성 문서에 반영” 조건을 더 이상 충족하지 않는다.

필수 조치:

1. 재작업 결과를 최신 `origin/develop`에 정렬한다.
2. T-20260730-004 완료와 T-005~006 잔여 범위를 Project Status, Current Context, Source of Truth와 관련 board에 반영한다.
3. 최신 develop 통합 후 Task 집계·충돌 scan·링크·diff를 다시 검증한다.

## 4. 통과한 독립 검증

- 제품 기능 정책 변경: 발견하지 못함
- 검증 대상 구현 변경 파일: 23개
- 변경 경로의 `allowed_paths` 위반: 0건
- Task front matter: 42개 파싱
- Task ID: 42개, 중복 0건
- 누락 `depends_on`·`blocks` 참조: 0건
- dependency cycle: 0건
- T-20260731-001 `aiops validate task --strict`: 통과
- 주요 로컬 Source of Truth·CI workflow·Backend 계약 경로 존재: 확인
- `git diff --check origin/develop...HEAD`: 통과

프로젝트 전역 strict validation의 기존 operating model·agent registry·archive schema 문제는 이번 Task가 새로 만든 결함이 아니므로 판정의 단독 근거로 사용하지 않았다.

## 5. Team 인계 완전성

현재 상태로는 추가 구두 설명 없이 다음 Team이 일관된 결론을 내릴 수 없다.

- Design Team context와 Design handoff가 Figma 기준을 다르게 안내한다.
- Development Team context와 공통 Source of Truth가 Backend 계약 존재 여부를 다르게 안내한다.
- Project/Development board가 완료된 하위 Task의 재실행 여부를 다르게 안내한다.
- Product QA의 현재 Task routing은 존재하지만 Quality Team·Agent registry의 정식 역할 매핑은 없다.

따라서 T-20260728-003의 문서 선행 차단을 해제하면 안 된다.

## 6. 최종 판정

`FAIL`.

루트 Agent 안내 축소, iOS의 Core MVP/첫 공개 출시 구분, Design 로컬 원본 우선순위와 주요 Project Status 갱신은 올바른 방향이다. 그러나 활성 운영·Team context와 Task Board에 구형 기준이 남아 있어 Source of Truth 정합성과 Team 인계 완전성 성공 기준을 충족하지 못한다.

Product Lead Agent가 필수 재작업 4건을 최신 `origin/develop` 기준으로 반영한 뒤 Product QA 재검증이 필요하다.

## 7. 다음 Agent에게 전달할 말

```text
Task: T-20260731-001
현재 상태: rework_requested
검증 판정: FAIL
다음 담당: Product Lead Agent / Lead Role
필수 재작업 4건:
- Design·Development Team context, Ops Issues·Migration Plan과 공통 Source of Truth 정합화
- Project·Development·Quality board의 완료/승인 대기 중복 제거
- Product QA routing을 정식 등록하거나 T-007 선행·임시 예외를 명시
- 최신 develop의 T-20260730-004 완료 상태를 병합하고 전체 문서 재검증
QA 보고서:
- .ai_project/qa/T-20260731-001_reconcile-active-document-source-of-truth-qa.md
```
