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
| Design Team | `design` | active | design domain | Design Lead Agent | `.ai_project/teams/design/team_context.md` | UX/UI와 디자인 핸드오프 |
| Core Development Team | `development` | active | platform workstreams | Development Lead Agent | `.ai_project/teams/development/team_context.md` | iOS 우선, Backend 기반 준비 |
| Quality Team | `quality` | active | shared verification pool | 별도 Lead 없음 | `.ai_project/teams/quality/team_context.md` | Task 라우팅 기반 독립 검증 |
| AI Ops Team | `ai_ops` | active | ops governance | AI Ops Agent | `.ai_project/` | 제품 Task 실행 라인 제외 |

Android Workstream은 iOS 우선 이정표 완료, Android 착수 범위 확정, 사용자 활성화 승인 후 활성화한다.

## 7. Role / Agent Mapping

| Agent | Role | Capabilities | 비고 |
|---|---|---|---|
| Product Lead Agent | Direction Role, Completion Role | product_direction, priority_management, approval_preparation, parent_task_completion | 상위 제품 Task만 완료한다. |
| Product Planning Agent | Execution Role | product_documentation, roadmap_management, task_reporting | Product Team의 승인된 문서 Task를 수행한다. |
| Design Lead Agent | Lead Role, Completion Role | design_scoping, design_dependency_management, design_child_completion | Design Team 하위 Task만 완료한다. |
| UI/UX Design Agent | Execution Role | ux_flow, ui_design, prototyping, design_handoff | 승인된 Design 하위 Task를 실행한다. |
| Development Lead Agent | Lead Role, Completion Role | technical_planning, ownership_review, dependency_management, development_child_completion, merge_coordination | Development 하위 Task만 완료한다. |
| iOS Agent | Execution Role | ios_implementation, developer_verification, task_reporting | `apps/ios/` 기본 소유 |
| Backend Agent | Execution Role | backend_architecture, api_contract, backend_implementation | Backend 경로 확정 전 foundation phase |
| Android Agent | Execution Role | android_implementation | deferred |
| Design QA Agent | Verification Role | design_qa, accessibility_review, design_handoff_review | Design 실행 세션과 분리 |
| iOS QA Agent | Verification Role | ios_qa, regression_test, design_fidelity_review | iOS 실행 세션과 분리 |
| Backend QA Agent | Verification Role | api_qa, contract_test, security_check, privacy_review | Backend 실행 세션과 분리 |
| Product QA Agent | Verification Role | product_documentation, cross_domain_reconciliation, source_of_truth_governance, independent_validation | Product 실행·완료 판단 세션과 분리 |
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

### Parent / Child Task Completion

```text
Product Lead Agent
  -> 상위 제품 Task 생성과 Team 목표 배정

Design / Development Lead Agent
  -> 상위 목표를 Team 하위 Task로 분해
  -> Product Owner 승인 후 Execution Agent에 라우팅

Execution Agent
  -> 작업 완료 후 도메인 QA Agent에 verification_ready 인계

Domain QA Agent
  -> 공식 독립 검증
  -> verification_passed 후 해당 Team Lead에 인계

Team Lead
  -> 자기 Team 하위 Task만 completion_review -> done

Product Lead Agent
  -> 필수 하위 Task가 모두 done인 상위 제품 Task만 완료
```

완료 권한은 전역 Role이 아니라 각 Task의 `team`, `target_agent`, `target_role`, `depends_on`, `blocks` 조합으로 제한한다.

