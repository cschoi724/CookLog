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
| Team Pattern | shared verification |
| Lead | QA Agent |

## 2. Role / Agent Mapping

| Role | Agent | 책임 |
|---|---|---|
| Lead Role | QA Agent | 검증 범위와 우선순위 조율 |
| Verification Role | QA Agent | PASS, PASS_WITH_RISK, FAIL, BLOCKED 판정 |
| Completion Role | Product Lead Agent | 검증 결과 수용과 완료 판단 |

같은 세션이 구현과 독립 검증을 연속 수행하지 않는다.

## 3. Ownership

| 유형 | 값 |
|---|---|
| Path | `.ai_project/qa/`, 검증 관련 보고서 |
| Domain | functional QA, regression, risk, security, privacy, PR review |
| Document | 플랫폼별 TESTING/QA 문서와 Task 검증 기준 |

## 4. Source of Truth

| 영역 | 기준 문서 |
|---|---|
| iOS 테스트 | `apps/ios/docs/TESTING.md` |
| iOS 수동 QA | `apps/ios/docs/MANUAL_QA_CHECKLIST.md` |
| 제품 성공 기준 | `docs/product/CookLog_PRD_v2.md` |

## 5. Board / Escalation

- Team board: `.ai_project/teams/quality/task_board.md`
- 검증 실패: Lead Role에 `rework_requested`
- 외부 차단: `blocked`
- 완료 판단: Product Lead Agent에게 인계
