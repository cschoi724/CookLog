# T-20260729-020 Backend QA 독립 재검증 보고서

작성일: 2026-07-30
작성자: Backend QA Agent
대상 Task: `T-20260729-020`
최종 판정: `PASS_WITH_RISK`
최종 상태 인계: `verification_in_progress -> verification_passed`

이 문서의 1~9절은 1차 독립 검증에서 `QA-HIGH-020-003`을 발견해
`rework_requested`로 인계한 기록이다. 10절부터는 해당 결함 재작업에 대한 독립
재검증 결과이며 최종 판정은 13절을 기준으로 한다.

## 1. 검증 범위

- 기존 `QA-RISK-020-001`, `QA-RISK-020-002` 재작업 해소 여부
- Cloud Run 서울·Cloud Tasks·Firestore의 공식 가격과 월 runtime 산식
- OpenAI 추천안과 Vertex AI 차선안의 모델·endpoint·가격·보관·처리 지역
- 월 비용, quota와 hard cutoff 상한의 독립 재계산
- Apple 기기 내 STT 기본값, 원격 STT 비활성·자동 fallback 금지
- PRD의 AI 복구 콘텐츠 `생성 후 최대 24시간` 삭제 정책과 Firestore TTL 동작
- Task metadata, 허용 경로와 문서 형식

Provider 계정 생성, 계약, 결제, 배포와 실제 project 설정 변경은 수행하지 않았다.

## 2. 재작업 항목 검증

### QA-RISK-020-001: Firestore TTL delete 무료 할당량 제외

판정: `RESOLVED`.

- Google Cloud 공식 가격표는 TTL delete를 무료 사용 미지원 항목으로 분류하고 billing
  활성화를 요구한다.
- 서울 가격표의 TTL delete 단가는 USD 0.01/100,000건이다.
- 월 4,400건의 비용은
  `4,400 / 100,000 × USD 0.01 = USD 0.00044`로 문서와 일치한다.
- 결정 문서와 실행 보고서는 일반 document delete 무료 할당량을 TTL delete에
  적용하지 않는다.

공식 근거:

