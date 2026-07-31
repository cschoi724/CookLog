# CookLog AI 레시피 job 계약

이 디렉터리는 T-20260729-023의 기계 검증 원본이다.

- `recipe-job-create.schema.json`: STEP snapshot 기반 job 생성 요청
- `recipe-draft.schema.json`: AI Review 초안
- `recipe-job-status.schema.json`: queued·processing·succeeded·failed·expired 상태
- `recipe-job-acknowledgement.schema.json`: 앱 결과 수신 확인
- `fixtures/recipe-job-create.json`: 정상 STEP snapshot
- `fixtures/recipe-draft.json`: evidence와 review flag를 포함한 정상 결과
- `fixtures/state-transitions.json`: 상태 전이·provider 호출 상한
- `fixtures/idempotency-cases.json`: 생성·조회·ACK·수동 재실행
- `fixtures/recovery-lifecycle.json`: ACK·22시간 cleanup·sweeper·24시간 만료
- `fixtures/output-negative.json`: 잘못된 evidence·안전값·schema 결과 차단
- `validate-contracts.sh`: schema·fixture 정책 정합성 검사

실행:

```sh
sh apps/backend/contracts/ai/validate-contracts.sh
```

runtime JSON Schema validator와 iOS·Backend 통합 fixture는 T-20260729-025가 이 원본을
사용해 구현한다.
