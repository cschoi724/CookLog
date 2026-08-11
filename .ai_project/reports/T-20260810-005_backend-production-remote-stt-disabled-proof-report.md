# T-20260810-005 Backend 작업 보고서

## 결과

- 상태: `verification_ready`
- 실행 Role: Backend Agent / Execution Role
- 시작 기준: `origin/develop@42e1c8e22c2890fc0165a93c51d033476be7f5b6`
- 최종 인계 기준: `origin/develop@bceba32afa946e5154c77255543ffdc7c036f934`
- 작업 branch: `task/T-20260810-005-remote-stt-disabled-proof`
- 작업 worktree: `/private/tmp/cooklog-t20260810-005-remote-stt-disabled-proof`

## 실행 조건 확인

- canonical에서 T-20260810-005가 Product Owner 승인 `approved`, Backend Agent /
  Execution Role, lock 없음임을 확인했다.
- 선행 T-20260728-006과 직전 Backend T-20260810-001~004가 canonical에서 모두 `done`이다.
- 다른 Backend 실행 Task·lock이 없고 Task `allowed_paths`와 source of truth를 확인한 뒤
  전용 worktree에서 단일 Task lock을 획득했다.
- 작업 중 추가된 canonical 문서 커밋 `bceba32`는 변경 경로가 겹치지 않아 dirty 구현을
  보존한 채 fast-forward로 통합하고 전체 검증을 다시 실행했다.

## 구현 내용

- production remote STT proof를 exact plain-data contract로 추가했다. upload route,
  audio body parser, queue publisher, audio storage adapter, provider, audio egress destination,
  automatic fallback 등록을 각각 0으로 고정하며 accessor·Proxy·unknown shape는 fail closed한다.
- disabled activation decision의 효과를 parser/storage/provider/egress 등록과 실제
  body/storage/queue/provider/egress side effect로 세분화해 전부 0으로 고정했다.
- actual source, package dependency, Dockerfile과 Backend deployment/workflow manifest를
  검사하는 `audit-production-remote-stt-disabled.mjs`를 추가하고 기존 boundary audit에
  연결했다. route/body parser, network/storage/queue/provider 메서드, provider SDK,
  image 환경·audio/test asset과 manifest 활성화 선언이 발견되면 실패한다.
- production runtime을 health-only app으로 확인하고 STT/speech/transcription/audio 후보
  POST 경로가 route·parser 없이 404, 합성 audio marker 비반사로 종료되는 회귀를 추가했다.
- container 검증에 Node 24.18.0·non-root, contracts/tests 부재, remote STT image env 부재,
  활성화 환경 startup 실패와 실행 container 후보 audio POST 404 검사를 추가했다.
- 별도 원격 STT provider, endpoint, SDK, upload parser, queue, audio storage, credential,
  egress destination과 fallback은 구현하거나 활성화하지 않았다.

## 변경 파일

- `apps/backend/src/stt/activation-gate.ts`
- `apps/backend/src/stt/production-disabled-proof.ts`
- `apps/backend/tests/stt/remote-stt-boundary.test.ts`
- `apps/backend/contracts/stt/fixtures/production-disabled-proof.json`
- `apps/backend/contracts/stt/validate-contracts.sh`
- `apps/backend/contracts/stt/README.md`
- `apps/backend/scripts/audit-production-remote-stt-disabled.mjs`
- `apps/backend/scripts/audit-foundation-boundaries.sh`
- `apps/backend/scripts/verify-container.sh`
- `apps/backend/docs/REMOTE_STT_ADAPTER.md`
- `apps/backend/docs/STATUS.md`
- `apps/backend/docs/CHANGELOG.md`
- Task·Development/Quality board·이 보고서

## 자체 검증

실행 명령: `cd apps/backend && npm run verify`

- T-005 targeted runtime tests: 13/13 PASS
- TypeScript typecheck/build: PASS
- Node runtime tests: 155/155 PASS
- common contract validation: PASS
- remote STT contract validation: PASS
- AI recipe contract validation: PASS
- security/privacy/observability contract validation: PASS
- iOS/Backend shared fixture contract validation: PASS
- production remote STT static audit: PASS, source 39개·Backend workflow/manifest 후보 1개
- Backend foundation boundary audit: PASS
- container script shell syntax: PASS
- Node 24 non-root container: NOT RUN — 현재 host에 Docker 실행기가 없음
- 실제 원격 STT/provider/Cloud API 호출·음성 upload: 0건
- credential 등록·Google Cloud 리소스 생성·변경·배포: 0건

## 남은 리스크

- 현재 Docker 실행기가 없어 수정한 runtime image gate를 실제 container에서 실행하지
  못했다. Backend QA/CI의 Docker 환경에서 `npm run verify:container` 재검증이 필요하다.
- 현재 production deployment manifest는 없고 감사 대상 manifest 후보는
  `.github/workflows/backend-verify.yml` 1개다. T-20260810-006이 실제 staging manifest를
  추가할 때 이 감사를 필수 gate로 다시 실행해야 한다.
- 정적 감사는 현재 source와 알려진 provider/route/body/storage/queue 패턴을 검사한다.
  새 실행 프레임워크·manifest 형식이 도입되면 audit allowlist와 negative mutation을 함께
  확장해야 한다.
- 원격 STT는 강제 비활성이라 향후 활성 상태의 grant·cleanup·provider 물리 삭제는 실행
  검증하지 않는다. 별도 정책 Task와 외부 변경 승인 없이는 이 위험을 활성화로 해소하지 않는다.

## 다음 Agent에게 전달할 말

너는 Backend QA Agent / Verification Role이야. Task T-20260810-005의 실행 결과를 독립 검증해줘.

- 현재 상태: `verification_ready`
- 기준 상태 ref/SHA: `origin/develop@bceba32afa946e5154c77255543ffdc7c036f934`
- 다음에 해야 할 일: 이 보고서, 변경 파일과 source of truth를 기준으로 PASS/PASS_WITH_RISK/FAIL/BLOCKED를 판단해줘.
- 기준 문서: 상위 T-20260729-003, T-20260729-022, `apps/backend/docs/REMOTE_STT_ADAPTER.md`
- 허용 경로: Task front matter의 `allowed_paths`
- 참고 산출물: 이 보고서와 `contracts/stt/fixtures/production-disabled-proof.json`
- 변경/검토 대상: `src/stt/`, `tests/stt/`, `contracts/stt/`, `scripts/`, Backend 관련 문서
- 중점 검증: config/profile mutation startup 거부, route·body parser·queue·storage·provider·
  egress·fallback 0, production 후보 audio POST 비반사, source/image/manifest audit 차단력
- 남은 리스크: Docker container 실검증과 실제 staging manifest는 미실행, 활성 remote STT
  grant·cleanup·provider 물리 삭제는 별도 승인 범위
- 차단/결정 필요: Docker 환경에서 `npm run verify:container` 실행 필요
- 주의: 실제 원격 STT 호출·음성 upload·credential·Cloud 리소스·배포는 계속 금지한다.
