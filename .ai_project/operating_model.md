# CookLog Project Operating Model

작성일: 2026-07-27
프로젝트: CookLog
상태: Active

## 1. 목적

이 문서는 CookLog에서 실제로 선택한 AI Agent 운영 구성을 기록한다.

일반 정책은 `.ai/`의 헌법과 모델 문서를 따르고, 이 문서는 CookLog의 활성 Team, Role, workflow, ownership, board, branch/PR, Knowledge 선택값을 기록한다.

## 2. General Policy References

| 영역 | 일반 정책 |
|---|---|
| 헌법 | `.ai/core/constitution.md` |
| 조직 모델 | `.ai/models/org_model.md` |
| Team 모델 | `.ai/models/team_model.md` |
| Role 모델 | `.ai/models/role_model.md` |
| Ownership | `.ai/policies/ownership_model.md` |
| Coordination | `.ai/policies/coordination_policy.md` |
| Board | `.ai/policies/board_model.md` |
| Branch / PR | `.ai/policies/branch_pr_policy.md` |
| Task Queue | `.ai/runtime/task_queue.md` |
| Versioning | `.ai/policies/versioning_policy.md` |

## 3. Start Context

| 항목 | 선택값 |
|---|---|
| core_version | 0.6.4 |
| core_source | homebrew |
| core_update_policy | migration plan 확인 후 사용자 승인 적용 |
| bootstrap_mode | `guided_full` |
| knowledge_mode | `full` |
| start_context | `custom_start_context` |
| primary_context | `scale_up_existing_ops` |
| secondary_context | `migration_or_modernization` |
| product_readiness | `implementation_ready` |
| operations_readiness | `migration_required` |
| design_readiness | 기존 기반 보존 후 확장 |
| start_context_summary | 기존 CookLog 제품과 AI 운영 기록을 보존하면서 제품·디자인·개발·검증을 멀티팀 운영으로 확장한다. |

## 4. Selected Operating Mode

| 항목 | 선택값 |
|---|---|
| operating_mode | `multi_team` |
| description | Product, Design, Core Development, Quality, AI Ops 책임을 분리하고 Development Lead가 플랫폼 작업의 병렬성과 의존성을 조율한다. |

## 5. Organization / Team Configuration

```text
CookLog Organization
  Product Division
    Product Team
  Experience Division
    Design Team
  Development Division
    Core Development Team
      iOS Workstream (active, highest priority)
      Backend Workstream (active, foundation phase)
      Android Workstream (deferred)
  Quality Division
    Quality Team
  AI Ops Division
    AI Ops Team
```

## 6. Active Teams

| Team | Team ID | 상태 | Pattern | Lead | Team Context | 비고 |
|---|---|---|---|---|---|---|
| Product Team | `product` | active | product direction | Product Lead Agent | `.ai_project/teams/product/team_context.md` | 제품 방향과 완료 판단 |
| Design Team | `design` | active | design domain | Design Agent | `.ai_project/teams/design/team_context.md` | UX/UI와 디자인 핸드오프 |
| Core Development Team | `development` | active | platform workstreams | Development Lead Agent | `.ai_project/teams/development/team_context.md` | iOS 우선, Backend 기반 준비 |
| Quality Team | `quality` | active | shared verification | QA Agent | `.ai_project/teams/quality/team_context.md` | 독립 검증 |
| AI Ops Team | `ai_ops` | active | ops governance | AI Ops Agent | `.ai_project/` | 제품 Task 실행 라인 제외 |

Android Workstream은 iOS 우선 이정표 완료, Android 착수 범위 확정, 사용자 활성화 승인 후 활성화한다.

## 7. Role / Agent Mapping

| Agent | Role | Capabilities | 비고 |
|---|---|---|---|
| Product Lead Agent | Direction Role, Completion Role | product_direction, priority_management, approval_preparation, completion_review | Product Owner 승인을 준비한다. |
| Product Planning Agent | Execution Role | product_documentation, roadmap_management, task_reporting | Product Team의 승인된 문서 Task를 수행한다. |
| Design Agent | Lead Role, Execution Role | ux_flow, ui_design, design_handoff, design_review | Design Team 내부 범위 |
| Development Lead Agent | Lead Role | technical_planning, ownership_review, dependency_management, merge_coordination | iOS/Backend/Android 조율 |
| iOS Agent | Execution Role | ios_implementation, developer_verification, task_reporting | `apps/ios/` 기본 소유 |
| Backend Agent | Execution Role | backend_architecture, api_contract, backend_implementation | Backend 경로 확정 전 foundation phase |
| Android Agent | Execution Role | android_implementation | deferred |
| QA Agent | Verification Role | qa_review, pr_review, test_execution, risk_review, security_check | 구현 세션과 분리 |
| AI Ops Agent | Ops Governance Role | process_governance, workflow_governance, ops_migration | 제품 Task 상태와 QA 판정을 변경하지 않는다. |

Product Owner는 사용자이며 Task 실행 승인, push, merge, 배포 승인 권한을 유지한다.

## 8. Workflow / State Configuration

| 항목 | 선택값 |
|---|---|
| state_model | `standard_vnext` |
| scoped_required | `yes` |
| workflow_overrides | `.ai_project/workflow_overrides.md` |

