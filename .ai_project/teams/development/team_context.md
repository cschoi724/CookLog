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
| Backend | active, foundation phase | Backend Agent | 경로·API 계약 생성 후보 |
| Android | deferred | Android Agent | `apps/android/` 문서 보존 |

## 3. Role / Agent Mapping

| Role | Agent | 책임 |
|---|---|---|
| Lead Role | Development Lead Agent | 기술 계획, 의존성, 병렬 작업, merge 판단 |
| Execution Role | iOS Agent, Backend Agent | 승인된 구현과 개발자 검증 |
| Verification Role | QA Agent | 구현 세션과 분리된 검증 |
| Completion Role | Product Lead Agent | 제품 기준 완료 판단 |

## 4. Source of Truth

| 영역 | 기준 문서 |
|---|---|
| iOS 현재 상태 | `apps/ios/docs/STATUS.md` |
| iOS 계획 | `apps/ios/docs/DEVELOPMENT_PLAN.md` |
| iOS 아키텍처 | `apps/ios/docs/ARCHITECTURE.md` |
| Backend 아키텍처/API | unresolved, 생성 후보 |
| Android 상태 | `apps/android/docs/STATUS.md` |

## 5. Coordination

- Team board: `.ai_project/teams/development/task_board.md`
- 병렬 가능 여부: Development Lead Agent가 `depends_on`, `blocks`, ownership을 확인
- Backend 계약과 Design 작업은 병렬 가능
- iOS API 연결은 승인된 Backend API 계약에 의존
- Android 활성화는 Product Owner 승인 필요
