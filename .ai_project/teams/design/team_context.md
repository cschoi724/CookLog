# Design Team Context

작성일: 2026-07-27
프로젝트: CookLog
Team: Design Team
상태: Active

## 1. Team Identity

| 항목 | 값 |
|---|---|
| Team ID | `design` |
| Parent Division | Experience Division |
| Team Pattern | design domain |
| Lead | Design Lead Agent |

## 2. Role / Agent Mapping

| Role | Agent | 책임 |
|---|---|---|
| Lead Role | Design Lead Agent | 상위 제품 목표를 Design 하위 Task로 분해하고 의존성을 조율 |
| Execution Role | UI/UX Design Agent | UX/UI, 사용자 흐름, Figma, 프로토타입, 디자인 명세 |
| Verification Role | Design QA Agent | 디자인 요구사항, 상태, 접근성, 핸드오프 독립 검증 |
| Completion Role | Design Lead Agent | 검증 통과한 Design 하위 Task만 완료 |

Product Lead Agent는 필수 Design 하위 Task가 모두 완료된 뒤 상위 제품 Task의 제품 기준 수용과 완료를 판단한다.

## 3. Ownership

| 유형 | 값 |
|---|---|
| Path | `design/`, 디자인 관련 `docs/product/` 문서 |
| Domain | user flow, interaction, visual design, handoff |
| External | Figma 원본 링크는 unresolved |

## 4. Source of Truth

| 영역 | 기준 문서 |
|---|---|
| 사용자 흐름 | `docs/product/CookLog_USER_FLOW.md` |
| 와이어프레임 | `docs/product/CookLog_WIREFRAME.md` |
| 제품 요구 | `docs/product/CookLog_PRD_v2.md` |

## 5. Board / Escalation

- Team board: `.ai_project/teams/design/task_board.md`
- Project board: `.ai_project/task_board.md`
- 구현 가능성 검토: Development Lead Agent
- 제품 범위 충돌: Product Lead Agent
- Design 하위 Task 완료: `target_agent: Design Lead Agent`, `target_role: Completion Role`
- 상위 제품 Task 완료: Product Lead Agent 전용

## 6. Completion Boundary

- Design Lead Agent는 `team: Design Team`인 하위 Task만 `completion_review -> done`으로 전이한다.
- Design QA Agent의 공식 검증 결과가 `verification_passed`인 Task만 완료 검토한다.
- 상위 제품 Task가 Design 하위 Task를 필요로 하면 상위 Task의 `depends_on`에 하위 Task ID를 연결한다.
- Design Lead Agent는 자신이 `target_agent`가 아닌 Product Team 상위 Task를 완료하지 않는다.
