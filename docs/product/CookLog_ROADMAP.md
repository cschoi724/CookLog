# CookLog First Public Release Roadmap

최종 업데이트: 2026-07-29
목표 플랫폼: iOS
목표 릴리즈: 첫 App Store 공개 출시

이 문서는 제품 Mission을 실제 출시까지 연결하는 최상위 실행 계획입니다. 기능 세부 계약은 `CookLog_PRD_v2.md`, 실행 상태는 `.ai_project/tasks/`의 개별 Task를 우선합니다.

## 1. Mission

실제 iPhone에서 사용자가 요리 중 10초 음성 기록을 반복하고, 온라인 STT와 AI로 개인 레시피를 만든 뒤, 저장된 레시피를 버튼과 핸즈프리 Audio Guide로 다시 요리할 수 있는 iOS 앱을 공개 출시합니다.

Mission Clear 조건:

- Mock이 아닌 실제 온라인 STT와 Backend AI 정리가 동작합니다.
- 진행 기록, AI Review 임시 저장, 완료 레시피와 앱 재실행 복구가 제품 정책과 일치합니다.
- 완료 레시피 조회·검색·수정·삭제와 로컬 Audio Guide가 동작합니다.
- 핸즈프리 7개 명령과 항상 사용 가능한 버튼 fallback이 동작합니다.
- 개인정보, 보관 기간, 장애 안내, 문의와 법적 문서가 출시 기준을 충족합니다.
- 최소 출시 품질 게이트와 필수 CI를 통과하고 미해결 P0·P1 결함이 없습니다.
- TestFlight 통합 확인 후 Product Owner가 App Store 제출을 별도로 승인합니다.

## 2. 실행 원칙

- iOS Core v1 공개 출시를 최우선으로 하고 Android와 수익화는 병렬로 시작하지 않습니다.
- Design, XCTest/CI와 Backend foundation은 의존성이 허용하는 범위에서 병렬 진행합니다.
- Team 상위 Task는 Lead Agent가 실제 실행 전에 하위 Task로 분해하고 Product Owner 승인을 받습니다.
- 한 하위 Task는 하나의 책임, 하나의 주 담당 Agent와 검증 가능한 성공 기준을 가져야 합니다.
- 실제 provider, 배포 환경, 외부 설정, 비용 상한과 App Store 제출은 별도 사용자 승인 없이 실행하지 않습니다.

## 3. Release Stage

### R0. 제품 기준 고정

목표: 구현과 디자인이 따를 제품 정책, 출시 범위와 Task 구조를 고정합니다.

- `T-20260729-001` 확정 제품 정책과 출시 계획 통합 문서화

통과 조건:

- Product Charter, PRD, MVP Scope, User Flow, Wireframe와 Roadmap이 같은 정책을 사용합니다.
- 기존 Task의 유지·수정·폐기 판단과 후속 상위 Task가 등록됩니다.
- 독립 문서 검증 후 Product Lead가 완료를 확정합니다.

### R1. 병렬 Foundation

목표: 디자인, 테스트 자동화와 Backend 계약을 구현 가능한 상태로 만듭니다.

- Design: `T-20260729-002` 확정 제품 UX 기반 디자인 시스템·프로토타입 갱신
- iOS Test: `T-20260728-004` XCTest runner 안정화
- CI: `T-20260728-008` iOS CI 기본 파이프라인
- Backend Contract: `T-20260728-005` STT·AI Backend 아키텍처와 API 계약
- Backend Foundation: `T-20260728-006` Mock provider 기반 Backend foundation

병렬 관계:

- Design, XCTest와 Backend Contract는 R0 이후 병렬 진행할 수 있습니다.
- CI는 XCTest 실행 기준 확정 후 진행합니다.
- Backend Foundation은 Backend Contract 승인 후 진행합니다.

통과 조건:

- 모든 확정 화면·상태를 표현한 디자인 Source of Truth와 구현 핸드오프가 있습니다.
- 로컬 또는 CI에서 종료 코드가 명확한 iOS 테스트 기준이 있습니다.
- STT와 AI 정리의 버전된 계약, 개인정보·idempotency·오류 기준이 있습니다.
- Mock provider로 실행 가능한 Backend와 계약 테스트가 있습니다.

### R2. 제품 기능 구현

목표: 확정 디자인과 정책을 iOS 로컬 기능에 반영하고 실제 서비스 경계를 연결합니다.

- iOS Local Product: `T-20260728-003` 확정 제품 UX·디자인과 로컬 상태 모델 적용
- Backend Production: `T-20260729-003` 실제 STT·AI provider와 배포 가능한 Backend gateway
- iOS Online STT: `T-20260729-004` 10초 녹음·권한·온라인 STT 연동
- iOS AI Integration: `T-20260729-005` AI 정리·처리 복구·AI Review 연동
- iOS Audio Guide: `T-20260729-006` 로컬 TTS·오디오 중단·핸즈프리 구현

통과 조건:

