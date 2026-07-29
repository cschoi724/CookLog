# CookLog Project Status

최종 업데이트: 2026-07-29

## 현재 상태

- 전체 상태: 제품 정책·첫 공개 출시 Roadmap 확정 중, iOS Mock Core Loop 조건부 통과
- 현재 우선 플랫폼: iOS
- Android 상태: 개발 대기
- iOS 프로젝트: `apps/ios/CookLog.xcodeproj` 생성 완료
- iOS 현재 이정표: Core v1 출시 Foundation 진입 준비
- 기준 제품 문서: `docs/product/CookLog_PRD_v2.md`
- 기본 작업 브랜치: `develop`
- 안정·릴리즈 브랜치: `main`
- 제품 UX 상태: 기록·초안·AI Review·Audio Guide·개인정보·운영 정책 확정, 출시 Task 재구성 완료

## 현재 제품 기준

CookLog는 사용자가 요리 중 10초 음성 기록을 반복하면 앱이 STT 결과를 STEP Preview로 축적하고, `AI 정리하기` 시점에 레시피로 변환한 뒤 저장된 레시피를 오디오 가이드로 다시 소비하게 해주는 개인 레시피 저장소입니다.

음성은 STT 입력 도구로만 사용하고 보존되는 기록은 텍스트입니다. STEP Preview와 AI Review는 진행 상태로 복구할 수 있으며, 첫 App Store 공개 출시에서는 버튼 조작과 핸즈프리 음성 명령을 함께 제공하는 Audio Guide를 필수 범위로 둡니다. 첫 출시는 계정 없이 기기 내부에만 저장하며 CookLog 자체 백업·복구는 제공하지 않습니다. 음성·레시피 콘텐츠는 처리와 짧은 결과 복구에 필요한 기간만 서버에서 사용하고 운영·분석 로그에 남기지 않습니다.

## 현재 이정표

### 전체

- PRD v2 기준 문서 정리 완료
- 플랫폼별 개발 에이전트 운영 구조 정리 완료
- iOS MVP 핵심 흐름 구현 후 문서/검증 정리 단계
- AI Agent 운영 마이그레이션 초기화 완료
- 첫 파일럿 Task로 루트 프로젝트 상태 문서 동기화 진행
- iOS QA에서 발견된 AI Review STEP Preview 입력 전달 결함 수정 완료
- iOS MVP Core Loop 조건부 통과 완료
- 멀티팀 일반 Task는 `develop`에서 통합하고 릴리즈 가능한 상태만 `main`에 승격
- 10초 기록, STEP Preview, AI Review 임시 저장, 여러 진행 레시피와 완료 레시피 생명주기 정책 확정
- 첫 App Store 공개 출시의 핸즈프리 Audio Guide 필수 범위 확정
- 첫 출시의 로컬 저장 범위와 백업·복구 제외 정책 확정
- 음성·STT·AI 콘텐츠의 서버 임시 보관, 운영 메타데이터와 외부 제공업체 개인정보 원칙 확정
- 외부 테스터 없이 내부 1인·실기기 1대로 수행하는 첫 공개 출시 최소 품질 게이트 확정
- 온라인 장애 시 로컬 기능 유지, 사용자 재실행과 최소 지원 채널 정책 확정
- Product Charter·PRD·Scope·Flow·Wireframe와 첫 공개 출시 Roadmap 역할 재구성
- 구형 Mock M8 잔여 검증 Task 폐기, 유효 항목을 제품 구현·최종 출시 게이트에 통합
- Design, XCTest·CI, Backend Contract·Foundation, iOS 실서비스와 최종 Release 상위 Task 등록
- T-20260729-001 Product QA `PASS_WITH_RISK`와 Product Lead 완료 검토 후 `done`

### 첫 공개 출시 실행 순서

1. 완료: `T-20260729-001` 제품 문서와 Task 정합성 검증
2. 진행: `T-20260729-002` Design, `T-20260728-004` XCTest 완료 검토와 `T-20260728-005` Backend Contract 병렬 Foundation
3. 이후: iOS 로컬 제품 상태, Backend foundation·production gateway와 iOS 실제 STT·AI·Audio Guide 구현
4. 최종: `T-20260728-009` TestFlight 통합, 최소 품질 게이트와 App Store 제출 준비

### iOS

