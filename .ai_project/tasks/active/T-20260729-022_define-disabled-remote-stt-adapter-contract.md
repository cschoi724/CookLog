---
schema: aiops.task.v1
id: T-20260729-022
title: 기본 비활성 원격 STT adapter 계약 정의
status: done
type: docs
priority: P1
priority_reason: 첫 출시 기본 경로를 바꾸지 않고 향후 원격 STT 교체 경계를 보존해야 한다.
org_unit: Development Division
team: Core Development Team
team_lead: Development Lead Agent
workflow: docs
target_agent:
target_role:
required_capabilities:
- backend_architecture
- api_contract
depends_on:
- T-20260729-021
- T-20260729-026
blocks:
- T-20260728-005
- T-20260729-025
parallel_group: backend-contract-foundation
allowed_paths:
- apps/backend/contracts/stt/
- apps/backend/docs/REMOTE_STT_ADAPTER.md
- ".ai_project/tasks/backlog/T-20260729-022_define-disabled-remote-stt-adapter-contract.md"
- ".ai_project/tasks/active/T-20260729-022_define-disabled-remote-stt-adapter-contract.md"
- ".ai_project/reports/T-20260729-022_define-disabled-remote-stt-adapter-contract-report.md"
- ".ai_project/qa/T-20260729-022_define-disabled-remote-stt-adapter-contract-qa.md"
- ".ai_project/teams/development/task_board.md"
- ".ai_project/teams/quality/task_board.md"
source_of_truth:
- docs/product/CookLog_PRD_v2.md
- docs/PROJECT_DECISIONS.md
created_by: Development Lead Agent
approved_by: Product Owner
locked_by:
locked_at:
lock_session:
lock_timeout_minutes: 240
created_at: 2026-07-30
updated_at: '2026-07-31'
report_to: ".ai_project/reports/T-20260729-022_define-disabled-remote-stt-adapter-contract-report.md"
qa_to: ".ai_project/qa/T-20260729-022_define-disabled-remote-stt-adapter-contract-qa.md"
---

# 기본 비활성 원격 STT adapter 계약 정의

## 범위

- 향후 활성화 시 사용할 업로드·변환 요청·응답·오류 계약
- 활성화된 경우에만 적용하는 음성 즉시 삭제와 최대 1시간 TTL
- 기본 비활성 설정, 무승인 업로드 금지와 자동 fallback 금지
- Apple 기기 내 STT와 교체 가능한 iOS service 경계

## 제외·검증 기준

- endpoint 구현, provider SDK, secret과 배포는 제외한다.
- Backend QA Agent가 기본 상태에서 원격 호출이 불가능한 계약인지 검증한다.

## 실행 결과

- 첫 출시 강제 비활성 release config schema와 fixture를 작성했다.
- 향후 승인된 provider 중립 request/result/deletion receipt schema를 작성했다.
- 제품·비용·개인정보·provider·QA 승인과 사용자 one-time grant를 body read 전
  필수 gate로 고정했다.
- Apple 기기 내 STT 실패·미지원·네트워크 복구가 원격 fallback을 만들지 않도록
  iOS service resolver 경계를 정의했다.
- 향후 활성 원격 adapter의 복구 가능 오류는 같은 request·provider에서 최대 1회만
  재처리하고 provider 전환·새 upload·삭제 deadline 연장을 금지했다.
- 음성 terminal 상태 즉시 삭제, 최초 접수 후 최대 1시간 deadline, cleanup retry의
  콘텐츠 복제 금지와 로그·오류·receipt 비노출을 정의했다.
- `validate-contracts.sh`로 비활성 profile, negative gate, 삭제 시간 순서와 공통 오류
  code 연결을 자체 검증했다.
- QA-HIGH-022-001 재작업으로 `UPSTREAM_UNAVAILABLE`만 동일 request에서 최대 1회
  재처리하고 `UPSTREAM_TIMEOUT`은 첫 발생에 terminal·삭제하도록 통일했다.
- QA-HIGH-022-002 재작업으로 body read 전 deadline delete task 원자 등록, T+55분
  worker, 5분 독립 sweeper와 정상·비정상 삭제 8개 fixture를 추가했다.

## 자체 검증

