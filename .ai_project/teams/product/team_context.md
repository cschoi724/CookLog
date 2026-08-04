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
| Lead Role | Product Lead Agent | Product Team Task의 범위, 소유권, 의존성과 실행·검증 라우팅 조율 |
| Execution Role | Product Planning Agent | PRD, 로드맵, 제품 문서 작업 |
| Completion Role | Product Lead Agent | 필수 하위 Task가 완료된 상위 제품 Task의 `done` 판단 |

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

## 6. Parent Task Completion

- Product Lead Agent는 제품 요구사항과 성공 기준을 가진 상위 제품 Task를 생성한다.
- Product Team Task는 Product Lead Agent가 `proposed -> scoped`로 조율하고 Product Owner 승인 후 Product Planning Agent에 실행을 라우팅한다.
- Product Planning Agent의 실행 결과는 Product QA Agent가 독립 검증하며 Product Lead Agent가 같은 실행의 독립 검증을 대신하지 않는다.
- Design/Development Lead는 상위 목표를 Team 하위 Task로 분해하고 Product Owner 승인 후 실행 Agent에 라우팅한다.
- 상위 제품 Task는 필수 하위 Task를 `depends_on`으로 연결한다.
- 모든 필수 하위 Task가 `done`이고 필요한 통합 검증이 통과한 경우에만 Product Lead Agent가 상위 Task를 `completion_review -> done`으로 전이한다.
- Product Lead Agent의 Lead Role은 Product Team에만 적용하며 Design·Development Team 하위 Task를 scope하거나 완료하지 않는다.
