# CookLog Project Changelog

## 2026-07-31

- 루트 `agents.md`를 제품 세부 정책 복제 없이 역할·Source of Truth 탐색 중심으로 재구성했습니다.
- T-20260731-001에서 운영·iOS·Design 활성 문서와 최신 제품 정책·완료 Task의 정합성 복구를 시작했습니다.
- 2026-06-22 PDF PRD를 현재 제품 계약이 아닌 역사적 스냅샷으로 명확히 구분했습니다.
- Product QA가 확인한 활성 Team context·Board·QA routing·최신 develop 정합성 결함 4건의 재작업을 승인받아 반영했습니다.
- Product QA Agent를 정식 Verification Agent로 등록하고 T-20260730-004의 실제 `completion_review` 상태를 활성 문서에 반영했습니다.

## 2026-07-29

- 원격 STT 단독 비용이 정책 검토용 가정에서 월 약 10만 원으로 추정됨에 따라 첫 공개 출시 기본 STT를 Apple 기기 내 처리로 변경하는 제품 정책 Task `T-20260729-026`을 시작했습니다.
- 유료 원격 STT는 공통 인터페이스 뒤의 기본 비활성 교체형 adapter로 유지하고 기기 내 STT 실패 시 자동 fallback하지 않도록 제품 기준을 갱신했습니다.
- 기기 내 STT 품질·지원 범위나 구현 안정성이 출시 기준에 미달하면 원격 경로를 자동 활성화하지 않고 Product Owner 결정 게이트로 올리도록 했습니다.
- 개발 Agent의 기존 원격 STT 비교·아키텍처 산출물은 수정하지 않고 향후 adapter 검토 자료로만 보존했습니다.
- Product QA 재검증 `PASS`와 Product Owner 최종 승인을 반영해 `T-20260729-026`을 `done`으로 확정했습니다.

이 문서는 플랫폼과 무관한 전체 프로젝트 변경 기록을 관리합니다.

## 2026-07-29

