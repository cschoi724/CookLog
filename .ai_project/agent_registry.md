# CookLog Project Agent Registry

작성일: 2026-07-01
최종 업데이트: 2026-07-27
프로젝트: CookLog

## 1. 목적

이 문서는 CookLog에서 실제로 활성화된 Agent 구성을 기록합니다.

사용 가능한 Agent와 기본 역할 정의는 `.ai/models/agent_registry.md`, `.ai/models/role_model.md`, `.ai/models/capabilities.md`를 따릅니다.

프로젝트별 실제 구성은 `.ai_project/operating_model.md`를 기준으로 합니다.

## 2. Active Agents

| Agent | 상태 | Team | 기본 Role | 비고 |
|---|---|---|---|---|
| Product Lead Agent | `enabled` | Product Team | Direction Role, Completion Role | 제품 방향, 우선순위, 완료 판단 |
| Product Planning Agent | `enabled` | Product Team | Execution Role | 승인된 제품 문서 Task 수행 |
| Design Agent | `enabled` | Design Team | Lead Role, Execution Role | UX/UI와 개발 핸드오프 |
| Development Lead Agent | `enabled` | Core Development Team | Lead Role | 기술 계획, 의존성, 병렬 작업, merge 판단 |
| iOS Agent | `enabled` | Core Development Team | Execution Role | iOS 최우선 구현 |
| Backend Agent | `enabled` | Core Development Team | Execution Role | Backend foundation과 API 계약 |
| Android Agent | `deferred` | Core Development Team | Execution Role | 사용자 활성화 승인 전 실행하지 않음 |
| QA Agent | `enabled` | Quality Team | Verification Role | 구현 세션과 분리된 독립 검증 |
| AI Ops Agent | `enabled` | AI Ops Team | Ops Governance Role | 제품 Task 실행 라인 제외 |

## 3. Delegated Capabilities

| Capability | 현재 담당 | 비고 |
|---|---|---|
| `product_direction` | Product Lead Agent | 제품 목표와 성공 기준 |
| `priority_management` | Product Lead Agent | Product Owner 승인 준비 |
| `completion_review` | Product Lead Agent | 검증 결과 수용과 완료 판단 |
| `product_documentation` | Product Planning Agent | PRD, 로드맵, 상태 문서 Task |
| `ux_flow`, `ui_design` | Design Agent | 디자인 원본과 핸드오프 |
| `technical_planning` | Development Lead Agent | 기술 범위와 작업 분해 |
| `dependency_management` | Development Lead Agent | cross-team/플랫폼 의존성 |
| `merge_coordination` | Development Lead Agent | 사용자 merge 승인 전 판단 |
| `ios_implementation` | iOS Agent | `apps/ios/` |
| `backend_architecture`, `api_contract` | Backend Agent | Backend 경로 확정 전 foundation |
| `android_implementation` | Android Agent | deferred |
| `developer_verification` | 각 Execution Agent | 최종 PASS 판정 아님 |
| `qa_review`, `pr_review`, `test_execution` | QA Agent | 독립 검증 |
| `risk_review`, `security_check` | QA Agent | 개인정보·권한·운영 위험 포함 |
| `rework_request` | QA Agent | Lead Role 재조율 요청 |
| `ops_audit`, `process_governance` | AI Ops Agent | 제품 실행 흐름 밖에서 점검 |
| `workflow_governance`, `ops_migration` | AI Ops Agent | core 0.6.4 운영 기준 |

## 4. Agent 변경 기록

| 날짜 | 변경 내용 | 승인 |
|---|---|---|
| 2026-07-01 | PM/Development/QA 기본 실행 Agent 활성화 | Product Owner 요청 기반 |
| 2026-07-01 | AI Ops Agent를 독립 운영 점검 Agent로 활성화 | Product Owner 요청 기반 |
| 2026-07-27 | Product/Design/Core Development/Quality/AI Ops 멀티팀 Role 매핑으로 확장 | Product Owner 승인 |
