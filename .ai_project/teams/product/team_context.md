# Product Team Context

작성일: 2026-07-27
프로젝트: CookLog
Team: Product Team
상태: Active

## 1. Team Identity

| 항목 | 값 |
|---|---|
| Team ID | `product` |
| Parent Division | Product Division |
| Team Pattern | product direction |
| Lead | Product Lead Agent |

## 2. Role / Agent Mapping

| Role | Agent | 책임 |
|---|---|---|
| Direction Role | Product Lead Agent | 제품 목표, 우선순위, 성공 기준, 승인 준비 |
| Execution Role | Product Planning Agent | PRD, 로드맵, 제품 문서 작업 |
| Completion Role | Product Lead Agent | 검증 결과 수용과 `done` 판단 |

## 3. Ownership

| 유형 | 값 |
|---|---|
| Path | `docs/product/`, `docs/PROJECT_STATUS.md`, `docs/PROJECT_DECISIONS.md`, `docs/PROJECT_CHANGELOG.md` |
| Domain | product direction, requirements, roadmap, priority |
| Document | PRD, MVP Scope, Product Roadmap |

## 4. Source of Truth

| 영역 | 기준 문서 |
|---|---|
| 요구사항 | `docs/product/CookLog_PRD_v2.md` |
| 범위 | `docs/product/CookLog_MVP_SCOPE.md` |
| 로드맵 | `docs/product/CookLog_ROADMAP.md` |
| 현재 상태 | `docs/PROJECT_STATUS.md` |

## 5. Board / Escalation

- Team board: `.ai_project/teams/product/task_board.md`
- Project board: `.ai_project/task_board.md`
- 우선순위 충돌: Product Lead Agent가 정리하고 Product Owner에게 요청
- 기술 범위 충돌: Development Lead Agent에게 인계
