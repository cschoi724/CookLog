# CookLog Project Changelog

이 문서는 플랫폼과 무관한 전체 프로젝트 변경 기록을 관리합니다.

## 2026-07-28

- `design/prototype/`을 공식 UI Source of Truth로 확정하고 Figma를 점진적 버전 미러로 전환했습니다.
- Warm Kitchen Journal 방향의 5개 MVP 화면, Light/Dark, 주요 상태와 핵심 흐름을 로컬 인터랙티브 프로토타입으로 구성했습니다.
- Design QA 결함 6건에 대응해 기록 반복·저장 전이, 저장 오류 복구, Player 피드백, WCAG AA 색상, 375×667 실제 프레임과 공통 컴포넌트 상태 갤러리를 보완했습니다.
- Figma 동기화를 위한 Manifest, 상태 ledger, 재개 Runbook과 Foundation 실행 스크립트를 `design/figma-build/`에 추가했습니다.
- 초기 실서비스 BM을 Free + CookLog Pro 월간·연간 구독으로 정리했습니다.
- `docs/product/CookLog_MONETIZATION.md`를 추가해 기능 경계, 가격·AI quota 가설, 원가 기준, Paywall, Apple 요건, 지표와 지속 관리 절차를 문서화했습니다.
- MVP Scope와 Roadmap에 Core MVP 이후 초기 실서비스 수익화 범위를 연결했습니다.
- 제품 준비도에 맞춰 실행할 수 있도록 수익화 정책, Figma, Backend 계약, StoreKit, quota, 관측성, 통합 QA와 출시 판정 Task `T-20260728-010`~`018`을 의존성 gate와 함께 등록했습니다.
- 첫 배포를 내부 TestFlight로 시작하고 비공개 외부 TestFlight 검증 후 App Store에 공개하는 3단계 출시 순서를 확정했습니다.
- 내부 TestFlight A에서는 실제 Core Loop를, TestFlight B에서는 Free/Pro 구독을 검증하도록 배포 범위를 분리했습니다.

## 2026-07-27

- `T-20260701-002` iOS MVP 수동 QA를 조건부 통과로 완료했습니다.
- iPhone SE 시뮬레이터에서 Home, Cooking Log, AI Review 저장, Recipe Detail, Audio Player, 앱 재실행 후 저장 유지 흐름을 확인했습니다.
- 핵심 선별 XCTest 18개 통과와 신규 P1 제품 결함 없음 상태를 기록했습니다.
- 새 클론 환경에서 이어갈 수 있도록 `.ai_project/new_clone_handoff.md` 인수인계 문서를 추가했습니다.

## 2026-07-01

- AI Agent 운영 마이그레이션 초기화 후 첫 파일럿 Task로 루트 프로젝트 상태 문서 동기화를 등록했습니다.
- `docs/PROJECT_STATUS.md`를 현재 iOS M8 MVP 정리와 검증 단계에 맞게 갱신했습니다.
- 루트 프로젝트 상태 문서의 오래된 iOS 프로젝트 생성 전 상태를 제거하고, `apps/ios/docs/STATUS.md`를 상세 상태 기준으로 연결했습니다.
- iOS QA에서 발견된 `AI 정리하기` 후 STEP Preview 입력 전달 결함을 수정하고, 후속 재검증 대상으로 문서화했습니다.
- iPhone SE 시뮬레이터에서 STEP Preview 2개 누적과 AI Review 초안 표시를 재검증하고, 저장 이후 흐름은 선별 XCTest 18개 통과와 후속 수동 QA 대상으로 기록했습니다.

## 2026-06-22

- PRD v2 PDF를 기준 제품 문서로 추가했습니다.
- PRD v2 내용을 Markdown 문서로 정리했습니다.
- 제품 문서, MVP 범위, 사용자 흐름, 와이어프레임, 로드맵을 PRD v2 기준으로 업데이트했습니다.
- iOS 개발 계획을 10초 음성 기록, STEP Preview, A-Lite Strategy, AI Review 중심으로 재정리했습니다.
- iOS 개발 스펙을 Feature 중심 MVVM + UseCase + Repository/DataSource 구조로 확정했습니다.
- NavigationStack/AppRoute, AppEnvironment 수동 주입, AppError, 제한적 ViewState, Mock/Preview/Test 데이터 분리 기준을 iOS 문서에 반영했습니다.
- iOS 개발 스펙을 역할별 문서로 분리하고 `DEVELOPMENT_SPEC.md`는 최상위 기준 문서로 축소했습니다.
- 개발 에이전트 운영을 플랫폼별 `apps/{platform}/docs/` 구조로 개편했습니다.
- iOS 개발 문서를 `apps/ios/docs/`로 이동했습니다.
- Android 개발 에이전트와 개발 대기 문서를 추가했습니다.
- 현재 사용하지 않는 `packages/`, `tools/` 추적 파일을 제거했습니다.
- Git 운영 기준을 `docs/GIT_WORKFLOW.md`로 분리하고, 다른 문서는 해당 문서를 참조하도록 정리했습니다.
- iOS 실제 프로젝트 생성 전 바로 착수할 수 있도록 iOS 개발 계획의 M0-M7 실행 순서를 구체화했습니다.

## 2026-06-19

- 루트 `agents.md`를 전체 서비스 관리 에이전트 기준으로 재정리했습니다.
- `apps/ios/agents.md`를 추가해 iOS 개발 에이전트 기준을 만들었습니다.
- iOS 개발 환경 권장안, 개발 계획, 의사결정 로그를 추가했습니다.
- 제품 문서를 v1 형태로 정리했습니다.
