# T-20260729-026 작업 보고서

작성일: 2026-07-29
작성자: Product Lead Agent
상태: done

## 결과

첫 공개 출시 STT 기본값을 Backend 온라인 STT에서 Apple 기기 내 STT로 변경했다. 유료 원격 STT는 교체형 adapter로 보존하되 기본 비활성화하고, 기기 내 STT 실패 시 자동 fallback하거나 사용자 음성을 무승인 전송하지 않도록 제품 기준을 통일했다.

AI 정리는 기존처럼 Backend를 사용하는 온라인 기능으로 유지한다.

## 변경 이유

- 원격 STT 단독 운영비가 아래 정책 검토용 가정에서 월 약 10만 원으로 추정됐다.
- 첫 출시 전에 고정 비용을 부담하기보다 기기 내 STT의 실제 품질과 지원 범위를 먼저 검증한다.
- 품질이나 구현 문제가 확인되면 원격 경로를 자동 활성화하지 않고 Product Owner가 별도 정책·비용 결정을 내린다.

## 비용 추정 산식

| 항목 | 정책 검토용 가정 |
|---|---:|
| 월 활성 설치 | 1,000개 |
| 설치당 월 요리 기록 | 4회 |
| 기록당 10초 clip | 6개 |
| 월 음성 처리량 | 240,000초 / 4,000분 |
| 원격 STT 단가 | USD 0.016/분 |
| 원격 STT 월 비용 | USD 64 |
| 예산 환율 | 2026-07-29 기준 가정, USD 1 = KRW 1,400 |
| 세금·환율 buffer | 10% |
| 원화 예산 추정 | KRW 98,560, 약 10만 원 |

원격 STT 단독 비용이며 AI 비용은 포함하지 않는다. 실제 트래픽 측정값, provider 견적 또는 확정 과금액이 아니다. provider·단가·실제 사용량이 정해지면 원격 adapter 활성화 승인 Task에서 다시 계산한다.

## 변경 문서

- Product Charter, PRD, MVP Scope, User Flow, Roadmap
- Project Decisions, Status, Changelog
- Project·Product·Design·Development·Quality Task Board
- Backend AI·원격 STT adapter와 iOS 기기 내 STT 관련 상위 Task

## 보존한 개발 산출물

`task/T-20260729-020-compare-backend-runtime-provider-cost-options` 등 개발 Agent 작업 브랜치의 원격 STT 비교·아키텍처 문서는 수정하지 않았다. 해당 문서는 공식 출시 정책으로 승격하지 않았으며 향후 원격 adapter 활성화 검토 자료로만 보존한다.

검증 시점에 T-020 worktree에는 Backend·iOS·제품 문서의 미커밋 변경과 QA 초안이 존재했다. Product Lead는 이를 되돌리거나 편집하지 않았고, 어떤 내용도 본 정책 브랜치로 복사하거나 공식 근거로 채택하지 않았다. 본 Task는 `origin/develop` `77b580a`에서 독립적으로 작성했다.

## 핵심 정책

- 기본: Apple 기기 내 STT
- 원격 adapter: 기본 비활성
- 자동 fallback: 없음
- 같은 기기 내 adapter의 기술 재처리: 최대 1회
- STT 오프라인 사용: 지원 환경에서 가능
- AI 정리: 인터넷 필요
- 품질·지원 범위 미달: Product Owner 결정 게이트

## Product QA 확인 요청

- 제품 문서 간 기본값·오프라인·실패 정책 일치
- Roadmap과 Task dependency에서 온라인 STT 필수 경로 제거
- 개인정보 문서에서 첫 출시 음성의 Backend 전송 제거
- 자동 fallback 금지와 같은 adapter 재처리의 구분
- 기존 개발 산출물 비공식 보존 경계
- STT 최소 품질 기준과 예외 결정 절차의 실행 가능성

## Product Lead 자체 검증

- Task YAML 21개 파싱
- Task ID 중복 0
- 누락 `depends_on`·`blocks` 참조 0
- 의존성 순환 0
- 상태 집계: proposed 11, verification_ready 1, done 8, cancelled 1
- 변경 경로 `allowed_paths` 준수
- `git diff --check` 통과
- 활성 제품 문서·Task에서 기존 온라인 STT 기본값 잔여 문구 0

## 2026-07-30 QA 재작업

- `T-20260729-003`에서 원격 STT 실제 provider·음성 upload·transcription을 첫 출시 범위와 성공 기준에서 제거하고 `T-20260729-004` 차단 관계를 삭제했다.
- `T-20260728-005`에서 `T-20260729-004` 차단 관계를 삭제하고 원격 STT 계약이 향후 별도 활성화 Task용 참고 경계임을 명시했다.
- `T-20260728-006`에서 Mock STT endpoint와 Backend 음성 임시 저장 구현을 첫 출시 P0 범위에서 제외했다.
- 첫 출시에는 앱 내부 임시 음성만 허용하고 Backend 음성 TTL은 향후 원격 adapter 별도 승인 시에만 적용하도록 Decisions, MVP Scope와 PRD를 통일했다.
- 월 약 10만 원을 실제 측정값이 아닌 가정 기반 원격 STT 단독 예산 추정으로 수정하고 사용량, 단가, 환율과 10% buffer 산식을 기록했다.
- `schema: aiops.task.v1`과 Verification 단계 capability를 보완했다.

재작업 후 `T-20260729-004`의 선행 Task는 `T-20260728-003`, `T-20260729-026`만 남으며 Backend T-003·T-005는 더 이상 이를 차단하지 않는다.

## Product Lead Completion Review

- Product QA 재검증 `PASS`를 수용한다.
- 첫 출시 기본 STT, 원격 adapter 비활성, 자동 fallback 금지와 온라인 AI 경계가 제품 문서에서 일치한다.
- Backend 원격 STT 구현은 첫 출시 Critical Path에서 제거됐고 iOS 기기 내 STT는 Backend STT 환경을 기다리지 않는다.
- 첫 출시 음성은 앱 내부에서만 임시 처리하며 향후 Backend 음성 TTL은 별도 원격 adapter 승인에만 적용된다.
- 월 약 10만 원은 실제 측정값이 아닌 원격 STT 단독 가정 기반 예산 추정으로 추적 가능하다.
- 기존 개발 Agent 산출물은 공식 정책으로 승격하지 않고 보존한다.

완료 기준을 충족했고 Product Owner의 명시적 최종 승인에 따라 `done`으로 전환했다.

## 다음 인계

Product QA 재검증 `PASS`, Product Lead 완료 검토와 Product Owner 최종 승인을 완료했다. 후속 Design·Development Task는 이 정책과 제품 Source of Truth를 실행 기준으로 사용한다.
