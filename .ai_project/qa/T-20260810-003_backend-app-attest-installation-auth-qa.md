# T-20260810-003 Backend 독립 QA 보고서

## 판정

- 결과: `PASS_WITH_RISK`
- 검증 Role: Backend QA Agent / Verification Role
- 기준: `origin/develop@081c206f60ef6e5f3d533a5a2b3aafafaa52b133`
- 검증 대상: `task/T-20260810-003-app-attest-installation-auth` worktree의 미커밋 변경
- 외부 호출: Apple·provider·network·Google Cloud 리소스·credential 사용 0건

## 자동 검증

- Node.js 26 host `npm run verify`: 135/135 PASS
- Node.js 24.18.0 전체 runtime tests: 135/135 PASS
- 계약 validator 5종: PASS
- Backend foundation 경계 감사: PASS

## 수용 조건 검증

- production에 `synthetic-test` verifier를 주입하면 startup에서 거부한다.
- chain, nonce, App ID hash, production AAGUID, credential/key ID, client data hash 중
  하나라도 불일치하면 token grant 전에 실패한다.
- challenge는 256-bit이며 hash만 저장하고 120초 만료, 3회 실패 폐기, 동시 제출 단일
  승자와 다른 idempotency body 거부를 유지한다.
- assertion은 등록 공개키·receipt와 monotonic counter를 검증하며 같은 counter를
  replay로 거부한다.
- signed token은 signature, issuer, audience, 미래 `iat`, expiry, 활성·직전 key,
  installation/JTI 폐기를 검사한다.
- production/compatibility rate policy 상향을 거부하고 installation·mutation·일일 AI·
  project·project AI 및 emergency 0 차원을 원자 소비한다.
- proof, access token, 원 IP는 저장·오류·관측 데이터에 직접 노출하지 않는다.

## 독립 위험 반례

### QA-RISK-810003-001 — process 재생성 후 폐기 상태가 복구되지 않음

동일 signing key로 `SignedInstallationTokenService`를 재생성한 결과:

- 재생성 전 installation/JTI 폐기 token: `INSTALLATION_REVOKED`
- 재생성 후 동일 token: signature·claim 검증을 통과해 다시 승인

현재 installation·JTI 폐기 set과 installation repository는 process-local이다. 실제
Firestore/KMS adapter가 승인 범위 밖이라는 보고된 한계와 일치하지만, production
composition에서 durable revocation 조회를 연결하지 않으면 폐기된 token이 Cloud Run
재시작 후 provider side effect 전에 차단되지 않는다.

### QA-RISK-810003-002 — signing key 회전 중 grant replay의 token bytes 변화

같은 committed grant를 active key 회전 전후에 재서명하면 `jti`는 같지만 `kid`와
access token 문자열은 달라진다. API 계약의 committed grant 복구는 유지되지만 구현
보고서의 “같은 signed token”을 byte-identical 응답으로 해석하면 차이가 있으므로
production idempotency 응답 정책을 완료 리뷰에서 명확히 해야 한다.

## 잔여 위험

- 실제 Apple attestation object CBOR·인증서 chain과 기기 assertion fixture는 미검증이다.
- production Firestore transaction, durable revocation·rate limiter와 Secret Manager/KMS
  signing key·회전은 미검증이다.
- iOS App Attest client와 실제 기기 proof 생성은 이 Task의 허용 범위 밖이다.
- Node 24 host 회귀는 통과했으나 신규 인증 package의 non-root container 검증은 실행하지 않았다.

승인된 local/domain contract 범위는 충족했고 신규 차단 결함은 확인되지 않았다. 실제
production 인증·폐기 경계를 후속 필수 gate로 남겨 `PASS_WITH_RISK`로 판정한다.

## 다음 Agent에게 전달할 말

너는 Development Lead Agent / Completion Role이야. Task T-20260810-003 완료 리뷰를 진행해줘.

- 현재 상태: `verification_passed`
- QA 판정: `PASS_WITH_RISK`
- 독립 검증: Node 24/26 135/135, 계약 validator 5종, 경계 감사 PASS
- 위험: `QA-RISK-810003-001~002`
- 필수 후속 gate: T-006에서 실제 Apple verifier, Firestore 단일 승자 transaction,
  durable installation/JTI revocation·distributed limiter, KMS signing key와 실제 기기 proof 검증
- 금지 경계: 승인 전 credential 등록, 실제 Apple/provider/network 호출, Google Cloud
  리소스 생성·배포 금지.