- Design 하위 Task의 `completion_review` 대상은 `Design Lead Agent`다.
- Development 하위 Task의 `completion_review` 대상은 `Development Lead Agent`다.
- 상위 제품 Task의 `completion_review` 대상은 `Product Lead Agent`다.
- Team Lead는 자신이 `target_agent`가 아닌 상위 제품 Task를 전이하지 않는다.
- 상위 제품 Task는 필수 하위 Task를 `depends_on`으로 연결하고 모두 `done`일 때만 완료 검토한다.
- 단순 하위 Task 검증은 같은 Task의 Verification 상태로 처리하고, cross-team 통합 검증이 필요할 때만 별도 Quality Task를 만든다.

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
| model | `develop_integration_pr` |
| default_branch | `develop` |
| task_base_branch | `develop` |
| task_pr_target | `develop` |
| stable_branch | `main` |
| promotion_flow | `develop -> main` |
| task_branch_pattern | `task/<task-id>-<slug>` |
| hotfix_branch_pattern | `hotfix/<task-id>-<slug>` |
| commit_owner | Execution Role |
| push_allowed | 사용자 승인 후 |
| pr_required | 코드, 설정, 디자인 산출물, 추적 문서 모두 필수 |
| pr_reviewer | Verification Role |
| initial_required_check | `ios-build` |
| pending_required_check | `ios-xctest` (`T-20260728-004`, `T-20260728-008` 이후 승격) |
| task_merge_owner | Development Lead Agent가 판단하고 사용자가 승인 |
| main_promotion_owner | Product Lead Agent가 수용 판단하고 사용자가 승인 |
| direct_push | `main`, `develop` 모두 금지 |
| hotfix_backport | `main` 병합 후 `develop`에 필수 역반영 |
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
| Backend 런타임·AI provider 추천안 | `apps/backend/docs/ARCHITECTURE_DECISION.md` |
| Backend 공통 API 계약 | `apps/backend/docs/API_CONTRACT.md`, `apps/backend/contracts/common/` |
| 기본 비활성 원격 STT adapter 계약 | `apps/backend/docs/REMOTE_STT_ADAPTER.md`, `apps/backend/contracts/stt/` |
| UI/UX 원본 | `design/prototype/`, `design/figma-build/manifest.json` |
| Figma 미러 | [CookLog — MVP UI/UX v1](https://www.figma.com/design/tAvYn6TatLKb3SXDjkH1hn) |

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
| Branch / PR 전략 | `develop_integration_pr` | Product Owner | 2026-07-28 |
| Knowledge | `full` | Product Owner | 2026-07-27 |

## 14. Open Configuration Questions

| 질문 | 상태 | 결정 필요 시점 |
|---|---|---|
| Figma 원본 링크 | resolved, 로컬 Prototype 원본·Figma 미러 | - |
| Backend runtime·AI provider | T-020 추천안 완료, Product Owner 최종 선택 대기 | 실제 provider 계약·배포 전 |
| Backend 공통 API 계약 | T-021 산출물·QA develop 통합과 완료 확정 | 후속 T-022~025 실행 전 |
| 기본 비활성 원격 STT adapter 계약 | T-022 QA 재검증 통과·`completion_review` | develop PR 통합·완료 확정 전 |
| CI 구성과 필수 check | T-001~004 완료, branch protection 적용 대기 | T-005~006 검증·승인 후 |
| Android Workstream 활성화 | deferred | iOS 우선 이정표 완료 후 |
| Release Role 활성화 | inactive | TestFlight 또는 운영 배포 준비 전 |
| 루트·플랫폼 안내 문서 정합성 | T-20260731-001 잔여 결함 수정·Product QA 재재검증 대기 | Product QA 판정 후 |
| `docs/GIT_WORKFLOW.md`와 새 전략 동기화 | resolved by `T-20260728-007` | - |

## 15. 변경 이력

| 날짜 | 변경 내용 |
|---|---|
| 2026-07-27 | Guided Full Discovery 결정과 core 0.6.4 마이그레이션 기준으로 운영 모델 생성 |
| 2026-07-28 | Design Lead/Execution 분리와 Team 하위 Task/제품 상위 Task 완료 권한 범위 추가 |
| 2026-07-28 | 일반 Task는 `develop`, 안정·릴리즈 승격은 `main`을 사용하는 통합 브랜치 운영으로 전환 |
| 2026-07-28 | `T-20260728-007` 승인 기준으로 Task branch·PR·초기 CI check와 merge gate 확정 |
| 2026-07-31 | T-20260731-001에서 UI/UX 원본, Backend 추천안·계약 경계와 CI 현재 상태를 최신화 |
| 2026-07-31 | T-20260731-001 재작업에서 Product QA Agent를 정식 등록하고 T-004 done 상태 반영 |
