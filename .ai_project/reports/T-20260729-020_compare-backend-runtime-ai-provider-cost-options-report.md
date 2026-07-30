# T-20260729-020 작업 보고서

작성일: 2026-07-30  
작성자: Backend Agent  
상태: verification_ready

## 결과

첫 공개 출시 Backend의 런타임, AI provider, 인증 방향과 비용 상한을 Product Owner가
항목별 승인할 수 있는 결정안을 작성했다.

추천안:

- Cloud Run `asia-northeast3` 서울
- request-based billing, 1 vCPU, 512 MiB, `min instances = 0`
- Cloud Tasks·Firestore Standard 서울의 시간 제한 비동기 job 처리
- 생성 22시간 명시적 delete task, 15분 주기 sweeper, 24시간 API 접근 차단
- Firestore TTL은 지연 삭제를 고려한 최종 안전망으로만 사용
- OpenAI `kr.api.openai.com/v1/chat/completions`
- `gpt-5-mini-2025-08-07` 고정 snapshot
- MAM 또는 ZDR과 Modified Retention amendment를 출시 필수 게이트로 적용
- App Attest 기반 앱 무결성 검증과 설치 단위 단기 token
- 월 KRW 50,000 예산과 gateway 호출·token hard cutoff

차선안:

- Cloud Run 서울은 유지
- Vertex AI `eu`의 `gemini-3.1-flash-lite` GA로 AI adapter만 교체
- global endpoint, grounding, context cache, session resumption과 Batch 미사용

## 주요 경계

- 첫 출시 STT는 Apple 기기 내 처리이며 원격 STT는 기본 비활성이다.
- 원격 STT 자동 fallback, 기본값 변경과 Backend 음성 endpoint를 제안하거나
  구현하지 않았다.
- AI provider 간 자동 fallback도 사용하지 않는다.
- OpenAI 한국 endpoint는 저장만 한국에 두며 regional processing은 제공하지 않는다는
  제한을 명시했다.
- 추천안의 MAM/ZDR을 확보하지 못하면 기본 30일 abuse monitoring 때문에 출시 경로로
  사용할 수 없다고 판정했다.
- 차선안은 EU 처리와 서울-EU 지연을 Product Owner가 수용해야 한다.

## 비용 가정

- 월 활성 설치 1,000개
- 설치당 월 AI 정리 4회
- logical job 4,000개
- 재처리·실패 allowance 10%, provider 호출 4,400회
- 호출당 입력 2,500 token, 출력 1,000 token
- 월 입력 11M token, 출력 4.4M token
- 평균 Cloud Run billable time 15초/호출
- 예산 환율 USD 1 = KRW 1,400, 환율·세금 변동 buffer 10%

| 조합 | AI | free tier 전 Runtime | 합계 | KRW·10% buffer |
|---|---:|---:|---:|---:|
| 추천 | USD 11.55 | USD 2.06 | USD 13.61 | KRW 20,952 |
| 차선 | USD 10.285 | USD 2.06 | USD 12.34 | KRW 19,004 |

Cloud Run 사용량은 free tier 범위 안으로 예상하지만 다른 workload의 free tier 소진을
알 수 없으므로 비교 산식에는 Cloud Run, Cloud Tasks와 Firestore의 free tier 전 비용을
사용했다. 정확한 runtime 합계는 USD 2.055198이며, 표시값만 USD 2.06으로 반올림했다.
KRW는 반올림 전 합계에 환율과 buffer를 적용했다. egress, build, artifact와 logging은
제외했고 KRW 50,000 예산에 여유를 뒀다.

재작업 후 runtime에는 provider worker 외에 cleanup task와 15분 sweeper를 포함했다.
월 Cloud Tasks 17,600 operations, Firestore write 26,400·read 24,880·일반 delete
4,400, sweeper Cloud Run 2,880초와 Cloud Scheduler job 1개를 계산했다.

Firestore TTL delete는 일반 document delete의 일일 무료 할당량 대상이 아니다.
billing 활성화가 필요하며, 최종 safety net이 모든 문서를 삭제하는 보수적 상한
4,400건 `4,400/100k × USD 0.01 = USD 0.00044`를 추가 반영했다. 정상 경로에서는
생성 22시간 명시적 delete나 앱 ACK delete가 먼저 수행되므로 실제 TTL delete는
0에 가까워야 한다.

Cloud Run 서울 10% 차이는 임의 buffer가 아니라 공식 Tier 2 CPU SKU
`085C-A237-027A`와 Memory SKU `600C-3782-6708`의 단가가 Tier 1의 1.10배인 데서
재현했다. Requests는 공통 SKU `2DA5-55D3-E679`의 USD 0.40/백만 요청을 사용하고
10%를 가산하지 않았다.

hard cutoff는 월 5,500 provider 호출, 입력 20M token, 출력 8M token 중 먼저 도달한
항목으로 한다. provider 호출 전에 원자적으로 quota를 예약하며 provider budget 알림을
hard cutoff로 오인하지 않는다.

## 공식 출처 확인

2026-07-30 기준 아래 공식 1차 출처만 사용했다.

- Google Cloud Run 위치·가격·free tier·지역 tier·billing
- Google Cloud Platform의 Tier 2 CPU·Memory와 공통 Requests SKU
- Firestore TTL delete의 무료 할당량 제외와 서울 단가
- Firestore TTL의 비즉시·지연 삭제 특성
- Cloud Tasks future schedule·retry와 Cloud Scheduler 가격
- OpenAI 모델 가격·snapshot·Structured Outputs·endpoint별 보관·지역
- Vertex AI 모델 GA·retirement·가격·지역·보관·학습·cache
- Apple App Attest 클라이언트·서버 검증
- 향후 원격 STT 참고용 Google Cloud STT와 OpenAI Whisper 가격·데이터 조건

