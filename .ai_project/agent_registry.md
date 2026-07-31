# CookLog Project Agent Registry

작성일: 2026-07-01
최종 업데이트: 2026-07-31
프로젝트: CookLog

## 1. 목적

이 문서는 CookLog에서 실제로 활성화된 Agent 구성을 기록합니다.

사용 가능한 Agent와 기본 역할 정의는 `.ai/models/agent_registry.md`, `.ai/models/role_model.md`, `.ai/models/capabilities.md`를 따릅니다.

프로젝트별 실제 구성은 `.ai_project/operating_model.md`를 기준으로 합니다.

## 2. Active Agents

| Agent | 상태 | Team | 기본 Role | 비고 |
|---|---|---|---|---|
| Product Lead Agent | `enabled` | Product Team | Direction Role, Completion Role | 상위 제품 Task 방향과 완료 판단 |
| Product Planning Agent | `enabled` | Product Team | Execution Role | 승인된 제품 문서 Task 수행 |
| Design Lead Agent | `enabled` | Design Team | Lead Role, Completion Role | Design 하위 Task 분해와 완료 판단 |
| UI/UX Design Agent | `enabled` | Design Team | Execution Role | UX/UI, Figma, 프로토타입, 핸드오프 |
| Development Lead Agent | `enabled` | Core Development Team | Lead Role, Completion Role | 개발 하위 Task 분해와 완료 판단 |
| iOS Agent | `enabled` | Core Development Team | Execution Role | iOS 최우선 구현 |
| Backend Agent | `enabled` | Core Development Team | Execution Role | Backend foundation과 API 계약 |
| Android Agent | `deferred` | Core Development Team | Execution Role | 사용자 활성화 승인 전 실행하지 않음 |
| Design QA Agent | `enabled` | Quality Team | Verification Role | 디자인 Task 독립 검증 |
| iOS QA Agent | `enabled` | Quality Team | Verification Role | iOS Task 독립 검증 |
| Backend QA Agent | `enabled` | Quality Team | Verification Role | Backend/API Task 독립 검증 |
| Product QA Agent | `enabled` | Quality Team | Verification Role | 제품 정책·문서·출시 기준과 cross-domain 인계 독립 검증 |
| AI Ops Agent | `enabled` | AI Ops Team | Ops Governance Role | 제품 Task 실행 라인 제외 |

## 3. Delegated Capabilities

| Capability | 현재 담당 | 비고 |
|---|---|---|
| `product_direction` | Product Lead Agent | 제품 목표와 성공 기준 |
| `priority_management` | Product Lead Agent | Product Owner 승인 준비 |
| `parent_task_completion` | Product Lead Agent | 필수 하위 Task가 완료된 상위 제품 Task만 완료 |
| `product_documentation` | Product Planning Agent | PRD, 로드맵, 상태 문서 Task |
| `design_scoping`, `design_dependency_management` | Design Lead Agent | Design 하위 Task 분해와 조율 |
| `design_child_completion` | Design Lead Agent | 검증 통과한 Design 하위 Task만 완료 |
| `ux_flow`, `ui_design`, `design_handoff` | UI/UX Design Agent | 디자인 원본과 핸드오프 |
| `technical_planning` | Development Lead Agent | 기술 범위와 작업 분해 |
| `dependency_management` | Development Lead Agent | cross-team/플랫폼 의존성 |
| `development_child_completion` | Development Lead Agent | 검증 통과한 개발 하위 Task만 완료 |
| `merge_coordination` | Development Lead Agent | 사용자 merge 승인 전 판단 |
| `ios_implementation` | iOS Agent | `apps/ios/` |
| `backend_architecture`, `api_contract` | Backend Agent | Backend 경로 확정 전 foundation |
| `android_implementation` | Android Agent | deferred |
| `developer_verification` | 각 Execution Agent | 최종 PASS 판정 아님 |
| `design_qa`, `accessibility_review` | Design QA Agent | 디자인 요구·상태·접근성 검증 |
| `ios_qa`, `regression_test`, `design_fidelity_review` | iOS QA Agent | iOS 기능·회귀·디자인 정합성 검증 |
| `api_qa`, `contract_test`, `security_check` | Backend QA Agent | API 계약·보안·개인정보 검증 |
| `product_documentation`, `cross_domain_reconciliation`, `source_of_truth_governance`, `independent_validation` | Product QA Agent | 제품 문서·운영 문서 정합성과 독립 출시 기준 검증 |
| `rework_request` | 각 Verification Agent | 담당 Team Lead에 재조율 요청 |
| `ops_audit`, `process_governance` | AI Ops Agent | 제품 실행 흐름 밖에서 점검 |
| `workflow_governance`, `ops_migration` | AI Ops Agent | core 0.6.4 운영 기준 |

## 4. Agent 변경 기록

| 날짜 | 변경 내용 | 승인 |
|---|---|---|
| 2026-07-01 | PM/Development/QA 기본 실행 Agent 활성화 | Product Owner 요청 기반 |
| 2026-07-01 | AI Ops Agent를 독립 운영 점검 Agent로 활성화 | Product Owner 요청 기반 |
| 2026-07-27 | Product/Design/Core Development/Quality/AI Ops 멀티팀 Role 매핑으로 확장 | Product Owner 승인 |
| 2026-07-28 | Design Lead/Execution과 도메인 QA를 분리하고 Team 하위 Task Completion 범위 추가 | Product Owner 승인 |
| 2026-07-31 | Product QA Agent와 제품 문서·cross-domain 정합성 독립 검증 capability 등록 | T-20260731-001 재작업 승인 |