- T-20260728-004를 PR #8로 `develop`에 squash merge하고 merge SHA `58403a0`을 확인해 `done`으로 확정했습니다.
- Product Charter, PRD, MVP Scope, User Flow, Wireframe와 Roadmap의 역할을 재정의하고 첫 공개 출시 기준으로 최신화했습니다.
- Roadmap을 제품 기준 고정, 병렬 Foundation, 제품 기능 구현, TestFlight·App Store 통합의 네 단계 실행 계획으로 재구성했습니다.
- 구형 Mock M8 잔여 검증 `T-20260728-001`을 취소하고 유효 검증 항목을 iOS 제품 구현과 최종 출시 게이트에 통합했습니다.
- T-003을 확정 제품 UX·디자인과 로컬 상태 모델 적용 Task로, T-005·006을 STT·AI Backend 계약·foundation Task로 수정했습니다.
- T-009를 실제 iOS·Backend 결과의 TestFlight·App Store 통합 출시 Task로 전환했습니다.
- 실제 Backend provider·배포, iOS online STT, AI Review 연동과 Audio Guide·핸즈프리 상위 Task `T-20260729-003~006`을 proposed로 등록했습니다.
- Design·Development Lead가 각 상위 Task를 실행 전 하위 Task로 분해하도록 패키지·성공 기준·승인 경계를 기록했습니다.
- Product QA Agent가 T-20260729-001을 `PASS_WITH_RISK`로 검증하고 Product Lead가 잔여 위험을 수용해 `done`으로 확정했습니다.
- Product QA 운영 등록과 루트 제품 안내 동기화를 AI Ops 후속 `T-20260729-007`로 등록했습니다.
- 10초 고정 기록, 원본 음성 삭제, STEP Preview 원문·삭제·시간순·자동 저장 정책을 제품 기준에 반영했습니다.
- 여러 진행 레시피, Home 상태별 카드 이동, AI Review 수동 임시 저장과 최종 완료 전환을 문서화했습니다.
- AI Review 조리 순서를 단계별 독립 입력 카드와 순서 배열로 정의했습니다.
- 완료 레시피 수정·덮어쓰기와 확인 후 영구 삭제 정책을 기록했습니다.
- 버튼 기반 단계별 Audio Guide와 첫 App Store 공개 출시 필수 핸즈프리 명령 범위를 분리했습니다.
- TTS 숫자·단위 읽기, 속도, 재료 듣기, 화면 잠금과 오디오 중단 정책을 추가했습니다.
- AI 정리 실패를 원인별로 안내하고 자동 재처리 없이 사용자가 다시 정리하도록 결정했습니다.
- 최종 레시피 저장 실패 시 현재 AI Review를 유지하고 완료 전환 없이 사용자가 다시 저장하도록 결정했습니다.
- 최종 저장 필수값을 제목과 조리 단계 최소 1개로 제한하고 나머지 레시피 항목은 선택 입력으로 확정했습니다.
- 빈 재료 행은 무시하고 재료명만 있는 행은 허용하며 수량만 있는 행은 재료명 입력을 요구하도록 결정했습니다.
- 빈 조리 단계는 저장에서 제외하고 내용이 있는 단계만 재번호화하며 전체 단계가 비었을 때만 저장을 막도록 결정했습니다.
- 마이크 권한은 첫 실행이 아니라 첫 기록 시점에 요청하고 거부해도 기존 레시피 기능을 계속 사용하도록 결정했습니다.
- 핸즈프리 권한은 첫 활성화 시점에 요청하고 거부 시 버튼 기반 Audio Guide를 유지하도록 결정했습니다.
- 별도 다단계 온보딩 없이 Home으로 바로 진입하고 첫 기능 사용 시점에만 짧게 안내하도록 결정했습니다.
- 당시 첫 출시 온라인 STT 기본안을 검토했으나 T-20260729-026에서 Apple 기기 내 STT 기본·원격 adapter 비활성·자동 fallback 없음으로 대체했습니다.
- 오프라인에서도 AI 정리 버튼을 유지하고 탭 시 연결 필요 안내 후 사용자가 다시 실행하도록 결정했습니다.
- AI 정리 요청 식별자와 진행 상태를 저장해 앱 백그라운드·재실행 후 같은 결과를 복구하고 중복 생성을 막도록 결정했습니다.
- AI 정리 중에는 요청에 사용한 STEP Preview를 잠그되 다른 레시피는 계속 사용할 수 있도록 결정했습니다.
- AI 정리가 10초를 넘으면 장기 처리와 다른 화면 사용 가능 안내를 표시하고 timeout은 실측 후 확정하도록 결정했습니다.
- AI 정리 완료는 첫 출시에서 앱 내부 배너와 Home 상태로 알리고 로컬·원격 푸시는 후속 검토로 두었습니다.
- 전체 보기에서 AI Review 진행 기록과 완료 레시피의 제목·재료명을 기기 내부에서 검색하는 기본 검색을 첫 출시 범위로 추가했습니다.
- 전체 보기 기본 정렬을 최근 활동순으로 정하고 검색 중에는 제목 일치 결과를 우선하도록 결정했습니다.
- Home의 최근 레시피는 진행·완료 상태를 함께 최근 활동순 최대 3개만 표시하도록 결정했습니다.
- Home 카드에 기록 중·AI 정리 중·검토 필요 상태와 완료 레시피 요약 정보를 구분해 표시하도록 결정했습니다.
- 첫 출시는 진행 기록과 완료 레시피를 기기 내부에만 저장하고 CookLog 자체 백업·복구와 내보내기는 제공하지 않도록 결정했습니다.
- 앱 삭제·기기 초기화·분실 시 데이터 유실 가능성을 데이터 보관 안내에 표시하고 상시 경고 배너는 사용하지 않도록 결정했습니다.
- 원본 음성의 비정상 잔존 방지 TTL을 최대 1시간, AI 결과 복구 캐시를 최대 24시간으로 제한했습니다.
- 사용자 콘텐츠가 없는 운영 메타데이터만 최대 30일 보관하고 레시피·음성·검색어는 분석과 오류 로그에서 제외하도록 결정했습니다.
- 외부 STT·AI 제공업체의 학습 사용을 비활성화하고 실제 보관 조건을 출시 전 검증·공개하도록 결정했습니다.
- 첫 공개 출시 품질 검증을 외부 테스터 없이 내부 1인·실제 iPhone 1대로 수행 가능한 최소 게이트로 확정했습니다.
- 핵심 흐름 3회, STT 10회, AI 기록 5개, 핸즈프리 명령별 1회와 주요 복구 시나리오를 최소 검증 범위로 정했습니다.
- 최소 검증에서도 데이터 손실, 안전 관련 AI 창작과 미해결 P0·P1 결함은 허용하지 않도록 결정했습니다.
- 온라인 장애 시 실패한 STT·AI 행동만 제한하고 로컬 기록·검색·저장·Audio Guide는 계속 사용하도록 결정했습니다.
- STT 최종 실패에는 `다시 기록하기`, AI 실패에는 `다시 정리하기`를 제공하고 서비스 복구 후 자동 실행하지 않도록 확정했습니다.
- 첫 출시 사용자 지원을 앱 정보의 이메일 문의, 개인정보처리방침, 이용약관과 데이터 보관 안내로 제한했습니다.

