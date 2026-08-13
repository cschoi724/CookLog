# T-20260812-004 Product QA 독립 검증 보고서

작성일: 2026-08-13
작성자: Product QA Agent / Verification Role
대상 Task: `T-20260812-004`
최종 판정: `FAIL`
최종 상태 인계: `verification_in_progress -> rework_requested`

## 1. 검증 기준

- 공용 상태 ref: `origin/develop`
- 공용 상태 SHA: `b5fc2e30007ae51d6415698a4e9add093b69f417`
- 검증 worktree: `/private/tmp/cooklog-t20260812-004-product-qa`
- 검증 branch: `task/T-20260812-004-product-qa`
- 실행 commit: `b5fc2e30007ae51d6415698a4e9add093b69f417`
- 실행 보고서: `.ai_project/reports/T-20260812-004_rebaseline-private-figma-delivery-flow-report.md`
- 핵심 산출물: `docs/product/CookLog_FIGMA_DELIVERY_FLOW.md`

Task의 `source_of_truth`, 변경된 10개 관련 Task, Project/Product/Design/Development/Quality 보드, Source of Truth 매트릭스와 실행 commit 전체를 대조했다.

## 2. 수용 기준별 결과

| 검증 항목 | 결과 | 근거 |
|---|---|---|
| Task 인벤토리·분류·owner·실행 순서 | 부분 통과 | 전달 흐름 문서와 보드는 T-003 중심 분류와 Figma → iOS QA → Visual QA 순서를 설명한다. 그러나 T-004 본문에는 실행 전 `승인 예정 패키지`와 과거 상태가 현재 정보처럼 남아 있다. |
| 선택된 팝 키치 방향 보존 | 통과 | 기존 컨셉과 Prototype을 삭제하지 않고 T-003의 Legacy/Baseline 입력으로 유지한다. 후보 비교로 되돌리지 않는다. |
| T-003 실행 전제와 기존 Task 처리 | **실패** | T-003 frontmatter·Coordination Notes는 T-004 완료와 취소 Task 흡수를 요구하지만, 같은 파일의 Handoff는 여전히 T-002 완료만 요구하고 T-008·T-005~007 상태를 변경하지 말라고 지시한다. |
| Figma → iOS 전달 순서 | 통과 | T-004 완료 → T-003 scope·승인·Design QA·baseline → T-20260805-008 → T-20260812-001 → T-20260728-003 완료 리뷰 순서가 Task와 보드에 연결된다. |
| Legacy/Baseline과 Source of Truth 전환 | 통과 | 기존 Prototype·Manifest·handoff·완료 산출물·T-008 WIP 삭제가 없고, Figma 고정 전후의 우선순위가 전달 흐름과 Source of Truth에 기록됐다. |
| Backend 독립 흐름 | 통과 | 실행 commit에 Backend Task·제품 파일 변경이 없고 UI/Figma 차단과 분리됐다. |
| 비공개 Figma 식별자 비기록 | 통과 | 추가 행에서 실제 URL·파일 키·팀/조직 ID·초대 대상 값이 발견되지 않았다. 기존 공개 Figma 미러 URL은 오히려 일반 Legacy 명칭으로 교체됐다. |
| 변경 경로·Task 정적 검증 | 부분 통과 | 변경된 관련 Task 10개 strict validation은 통과하고 변경 파일은 allowed paths 안이다. 다만 실행 보고서의 `git diff --check: PASS` 주장과 달리 실제 명령은 4개 Markdown 후행 공백으로 exit 2다. |

## 3. 필수 재작업

### PQA-HIGH-813004-001: T-003 Handoff가 현재 dependency·취소 결과와 충돌함

- 심각도: 높음
- 분류: Dependency routing / Role handoff correctness

근거:

- T-003 frontmatter는 `depends_on: T-20260812-004`이며 blocker와 next decision도 T-004의 Product QA·완료 확정을 요구한다.
- 같은 파일의 Coordination Notes는 T-008·T-005~007이 T-004에서 이미 `cancelled`됐고 Legacy/Baseline으로만 사용된다고 명시한다.
- 그러나 Handoff는 선행 조건을 여전히 `T-20260812-002` 완료로 안내하고, T-008·T-005~007의 상태를 자동 변경하지 말라고 지시한다.

영향:

- Design Lead가 Handoff만 따라가면 T-004 완료 전 T-003을 scope하거나, 이미 승인·반영된 취소 결과를 다시 변경 제안으로 되돌릴 수 있다.
- Task frontmatter와 역할 인계가 서로 다른 실행 상태를 설명하므로 Acceptance Criteria 3과 7을 충족하지 못한다.

필수 조치:

