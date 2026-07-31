# Core Development Team Context

작성일: 2026-07-27
프로젝트: CookLog
Team: Core Development Team
상태: Active

## 1. Team Identity

| 항목 | 값 |
|---|---|
| Team ID | `development` |
| Parent Division | Development Division |
| Team Pattern | platform workstreams |
| Lead | Development Lead Agent |

## 2. Workstreams

| Workstream | 상태 | Agent | 기본 Ownership |
|---|---|---|---|
| iOS | active, highest priority | iOS Agent | `apps/ios/` |
| Backend | active, contract foundation | Backend Agent | `apps/backend/`, 공통 API·후속 AI 계약 |
| Android | deferred | Android Agent | `apps/android/` 문서 보존 |

## 3. Role / Agent Mapping

| Role | Agent | 책임 |
|---|---|---|
| Lead Role | Development Lead Agent | 기술 계획, 의존성, 병렬 작업, merge 판단 |
| Execution Role | iOS Agent, Backend Agent | 승인된 구현과 개발자 검증 |
| Verification Role | iOS QA Agent, Backend QA Agent | 구현 세션과 분리된 도메인 검증 |
| Completion Role | Development Lead Agent | 검증 통과한 Development 하위 Task만 완료 |

Product Lead Agent는 필수 개발 하위 Task가 모두 완료된 뒤 상위 제품 Task의 제품 기준 수용과 완료를 판단한다.

## 4. Source of Truth

| 영역 | 기준 문서 |
|---|---|
| iOS 현재 상태 | `apps/ios/docs/STATUS.md` |
| iOS 계획 | `apps/ios/docs/DEVELOPMENT_PLAN.md` |
| iOS 아키텍처 | `apps/ios/docs/ARCHITECTURE.md` |
| Backend 런타임·AI provider 추천안 | `apps/backend/docs/ARCHITECTURE_DECISION.md` |
| Backend 공통 API 계약 | `apps/backend/docs/API_CONTRACT.md`, `apps/backend/contracts/common/` |
| Android 상태 | `apps/android/docs/STATUS.md` |

## 5. Coordination

- Team board: `.ai_project/teams/development/task_board.md`
- 병렬 가능 여부: Development Lead Agent가 `depends_on`, `blocks`, ownership을 확인
- Backend 계약과 Design 작업은 병렬 가능
- iOS API 연결은 T-021 공통 계약과 후속 T-023~025 계약·fixture에 의존
- Android 활성화는 Product Owner 승인 필요
- 개발 하위 Task 완료: `target_agent: Development Lead Agent`, `target_role: Completion Role`
- 상위 제품 Task 완료: Product Lead Agent 전용

## 6. Completion Boundary

- Development Lead Agent는 `team: Core Development Team`인 하위 Task만 `completion_review -> done`으로 전이한다.
- iOS Task는 iOS QA Agent, Backend/API Task는 Backend QA Agent의 `verification_passed` 결과를 확인한다.
- 상위 제품 Task가 개발 하위 Task를 필요로 하면 상위 Task의 `depends_on`에 하위 Task ID를 연결한다.
- Development Lead Agent는 자신이 `target_agent`가 아닌 Product Team 상위 Task를 완료하지 않는다.
- Design과 Backend 계약 등 선행 Task가 있으면 `depends_on`, `blocks`, `parallel_group`으로 순서를 명시한다.
