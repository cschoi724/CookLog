# T-20260804-001 Product QA 독립 검증 보고서

작성일: 2026-08-04
작성자: Product QA Agent
대상 Task: `T-20260804-001`
최종 판정: `PASS`
최종 상태 인계: `verification_in_progress -> verification_passed`

## 1. 검증 기준

- 공용 상태 ref: `origin/develop`
- 공용 상태 SHA: `e4bab3a5d4d43b56352b361da1166cb230af7f79`
- 검증 worktree: `/private/tmp/cooklog-t20260804-001`
- 검증 branch: `task/T-20260804-001-restore-monetization-sot`
- 검증 시작 HEAD: `e4bab3a5d4d43b56352b361da1166cb230af7f79`
- 작업 보고서: `.ai_project/reports/T-20260804-001_restore-monetization-source-of-truth-report.md`

## 2. 성공 기준별 결과

| 검증 항목 | 결과 | 근거 |
|---|---|---|
| `CookLog_MONETIZATION.md` Source of Truth 등록 | 통과 | `.ai_project/source_of_truth.md`에 수익화 정책·가설 원본과 T-010~018 경계가 등록됐다. |
| T-010~018 상태 동결 | 통과 | 9개 front matter를 독립 파싱해 모두 `proposed`, `approved_by`·`locked_by`·`locked_at`·`lock_session` 비어 있음을 확인했다. |
| Core v1 Critical Path 비차단 | 통과 | 수익화 후보 외 Task의 `depends_on`에서 T-010~018 참조가 0건이며 제품 문서·보드도 별도 동결 Workstream으로 안내한다. |
| T-010 비용 비교 범위 | 통과 | AI 재시도·Backend 고정/변동비·Apple/세금·운영비·무료/실패 호출·평균/피크·악용 손실·손익분기·보수/기준/성장 시나리오를 포함한다. |
| 기기 내 STT와 원격 STT 경계 | 통과 | Apple 기기 내 STT를 기본 원가 경로로 두고 유료 원격 STT를 기본 비활성·자동 fallback 없는 별도 시나리오로 분리했다. |
| 핸즈프리 출시 정책 | 통과 | 핸즈프리를 Free/Pro 모두 제공하고 첫 공개 출시 핵심 경험·수익화 제외로 명시했다. |
| WIP T-011 실행 결과 미복구 | 통과 | 복구 범위에 Paywall 디자인·실행 report·QA 결과가 없고 T-011은 신규 `proposed` 후보와 실행 이력 없는 상태로만 존재한다. |
| dependency·blocks 구조 | 통과 | 모든 내부 참조 파일이 존재하고 T-010~018의 `blocks`가 대상 Task의 `depends_on`과 상호 일치하며 cycle을 만들지 않는다. |
| 보드·집계·변경 경로 | 통과 | 실제 Task 상태 집계와 Project Board 집계가 일치하고 변경 파일은 모두 `allowed_paths` 안에 있다. |
| 후보 Task의 다음 상태 라우팅 | **실패** | `T-010`, `T-013`, `T-018`이 필수 `scoped` 단계를 수행할 `Lead Role`로 라우팅되지 않는다. |
| vNext Task schema | **실패** | 복구 Task와 T-010~018 모두 `schema: aiops.task.v1`이 없어 strict validator가 10/10 실패한다. |

## 3. 필수 재작업

### PQA-HIGH-804-001: Product 후보 3개가 `proposed -> scoped`로 전이할 수 없음

- 심각도: 높음
- 분류: Task workflow / Role routing

근거:

- `.ai_project/workflow_overrides.md`는 신규 Task에 `standard_vnext`와 `scoped` 단계를 필수로 요구한다.
- `.ai/workflows/docs.md`와 `.ai/runtime/task_queue.md`에서 `proposed -> scoped` 수행 주체는 `Lead Role`이다.
- `.ai_project/operating_model.md`와 `.ai_project/agent_registry.md`에서 Product Lead Agent는 `Direction Role, Completion Role`만 보유하고 `Lead Role`을 보유하지 않는다.
- `T-20260728-010`과 `T-20260728-013`은 `target_role: Direction Role`, `T-20260728-018`은 `target_role: Completion Role`이다.
- CookLog workflow override는 이 전이를 Product Direction/Completion Role에 허용하는 예외가 없다고 명시한다.

영향:

- activation gate가 충족돼도 세 Task는 현재 metadata만으로 필수 `scoped` 단계에 진입할 수 없다.
- Product Lead가 비공식적으로 Role 계약을 우회하거나 Task metadata를 즉석 수정해야 하므로 추가 구두 설명 없이 실행 가능한 후보 복구가 아니다.
- 특히 T-018은 최종 완료 책임만 먼저 지정돼 방향·범위 조율과 실행·독립 검증의 시작 경로가 정의되지 않는다.