```text
proposed
-> scoped
-> approved
-> in_progress
-> verification_ready
-> verification_in_progress
-> verification_passed
-> completion_review
-> done
```

예외 상태는 `blocked`, `rework_requested`, `cancelled`를 사용한다.

## 9. Ownership / Coordination Configuration

| 항목 | 선택값 |
|---|---|
| ownership_model | `path_plus_domain` |
| coordination_policy | `lead_coordinated_parallel` |
| parallel_work_allowed | `yes` |
| parallel_decision_owner | Development Lead Agent |
| priority_conflict_owner | Product Lead Agent |
| blocked_resolution_owner | 현재 Lead Role |

경로가 겹치지 않아도 제품, 디자인, API 계약 의존성이 있으면 Task의 `depends_on`, `blocks`, `parallel_group`을 확인한다.

## 10. Board Configuration

| 항목 | 선택값 |
|---|---|
| board_model | `project_plus_team_board` |
| project_board | `.ai_project/task_board.md` |
| Product Team board | `.ai_project/teams/product/task_board.md` |
| Design Team board | `.ai_project/teams/design/task_board.md` |
| Core Development Team board | `.ai_project/teams/development/task_board.md` |
| Quality Team board | `.ai_project/teams/quality/task_board.md` |
| AI Ops tracking | `.ai_project/ops_issues.md`, `.ai_project/ops_decisions.md` |

Board는 요약판이며 실제 실행 지시는 개별 Task 파일이 기준이다.

## 11. Branch / PR Configuration

| 항목 | 선택값 |
|---|---|
| branch_pr_strategy | `.ai_project/branch_pr_strategy.md` |
| model | `feature_branch_pr` |
| base_branch | `main` |
| task_branch_pattern | `task/<task-id>-<slug>` |
| commit_owner | Execution Role |
| push_allowed | 사용자 승인 후 |
| pr_reviewer | Verification Role |
| merge_owner | Development Lead Agent가 판단하고 사용자가 승인 |
| team_override_allowed | 사용자 승인 후 |

## 12. Source of Truth

| 영역 | 기준 문서 |
|---|---|
| 제품 요구사항 | `docs/product/CookLog_PRD_v2.md` |
| MVP 범위 | `docs/product/CookLog_MVP_SCOPE.md` |
| 전체 현재 상태 | `docs/PROJECT_STATUS.md` |
| 제품 계획 | `docs/product/CookLog_ROADMAP.md` |
| 디자인 | `docs/product/CookLog_USER_FLOW.md`, `docs/product/CookLog_WIREFRAME.md` |
| iOS 구현 계획 | `apps/ios/docs/DEVELOPMENT_PLAN.md` |
| iOS 아키텍처 | `apps/ios/docs/ARCHITECTURE.md` |
| 테스트/QA | `apps/ios/docs/TESTING.md`, `apps/ios/docs/MANUAL_QA_CHECKLIST.md` |
| 공통 결정 | `docs/PROJECT_DECISIONS.md` |
| 변경 이력 | `docs/PROJECT_CHANGELOG.md` |
| Backend 아키텍처/API | `unresolved`, 생성 후보 |
| Figma 원본 | `unresolved`, 링크 등록 후보 |

세부 기준은 `.ai_project/source_of_truth.md`를 따른다.

## 13. Bootstrap Decisions

| 항목 | 선택값 | 결정자 | 날짜 |
|---|---|---|---|
| Start Context | 운영 확장 + 마이그레이션 | Product Owner | 2026-07-27 |
| Readiness | 제품 구현 가능, 운영 마이그레이션 필요 | Product Owner | 2026-07-27 |
| 운영 모드 | `multi_team` | Product Owner | 2026-07-27 |
| Team 구성 | Product, Design, Core Development, Quality, AI Ops | Product Owner | 2026-07-27 |
| Workflow | `standard_vnext` | Product Owner | 2026-07-27 |
| Ownership / Coordination | `path_plus_domain`, `lead_coordinated_parallel` | Product Owner | 2026-07-27 |
| Board 모델 | `project_plus_team_board` | Product Owner | 2026-07-27 |
| Branch / PR 전략 | `feature_branch_pr` | Product Owner | 2026-07-27 |
| Knowledge | `full` | Product Owner | 2026-07-27 |

## 14. Open Configuration Questions

| 질문 | 상태 | 결정 필요 시점 |
|---|---|---|
| Figma 원본 링크 | unresolved | Design Team 첫 실행 전 |
| Backend 코드 경로와 API 계약 문서 | to_create_candidate | Backend 구현 Task 승인 전 |
| CI 구성과 필수 check | unresolved | 첫 코드 PR merge 전 |
| Android Workstream 활성화 | deferred | iOS 우선 이정표 완료 후 |
| Release Role 활성화 | inactive | TestFlight 또는 운영 배포 준비 전 |
| 기존 `agents.md`와 adapter 지침 병합 | needs_user_decision | 후속 운영 Task |
| `docs/GIT_WORKFLOW.md`와 새 전략 동기화 | needs_user_decision | 후속 문서 Task |

## 15. 변경 이력

| 날짜 | 변경 내용 |
|---|---|
| 2026-07-27 | Guided Full Discovery 결정과 core 0.6.4 마이그레이션 기준으로 운영 모델 생성 |