- 현재 이정표: Mock Core Loop 보존, 확정 제품 UX·실서비스 전환 대기
- 현재 상태:
  - SwiftUI 기반 `CookLog.xcodeproj` 생성 완료
  - Home, Cooking Log, AI Review, Recipe Detail, Audio Player 기본 흐름 구현
  - 도메인 모델, UseCase, Repository/DataSource, Mock 서비스 구성 완료
  - SwiftData 기반 로컬 Recipe 저장 경로 연결 완료
  - `AI 정리하기` route가 STEP Preview 배열을 직접 전달하도록 보정 완료
  - iPhone SE 시뮬레이터에서 Home -> 기록 -> AI Review -> 저장 -> Recipe Detail -> Audio Player -> 앱 재실행 저장 유지 흐름 확인
  - `xcodebuild build`와 `xcodebuild build-for-testing` 성공 이력 있음
  - AI Review, Recipe Detail, Audio Player, SwiftData 저장소 선별 테스트 18개 통과
  - 전체 XCTest 직렬 실행, 600초 timeout, 로그와 `xcresult` 보존 절차 확정
  - Xcode 26.6, iPhone 15 iOS 17.2 Simulator에서 전체 XCTest 33개 3회 연속 통과
  - 신규 P1 제품 결함 없음
  - Xcode 15.2 설치본 부재로 과거 worker 대기 현상의 동일 toolchain 재현은 잔여 위험
- 다음 작업:
  1. `T-20260728-008`에서 CI의 Xcode·Simulator 버전을 고정하고 표준 XCTest 스크립트와 artifact 보존 절차 재검증
  2. `T-20260729-002` 완료 후 `T-20260728-003`을 로컬 상태·화면 하위 Task로 분해
  3. Backend 계약·환경 이후 실제 STT·AI client 연동
  4. 로컬 TTS·핸즈프리 구현과 최종 실제 기기 검증
- 상세 상태 기준: `apps/ios/docs/STATUS.md`

### Android

- 상태: 개발 대기
- iOS MVP 흐름이 안정된 뒤 개발 착수 예정

## 운영 기준

- 공통 제품 기준은 `docs/product/`에서 관리합니다.
- 전체 프로젝트 상태, 변경 기록, 결정사항은 `docs/PROJECT_*` 문서에서 관리합니다.
- iOS 개발 상태, 계획, 스펙, 결정, 변경 기록은 `apps/ios/docs/`에서 관리합니다.
- Android 개발 상태, 계획, 스펙, 결정, 변경 기록은 `apps/android/docs/`에서 관리합니다.
- 모든 일반 Task 브랜치는 최신 `develop`에서 생성하고 `develop` 대상 PR을 사용합니다.
- `main`은 cross-team 통합 QA와 Product Lead 수용 검토를 통과한 승격 변경만 반영합니다.

## 열린 질문

- iOS QA Agent가 현재 지원 toolchain에서 `Scripts/run-xctest.sh`, timeout과 artifact 절차를 독립 재현해 `PASS_WITH_RISK`로 판정했습니다.
- Xcode 15.2 동일 환경 미검증 위험은 Product Owner가 수용했으며 T-20260728-008에서 CI의 Xcode·Simulator 버전을 고정해 재검증합니다.
- Backend runtime·배포 환경, STT·AI provider·model과 초기 비용 상한은 `T-20260728-005`에서 추천안을 준비해 Product Owner가 승인해야 합니다.
- 핸즈프리 Apple framework 조합과 지원 기기 범위는 `T-20260729-006`의 기술 spike 후 승인해야 합니다.
- 개인정보처리방침·이용약관 URL, 문의 이메일과 App Store metadata 실제 값은 `T-20260728-009`에서 확정해야 합니다.

## 다음 세션 시작 기준

루트 관리 세션은 이 문서를 먼저 확인합니다.

iOS 개발 세션은 다음 문서를 순서대로 확인합니다.

1. `apps/ios/agents.md`
2. `apps/ios/docs/STATUS.md`
3. `apps/ios/docs/DEVELOPMENT_PLAN.md`
4. `docs/product/CookLog_PRD_v2.md`

Android 개발 세션은 다음 문서를 순서대로 확인합니다.

1. `apps/android/agents.md`
2. `apps/android/docs/STATUS.md`
3. `docs/product/CookLog_PRD_v2.md`