URL과 확인일은 `apps/backend/docs/ARCHITECTURE_DECISION.md`의 공식 출처 절에
기록했다.

## 변경 파일

- `apps/backend/docs/ARCHITECTURE_DECISION.md`
- `.ai_project/tasks/active/T-20260729-020_compare-backend-runtime-ai-provider-cost-options.md`
- `.ai_project/reports/T-20260729-020_compare-backend-runtime-ai-provider-cost-options-report.md`
- `.ai_project/teams/development/task_board.md`
- `.ai_project/teams/quality/task_board.md`

## 자체 검증

- 지정 branch·기준 SHA와 `origin/develop` 일치 확인
- Task allowed paths 외 변경 없음 확인
- 공식 URL의 HTTPS 형식과 확인일 기록 확인
- 추천안·차선안의 runtime, endpoint, model, 보관과 비용 산식 일관성 확인
- Cloud Run Tier 2 CPU·Memory SKU 단가와 공통 Requests SKU를 독립 재계산
- Firestore TTL을 최대 24시간 삭제의 주 수단에서 제외하고 safety net으로 제한
- 생성 22시간 cleanup task, 15분 sweeper, 24시간 API 접근 차단 계약 확인
- 추가 Cloud Tasks·Firestore·sweeper·Scheduler를 포함한 runtime 비용 재계산
- 원격 STT 기본 비활성, 자동 fallback 금지, 음성 endpoint 미구현 확인
- `aiops validate task --strict` 통과
- 40개 Task graph의 누락 참조·순환 검증 통과
- `git diff --check` 통과

`aiops validate project --strict`는 이번 Task와 무관한 기존
`.ai_project/operating_model.md`, `.ai_project/agent_registry.md` front matter와
archive `T-20260728-019`의 `schema` 누락을 보고했다. T-020 자체 strict validation,
`.ai_project/tasks` 검사와 Task graph는 통과했고 해당 파일들은 allowed paths 밖이므로
수정하지 않았다.

## Backend QA Agent 인계

다음을 독립 재계산한다.

1. cleanup·sweeper·Scheduler를 포함한 free tier 전 runtime USD 2.055198 산식
2. 추천·차선의 11M 입력, 4.4M 출력 비용과 KRW 환산
3. hard cutoff의 20M 입력, 8M 출력 및 runtime 상한
4. OpenAI `Chat Completions`와 `Responses`의 application state 차이
5. OpenAI 한국 endpoint의 저장 가능·처리 미지원·MAM/ZDR 요구
6. Vertex AI EU model의 GA·retirement·가격·처리 지역·cache 조건
7. 원격 STT가 참고 자료로만 남고 기본값·fallback·endpoint 구현을 바꾸지 않는지
8. App Attest 미지원 경로가 무제한 익명 접근을 허용하지 않는지

QA는 provider 계정이나 결제 설정을 변경하지 않고 문서와 공식 출처만 검증한다.

## Backend QA 재검증 지적 대응

- `QA-RISK-020-001`: Firestore TTL delete는 무료 할당량 대상이 아니며 billing
  활성화와 월 USD 0.00044 청구가 필요하다고 비용표와 본문에 명시했다.
- `QA-RISK-020-002`: Cloud Run 서울 Tier 2 CPU·Memory의 10% 차이를 공식 SKU
  `085C-A237-027A`, `600C-3782-6708`로 추적하고, 공통 Requests SKU에는 10%를
  적용하지 않도록 산식을 수정했다.
- 당시 결정 문서와 실행 보고서의 runtime USD 1.86791, 추천 KRW 20,664, 차선
  KRW 18,715를 일치시켰다. `QA-HIGH-020-003` 재작업 뒤에는 아래 새 산식으로
  대체했다.

## Backend QA `QA-HIGH-020-003` 재작업 대응

- Firestore TTL은 만료 시각에 즉시 삭제되지 않는다는 공식 제한을 결정 문서에
  추가하고 생성 후 최대 24시간 삭제의 근거에서 제외했다.
- 앱 결과 수신 확인 시 즉시 명시적 delete를 수행한다.
- 미확인 콘텐츠는 `delete_after = created_at + 22시간`의 Cloud Tasks cleanup으로
  명시적 삭제한다.
- Cloud Scheduler가 15분마다 sweeper를 호출해 cleanup 실패·지연 문서를 다시
  삭제한다.
- 모든 결과 조회는 `expires_at = created_at + 24시간`을 서버에서 검사하고, 만료된
  콘텐츠를 복호화하거나 반환하지 않으며 동기 delete를 시도한다.
- 22시간 30분 warning, 23시간 critical·신규 AI job 차단, 23시간 30분 incident
  cleanup을 운영 계약으로 추가했다.
- T-20260729-023에는 timestamp·idempotent delete·접근 차단, `024`에는 비콘텐츠
  metric·alert·job 차단·incident를 필수 인수 조건으로 명시했다.
- 추가 삭제 경로를 반영해 runtime을 USD 2.055198, 추천 비용을 KRW 20,952,
  차선 비용을 KRW 19,004로 다시 계산했다.

## 남은 Product Owner 결정

- 추천 OpenAI 조합 또는 차선 Vertex AI 조합 선택
- 추천안의 한국 밖 추론 또는 차선안의 EU 처리 수용
- MAM/ZDR 계약 진행 또는 Google abuse monitoring 예외 검증 승인
- Cloud Run 서울 설정 승인
- App Attest와 제한된 compatibility 경로 승인
- 월 KRW 50,000, 호출·token quota와 hard cutoff 승인

위 항목 승인과 Backend QA PASS 전에는 provider 계약·결제·배포·실제 연동을 시작하지
않는다.
