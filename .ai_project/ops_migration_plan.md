# AI Ops Migration Plan

작성일: 2026-07-01
프로젝트: CookLog
상태: Applied with follow-up decisions

## 1. 목적

이 문서는 CookLog에 AI Agent 운영 체계를 도입하기 위한 프로젝트별 마이그레이션 계획입니다.

운영 체계 도입은 AI Ops Agent가 주도합니다. 제품 우선순위는 Product Lead Agent가 정리하고 Product Owner가 승인하며, 개발 Task 조율은 Development Lead Agent가 담당합니다.

## 2. 현재 프로젝트 구조 요약

```text
CookLog/
  AGENTS.md
  README.md
  .gitignore
  .ai/
  .ai_project/
  docs/
    PROJECT_STATUS.md
    PROJECT_CHANGELOG.md
    PROJECT_DECISIONS.md
    GIT_WORKFLOW.md
    product/
  apps/
    ios/
      AGENTS.md
      CookLog.xcodeproj
      CookLog/
      CookLogTests/
      docs/
    android/
      AGENTS.md
      docs/
  design/
    references/
    exports/
```

## 3. 적용할 운영 구조

```text
CookLog/
  .ai/                 # ai-agent-ops 템플릿 체크아웃, CookLog 저장소 제외
  .ai_project/         # CookLog Agent 협업 기록, CookLog 저장소 포함
    README.md
    agent_registry.md
    current_context.md
    source_of_truth.md
    task_board.md
    ops_decisions.md
    ops_issues.md
    ops_migration_plan.md
    workflow_overrides.md
    tasks/
    reports/
    qa/
    release/
```

## 4. Source Of Truth 매핑

| 영역 | 기준 문서 | 보조 문서 | 비고 |
|---|---|---|---|
| 제품 기준 | `docs/product/CookLog_PRD_v2.md` | `docs/product/CookLog PRD v2.pdf`, `docs/product/CookLog_PRODUCT.md` | PRD v2 우선 |
| 세션 공통 컨텍스트·라우팅 | `AGENTS.md` | `.ai_project/operating_model.md`, `.ai_project/agent_registry.md` | 루트 위치로 역할을 자동 부여하지 않음 |
| MVP 범위 | `docs/product/CookLog_MVP_SCOPE.md` | PRD v2 | MVP 포함/제외 기준 |
| 사용자 흐름 | `docs/product/CookLog_USER_FLOW.md` | 플랫폼별 `AGENTS.md` | 기록 흐름과 다시 요리 흐름 |
| 전체 현재 상태 | `docs/PROJECT_STATUS.md` | `apps/ios/docs/STATUS.md`, `apps/android/docs/STATUS.md` | 현재 iOS 문서와 차이 있어 동기화 필요 |
| 전체 결정사항 | `docs/PROJECT_DECISIONS.md` | 플랫폼별 `DECISIONS.md` | 공통/플랫폼 결정 분리 |
| Git 운영 | `docs/GIT_WORKFLOW.md` | `.ai_project/branch_pr_strategy.md`, `.ai/policies/branch_pr_policy.md` | 프로젝트의 승인된 `feature_branch_pr` 전략 우선 |
| iOS 세션 기준 | `apps/ios/AGENTS.md` | 루트 `AGENTS.md` | iOS 구현 판단 우선 |
| iOS 구현 계획 | `apps/ios/docs/DEVELOPMENT_PLAN.md` | `apps/ios/docs/STATUS.md` | M8 이후 작업 확인 |
| iOS QA 기준 | `apps/ios/docs/MANUAL_QA_CHECKLIST.md` | `apps/ios/docs/TESTING.md` | 수동 QA와 테스트 이슈 |
| Android 세션 기준 | `apps/android/AGENTS.md` | 루트 `AGENTS.md` | Android는 대기 상태 |

상세 매핑은 `.ai_project/source_of_truth.md`에 기록했습니다.

## 5. 기존 문서 처리 기준

