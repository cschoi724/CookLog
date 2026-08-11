# Security·privacy·cost guardrail fixtures

T-20260729-024의 장애·동시성 반례를 기계 검증한다.

- `raw-metadata-retention-cases.json`: 28일 cleanup부터 30일 접근 차단까지의 수명과
  task 누락·worker crash·queue 장애·sink 삭제 실패·TTL 지연
- `cost-ledger-cases.json`: provider와 Cloud Run·Tasks·Firestore·TTL·logging·egress·
  build 비용의 단일 KRW 원장 경합, operation 전액 승인·거절, actual 초과 delayed
  reserve 정산과 가격·환율·billing 지연 fail-closed
- `production-cost-hard-cutoffs.json`: 월 provider 호출·입력·출력 token·KRW의 독립
  hard cutoff, 요청당 token/attempt 상한, provider 13-SKU exact envelope,
  operation kind별 SKU·quantity 계약, 필수 telemetry와 외부 활성화 금지 경계
- `provider-region-gate-cases.json`: 저장 region, regional processing과 국외 처리
  승인의 독립 gate

실행:

```sh
sh apps/backend/contracts/security/validate-contracts.sh
```

fixture의 catalog SKU ID는 합성값이며 production 가격 manifest로 사용할 수 없다.
production은 Cloud Billing Catalog에서 배포 region과 usage type에 맞는 실제 SKU ID를
고정해야 한다. Cloud Run 세 SKU만 계약 문서의 공식 ID와 fixture가 일치하는지 검사한다.