1. T-003 Handoff의 선행 조건을 T-004 `done`으로 교체한다.
2. 다음 조치를 T-004 완료 후 Design Lead scope와 Product Owner의 별도 Figma 실행 승인으로 맞춘다.
3. T-008·T-005~007은 이미 `cancelled`·흡수됐으며 산출물/WIP를 Legacy로 보존한다는 현재 상태를 인계에 반영한다.

### PQA-MEDIUM-813004-002: T-004 본문의 실행 전 승인안이 현재 결과와 혼재함

- 심각도: 중간
- 분류: Task inventory / Internal consistency

근거:

- T-004는 `verification_ready`이고 관련 Task 변경이 canonical에 반영됐다.
- 하지만 본문 `진행 준비 결과와 승인 예정 패키지`는 “T-004 실행 승인 시 반영할 변경안”, “이번 scoped 전환만으로 변경하지 않는다”라고 쓰며 표의 현재 상태도 T-008 `approved`, T-005~007 `proposed` 등 실행 전 값을 유지한다.
- 동일 Task의 Activity와 실행 보고서는 해당 변경이 이미 반영됐다고 기록한다.

영향:

- Task 파일을 source of truth로 읽는 다음 Agent가 현재 canonical 상태와 실행 전 제안 상태를 혼동할 수 있다.

필수 조치:

1. 해당 절을 실행 완료 결과로 갱신하거나 명확한 역사적 승인안으로 표시한다.
2. 표의 상태와 설명을 현재 canonical 결과 또는 `실행 전 상태 / 적용 결과`로 분리한다.

### PQA-LOW-813004-003: 실행 보고서의 diff 검증 결과가 재현되지 않음

- 심각도: 낮음
- 분류: Verification evidence accuracy

근거:

- `git diff --check b5fc2e3^ b5fc2e3`은 실행 보고서와 전달 흐름 문서의 Markdown 강제 줄바꿈 후행 공백 4건으로 exit 2다.
- 실행 보고서는 동일 검증을 `PASS`로 기록한다.

필수 조치:

1. 후행 공백을 제거하거나, 의도한 Markdown 줄바꿈이라면 `git diff --check` 실패 사실과 예외 근거를 보고서에 정확히 기록한다.

## 4. 통과 증거와 잔여 리스크

- 변경된 관련 Task 10개 `aiops validate task ... --strict`: 모두 PASS
- 취소 Task 상태: T-20260811-002·005·006·007·008 모두 `cancelled`, 실행 라우팅 비움
- Canonical graph: T-002 `done`; T-004 검증 후 T-003 `proposed`; T-20260805-008 `blocked`; T-20260812-001·T-20260728-003 `scoped`
- 실행 commit의 삭제 파일: 0개
- Prototype·Manifest·iOS·Backend 제품 파일 변경: 0개
- 신규 비공개 Figma 실식별자: 0개
- `aiops validate project --strict`: 기존 archive schema 누락 및 전역 legacy 경고로 FAIL. 실행 보고서에 기존 원인으로 공개돼 있으며 이번 3개 필수 재작업과는 별도다.
- Source of Truth가 아직 생성되지 않은 미래 Figma baseline을 조건부 최종 기준으로 표기하므로, T-003 완료 전에는 Legacy 자료가 설계 입력일 뿐 새 시각 원본이 아직 존재하지 않는 전환 구간임을 Completion에서 계속 관리해야 한다.

## 5. 판정

`FAIL`.

재정렬 그래프, Legacy 보존, Backend 분리와 비공개 식별자 비기록은 통과했다. 그러나 다음 실행 Task인 T-003의 Handoff가 현재 dependency와 취소 결과를 반대로 안내하고, T-004 자체도 실행 전 승인안과 실행 후 결과를 혼재한다. Role 인계 오판 위험이 있어 Completion으로 넘길 수 없다.

다음 Agent에게 전달할 말:

너는 Product Lead Agent / Lead Role이야.
Task `T-20260812-004`의 재작업 범위를 조율해줘.

- 현재 상태: `rework_requested`
- 기준 상태 ref: `origin/develop`
- 기준 상태 SHA: `b5fc2e30007ae51d6415698a4e9add093b69f417`
- 필수 수정: `PQA-HIGH-813004-001`, `PQA-MEDIUM-813004-002`, `PQA-LOW-813004-003`
- 우선 조치: T-003 Handoff를 T-004 `done` 선행·취소 Task Legacy 흡수 결과로 교체하고, T-004 본문의 승인 예정안을 실행 결과로 정리해줘.
- 보존 사항: 현재 재정렬 그래프, 취소 상태, Legacy/WIP, Backend 독립 흐름과 비공개 식별자 비기록 원칙은 변경하지 마.
- 재검증 요청: 문서 정합성과 `git diff --check`를 수정한 뒤 Product QA Agent / Verification Role로 다시 인계해줘.
- 주의: 현재 Task의 workflow, status, target_agent, target_role이 Lead Role과 맞는지 먼저 확인해줘.