- [Firestore 가격과 TTL delete 무료 할당량 제외](https://cloud.google.com/firestore/pricing)

### QA-RISK-020-002: Cloud Run 서울 Tier 2 공식 단가

판정: `RESOLVED`.

- 서울 `asia-northeast3`는 Cloud Run request-based pricing의 Tier 2 대상 지역이다.
- 문서의 CPU USD 0.0000264/vCPU-second와 Memory
  USD 0.00000275/GiB-second는 Tier 1 단가의 1.10배다.
- Requests는 USD 0.40/백만 요청을 사용하고 별도 10%를 가산하지 않았다.
- 계산 결과 CPU USD 1.7424, Memory USD 0.09075, Requests USD 0.00176,
  Cloud Run 합계 USD 1.83491로 문서와 일치한다.

공식 근거:

- [Cloud Run 가격·free tier·지역 tier](https://cloud.google.com/run/pricing)

## 3. 비용 독립 재계산

### 기준 트래픽

- 월 provider 호출 4,400회
- 호출당 15초, 1 vCPU, 0.5 GiB
- 월 입력 11M token, 출력 4.4M token
- 환율 USD 1 = KRW 1,400, buffer 10%

### Runtime

| 항목 | 독립 계산 |
|---|---:|
| Cloud Run CPU | USD 1.7424 |
| Cloud Run Memory | USD 0.09075 |
| Cloud Run Requests | USD 0.00176 |
| Cloud Tasks | USD 0.00352 |
| Firestore writes·reads·TTL deletes | USD 0.02948 |
| 합계 | **USD 1.86791** |

Cloud Tasks의 첫 1백만 operations 무료와 USD 0.40/백만 단가도 공식 가격표와
일치한다. 비교표는 무료 할당량의 다른 workload 소진 가능성을 고려해 free tier 전
비용을 사용하므로 보수적 상한 비교로 타당하다.

공식 근거:

- [Cloud Tasks 가격](https://cloud.google.com/tasks/pricing)
- [Firestore 가격](https://cloud.google.com/firestore/pricing)

### AI와 합계

| 조합 | AI | Runtime 포함 | KRW·10% buffer | 판정 |
|---|---:|---:|---:|---|
| OpenAI 추천 | USD 11.55 | USD 13.41791 | KRW 20,664 | 일치 |
| Vertex AI 차선 | USD 10.285 | USD 12.15291 | KRW 18,715 | 일치 |

- GPT-5 mini는 입력 USD 0.25/1M, 출력 USD 2.00/1M이며
  `gpt-5-mini-2025-08-07` snapshot과 Structured Outputs를 지원한다.
- Gemini 3.1 Flash-Lite Standard의 EU non-global 단가는 텍스트 입력
  USD 0.275/1M, 텍스트 출력 USD 1.65/1M이다.
- Gemini 차선안은 Standard online prediction을 명시하므로 Priority 또는
  Flex/Batch 단가를 섞지 않았다.

공식 근거:

- [OpenAI GPT-5 mini 모델·가격](https://developers.openai.com/api/docs/models/gpt-5-mini)
- [Gemini 3.1 Flash-Lite 가격](https://cloud.google.com/gemini-enterprise-agent-platform/generative-ai/pricing)

### Hard cutoff

- 5,500회 기준 runtime: USD 2.3348875
- 추천 AI 상한: USD 21.00, 합계 buffer: KRW 35,936
- 차선 AI 상한: USD 18.70, 합계 buffer: KRW 32,394

문서의 약 USD 2.33, KRW 35,936, KRW 32,394와 일치하며 KRW 50,000 운영 중지
게이트 안에 있다.

## 4. Provider 개인정보·지역 검증

### OpenAI 추천안

판정: 문서와 공식 근거가 일치한다.

- API 입력은 명시적 opt-in 없이 모델 학습에 사용되지 않는다.
- 기본 abuse monitoring은 prompt·response를 포함할 수 있고 최대 30일이다.
- Chat Completions의 application state는 본 설계의 텍스트 요청에서 `None`이며
  MAM/ZDR 승인 전에는 30일 abuse monitoring이 남는다.
- 한국 endpoint는 저장을 지원하지만 regional processing은 지원하지 않고
  MAM 또는 ZDR이 필요하다.
- 결정 문서는 MAM/ZDR과 Modified Retention amendment를 출시 필수 게이트로
  두므로 기본 30일 보관을 출시 경로에 허용하지 않는다.

공식 근거:

- [OpenAI API 데이터 제어](https://developers.openai.com/api/docs/guides/your-data)

### Vertex AI 차선안

판정: 문서와 공식 근거가 일치한다.

- `gemini-3.1-flash-lite`는 GA, `eu` multi-region 지원, 2026-05-07 출시,
  2027-05-07 이후 retirement다.
- Google은 사전 허락 없이 customer data로 managed model을 학습하지 않는다.
- 기본 project 격리 in-memory cache는 24시간 TTL이고 project 단위 비활성화가
  가능하다.
- prompt abuse monitoring 대상이면 zero retention을 위해 예외 확인이 필요하다.
- 결정 문서는 EU non-global, cache off, abuse monitoring 예외 확인을 출시 게이트로
  둔다.

공식 근거:

- [Gemini 3.1 Flash-Lite 모델·지역·수명](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/gemini/3-1-flash-lite)
- [Gemini zero data retention](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/vertex-ai-zero-data-retention)

## 5. 필수 재작업

### QA-HIGH-020-003: Firestore TTL만으로 생성 후 최대 24시간 삭제를 보장할 수 없음

- 심각도: 높음
- 분류: 개인정보 보관 정책 충돌 / 아키텍처 보장 오류

근거:

- PRD는 AI 입력·결과 복구 캐시를 앱 수신 확인 즉시 삭제하고, 확인이 없어도
  **생성 후 최대 24시간 안에 자동 삭제**하도록 확정한다.
- Project Decisions도 확인되지 않은 결과 캐시를 최대 24시간 뒤 삭제하도록 확정한다.
- 결정 문서는 Firestore Standard 서울의 TTL 제한 job 문서가 이 최대 24시간 정리를
  수행한다고 설명하고 TTL delete 비용을 계산한다.
- Firestore 공식 문서는 TTL 삭제가 즉시 수행되지 않으며, 만료된 문서가 실제 삭제될
  때까지 조회에 계속 나타나고 데이터는 만료 시각 **후 통상 24시간 안에** 삭제된다고
  명시한다.
- 따라서 생성 시각 + 24시간을 TTL 만료 시각으로 설정하면 실제 콘텐츠는 생성 후
  약 48시간까지 남을 수 있다. 공식 문구도 `typically`이므로 생성 후 24시간 물리
  삭제의 보장으로 사용할 수 없다.

영향:

- 확정된 개인정보 보관 상한을 아키텍처가 충족하지 못한다.
- T-20260729-023이 현재 결정을 그대로 구현하면 만료된 사용자 콘텐츠가 조회·저장소에
  남는 시간이 제품 고지보다 길어질 수 있다.
- TTL 비용 산식은 맞지만, 그 비용 항목의 존재가 삭제 시각 보장을 증명하지 않는다.

필수 조치:

1. Firestore TTL을 최종 안전망으로만 분류하고 최대 24시간 삭제의 주 메커니즘으로
   표현하지 않는다.
2. 생성 후 24시간 이전에 콘텐츠를 명시적으로 삭제하는 deterministic cleanup
   경로와 재시도·실패 감시·경보를 결정안에 포함한다.
3. 만료 시각 이후 API 조회가 콘텐츠를 반환하지 않도록 application-level
   `expires_at` 검사와 접근 차단을 별도로 명시한다.
4. 변경된 삭제 경로의 Cloud Tasks·Firestore operation 수와 비용 상한을 다시
   계산한다.
5. T-20260729-023과 `024`가 추가 구두 설명 없이 같은 보관 계약을 구현·검증할 수
   있도록 인계 조건을 기록한다.

공식 근거:

- [Firestore TTL 동작](https://firebase.google.com/docs/firestore/ttl)

## 6. 운영·형식 위험

### QA-RISK-020-004: 상태별 Task routing metadata 불일치

- 검증 시작 시 `target_role`은 `Verification Role`이었지만 `target_agent`는
  `Backend Agent`였다.
- Quality Team mapping과 Task 본문의 검증 요청은 `Backend QA Agent`를 지정했다.
- 이번 재검증은 사용자의 명시적 요청으로 직접 라우팅했지만, 자동 Queue routing에서는
  구현 Agent로 잘못 배정될 수 있다.
- FAIL 전환 뒤 `target_role`은 `Lead Role`이지만 `target_agent`는 계속
  `Backend Agent`다. 다음 담당은 Team mapping상 `Development Lead Agent`다.
- 재작업 scope 시 상태별 `target_agent` 전환 규칙을 Task metadata에 일관되게
  적용해야 한다.

### QA-RISK-020-005: 검증 worktree가 최신 origin/develop보다 2개 커밋 뒤임

- 작업 시작 기준 SHA `8a36f22`는 당시 `origin/develop`과 일치했으나, 재검증 시점의
  `origin/develop`은 `af4b959`다.
- 새 커밋 2개는 Design T-009 구현·완료 범위로 이번 Backend 문서 판정 자체를
  바꾸지 않는다.
- PR 생성 전 최신 `origin/develop` 기준으로 재정렬하고 allowed path와 문서 충돌을
  다시 확인해야 한다.

## 7. 자동·구조 검증

- `aiops validate task --strict`: 통과
- `git diff --check`: 통과
- QA 산출물과 board 변경: Task `allowed_paths` 안
- Apple 기기 내 STT 기본값, 원격 STT 비활성, 음성 자동 fallback 금지: 일치
- 추천·차선 provider 자동 fallback 금지: 일치

프로젝트 전체 strict validation의 기존 운영 문서·archive schema 문제는 실행
보고서에 기록된 기존 범위 밖 결함이며 이번 FAIL의 근거로 사용하지 않았다.

## 8. 최종 판정

`FAIL`.

기존 `QA-RISK-020-001`, `QA-RISK-020-002`의 비용 근거와 산식은 해소됐다. 추천·차선
provider 비용, 지역, 보관 gate와 hard cutoff도 공식 출처 및 독립 재계산과 일치한다.

그러나 Firestore TTL만으로 생성 후 최대 24시간 콘텐츠 삭제를 보장한다는 결정은
확정된 PRD 개인정보 정책과 충돌한다. `QA-HIGH-020-003`을 해소하기 전
`T-20260729-023`, `024`의 선행 차단을 해제하거나 Product Owner 완료 검토로 넘기면
안 된다.

## 9. 다음 Agent에게 전달할 말

```text
Task: T-20260729-020
현재 상태: rework_requested
검증 판정: FAIL
다음 담당: Development Lead Agent / Lead Role
해소 확인:
- QA-RISK-020-001 Firestore TTL delete 무료 할당량 제외·USD 0.00044 반영
- QA-RISK-020-002 Cloud Run 서울 Tier 2 공식 단가·Requests 공통 단가
필수 재작업:
- QA-HIGH-020-003 Firestore TTL을 24시간 삭제 보장으로 사용하지 말고
  24시간 이전 명시적 삭제·접근 차단·재시도·감시 경로와 비용을 결정안에 반영
운영 정리:
- 상태별 target_agent routing metadata 정정
- PR 전 최신 origin/develop 기준 재정렬
QA 보고서:
- .ai_project/qa/T-20260729-020_compare-backend-runtime-ai-provider-cost-options-qa.md
```

## 10. QA-HIGH-020-003 독립 재검증

재검증 판정: `RESOLVED`.

공식 Firestore TTL 문서는 TTL 삭제가 즉시 수행되지 않고 만료 문서가 실제 삭제될
때까지 query와 lookup에 나타나며, 통상 만료 후 24시간 안에 삭제된다고 설명한다.
재작업된 결정안은 이 지연을 인정하고 TTL을 생성 후 최대 24시간 삭제의 근거가 아닌
최종 safety net으로만 제한했다.

주 삭제·차단 경로는 다음과 같이 서로 독립된 방어 계층으로 보강됐다.

1. 앱 결과 ACK와 같은 요청에서 콘텐츠 document를 즉시 명시적으로 삭제한다.
2. 미확인 콘텐츠는 `created_at + 22시간`에 Cloud Tasks cleanup task가 idempotent
   delete를 시도한다.
3. Cloud Scheduler가 15분마다 sweeper를 실행해 `delete_after <= now` 잔존
   document를 다시 삭제한다.
4. 모든 조회·복구 API는 서버 시각 `now >= expires_at`에서 본문을 복호화하거나
   반환하지 않고 `expired`만 반환하며 동기 delete를 시도한다.
5. 최대 age 22시간 30분 warning, 23시간 critical과 신규 AI job 차단,
   23시간 30분 incident cleanup, 잔존 count 0 확인 전 job 재개 금지를 둔다.
6. staging 출시 gate에 24시간 이상 콘텐츠 document 0건과 ACK·cleanup·sweeper
   계약 테스트를 포함한다.

Cloud Tasks 공식 문서는 미래 `scheduleTime` 설정을 지원하고, 실패한 task는 설정한
`maxAttempts`, `maxRetryDuration`, backoff에 따라 재시도할 수 있음을 확인했다.
따라서 22시간 cleanup과 재시도는 서비스 기능 범위 안에서 구현 가능하다.

이 설계는 단일 managed TTL에 생성 후 24시간 물리 삭제를 맡기지 않는다. 22시간부터
명시적 삭제를 반복하고 24시간에는 application boundary에서 콘텐츠 접근을
결정적으로 차단하며, 실패를 조기에 감지해 신규 콘텐츠 생성을 멈춘다.
`QA-HIGH-020-003`의 필수 조치인 명시적 cleanup, 접근 차단, 재시도·감시, 비용과
후속 Task 인계가 모두 충족됐다.

공식 근거:

- [Firestore TTL 동작](https://firebase.google.com/docs/firestore/ttl)
- [Cloud Tasks 미래 실행 시각](https://docs.cloud.google.com/tasks/docs/creating-http-target-tasks)
- [Cloud Tasks retry 설정](https://docs.cloud.google.com/tasks/docs/configuring-queues)

## 11. 비용 독립 재계산

2026-07-30 현재 공식 가격표에서 Cloud Run 서울은 Tier 2이며, request-based CPU와
Memory는 문서의 공식 SKU 단가인 USD 0.0000264/vCPU-second와
USD 0.00000275/GiB-second를 사용했다. Requests는 USD 0.40/백만 회다.
Firestore 서울은 read USD 0.03/100k, write USD 0.09/100k,
일반·TTL delete USD 0.01/100k이며 TTL delete에는 무료 quota가 없다.
Cloud Tasks는 create API call과 delivery attempt를 각각 billable operation으로
세고 USD 0.40/백만 operations, Cloud Scheduler는 USD 0.10/job-month다.

### 정상 트래픽 runtime

| 항목 | 독립 산식 | 비용 |
|---|---|---:|
| Cloud Run CPU | `4,400 × 15 × 1 × 0.0000264` | USD 1.742400 |
| Cloud Run Memory | `4,400 × 15 × 0.5 × 0.00000275` | USD 0.090750 |
| Cloud Run requests | `4,400 / 1M × 0.40` | USD 0.001760 |
| Cloud Tasks | `17,600 / 1M × 0.40` | USD 0.007040 |
| Firestore writes | `26,400 / 100k × 0.09` | USD 0.023760 |
| Firestore reads | `24,880 / 100k × 0.03` | USD 0.007464 |
| Firestore 일반 deletes | `4,400 / 100k × 0.01` | USD 0.000440 |
| Firestore TTL 상한 | `4,400 / 100k × 0.01` | USD 0.000440 |
| Sweeper Cloud Run | `2,880 × (0.0000264 + 0.5 × 0.00000275) + requests` | USD 0.081144 |
| Cloud Scheduler | `1 × 0.10` | USD 0.100000 |
| 합계 | 위 항목 합계 | **USD 2.055198** |

### AI와 월 합계

| 조합 | AI 독립 산식 | AI | Runtime 포함 | KRW·10% buffer |
|---|---|---:|---:|---:|
| OpenAI 추천 | `11M × 0.25 + 4.4M × 2.00` | USD 11.550 | USD 13.605198 | **KRW 20,952** |
| Vertex AI 차선 | `11M × 0.275 + 4.4M × 1.65` | USD 10.285 | USD 12.340198 | **KRW 19,004** |

GPT-5 mini의 입력 USD 0.25/1M, 출력 USD 2.00/1M과 snapshot
`gpt-5-mini-2025-08-07`, Gemini 3.1 Flash-Lite Standard non-global의 입력
USD 0.275/1M, 출력 USD 1.65/1M을 공식 가격표에서 다시 확인했다.

### Hard cutoff

5,500회에 맞춰 provider·cleanup operation을 비례시키고 15분 sweeper와 Scheduler를
고정하면 runtime은 **USD 2.5234955**다.

- 추천 AI 상한: `20M × 0.25 + 8M × 2.00 = USD 21.00`
- 차선 AI 상한: `20M × 0.275 + 8M × 1.65 = USD 18.70`
- 추천 합계: `(21 + 2.5234955) × 1,400 × 1.10 = KRW 36,226`
- 차선 합계: `(18.70 + 2.5234955) × 1,400 × 1.10 = KRW 32,684`

결정안·실행 보고서·Task 요약의 runtime, 추천·차선과 hard cutoff 값은 독립 계산과
일치한다.

공식 근거:

- [Cloud Run 가격과 지역 tier](https://cloud.google.com/run/pricing)
- [Cloud Tasks 가격](https://cloud.google.com/tasks/pricing)
- [Firestore 가격](https://cloud.google.com/firestore/pricing)
- [Cloud Scheduler 가격](https://cloud.google.com/scheduler/pricing)
- [OpenAI GPT-5 mini 가격](https://developers.openai.com/api/docs/models/gpt-5-mini)
- [Gemini 3.1 Flash-Lite 가격](https://cloud.google.com/gemini-enterprise-agent-platform/generative-ai/pricing)

## 12. 잔여 리스크

### QA-RISK-020-006: 삭제 경로의 실제 SLA는 후속 구현·staging 증빙 필요

- 현재 산출물은 아키텍처 결정안이며 실제 queue retry, idempotent delete,
  sweeper query, alert와 job 차단 구현은 T-20260729-023·024의 범위다.
- Cloud Tasks 미래 `scheduleTime`은 시도 시각을 지정하지만 외부 장애 중 정확한
  dispatch·Firestore delete 완료 시각 자체를 보증하는 SLA는 아니다.
- 따라서 이번 통과는 결정안의 결함 해소 판정이며, 첫 출시 전 staging에서 장애·지연을
  주입해 24시간 이상 콘텐츠 document 0건과 24시간 API 접근 차단을 확인해야 한다.

### QA-RISK-020-007: retry attempt 비용은 계측 후 상한 보정 필요

- Cloud Tasks 가격은 create뿐 아니라 각 push delivery attempt도 operation으로 센다.
- USD 2.055198은 정상 경로에서 provider·cleanup delivery가 각각 1회인 명목
  비교값이며 cleanup retry delivery와 그에 따른 Cloud Run·Firestore 재시도 비용은
  포함하지 않는다.
- 현재 호출 5,500회·token hard cutoff의 합계는 KRW 50,000보다 충분히 낮아 이
  누락이 후보 선택을 뒤집지는 않는다. T-20260729-024에서 cleanup retry 횟수와
  비용 metric을 계측하고 운영 상한을 보정해야 한다.

기존 `QA-RISK-020-004` routing 불일치는 재검증 시작 시
`target_agent: Backend QA Agent`로 정정됐다. 검증 통과 후에는 프로젝트 override에
따라 `Development Lead Agent / Completion Role`로 라우팅한다.

## 13. 최종 판정

`PASS_WITH_RISK`.

`QA-HIGH-020-003`은 해소됐다. Firestore TTL은 더 이상 생성 후 최대 24시간 삭제의
주 메커니즘이 아니며, ACK 즉시 삭제·22시간 cleanup·15분 sweeper·24시간 접근 차단,
사전 경보·신규 job 차단·incident cleanup과 staging 출시 gate가 결정안에 명시됐다.

runtime USD 2.055198, 추천 KRW 20,952, 차선 KRW 19,004와 hard cutoff 추천
KRW 36,226·차선 KRW 32,684는 공식 현재 가격과 독립 산식에 일치한다. Apple 기기 내
STT 기본값, 원격 STT 비활성·자동 fallback 금지, provider 자동 fallback 금지도
Source of Truth와 일치한다.

잔여 리스크는 후속 구현·staging 검증과 retry 비용 계측으로 관리 가능하며 이
아키텍처 결정 Task를 재작업 상태로 되돌릴 차단 결함은 아니다.

## 14. 다음 Agent에게 전달할 말

```text
Task: T-20260729-020
현재 상태: verification_passed
검증 판정: PASS_WITH_RISK
다음 담당: Development Lead Agent / Completion Role
해소 확인:
- QA-HIGH-020-003 TTL 지연 삭제 결함
- ACK 즉시 delete, 생성 22시간 cleanup, 15분 sweeper
- 24시간 API 접근 차단, 경보·신규 job 차단·incident cleanup
- runtime·AI·hard cutoff 비용 독립 재계산 일치
잔여 리스크:
- T-20260729-023·024 구현과 staging에서 24시간 삭제·접근 차단 증빙
- cleanup retry delivery·Cloud Run·Firestore 추가 비용 계측
QA 보고서:
- .ai_project/qa/T-20260729-020_compare-backend-runtime-ai-provider-cost-options-qa.md
```