- 기존 문서는 삭제하지 않습니다.
- 기존 문서가 유효하면 그대로 source of truth로 연결합니다.
- 현재 마이그레이션에서는 기존 문서 백업 파일을 만들지 않습니다.
- 문서 내용 동기화가 필요한 항목은 `.ai_project/ops_issues.md`에 운영 이슈로 기록하고, 담당 Lead가 별도 Task 필요 여부를 판단합니다.

## 6. AGENTS.md 병합 계획

| 위치 | 현재 상태 | 처리 방향 | 비고 |
|---|---|---|---|
| 루트 `AGENTS.md` | core 0.9.0 Codex adapter | 적용 완료 | core 템플릿과 exact match, CookLog 맥락은 프로젝트 문서로 분리 |
| `apps/ios/AGENTS.md` | iOS 구현 Agent 기준 | 적용 완료 | iOS Execution Agent source of truth |
| `apps/android/AGENTS.md` | Android 구현 Agent 기준 | 적용 완료 | Android 활성화 전 기준 문서 |
| `.ai/templates/tool_adapters/codex/AGENTS.md` | Codex 적용 템플릿 | 참고만 함 | `.ai/` 수정 없음 |

## 7. 백업/롤백 전략

| 대상 | 백업 위치 | 롤백 조건 | 담당 |
|---|---|---|---|
| `.gitignore`의 `.ai/` 추가 | Git diff | `.ai/`를 CookLog 저장소에 포함하기로 사용자 결정이 바뀔 때 | Product Lead Agent / AI Ops Agent |
| `.ai_project/` 초기 문서 | Git diff 또는 커밋 전 삭제 | 운영 체계 도입을 취소할 때 | Product Lead Agent / AI Ops Agent |
| 기존 CookLog 문서 | 별도 백업 없음 | 이번 마이그레이션에서 기존 문서 직접 수정 없음 | 해당 없음 |
| `.ai/` 템플릿 | 별도 백업 없음 | 이번 마이그레이션에서 `.ai/` 직접 수정 없음 | 해당 없음 |

## 8. 적용 단계

| 단계 | 상태 | 내용 |
|---|---|---|
| 1 | 완료 | 현재 구조와 기존 문서 분석 |
| 2 | 완료 | `.ai/` 적용과 Git 제외 정책 확인 |
| 3 | 완료 | `.ai_project/` 초기 구조 생성 |
| 4 | 완료 | source of truth 매핑 작성 |
| 5 | 완료 | `AGENTS.md`를 현행 Role 라우팅 기준과 병합하고 파일명 정규화 |
| 6 | 완료 | Direction/Lead/Execution/Verification/Ops Governance 세션 시작 기준 정리 |
| 7 | 완료 | 초기 파일럿 Task 등록 및 실행 |
| 8 | 완료 | Execution/Verification 파일럿 검증 |

## 9. 사용자 결정 필요 항목

| 항목 | 선택지 | 권장안 | 결정 |
|---|---|---|---|
| 첫 파일럿 Task | 루트 상태 문서 동기화 / iOS 수동 QA / `xcodebuild test` 대기 이슈 조사 | 루트 상태 문서 동기화 | 미정 |
| 루트 상태 문서 동기화 승인 | 승인 / 보류 | 승인 | 미정 |
| `.ai_project/` Git 포함 여부 | 포함 / 로컬 전용 | 포함 | 포함으로 초기 적용 |

## 10. 리스크

| 리스크 | 영향 | 대응 |
|---|---|---|
| 루트 상태 문서와 iOS 상태 문서 불일치 | Agent가 서로 다른 현재 상태로 작업 가능 | Product Planning Agent 문서 동기화 Task 생성 |
| Task Queue 비어 있음 | Execution/Verification Agent가 Queue 기반으로 작업 선택 불가 | Product Lead Agent가 첫 파일럿 Task를 라우팅 |
| `.ai/`가 실수로 CookLog 저장소에 포함됨 | 템플릿 저장소와 프로젝트 저장소 책임 경계 붕괴 | `.gitignore`에 `.ai/` 추가 |
| core `0.9.0`의 schema front matter 미채택 | 최신 schema 기반 자동 검증 범위가 제한됨 | 운영 모델·registry·Task별 수동 검토 후 별도 승인 적용 |