- iOS Local Product는 여러 초안, 상태별 Home, 검색, 편집·삭제, 임시 저장과 앱 정보 UI를 포함합니다.
- Backend는 secret redaction, 보관 TTL, 비용 제한, timeout, idempotency와 provider 오류 매핑을 검증합니다.
- 온라인 STT와 AI 실패가 기존 로컬 기록을 손상하지 않습니다.
- Audio Guide 버튼과 핸즈프리가 같은 액션 모델을 사용하며 중단 후 자동 재생하지 않습니다.

### R3. 통합 TestFlight와 공개 출시

목표: 실제 환경의 전체 흐름을 최소 출시 게이트로 검증하고 App Store 제출 가능한 상태를 만듭니다.

- `T-20260728-009` iOS 첫 공개 출시 통합·TestFlight·App Store 게이트

TestFlight 진입 조건:

- R1·R2의 모든 차단 Task가 독립 검증을 통과합니다.
- 실제 개발·스테이징 환경에서 STT, AI와 iOS 전체 흐름이 연결됩니다.
- 필수 CI, secret·비용 상한, 개인정보 보관 TTL과 장애 fallback이 확인됩니다.

App Store 제출 조건:

- 실제 지원 iPhone 1대에서 핵심 전체 흐름을 3회 연속 완료합니다.
- 일반 실내 5회와 조리 소음 5회의 STT 중 8회 이상 사용 가능한 STEP Preview를 생성합니다.
- 서로 다른 AI 입력 5개가 최초 요청 또는 1회 사용자 재실행 안에 Review로 진입합니다.
- 안전 관련 AI 창작, 데이터 손실과 미해결 P0·P1 결함이 0건입니다.
- 핸즈프리 7개 명령을 조리 소음 환경에서 각각 최소 1회 성공하고 버튼 fallback을 확인합니다.
- 개인정보처리방침·이용약관·지원 URL과 문의 이메일, App Store privacy 응답이 실제 설정과 일치합니다.
- Product Owner가 배포 버전과 App Store 제출을 승인합니다.

## 4. Critical Path

```text
T-20260729-001
├─> T-20260729-002 ─> T-20260728-003 ─┬─> T-20260729-004 ─┐
│                                      ├─> T-20260729-005 ─┤
│                                      └─> T-20260729-006 ─┤
├─> T-20260728-005 ─> T-20260728-006 ─> T-20260729-003 ───┤
└─> T-20260728-004 ─> T-20260728-008 ─────────────────────┤
                                                            v
                                                   T-20260728-009
```

`T-20260729-004`와 `T-20260729-005`는 실제 서비스 중복 재작업을 피하기 위해 `T-20260729-003`의 검증된 개발·스테이징 환경 이후 시작합니다.

## 5. Task 정리 결정

| Task | 결정 | 이유 |
|---|---|---|
| `T-20260728-001` | 폐기 | 구형 Mock UI의 잔여 수동 검증은 전면 제품 UX 적용과 최종 출시 게이트에서 다시 검증되어 중복됩니다. |
| `T-20260728-003` | 범위 수정·유지 | Figma 단순 적용이 아니라 확정 제품 상태와 로컬 기능 구현의 상위 Task로 전환합니다. |
| `T-20260728-004` | 유지·P0 | 안정적인 테스트 종료 코드가 CI와 회귀 검증의 선행 조건입니다. |
| `T-20260728-005` | 범위 수정·P0 | AI만이 아니라 온라인 STT·AI 공통 Backend 계약이 필요합니다. |
| `T-20260728-006` | 범위 수정·P0 | 실제 provider 전 Mock 기반 계약·보안 foundation이 필요합니다. |
| `T-20260728-008` | 유지·P0 | 출시선의 필수 회귀 게이트입니다. |
| `T-20260728-009` | 범위 수정·P0 | 문서 정의 Task에서 TestFlight·App Store 통합 실행 상위 Task로 전환합니다. |
| `T-20260729-002` | 범위 수정·유지 | 확정 정책 전체를 디자인 Source of Truth에 반영하는 Design 상위 Task입니다. |

## 6. 이번 출시에서 분리하는 Workstream

- 수익화 문서와 `T-20260728-010~018` 후보: 기존 동결 상태 유지, Core v1 출시를 차단하지 않음
- Android: iOS 공개 출시와 실제 사용성 확인 후 재우선순위화
- 클라우드 백업·기기 동기화·내보내기
- 블로그·유튜브·OCR Import
- 조기 녹음 종료와 on-device STT fallback
- AI 완료 푸시 알림
- 레시피 버전 기록과 삭제 복구
- 공유, 커뮤니티와 소셜 기능

## 7. 출시 후 우선순위

1. 실제 STT·AI 성공률, 지연시간과 비용 확인
2. 기록 완료율, 저장 완료율, Audio Guide 사용과 재사용률 확인
3. 개인정보·장애 문의와 데이터 복구 요구 확인
4. 근거가 확보되면 수익화 Workstream 재개
5. 이후 Import, 로컬 STT, 백업·동기화와 Android 순서를 다시 결정
