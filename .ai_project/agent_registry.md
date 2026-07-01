# CookLog Project Agent Registry

작성일: 2026-07-01  
프로젝트: CookLog

## 1. 목적

이 문서는 CookLog에서 실제로 활성화된 Agent 구성을 기록합니다.

사용 가능한 Agent와 기본 역할 정의는 `.ai/agent_registry.md`와 `.ai/agents/`를 따릅니다.

## 2. Active Agents

| Agent | 상태 | 역할 문서 | 비고 |
|---|---|---|---|
| PM Agent | `enabled` | `.ai/agents/pm_agent.md` | 제품/일정 영향, Task 생성과 승인 관리 |
| Development Agent | `enabled` | `.ai/agents/development_agent.md` | 승인된 구현 Task 수행 |
| QA Agent | `enabled` | `.ai/agents/qa_agent.md` | 검증, 리스크, 재작업 요청 |
| AI Ops Agent | `enabled` | `.ai/agents/ai_ops_agent.md` | 독립 운영 프로세스 점검, 제품 Task 실행 라인 제외 |

## 3. Delegated Capabilities

| Capability | 현재 담당 | 비고 |
|---|---|---|
| `planning` | PM Agent | 제품/일정 관점 작업 정의 |
| `task_routing` | PM Agent | Task 담당 Agent 지정 |
| `task_queue_management` | PM Agent | `.ai_project/tasks/` 관리 |
| `approval_management` | PM Agent | 사용자 승인 기록 |
| `documentation` | PM Agent | 제품/운영 문서 정리, 후속 분리 가능 |
| `release_planning` | PM Agent | 후속 분리 가능 |
| `technical_review` | PM Agent | 필요 시 Development Agent 검토 연결 |
| `implementation` | Development Agent | 앱 코드와 개발 문서 변경 |
| `developer_verification` | Development Agent | 빌드/테스트/개발 검증 |
| `dev_reporting` | Development Agent | `.ai_project/reports/` 보고 |
| `qa_review` | QA Agent | QA 검증 |
| `risk_review` | QA Agent | 위험도 검토 |
| `security_check` | QA Agent | 개인정보/로그/권한 관점 |
| `release_check` | QA Agent | 릴리즈 전 검증 |
| `rework_request` | QA Agent | 재작업 요청 |
| `ops_audit` | AI Ops Agent | 운영 문서와 실제 운영 상태 충돌 점검 |
| `process_governance` | AI Ops Agent | Task Queue, 승인, lock, report, QA 흐름 점검 |
| `agent_boundary_review` | AI Ops Agent | Agent 역할/권한 경계 점검 |
| `ops_migration` | AI Ops Agent | AI Agent 운영 체계 도입 |

## 4. Agent 변경 기록

| 날짜 | 변경 내용 | 승인 |
|---|---|---|
| 2026-07-01 | PM/Development/QA 기본 실행 Agent 활성화 | Product Owner 요청 기반 |
| 2026-07-01 | AI Ops Agent를 독립 운영 점검 Agent로 활성화 | Product Owner 요청 기반 |
