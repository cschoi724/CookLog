# Quality Team Context

작성일: 2026-07-27
프로젝트: CookLog
Team: Quality Team
상태: Active

## 1. Team Identity

| 항목 | 값 |
|---|---|
| Team ID | `quality` |
| Parent Division | Quality Division |
| Team Pattern | shared verification pool |
| Lead | 별도 QA Lead Agent 없음 |
| Queue Priority | Product Lead Agent |
| Routing | 각 Task의 `target_agent`, `target_role`, `required_capabilities` |

## 2. Role / Agent Mapping

| Role | Agent | 책임 |
|---|---|---|
| Verification Role | Design QA Agent | 디자인 요구사항, 상태, 접근성, 핸드오프 검증 |
| Verification Role | iOS QA Agent | 기능, 회귀, 디자인 구현 정합성 검증 |
| Verification Role | Backend QA Agent | API 계약, 오류, 보안, 개인정보 검증 |
| Verification Role | Product QA Agent | 제품 정책·문서·출시 기준, Source of Truth와 cross-domain 인계 검증 |

같은 세션이 구현과 독립 검증을 연속 수행하지 않는다.

Quality Team은 공식 검증만 담당하고 하위 Task 또는 상위 제품 Task를 `done`으로 전환하지 않는다.

## 3. Ownership

| 유형 | 값 |
|---|---|
| Path | `.ai_project/qa/`, 검증 관련 보고서 |
| Domain | product documentation, cross-domain reconciliation, functional QA, regression, risk, security, privacy, PR review |
| Document | 플랫폼별 TESTING/QA 문서와 Task 검증 기준 |

## 4. Source of Truth

| 영역 | 기준 문서 |
|---|---|
| iOS 테스트 | `apps/ios/docs/TESTING.md` |
| iOS 수동 QA | `apps/ios/docs/MANUAL_QA_CHECKLIST.md` |
| 제품 성공 기준 | `docs/product/CookLog_PRD_v2.md` |
| 제품 범위·출시 기준 | `docs/product/CookLog_MVP_SCOPE.md`, `docs/product/CookLog_ROADMAP.md` |
| 문서·Task 현재 상태 | `.ai_project/source_of_truth.md`, `.ai_project/task_board.md`, 개별 Task 파일 |

## 5. Board / Escalation

- Team board: `.ai_project/teams/quality/task_board.md`
- 검증 우선순위 충돌: Product Lead Agent가 제품 우선순위만 조정
- 검증 범위: Design/Development Lead가 각 하위 Task에 기록
- 검증 실패: 해당 Team Lead에 `rework_requested`
- 외부 차단: `blocked`
- Design 검증 통과: Design Lead Agent에게 `verification_passed` 인계
- iOS/Backend 검증 통과: Development Lead Agent에게 `verification_passed` 인계
- cross-team 통합 검증 통과: Product Lead Agent에게 인계
- 제품 문서·출시 기준 검증 통과: Product Lead Agent에게 `verification_passed` 인계

## 6. Parallel Verification

- 서로 다른 `verification_ready` Task는 Product/Design/iOS/Backend QA Agent 세션에서 병렬 검증할 수 있다.
- 각 QA 세션은 하나의 Task만 lock하고 별도 QA report를 작성한다.
- QA Lead 전용 세션은 활성화하지 않는다.
- 공용 환경 충돌, 검증 Queue 병목, release gate 조율이 반복될 때만 QA Lead 활성화를 재검토한다.
