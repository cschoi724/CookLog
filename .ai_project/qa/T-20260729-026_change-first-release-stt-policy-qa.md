# T-20260729-026 Product QA 독립 검증 보고서

작성일: 2026-07-30
작성자: Product QA Agent
대상 Task: `T-20260729-026`
최종 판정: `PASS`
최종 상태 인계: `verification_in_progress -> verification_passed`

## 1. 검증 범위

- Task 정의와 Product Lead 작업 보고서
- Product Charter, PRD, MVP Scope, User Flow, Roadmap
- Project Decisions, Status, Changelog
- 변경된 Backend·iOS·Design 상위 Task와 Project/Team board
- 원격 STT 비용 근거의 추적성
- 변경 경로, 문서 형식과 AI Ops strict validation

제품 구현 코드, Apple 기기 내 STT의 실제 지원 범위·정확도와 외부 Provider 단가의 최신성은 이번 문서 Task의 독립 검증 범위에 포함하지 않았다.

## 2. 성공 기준별 결과

| 성공 기준 | 결과 | 근거 |
|---|---|---|
| 첫 출시 STT 기본값, 원격 adapter 비활성, 자동 fallback 금지의 제품 문서 일치 | 실패 | MVP Scope와 공통 결정 문서에 첫 출시 Backend 음성 사본 정책이 남아 있다. |
| 지원 환경의 오프라인 10초 기록·STEP Preview와 온라인 AI 경계 | 통과 | PRD, MVP Scope, User Flow, Product Charter에 같은 경계가 반영됐다. |
| STT 실패 시 무승인 원격 전송 금지와 `다시 기록하기` | 부분 통과 | 주요 흐름 문서에는 반영됐지만 개인정보·서버 보관 문구가 충돌한다. |
| 품질 기준 미달 시 Product Owner 결정 게이트 | 통과 | 기존 10회 최소 표본, P0·P1 0건 게이트와 별도 Product Owner 결정 경계가 유지됐다. |
| Backend·iOS Critical Path에서 온라인 STT 필수 의존성 제거 | 실패 | Backend production Task가 실제 원격 STT 성공을 완료 조건으로 유지하고 iOS 기기 내 STT Task를 차단한다. |
| 기존 개발 산출물 비공식 보존 | 통과 | T-020 worktree와 커밋을 변경하지 않았고 이번 정책 브랜치로 복사하지 않았다. |
| Product QA 독립 검증 | 완료 | 본 보고서에 결과를 기록했다. |

## 3. 필수 재작업

### PQA-HIGH-026-001: 온라인 STT가 출시 Critical Path와 완료 조건에 남아 있음

- 심각도: 높음
- 분류: 요구사항 추적 실패 / Task graph 충돌

근거:

- `T-20260729-003`의 `priority_reason`은 온라인 음성 변환을 첫 공개 출시의 필수 경로로 정의한다.
- 같은 Task의 범위는 실제 10초 음성 upload·transcription을 포함하고, 성공 기준은 실제 음성이 원격 계약으로 텍스트 변환되는 것을 요구한다.
- 같은 Task의 `blocks`에는 기기 내 STT Task `T-20260729-004`가 남아 있다.
- `T-20260728-005`도 `blocks`에 `T-20260729-004`를 유지한다.
- `T-20260728-006`은 P0 Backend foundation의 범위와 하위 분해에 Mock STT endpoint 및 음성 임시 저장을 포함한다. 이 Task는 `T-20260729-003`과 최종 출시 Task로 이어지는 필수 선행 경로다.
- 반면 Roadmap과 `T-20260729-004.depends_on`은 기기 내 STT가 Backend STT 환경을 기다리지 않는다고 정의한다.

영향:

- Development Lead가 어떤 문서를 기준으로 읽는지에 따라 iOS 기기 내 STT 착수 시점과 Backend 완료 범위가 달라진다.
- 원격 STT provider 연결과 실제 음성 업로드가 첫 출시 완료 조건으로 다시 해석될 수 있다.
- Task의 “Backend·iOS Critical Path에서 온라인 STT가 첫 출시 필수 의존성으로 남지 않는다” 성공 기준을 충족하지 못한다.

필수 조치:

1. `T-20260729-003`의 우선순위 이유, 범위, 성공 기준, 하위 분해를 실제 AI provider 중심으로 정리하고 원격 STT는 기본 비활성 adapter 경계의 선택 검증으로 분리한다.
2. `T-20260729-003.blocks`와 `T-20260728-005.blocks`에서 `T-20260729-004` 차단 관계를 제거한다.
3. 원격 STT endpoint·Mock 구현이 첫 출시 P0 완료 조건인지, 후속 선택형 범위인지 명시하고 Roadmap과 동일하게 맞춘다.

### PQA-HIGH-026-002: 첫 출시 음성의 Backend 보관 여부가 제품 문서 안에서 충돌함

- 심각도: 높음
- 분류: 개인정보 정책 충돌 / 문서 정합성 실패

