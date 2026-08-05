# CookLog Project Decisions

이 문서는 플랫폼 공통 제품 및 저장소 운영 결정사항을 관리합니다. 플랫폼별 기술 결정은 각 앱 폴더의 `docs/DECISIONS.md`에 기록합니다.

## 2026-07-28 - 내부 TestFlight는 Core Loop와 구독을 분리해 검증

- 상태: 확정
- 결정: 첫 내부 TestFlight A에서는 실제 Core Loop를 검증하고, 두 번째 내부 TestFlight B에서 Free/Pro 구독을 추가합니다.
- TestFlight A 포함: 실제 10초 음성 기록·STT, Backend AI 정리, SwiftData 로컬 저장, 실제 TTS 오디오 가이드, 승인된 UI
- TestFlight A 제외: Paywall, StoreKit 구매, Free/Pro quota
- TestFlight B 포함: TestFlight A 통과 범위와 Free/Pro, StoreKit 2, Backend entitlement·quota, 구매 복원
- 외부 베타 조건: TestFlight A와 B를 모두 통과한 뒤 비공개 외부 TestFlight로 전환합니다.
- 이유: 음성·AI·저장·오디오 문제와 결제·구독 문제를 분리해 원인과 리스크를 명확히 검증하기 위함입니다.
- 후속 결정: 내부 TestFlight A의 통과 기준

## 2026-07-28 - 초기 실서비스는 3단계 검증 후 App Store에 공개

- 상태: 확정
- 결정: CookLog의 첫 배포는 내부 TestFlight로 진행하고, 통과 후 비공개 외부 TestFlight를 거쳐 App Store에 정식 공개합니다.
- 순서: 내부 TestFlight -> 비공개 외부 TestFlight -> App Store 공개
- 공개 조건: 외부 TestFlight의 제품·기술·수익화 검증을 통과하기 전에는 App Store에 공개하지 않습니다.
- 이유: 실제 STT, AI proxy, 구독, 개인정보와 비용 리스크를 통제된 환경에서 단계적으로 확인하기 위함입니다.
- 후속 결정: 내부 TestFlight에 포함할 기능 범위와 통과 기준

## 2026-07-28 - 로컬 디자인 프로토타입을 UI Source of Truth로 사용

