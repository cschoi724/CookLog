# CookLog Project Status

최종 업데이트: 2026-07-27

## 현재 상태

- 전체 상태: PRD v2 확정, iOS MVP Core Loop 조건부 통과 후 마무리 안정화 단계
- 현재 우선 플랫폼: iOS
- Android 상태: 개발 대기
- iOS 프로젝트: `apps/ios/CookLog.xcodeproj` 생성 완료
- iOS 현재 이정표: M8. MVP 정리와 검증
- 기준 제품 문서: `docs/product/CookLog_PRD_v2.md`

## 현재 제품 기준

CookLog는 사용자가 요리 중 10초 음성 기록을 반복하면 앱이 STT 결과를 STEP Preview로 축적하고, `AI 정리하기` 시점에 레시피로 변환한 뒤 저장된 레시피를 오디오 가이드로 다시 소비하게 해주는 개인 레시피 저장소입니다.

## 현재 이정표

### 전체

- PRD v2 기준 문서 정리 완료
- 플랫폼별 개발 에이전트 운영 구조 정리 완료
- iOS MVP 핵심 흐름 구현 후 문서/검증 정리 단계
- AI Agent 운영 마이그레이션 초기화 완료
- 첫 파일럿 Task로 루트 프로젝트 상태 문서 동기화 진행
- iOS QA에서 발견된 AI Review STEP Preview 입력 전달 결함 수정 완료
- iOS MVP Core Loop 조건부 통과 완료

### iOS

- 현재 이정표: M8. MVP 정리와 검증
- 현재 상태:
  - SwiftUI 기반 `CookLog.xcodeproj` 생성 완료
  - Home, Cooking Log, AI Review, Recipe Detail, Audio Player 기본 흐름 구현
  - 도메인 모델, UseCase, Repository/DataSource, Mock 서비스 구성 완료
  - SwiftData 기반 로컬 Recipe 저장 경로 연결 완료
  - `AI 정리하기` route가 STEP Preview 배열을 직접 전달하도록 보정 완료
  - iPhone SE 시뮬레이터에서 Home -> 기록 -> AI Review -> 저장 -> Recipe Detail -> Audio Player -> 앱 재실행 저장 유지 흐름 확인
  - `xcodebuild build`와 `xcodebuild build-for-testing` 성공 이력 있음
  - AI Review, Recipe Detail, Audio Player, SwiftData 저장소 선별 테스트 18개 통과
  - 신규 P1 제품 결함 없음
  - `xcodebuild test`는 로컬 시뮬레이터 XCTest runner 단계 대기 이슈가 남아 있음
- 다음 작업:
  1. 실제 기기 또는 사람 손 입력으로 AI Review의 재료명/양, STEP 본문, 예상 시간, 메모 문자열 수정과 키보드 가림 최종 확인
  2. 2단계 이상 저장 레시피에서 Audio Player 이전/다음 단계 이동 수동 확인
  3. 필요 시 M8에서 발견된 작은 UI 문구/레이아웃 보정
  4. `xcodebuild test`의 시뮬레이터 XCTest runner 대기 원인 추가 확인
- 상세 상태 기준: `apps/ios/docs/STATUS.md`

### Android

- 상태: 개발 대기
- iOS MVP 흐름이 안정된 뒤 개발 착수 예정

## 운영 기준

- 공통 제품 기준은 `docs/product/`에서 관리합니다.
- 전체 프로젝트 상태, 변경 기록, 결정사항은 `docs/PROJECT_*` 문서에서 관리합니다.
- iOS 개발 상태, 계획, 스펙, 결정, 변경 기록은 `apps/ios/docs/`에서 관리합니다.
- Android 개발 상태, 계획, 스펙, 결정, 변경 기록은 `apps/android/docs/`에서 관리합니다.

## 열린 질문

- iOS `xcodebuild test`가 현재 로컬 시뮬레이터의 XCTest runner 설치/실행 단계에서 대기하는 원인을 추가 확인해야 합니다.

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