필수 조치:

1. Product Team의 `proposed -> scoped` 책임 Role을 운영 모델과 일치하도록 확정한다.
2. T-010·T-013·T-018의 현재 `target_role`, capability와 다음 전이를 그 결정에 맞춰 수정한다.
3. `scoped -> approved -> in_progress -> verification_ready -> verification_passed -> completion_review`의 담당 분리가 가능한지 세 Task별로 확인한다.
4. 후보 9개 상태 동결, dependency·blocks와 기존 통과 항목을 회귀 검증한 뒤 Product QA에 다시 인계한다.

### PQA-HIGH-804-002: 복구 Task 10개가 필수 vNext schema 검증에 실패함

- 심각도: 높음
- 분류: Task schema / 자동 검증 실패

근거:

- `.ai_project/workflow_overrides.md`는 신규 Task에 `standard_vnext` 사용을 요구한다.
- 최신 vNext Task는 front matter에 `schema: aiops.task.v1`을 사용한다.
- T-20260804-001과 복구된 T-010~018에는 `schema` 필드가 없다.
- `aiops validate task --strict <FILE>`을 10개에 각각 실행한 결과 모두 `missing: schema`, exit code 1로 실패했다.

영향:

- 자동화가 복구 Task와 후보 Task를 유효한 vNext Task로 검증하지 못한다.
- 이후 scope·승인·인계 시 schema 누락이 반복되거나 CI/운영 도구의 처리 대상에서 제외될 수 있다.

필수 조치:

1. T-20260804-001과 T-010~018에 현재 표준 schema를 명시한다.
2. 10개 각각의 strict validation을 통과시킨다.
3. schema 보완 뒤 상태·승인·lock 동결과 Task graph를 다시 검증한다.

## 4. 독립 검증 증거

- T-010~018 YAML front matter 9개 파싱: 통과
- 상태·승인·lock 불변식: 9/9 통과
- 최종 Task 상태 집계: proposed 18, scoped 2, approved 1, in_progress 1, rework_requested 1, done 30, cancelled 1
- T-010~018 dependency 존재 여부와 내부 `blocks` 역참조: 통과
- 수익화 후보 외 Task가 T-010~018에 의존하는 참조: 0건
- WIP 원본과 복구본 diff: 최신 STT·핸즈프리·비용·로컬 UI/UX 경계 보정만 확인
- 복구된 디자인·구현·외부 설정 파일: 0건
- `aiops validate task --strict`: 복구 Task와 후보 Task 10/10 실패, 공통 원인 `missing: schema`
- 수익화 문서 계산 검산: 연 39,000원/12=3,250원, 월간 대비 약 34% 할인, 70% 정산·20% 변동비·30회당 예산 값 일치
- Apple Developer 참조 URL 응답 확인: 유효
- 추적·미추적 검증 파일 whitespace 검사와 `git diff --check`: 통과
- 변경 경로의 `allowed_paths` 위반: 0건

## 5. 판정

`FAIL`.

수익화 정책 원본, 상태 동결, 비용 범위, STT·핸즈프리 정책, WIP 실행 결과 배제와 Task graph 자체는 통과했다. 그러나 복구된 Product 후보 3개가 프로젝트의 필수 `scoped` 단계로 진입할 수 없고 복구 Task 10개가 필수 vNext schema 검증에 실패하므로 실행 가능한 Source of Truth 복구 성공 기준을 충족하지 못한다.

다음 Agent에게 전달할 말:

너는 Product Lead Agent / Lead Role이야.
Task `T-20260804-001`의 범위를 다시 조율해줘.

- 현재 상태: `rework_requested`
- 기준 상태 ref: `origin/develop`
- 기준 상태 SHA: `e4bab3a5d4d43b56352b361da1166cb230af7f79`
- 다음에 해야 할 일: `PQA-HIGH-804-001~002`에 따라 Product 후보 T-010·T-013·T-018의 scope Role 라우팅을 정합화하고 복구 Task 10개의 vNext schema·strict validation을 보완해줘.
- 기준 문서: `docs/product/CookLog_PRD_v2.md`, `docs/product/CookLog_ROADMAP.md`, `docs/PROJECT_DECISIONS.md`, `.ai_project/source_of_truth.md`, `.ai_project/workflow_overrides.md`, `.ai_project/operating_model.md`
- 허용 경로: Task의 `allowed_paths`
- 참고 산출물: `.ai_project/reports/T-20260804-001_restore-monetization-source-of-truth-report.md`, `.ai_project/qa/T-20260804-001_restore-monetization-source-of-truth-qa.md`
- 변경/검토 대상: T-20260804-001, T-010~018과 관련 보드
- 남은 리스크: Product Team에 formal `Lead Role`이 없어 metadata 수정만으로 해결할지 운영 모델 보완이 필요한지 Product Owner 판단이 필요하다.
- 차단/결정 필요: Product 후보의 scope 책임 Role 확정, vNext schema 보완
- 주의: 현재 Task의 workflow, status, target_agent, target_role이 네 Role과 맞는지 먼저 확인해줘.