근거:

- `docs/PROJECT_DECISIONS.md`의 새 결정은 첫 출시 음성을 Backend나 원격 STT 제공업체에 보내지 않는다고 규정한다.
- 같은 문서의 확정 결정인 “음성·레시피 콘텐츠는 처리에 필요한 최소 기간만 서버에서 사용”은 앱과 Backend의 임시 음성을 STT 종료 후 삭제한다고 조건 없이 규정한다.
- `docs/product/CookLog_MVP_SCOPE.md`의 “구현상 중요한 구분”도 원본 음성의 앱·Backend 임시 사본과 최대 1시간 TTL을 첫 출시 기기 내 STT 문구 바로 앞에서 함께 요구한다.

영향:

- iOS·Backend·개인정보처리방침 담당 Team이 첫 출시에서 음성 업로드가 존재하는지 서로 다르게 해석할 수 있다.
- 무승인 음성 전송 금지와 첫 출시 Backend 비사용 성공 기준을 검증할 수 없다.

필수 조치:

1. 첫 출시 기본 경로는 앱 내부 임시 음성만 허용한다고 문구를 분리한다.
2. Backend 음성 TTL은 향후 원격 adapter가 별도 승인으로 활성화될 때만 적용되는 조건부 정책으로 명시한다.
3. 공통 결정, MVP Scope, PRD 개인정보 절의 적용 시점을 동일하게 맞춘다.

### PQA-MEDIUM-026-003: 월 약 10만 원 비용 근거가 “측정값”으로 과장되고 추적되지 않음

- 심각도: 중간
- 분류: 요구사항 근거 추적 / 의사결정 증거

근거:

- T-026 문서들은 원격 STT 비용이 월 약 10만 원으로 “측정”됐다고 표현한다.
- 보존된 T-020 보고서의 값은 월 활성 설치 1,000개, 설치당 월 4회 요리, 세션당 10초 clip 6개를 가정한 list-price 시나리오다.
- 해당 시나리오에서 Google 원격 STT는 월 `$64`, AI 포함 합계는 `$71.60`이며 실제 트래픽 측정값이 아니다.
- 원화 환산 기준일·환율과 “약 10만 원”의 계산 범위가 T-026 Source of Truth 또는 보고서에 연결돼 있지 않다.
- 동시에 T-026은 T-020 산출물을 공식 근거로 채택하지 않았다고 명시해 비용 결정 문구의 추적 경로가 끊긴다.

영향:

- Product Owner가 실제 측정 비용과 가정 기반 추정 비용을 구분하기 어렵다.
- 규모·사용 빈도·환율이 달라질 때 정책 재검토 기준을 재현할 수 없다.

필수 조치:

1. “측정”을 “가정 기반 추정”으로 수정한다.
2. 월 활성 설치, 기록 빈도, clip 수, 적용 단가, 환율 기준일과 STT 단독/AI 포함 여부를 정책 보고서에 기록한다.
3. T-020을 비공식 참고자료로 유지한다면 T-026 안에 승인에 필요한 최소 산식만 독립적으로 남긴다.

## 4. Team 인계 완전성

현재 인계는 불완전하다.

- Backend Team은 원격 STT가 첫 출시 필수 완료 조건인지 선택형 확장 경계인지 단일하게 판단할 수 없다.
- iOS Team은 `T-20260729-004.depends_on`만 보면 Backend와 독립 착수할 수 있지만 Backend Task의 `blocks`를 보면 착수할 수 없다.
- 개인정보·지원 문구 담당은 첫 출시 음성이 Backend에 전송되는지 문서만으로 확정할 수 없다.
- 비용 결정의 입력 가정과 환산 기준을 추가 구두 설명 없이 재현할 수 없다.

따라서 후속 Design·Development Team 차단을 해제하면 안 된다.

## 5. 형식·자동 검증 결과

- `git diff --check`: 통과
- 변경 경로: Task의 `allowed_paths` 안에 있음
- 기존 T-020 worktree·커밋 보존: 확인
- 직접 확인한 Task ID 참조: 존재하지 않는 ID 참조는 발견하지 못함
- `aiops validate task --strict`: 실패
  - `schema` 누락
  - `required_capabilities`가 빈 목록
- `aiops validate project --strict`: 기존 운영 문서와 Task schema 문제로 실패

strict validation 실패는 프로젝트 전반의 기존 schema migration 문제도 포함하므로 제품 정책 실패의 단독 근거로 사용하지 않았다. 다만 T-026이 새 Task인 만큼 재작업 시 현재 validator에 맞는 schema와 Verification capability를 보완해야 한다.

## 6. 초기 판정

`FAIL`.

기기 내 STT 기본값, 자동 fallback 금지, 오프라인 기록과 온라인 AI의 큰 방향은 주요 제품 문서에 반영됐다. 그러나 온라인 STT가 Backend Critical Path와 완료 조건에 남아 있고, 첫 출시 음성의 Backend 보관 여부가 문서 안에서 충돌한다. 비용 근거도 실제 측정값으로 재현할 수 없다.