- `sh apps/backend/contracts/stt/validate-contracts.sh`: PASS
- `jq empty apps/backend/contracts/stt/*.json apps/backend/contracts/stt/fixtures/*.json`: PASS
- `git diff --check`: PASS
- 공식 판정은 Backend QA Agent가 별도 세션에서 수행한다.

## Next Agent Handoff

```text
너는 Backend QA Agent / Verification Role이야.
T-20260729-022의 기본 비활성 원격 STT adapter 계약을 독립 검증해줘.

- 문서: apps/backend/docs/REMOTE_STT_ADAPTER.md
- schema·fixture: apps/backend/contracts/stt/
- 첫 출시 upload route/provider/audio egress 강제 비활성
- 로컬 STT 실패·미지원·네트워크 복구의 자동 원격 fallback 금지
- 승인·one-time grant 누락 시 body read·임시 object·provider call 0
- 성공·실패·취소·timeout 즉시 삭제와 최초 접수 후 최대 1시간 deadline
- audio·transcript·provider 정보·secret의 로그·오류·queue·receipt 비노출
- 자체 검사: sh apps/backend/contracts/stt/validate-contracts.sh
```

## 승인 및 병렬 실행 기준

- 2026-07-31 Product Owner가 실행을 승인했다.
- 선행 `T-20260729-021`, `T-20260729-026`은 모두 `done`이다.
- `T-20260729-023`, `T-20260729-024`와 핵심 산출물 경로가 분리돼 병렬 실행할 수
  있다.
- 각 Task는 최신 `origin/develop` 기반의 독립 worktree·브랜치·Backend Agent
  세션을 사용한다. Backend Agent 세션이 하나뿐이면 병렬이 아니라 순차 실행한다.
- 공용 Development·Quality 보드는 공유 경로이므로 다른 병렬 Task의 상태를
  덮어쓰지 않는다. QA 인계와 PR 전 최신 `develop`에 재정렬해 형제 Task 상태를
  보존한다.
- 첫 출시의 Apple 기기 내 STT 기본값, 원격 STT 기본 비활성, 무승인 업로드와 자동
  fallback 금지를 유지한다.

## AI Ops CLI 기록