## 6. 최종 독립 재검증

재검증일: 2026-08-04
기준 상태 ref: `origin/develop`
기준 상태 SHA: `a1fa8d0350bf4b586f815ca0689b689fae7bfdf0`
재검증 worktree: `/private/tmp/cooklog-t20260804-001-rework-v5`
재검증 branch: `task/T-20260804-001-restore-monetization-sot-rework-v5`

### 결함별 결과

| 결함 | 결과 | 독립 재검증 근거 |
|---|---|---|
| `PQA-HIGH-804-001` Product 후보 scope Role | 해소 | Product Lead Agent의 Product Team 한정 Lead Role과 `product_scoping`·`product_dependency_management`가 Operating Model, Agent Registry, Product Team Context에 일치한다. T-010·T-013·T-018은 `target_role: Lead Role`이며 scope·실행·검증·완료 담당을 분리했다. |
| `PQA-HIGH-804-002` vNext schema | 해소 | T-20260804-001과 T-010~018 모두 `schema: aiops.task.v1`을 가지며 `aiops validate task --strict`가 10/10 통과했다. |

### 회귀 검사

- T-010~018: 9/9 `proposed`, 승인·lock 없음
- T-010~018 dependency 존재 여부와 내부 `blocks` 역참조: 통과
- 수익화 후보 외 Task의 T-010~018 의존: 0건
- Product Lead Lead Role의 범위: Product Team scope에만 제한, Design·Development 권한 확장 없음
- Product Planning 실행·Product QA 검증·Product Lead 완료 검토 분리: 통과
- 전체 Task 상태 집계와 Project Board: 일치
- 최신 develop의 T-025·T-005·Design T-014·T-002 `done`: 보존
- 변경 경로의 `allowed_paths` 위반: 0건
- 추적·미추적 파일 whitespace와 `git diff --check`: 통과
- 수익화 정책·비용·STT·핸즈프리·WIP 실행 결과 배제: 기존 통과 항목 무회귀

### 잔여 위험

- 월·연 가격과 Free/Pro quota는 계속 가설이며 T-010 실행과 Product Owner 승인 전에는 확정값이 아니다.
- 수익화 구현과 외부 App Store 변경은 계속 동결 상태이며 이번 통과로 실행 승인이 발생하지 않는다.

## 7. 최종 판정

`PASS`.

기존 HIGH 결함 2건이 모두 해소됐고 후보 상태 동결, Task graph, 제품 정책과 최신 develop 완료 상태에도 회귀가 없다. Product Lead Agent가 완료 검토를 수행해야 하며 develop 통합 전에는 이 worktree의 검증 결과만 유효하다.

다음 Agent에게 전달할 말:

너는 Product Lead Agent / Completion Role이야.
Task `T-20260804-001`의 완료 확정 여부를 검토해줘.

- 현재 상태: `verification_passed`
- 기준 상태 ref: `origin/develop`
- 기준 상태 SHA: `a1fa8d0350bf4b586f815ca0689b689fae7bfdf0`
- 다음에 해야 할 일: QA PASS, 잔여 가설·실행 동결, 허용 경로와 최신 develop 정렬을 수용할지 검토해줘.
- 기준 문서: Task의 `source_of_truth`, `.ai_project/workflow_overrides.md`, `.ai_project/operating_model.md`
- 허용 경로: Task의 `allowed_paths`
- 참고 산출물: `.ai_project/reports/T-20260804-001_restore-monetization-source-of-truth-report.md`, `.ai_project/qa/T-20260804-001_restore-monetization-source-of-truth-qa.md`
- 변경/검토 대상: T-20260804-001, T-010~018, 수익화 Source of Truth와 관련 보드
- 남은 리스크: 가격·quota는 T-010과 Product Owner 승인 전까지 가설, 수익화 실행은 동결
- 차단/결정 필요: 없음
- 완료 가능 시: `completion_review`를 거쳐 develop 통합과 최종 `done` 여부를 Product Owner 승인 기준으로 처리해줘.
- 주의: 현재 Task의 workflow, status, target_agent, target_role이 네 Role과 맞는지 먼저 확인해줘.