Product Lead Agent가 필수 재작업을 반영한 뒤 Product QA 재검증이 필요하다. Product Owner 완료 승인 단계로 넘기지 않는다.

## 7. 다음 Agent에게 전달할 말

```text
Task: T-20260729-026
현재 상태: rework_requested
검증 판정: FAIL
다음 담당: Product Lead Agent / Lead Role
필수 재작업:
- Backend T-003/T-005/T-006에서 원격 STT의 출시 필수 경로와 T-004 차단 관계 제거
- 첫 출시 앱 내부 음성과 향후 원격 adapter의 Backend 음성 TTL 정책 분리
- 월 약 10만 원을 가정 기반 추정으로 바로잡고 산식·환율·범위 추적성 추가
QA 보고서:
- .ai_project/qa/T-20260729-026_change-first-release-stt-policy-qa.md
```

## 8. 2026-07-30 재작업 독립 재검증

### PQA-HIGH-026-001 해소: 원격 STT 출시 필수 경로 제거

- `T-20260729-003`은 실제 AI provider만 첫 출시 필수 범위로 남겼다.
- 원격 STT provider 연결, 음성 upload·transcription과 Backend 음성 저장은 명시적 제외 범위다.
- `T-20260728-006`은 Mock STT endpoint와 Backend 음성 저장 구현을 제외하고, 비활성 확장 지점과 무승인 활성화 방지 테스트만 유지한다.
- `T-20260728-005`의 원격 STT 계약은 향후 별도 활성화 Task용 참고 경계이며 첫 출시 구현 완료 조건이 아니라고 명시됐다.
- `T-20260728-005`와 `T-20260729-003`의 `blocks`에서 `T-20260729-004`가 제거됐다.
- graph 재검증 결과 `T-20260729-004`의 선행 Task는 `T-20260728-003`, `T-20260729-026`뿐이다.

판정: `PASS`.

### PQA-HIGH-026-002 해소: 첫 출시 앱 음성과 향후 Backend TTL 분리

- 첫 출시 기본 경로는 앱 내부 임시 음성만 허용하고 Backend 음성 사본을 만들지 않는다고 PRD, MVP Scope와 Project Decisions가 일치한다.
- 앱 임시 음성은 성공·최종 실패·같은 adapter 1회 재처리 종료 후 즉시 삭제하며 비정상 잔존 TTL은 최대 1시간이다.
- Backend 음성의 즉시 삭제·최대 1시간 TTL은 원격 adapter가 별도 제품 정책과 비용 승인으로 활성화될 때만 적용된다.

판정: `PASS`.

### PQA-MEDIUM-026-003 해소: 비용 추정의 가정·산식·범위 명시

- 월 활성 설치 1,000개 × 설치당 월 기록 4회 × 기록당 10초 clip 6개 = 월 4,000분으로 기록됐다.
- 분당 USD 0.016, 정책 검토용 환율 USD 1 = KRW 1,400, 세금·환율 buffer 10%를 적용해 `USD 64 × KRW 1,400 × 1.10 = KRW 98,560`으로 재현된다.
- 원격 STT 단독 비용이며 AI 비용은 제외되고, 실제 트래픽 측정값·provider 견적·확정 과금액이 아닌 정책 비교용 가정임이 명시됐다.
- T-020은 공식 근거로 승격하지 않고 기존 개발 산출물로 보존한다.

판정: `PASS`.

### 자동·구조 검증

- `aiops validate task .ai_project/tasks/active/T-20260729-026_change-first-release-stt-policy.md --strict`: 통과
- Task graph 독립 파싱: 21개, ID 중복 0, 누락 참조 0, 순환 0
- 설치된 AI Ops CLI에는 `aiops graph` 명령이 없어 동일 항목을 Task front matter 전수 파싱으로 검증
- `git diff --check`: 통과
- 변경 경로: `allowed_paths` 준수
- 본 정책 브랜치의 merge base와 `origin/develop`: `77b580a98fb45b90fcca2d3de0c62aa63ab0e2cb`
- T-020 및 플랫폼 개발 문서는 본 정책 branch diff에 포함되지 않음
- T-020 worktree의 기존 ahead 1·미커밋 변경 상태는 보존됐고 본 재검증에서 수정하지 않음

`aiops validate project --strict`는 이번 Task 외 기존 `.ai_project/operating_model.md`, `.ai_project/agent_registry.md` front matter와 archive Task schema 문제로 실패했다. T-026 자체 strict validation과 Task graph는 통과하므로 본 정책 Task의 차단 결함으로 분류하지 않는다.

## 9. 최종 판정

`PASS`.

기존 FAIL 3건은 모두 해소됐다. T-026을 `verification_passed`로 Product Lead Agent / Completion Role에 인계한다. Product Owner의 명시적 완료 승인 전에는 `done`으로 전환하지 않는다.