## 11. 완료 기준

- `.ai/`와 `.ai_project/`의 역할 경계가 명확합니다.
- Direction/Lead/Execution/Verification/Ops Governance 세션 시작 기준이 문서화되어 있습니다.
- source of truth 문서가 지정되어 있습니다.
- 기존 문서의 유지 기준이 정리되어 있습니다.
- Product Lead Agent가 Task를 라우팅할 수 있는 상태입니다.
- AI Ops 이슈 기록 위치가 준비되어 있습니다.

## 12. 변경 이력

| 날짜 | 변경 내용 |
|---|---|
| 2026-07-01 | AI Ops Migration Plan 초기화 |
| 2026-08-05 | 루트 역할 자동 부여와 adapter/Git 정책 충돌 해결, core 0.9.0 마이그레이션은 별도 결정으로 분리 |

## Migration Record - 2026-07-27

| 항목 | 값 |
|---|---|
| core_version | 0.6.4 |
| core_source | homebrew |
| apply_scope | safe_auto_fix |

## vNext Guided Full Migration - 2026-07-27

위 2026-07-01 계획과 이력은 보존합니다. 현재 마이그레이션 상태는 아래 기록을 우선합니다.

| 항목 | 값 |
|---|---|
| current_core_version | `0.6.4` |
| project_recorded_core_version | `0.6.4` |
| bootstrap_mode | `guided_full` |
| migration_status | applied |
| operating_mode | `multi_team` |
| knowledge_mode | `full` |
| validation | migration verification passed, doctor strict completed_with_warnings |

### 적용 결과

- `.ai_project/operating_model.md` 생성
- `tasks/active`, `tasks/backlog`, `tasks/archive` 구조 추가
- Product, Design, Core Development, Quality Team context와 board 추가
- `feature_branch_pr` 전략 문서 추가
- Full Knowledge workspace 추가
- 기존 완료 Task, reports, QA 기록 보존
- 제품 코드와 제품 문서 미변경
- Knowledge lint 통과
- strict doctor 경고: adapter drift 1건, legacy Task `target_role` 누락 3건

### 후속 사용자 결정

| 항목 | 상태 | 처리 |
|---|---|---|
| `AGENTS.md` adapter 정합성 | resolved | 2026-08-05 core 0.9.0 템플릿과 정확히 동기화 |
| `docs/GIT_WORKFLOW.md` 동기화 | resolved | 2026-08-05 `feature_branch_pr` 기준 반영 |
| core `0.9.0` migration-safe Apply | resolved | 2026-08-05 적용 및 자체 검증 통과 |
| 신규 Task schema 적용 | resolved | 2026-08-05 이후 신규 Task부터 `aiops.task.v1` 적용, 기존 Task는 legacy 보존 |
| Backend source of truth | unresolved | Backend 구현 승인 전 |
| Figma 원본 링크 | unresolved | Design Team 첫 실행 전 |
| CI merge gate | unresolved | 첫 코드 PR merge 전 |

### 롤백

이번 변경은 `ops/aiops-vnext-migration` branch에 한정합니다. merge 전에는 branch 폐기로 롤백할 수 있고, merge 후에는 해당 migration commit revert로 운영 문서만 되돌릴 수 있습니다.

## Migration Record - 2026-08-05

| 항목 | 값 |
|---|---|
| core_version | 0.9.0 |
| core_source | homebrew |
| apply_scope | safe_auto_fix |
| safe_fixes | core_version, tasks directories, handoffs directory, ops records, knowledge context packs |
| review_scope | 기존 운영 모델·registry·Task는 legacy 호환 대상으로 유지하고 신규 Task부터 v1 schema 적용 |
| verification | passed |