| 날짜 | Actor | Event | Reason |
|---|---|---|---|
| 2026-07-31 | Product Owner | transition: proposed -> approved | T-021 완료 후 기본 비활성 원격 STT adapter 계약 실행 승인 |
| 2026-07-31 | Development Lead Agent | approve parallel execution | T-023·T-024와 독립 산출물 병렬 실행, 공용 보드 직렬 통합 기준 확정 |
| 2026-07-31 | Backend Agent | lock | task lock |
| 2026-07-31 | Backend Agent | transition: approved -> in_progress | 승인된 기본 비활성 원격 STT adapter 계약 작성 시작 |
| 2026-07-31 | Backend Agent | self-verification | 강제 비활성·negative gate·삭제 1시간·공통 오류 연결 계약 검사 통과 |
| 2026-07-31 | Backend Agent | transition: in_progress -> verification_ready | 기본 비활성·무승인 업로드 차단·삭제 최대 1시간 계약과 자체 검증 완료 |
| 2026-07-31 | Backend Agent | unlock | task unlock |
| 2026-07-31 | Backend Agent | integrate latest develop | origin/develop 22fe75f 위로 재정렬하고 T-004·T-023·T-024 공용 보드 상태 보존 |
| 2026-07-31 | Backend QA Agent | transition: verification_ready -> verification_in_progress | 기본 비활성 원격 STT·무승인 업로드·자동 fallback 금지·최대 1시간 삭제 계약 독립 검증 |
| 2026-07-31 | Backend QA Agent | lock | task lock |
| 2026-07-31 | Backend QA Agent | transition: verification_in_progress -> rework_requested | QA-HIGH-022-001 provider 오류 retry/terminal 계약 상충, QA-HIGH-022-002 삭제 실패 시 최대 1시간 자동 삭제 보장 누락 |
| 2026-07-31 | Backend QA Agent | unlock | task unlock |
| 2026-07-31 | Product Owner | approve rework | QA-HIGH-022-001~002 해소를 위한 provider retry/terminal 통일과 deadline 전 cleanup 보강 재작업 승인 |
| 2026-07-31 | Development Lead Agent | transition: rework_requested -> approved | Backend Agent에 승인된 T-022 재작업 범위와 독립 재검증 인계 |
| 2026-07-31 | Backend Agent | lock | task lock |
| 2026-07-31 | Backend Agent | transition: approved -> in_progress | QA-HIGH-022-001~002 승인 재작업 시작 |
| 2026-07-31 | Backend Agent | self-verification | 오류별 retry/terminal 4개·삭제 lifecycle 8개·deadline worker/sweeper 계약 검사 통과 |
| 2026-07-31 | Backend Agent | integrate latest develop | origin/develop 0fdfe52 위로 재정렬하고 T-004 done·T-023·T-024 공용 보드 상태 보존 |
| 2026-07-31 | Backend Agent | transition: in_progress -> verification_ready | QA-HIGH-022-001~002 retry/terminal 통일·deadline cleanup 이중 경로와 실패 fixture 재작업 완료 |
| 2026-07-31 | Backend Agent | unlock | task unlock |
| 2026-07-31 | Backend QA Agent | transition: verification_ready -> verification_in_progress | QA-HIGH-022-001~002 해소와 기본 비활성·무승인 업로드·자동 fallback 금지 무회귀 독립 재검증 |
| 2026-07-31 | Backend QA Agent | lock | task lock |
| 2026-07-31 | Backend QA Agent | transition: verification_in_progress -> verification_passed | QA-HIGH-022-001~002 해소, retry 4개·삭제 lifecycle 8개·deadline worker/sweeper와 기본 비활성·무승인 전송 금지 무회귀 PASS_WITH_RISK |
| 2026-07-31 | Backend QA Agent | unlock | task unlock |
| 2026-07-31 | Development Lead Agent | integrate latest develop | QA 결과를 고정한 뒤 origin/develop 0fdfe52 위에 정렬된 계약·fixture·T-004 done·형제 Task 상태 보존 |
| 2026-07-31 | Development Lead Agent | transition: verification_passed -> completion_review | QA-HIGH-022-001~002 해소, PASS_WITH_RISK 증빙, 허용 경로와 비차단 잔여 위험을 수용해 develop PR 통합 대기로 전환 |

## Development Lead 완료 검토

- Backend QA 최종 판정: `PASS_WITH_RISK`
- 재작업 구현 기준 커밋: `c960eed`
- 재검증 결과 고정 커밋: `2179040`
- retry/terminal fixture 4개와 cleanup lifecycle fixture 8개: PASS
- deadline worker·5분 sweeper·T+55분 forced delete 계약: PASS
- 기본 비활성·무승인 upload·자동 fallback 금지 무회귀: PASS
- 계약 script·JSON·Task strict validation·`git diff --check`: PASS
- 최신 `origin/develop` 대비 뒤처짐: 0
- `T-20260730-004 done`, T-023·T-024 형제 상태: 보존
- 변경 경로: Task `allowed_paths` 안
- 미해결 차단 결함: 없음

실제 runtime worker/sweeper 장애 복구와 provider 물리 삭제 SLA는 `T-20260729-025`와
후속 원격 STT 활성화 staging gate에서 검증한다. 원격 STT는 현재 강제 비활성이고
provider가 물리 삭제 확인을 제공하지 않으면 활성화하지 않으므로 이 위험은 문서
계약 Task 완료를 차단하지 않는다.

Development Lead가 성공 기준과 독립 QA 증빙을 수용해 `completion_review`로
전환한다. 필수 검토 후 `develop` 병합 대상으로 확정한다.

## 완료

- PR: [#40](https://github.com/cschoi724/CookLog/pull/40)
- 대상 브랜치: `develop`
- 병합 방식: squash merge
- merge SHA: `93f577ee137a4bcf0017d426d6334010294bfff3`
- hosted checks: `ios-build`, `ios-xctest` 성공
- 완료 판정: `done`

구현·QA PR의 checks와 squash merge를 확인해 Task를 `done`으로 확정한다.
실제 runtime cleanup 장애 복구와 provider 물리 삭제 SLA는 T-025 및 후속 staging
gate에서 검증한다.
