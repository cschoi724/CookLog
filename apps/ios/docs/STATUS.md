# CookLog iOS Status

최종 업데이트: 2026-06-22

## 현재 상태

- 상태: iOS 프로젝트 골격 생성 완료
- 기준 PRD: `../../../docs/product/CookLog_PRD_v2.md`
- iOS 프로젝트: `CookLog.xcodeproj` 생성 완료
- 현재 로컬 Xcode: 15.2
- 현재 이정표: M0. 개발 기반 준비 완료, M1 착수 대기
- scheme: `CookLog`
- 검증 destination: `platform=iOS Simulator,name=iPhone 15,OS=17.2`

## 다음 작업

1. M1-A 도메인 모델 작성
2. M1-B Repository/DataSource/Service 프로토콜 작성
3. M1-C UseCase와 Mock 구현 작성
4. `xcodebuild test`의 시뮬레이터 XCTest runner 대기 현상 재확인

## 최근 작업

- PRD v2 기준으로 iOS 개발 계획을 업데이트했습니다.
- iOS 개발 문서를 `apps/ios/docs/`로 이동했습니다.
- iOS 전담 개발 세션 기준을 `apps/ios/agents.md`에 정리했습니다.
- 향후 확장을 고려한 iOS 개발 스펙을 작성했습니다.
- 현재 개발 Mac 기준으로 Xcode 15.2를 개발 기준으로 확정했습니다.
- 최소 iOS 버전을 iOS 17 이상으로 확정했습니다.
- MVP 로컬 저장은 SwiftData로 바로 시작하기로 확정했습니다.
- 레시피 검색은 MVP에서 제외하고 보류하기로 결정했습니다.
- STT 실패 시 사용자 텍스트 입력 fallback은 제공하지 않고 다시 녹음/권한 안내를 제공하기로 결정했습니다.
- 실제 AI API는 앱 직접 호출을 피하고 추후 백엔드 프록시 방식을 우선 검토하기로 결정했습니다.
- 프로젝트는 Xcode에서 직접 생성하기로 결정했습니다.
- DI 라이브러리 없이 수동/생성자 주입으로 진행하고, 외부 패키지가 필요해지면 SPM으로 관리하기로 결정했습니다.
- SwiftData 저장 모델과 도메인 모델은 분리하기로 결정했습니다.
- iOS 개발 기술 스펙을 확정했습니다.
- Feature 중심 MVVM + UseCase + Repository/DataSource 구조를 확정했습니다.
- NavigationStack/AppRoute, AppError, 제한적 ViewState, Mock/Preview/Test 데이터 분리를 확정했습니다.
- 비대해질 수 있는 iOS 개발 스펙을 역할별 문서로 분리했습니다.
- `ARCHITECTURE.md`, `DATA_MODEL.md`, `PERSISTENCE.md`, `NAVIGATION.md`, `SERVICES.md`, `TESTING.md`를 추가했습니다.
- iOS 개발 세션이 바로 착수할 수 있도록 `DEVELOPMENT_PLAN.md`의 M0-M7 실행 순서와 체크리스트를 구체화했습니다.
- `apps/ios/` 안에 SwiftUI 기반 `CookLog.xcodeproj`를 생성했습니다.
- 앱 타겟 `CookLog`와 Unit Test 타겟 `CookLogTests`를 추가했습니다.
- `CookLog/App`, `Domain`, `Data`, `Services`, `Features`, `Support`, `PreviewSupport`, `Resources` 폴더 구조를 생성했습니다.
- 기본 시작 화면은 `CookLog/Features/Home/ContentView.swift`에 임시 화면으로 두었습니다.
- `xcodebuild -project CookLog.xcodeproj -scheme CookLog -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' build` 성공을 확인했습니다.
- `xcodebuild -project CookLog.xcodeproj -scheme CookLog -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' build-for-testing` 성공을 확인했습니다.
- `xcrun simctl install booted .../CookLog.app`와 `xcrun simctl launch booted app.cooklog.CookLog`로 시뮬레이터 설치/실행을 확인했습니다.
- `xcodebuild test`는 테스트 번들 빌드 후 시뮬레이터 XCTest runner 설치/실행 단계에서 대기해 수동 중단했습니다.

## 열린 질문

- `xcodebuild test`가 현재 로컬 시뮬레이터의 XCTest runner 설치/실행 단계에서 대기하는 원인을 추가 확인해야 합니다.

## 세션 시작 체크리스트

- [ ] `git status -sb` 확인
- [ ] `apps/ios/agents.md` 확인
- [ ] 이 문서의 현재 상태와 다음 작업 확인
- [ ] `apps/ios/docs/DEVELOPMENT_PLAN.md` 확인
- [ ] 작업 주제에 맞는 역할별 상세 문서 확인
- [ ] `../../../docs/product/CookLog_PRD_v2.md` 확인

## 세션 종료 체크리스트

- [ ] 완료한 작업을 이 문서에 반영
- [ ] 개발 계획 체크리스트 업데이트
- [ ] 새 결정사항을 `DECISIONS.md`에 기록
- [ ] 변경사항을 `CHANGELOG.md`에 기록
- [ ] 빌드/테스트 결과 기록
