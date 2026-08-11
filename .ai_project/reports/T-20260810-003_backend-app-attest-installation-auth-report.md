# T-20260810-003 Backend 작업 보고서

## 결과

- 상태: `verification_ready`
- 실행 Role: Backend Agent / Execution Role
- 기준: `origin/develop@081c206f60ef6e5f3d533a5a2b3aafafaa52b133`
- 작업 branch: `task/T-20260810-003-app-attest-installation-auth`
- 작업 worktree: `/private/tmp/cooklog-t20260810-003-app-attest-installation-auth`

## 구현 내용

- 256-bit CSPRNG challenge를 생성하고 hash만 120초 보관하며, 단일 소비와 검증 실패
  3회 폐기를 적용했다.
- production에서 synthetic verifier를 거부하는 App Attest cryptographic verifier port를
  추가했다. verifier 결과의 chain, nonce, App ID hash, production AAGUID,
  credential/key ID를 모두 fail closed 검증한다.
- 최초 등록의 App ID, 전역 유일 key ID, 공개키와 receipt hash를 고정했다. assertion에는
  저장 credential context를 전달하고 공개키·receipt 연속성과 monotonic counter를
  검증한다.
- challenge 소비, installation 등록/counter 갱신, idempotency body hash와 committed token
  grant를 repository의 단일 원자 commit 경계로 묶었다. 같은 challenge 동시 요청은 단일
  승자만 허용하고 정확한 idempotency replay는 같은 signed token을 복구한다.
- HMAC SHA-256 installation token에 `kid`, issuer, audience, installation subject,
  `iat`, `exp`, `jti`, App ID와 attestation provider를 넣었다. TTL 60~900초,
  signature·clock skew·expiry 검증, 활성/직전 key 회전, installation/JTI 폐기를 적용했다.
- challenge IP 10/분, installation 인증 IP 5/10분, installation 60/분·mutation 12/분·
  AI 20/일, project 600/분·AI 100/분 정책과 emergency project 0을 추가했다. production
  상한은 설정으로 높일 수 없고 development compatibility는 더 낮은 cap을 사용한다.
- non-production 전용 compatibility verifier는 production 생성과 proof replay를 거부한다.
  raw proof와 access token은 저장·오류 메시지·관측 데이터에 포함하지 않는다.

## 변경 파일

- `apps/backend/src/auth/app-attest-installation.ts`
- `apps/backend/src/auth/attestation.ts`
- `apps/backend/src/auth/installation-token.ts`
- `apps/backend/src/limits/rate-limiter.ts`
- `apps/backend/src/limits/rate-limit-guard.ts`
- `apps/backend/tests/auth/app-attest-installation.test.ts`
- `apps/backend/tests/auth/abuse-rate-limit.test.ts`
- `apps/backend/docs/SECURITY_PRIVACY_OBSERVABILITY.md`
- `apps/backend/docs/STATUS.md`
- `apps/backend/docs/CHANGELOG.md`
- Task·Development/Quality board·이 보고서

## 자체 검증

실행 명령: `cd apps/backend && npm run verify`

- TypeScript typecheck/build: PASS
- Node runtime tests: 135/135 PASS
- common contract validation: PASS
- remote STT contract validation: PASS
- AI recipe contract validation: PASS
- security/privacy/observability contract validation: PASS
- iOS/Backend shared fixture contract validation: PASS
- Backend foundation boundary audit: PASS
- 실제 Apple/provider/network/Google Cloud 호출: 0건
- 실제 credential 등록·Cloud resource 생성·배포: 0건

## 남은 리스크

- 승인 범위에 credential 등록과 실제 외부 호출이 없으므로 Apple attestation object의
  CBOR·인증서 chain을 처리하는 concrete production adapter는 연결하지 않았다. 이번
  구현은 production adapter가 제공해야 할 암호 검증 결과와 저장 공개키 assertion 입력을
  강제하는 port 및 원자 domain 경계다. T-20260810-006 composition에서 concrete adapter를
  연결할 때 실제 기기 fixture로 독립 검증해야 한다.
- 제공한 repository는 process-local 원자 contract adapter다. production Firestore
  구현은 challenge/credential/counter/idempotency/grant 단일 승자 의미를 보존해야 한다.
- signing key는 합성 test 값만 사용했다. Secret Manager/KMS credential 등록과 회전
  운영 검증은 외부 변경 승인 뒤 별도로 필요하다.
- 현재 실행 환경은 Node.js `v26.4.0`이며 production 기준은 Node.js 24 LTS다.
  Backend QA/CI에서 Node 24·non-root container 재검증이 필요하다.
- iOS App Attest client와 실제 기기 proof 생성은 이 Task의 허용 경로 밖이다.

## 다음 Agent에게 전달할 말

너는 Backend QA Agent / Verification Role이야. Task T-20260810-003을 독립 검증해줘.

- 현재 상태: `verification_ready`
- 기준 상태 ref/SHA: `origin/develop@081c206f60ef6e5f3d533a5a2b3aafafaa52b133`
- 검증 대상: `task/T-20260810-003-app-attest-installation-auth` worktree의 미커밋 변경
- 작업 보고서: `.ai_project/reports/T-20260810-003_backend-app-attest-installation-auth-report.md`
- 중점 검증: production synthetic verifier 거부, chain/nonce/App ID/AAGUID/key 결과
  fail closed, 저장 공개키 assertion context와 공개키·receipt 고정, monotonic counter,
  challenge 120초·3회 실패·동시 단일 승자, committed grant idempotency, token 위조·시간·
  회전·폐기, IP/installation/project/AI 제한과 compatibility cap
- 남은 리스크: concrete Apple CBOR/인증서 adapter와 Firestore transaction, 실제 signing
  key·기기 fixture·Node 24 container는 이번 승인 범위에서 활성화하지 않음
- 금지 경계: credential 등록, 실제 Apple/provider/network 호출, Google Cloud 리소스
  생성·배포 금지
- 판정은 `PASS`, `PASS_WITH_RISK`, `FAIL`, `BLOCKED` 중 하나로 기록해줘.