## 2026-07-28

- `T-20260728-004`에서 iOS XCTest 병렬 worker를 비활성화하고 단일 worker, 600초 timeout, 로그와 `xcresult` 보존 절차를 확정했습니다.
- SwiftData mapper 테스트를 실제 저장 조건과 맞추고 전체 XCTest 33개를 3회 연속 통과했습니다.
- iOS QA 독립 재현을 `PASS_WITH_RISK`로 통과했고 Product Owner가 Xcode 15.2 동일 환경 미검증 위험을 수용했습니다.
- 후속 `T-20260728-008`이 `Scripts/run-xctest.sh`를 `ios-xctest` check에 연결할 수 있도록 destination과 artifact 기준을 인계했습니다.
- `T-20260728-002` 디자인 변경을 PR #6으로 `develop`에 squash merge하고 Task를 `done`으로 확정했습니다.
- T-003 iOS UI 적용의 T-002 디자인 의존성을 충족 처리했으며, T-001 완료 전 실행 대기는 유지했습니다.
- `design/prototype/`을 공식 UI Source of Truth로 확정하고 Figma를 점진적 버전 미러로 전환했습니다.
- Warm Kitchen Journal 방향의 5개 MVP 화면, Light/Dark, 주요 상태와 핵심 흐름을 로컬 인터랙티브 프로토타입으로 구성했습니다.
- Design QA 결함 6건에 대응해 기록 반복·저장 전이, 저장 오류 복구, Player 피드백, WCAG AA 색상, 375×667 실제 프레임과 공통 컴포넌트 상태 갤러리를 보완했습니다.
- Figma 동기화를 위한 Manifest, 상태 ledger, 재개 Runbook과 Foundation 실행 스크립트를 `design/figma-build/`에 추가했습니다.
- `T-20260728-019`에 따라 일반 Task를 `develop`에서 통합하고 릴리즈 가능한 상태만 `main`에 승격하도록 Git 흐름을 전환했습니다.
- `main`과 `develop` 직접 push를 금지하고 `develop -> main` 통합 QA·제품 수용·사용자 승인 기준을 추가했습니다.
- 긴급 수정은 `hotfix/* -> main` 후 `develop`에 필수 backport하도록 기록했습니다.
- `T-20260728-007`에 따라 `feature_branch_pr`를 공식 Git 전략으로 확정했습니다.
- 코드, 설정, 디자인 산출물과 문서 변경에 Task branch와 Pull Request를 적용했습니다.
- `main` 직접 push를 금지하고 독립 검증, squash merge, 브랜치 삭제와 사용자 승인 경계를 명시했습니다.
- 초기 CI required check를 `ios-build`로 정하고 `ios-xctest`의 안정화 후 승격 조건을 기록했습니다.
- `docs/GIT_WORKFLOW.md`, `.ai_project/branch_pr_strategy.md`, 운영 모델과 Source of Truth의 충돌을 해소했습니다.

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
