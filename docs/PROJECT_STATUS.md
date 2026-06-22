# CookLog Project Status

최종 업데이트: 2026-06-22

## 현재 상태

- 전체 상태: PRD v2 확정, iOS MVP 개발 착수 준비
- 현재 우선 플랫폼: iOS
- Android 상태: 개발 대기
- iOS 프로젝트: 아직 생성 전
- 기준 제품 문서: `docs/product/CookLog_PRD_v2.md`

## 현재 제품 기준

CookLog는 사용자가 요리 중 10초 음성 기록을 반복하면 앱이 STT 결과를 STEP Preview로 축적하고, `AI 정리하기` 시점에 레시피로 변환한 뒤 저장된 레시피를 오디오 가이드로 다시 소비하게 해주는 개인 레시피 저장소입니다.

## 현재 이정표

### 전체

- PRD v2 기준 문서 정리 완료
- 플랫폼별 개발 에이전트 운영 구조 정리 완료
- iOS MVP 개발 준비 단계

### iOS

- 현재 이정표: M0. 개발 기반 준비
- 다음 작업:
  1. `apps/ios/`에 SwiftUI iOS 프로젝트 생성
  2. 기본 빌드와 시뮬레이터 실행 확인
  3. 실제 프로젝트 구조를 `apps/ios/agents.md`와 `apps/ios/docs/` 문서에 반영

### Android

- 상태: 개발 대기
- iOS MVP 흐름이 안정된 뒤 개발 착수 예정

## 운영 기준

- 공통 제품 기준은 `docs/product/`에서 관리합니다.
- 전체 프로젝트 상태, 변경 기록, 결정사항은 `docs/PROJECT_*` 문서에서 관리합니다.
- iOS 개발 상태, 계획, 스펙, 결정, 변경 기록은 `apps/ios/docs/`에서 관리합니다.
- Android 개발 상태, 계획, 스펙, 결정, 변경 기록은 `apps/android/docs/`에서 관리합니다.

## 열린 질문

- 현재 열린 질문 없음

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