- 상태: 확정
- 결정: `design/prototype/`을 CookLog의 공식 UI Source of Truth로 사용합니다.
- 보조 기준: 디자인 토큰·컴포넌트·상태 구조는 `design/figma-build/manifest.json`, 구현 핸드오프는 `design/COOKLOG_MVP_UIUX_V1_HANDOFF.md`를 사용합니다.
- Figma 역할: [CookLog — MVP UI/UX v1](https://www.figma.com/design/tAvYn6TatLKb3SXDjkH1hn)은 버전 스냅샷과 형상 보존용 미러로 유지하며 호출 가능 시 점진적으로 동기화합니다.
- 충돌 처리: 로컬 Prototype·Manifest와 Figma가 다르면 Product Owner가 승인한 최신 로컬 원본을 우선합니다.
- 이유: 디자인 개발을 Figma Starter 플랜의 페이지·변수·MCP 호출 한도와 분리하고, Git 기반 이력과 실행 가능한 인터랙션을 유지하기 위해서입니다.
- 영향: Design Task와 iOS 적용 Task는 Figma 완료를 기다리지 않고 승인된 로컬 원본과 Design QA를 기준으로 진행할 수 있습니다.

## 2026-07-28 - 초기 실서비스는 Free + CookLog Pro 구독으로 수익화

- 상태: 확정
- 결정: 초기 실서비스는 광고 없는 Free + CookLog Pro 모델을 사용하고 Pro는 월간·연간 자동 갱신 구독으로 제공합니다.
- 가격 가설: 월 4,900원, 연 39,000원
- 사용량 가설: Free AI 정리 월 3회, Pro 월 30회
- 제품 보호 원칙: 로컬 레시피 저장·조회와 기본 오디오 가이드는 Free에 유지하며 구독 만료 후에도 사용자 데이터를 잠그지 않습니다.
- 제외: 초기 주간 구독, 평생 이용권, 광고, 소모성 AI 이용권
- 기준 문서: `docs/product/CookLog_MONETIZATION.md`
- 후속 작업: AI 원가 검증, 구독 UX, StoreKit 2, Backend entitlement·quota, App Store Connect와 구독 QA

## 2026-06-22 - PRD v2를 제품 기준으로 사용

- 상태: 확정
- 결정: CookLog의 현재 제품 기준은 `docs/product/CookLog_PRD_v2.md`와 `docs/product/CookLog PRD v2.pdf`입니다.
- 이유: 10초 음성 기록, STEP Preview, A-Lite Strategy, AI Review 시점이 명확하게 정의되었습니다.
- 영향: 모든 플랫폼 개발 문서는 PRD v2를 기준으로 작성하고 갱신합니다.

## 2026-06-22 - 제품 문서와 플랫폼 개발 문서를 분리

- 상태: 확정
- 결정: 공통 제품 문서는 `docs/product/`에 두고, 플랫폼별 개발 문서는 `apps/{platform}/docs/`에 둡니다.
- 이유: iOS와 Android 개발 에이전트를 별도 세션으로 운영할 예정이므로 각 플랫폼 작업 맥락을 독립적으로 유지해야 합니다.
- 영향: iOS 개발 세션은 `apps/ios/`, Android 개발 세션은 `apps/android/`를 기본 작업 범위로 삼습니다.

## 2026-06-22 - 전체 상태 문서는 루트 docs에서 관리

- 상태: 확정
- 결정: 전체 프로젝트 상태, 변경 기록, 공통 결정사항은 `docs/PROJECT_STATUS.md`, `docs/PROJECT_CHANGELOG.md`, `docs/PROJECT_DECISIONS.md`에서 관리합니다.
- 이유: 루트 관리 에이전트가 플랫폼별 개발 상황을 한눈에 파악하고 다음 작업을 배정할 수 있어야 합니다.
- 영향: 플랫폼별 상세 진행은 각 앱 폴더에 두되, 전체 요약은 루트 문서에 반영합니다.

### 현행 운영 모델에 따른 후속 정정 (2026-08-05)

- 문서 위치와 전체 요약 유지 결정은 계속 유효합니다.
- 별도의 `루트 관리 에이전트`가 작업을 배정한다는 역할 설명은 폐기합니다.
- 전체 상태 갱신은 Product Lead가 필요성과 우선순위를 판단하고 Product Planning Agent 또는 해당 Execution Agent에 라우팅합니다.
- 세션 역할과 권한은 `.ai_project/operating_model.md`, `.ai_project/agent_registry.md`, 해당 Task metadata를 따릅니다.

## 2026-06-22 - `packages/`와 `tools/`는 초기 구조에서 제거

- 상태: 확정
- 결정: 현재 실사용 코드나 스크립트가 없는 `packages/`와 `tools/` 추적 파일을 제거합니다.
- 이유: iOS MVP 착수 전에는 빈 디렉토리가 다음 개발 에이전트에게 불필요한 맥락을 줄 수 있습니다.
- 영향: 공통 코드나 자동화 스크립트가 필요해지는 시점에 다시 생성합니다.

## 2026-06-22 - 1인 개발 기준 Git 운영은 main 중심으로 단순화

- 상태: 대체됨 (2026-08-05)
- 결정: Git 운영 기준은 `docs/GIT_WORKFLOW.md`에서 단일 관리합니다. 현재 기준은 `main` 직접 작업 중심이며, 큰 실험이나 파일 변화가 큰 작업만 `work/...` 임시 브랜치를 사용합니다.
- 이유: 현재는 1인 개발이며 브랜치를 세세하게 나누는 비용보다 작은 커밋과 자주 push하는 운영이 더 적합합니다.
- 영향: Git 전략이 바뀌면 `docs/GIT_WORKFLOW.md`를 우선 수정하고, 다른 문서는 해당 문서를 참조합니다.

## 2026-08-05 - feature branch와 PR 기반 Git 운영으로 전환

- 상태: 확정
- 결정: CookLog의 공식 Git 전략은 `feature_branch_pr`이며 Task 브랜치와 PR을 기본으로 사용합니다.
- 브랜치 형식: `task/<task-id>-<slug>`
- 검토와 병합: Verification Role의 독립 검토 후 Development Lead Agent가 merge를 판단하고 Product Owner가 승인합니다.
- 권한: push와 merge는 Product Owner 승인 후 진행하며 `main` 직접 push는 허용하지 않습니다.
- 영향: 이 결정은 2026-06-22의 `main` 직접 작업 결정을 대체하고 `docs/GIT_WORKFLOW.md`와 `.ai_project/branch_pr_strategy.md`에 동일하게 반영됩니다.
