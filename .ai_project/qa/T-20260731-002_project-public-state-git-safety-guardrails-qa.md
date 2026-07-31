# T-20260731-002 독립 AI Ops 검증 요청

작성일: 2026-07-31
작성자: AI Ops Agent
대상 Task: `T-20260731-002`
상태: `verification_ready`

## 검증 대상

- Task:
  `.ai_project/tasks/active/T-20260731-002_project-public-state-git-safety-guardrails.md`
- 실행 보고서:
  `.ai_project/reports/T-20260731-002_project-public-state-git-safety-guardrails-report.md`
- 기준 SHA: `origin/develop@4760ba6`

## 독립 확인 항목

- 추적 문서의 `<<<<<<<`, `=======`, `>>>>>>>` 표식이 0건인지
- T-005가 Task·프로젝트 Board·Development·Quality Board·current context에서
  모두 `done`인지
- 공용 상태가 fetch를 마친 최신 `origin/develop`로 고정되는지
- 로컬 Task 파일과 Board를 공용 상태로 오인하지 않도록 구분했는지
- 상태 보고에 public SHA와 worktree·branch·local HEAD·공용·로컬 상태·dirty
  여부가 포함되는지
- `approved`, dependency·blocks, rework, done, 차단 해제가 `develop` 병합 후
  공용 효력을 갖는지
- 오래된 dirty worktree를 자동 `reset`, `rebase`, `stash`하지 않는지
- branch와 worktree 삭제가 비파괴 감사와 Product Owner 별도 승인 뒤에만
  가능한지
- squash merge를 `merge-base --is-ancestor`만으로 판정하지 않는지
- Task `allowed_paths`, `source_of_truth`, `report_to`, `qa_to`가 완전한지
- 변경이 Task 허용 경로 안에 있고 `agents.md`, `.ai/`, 제품 코드가 변경되지
  않았는지

## 필수 명령

```bash
git diff --check
aiops validate task .ai_project/tasks/active/T-20260731-002_project-public-state-git-safety-guardrails.md --strict
```

## 판정 형식

- 통과: `AI_OPS_GUARDRAIL_PASS`
- 재작업: `AI_OPS_GUARDRAIL_REWORK_REQUIRED`

검증 중 파일 수정, stage, commit, push, PR, merge와 worktree 정리를 수행하지
않는다.
