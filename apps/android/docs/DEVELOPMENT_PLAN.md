# CookLog Android Development Plan

최종 업데이트: 2026-06-22
기준 PRD: `../../../docs/product/CookLog_PRD_v2.md`

## 현재 상태

Android 개발은 대기 상태입니다. iOS MVP를 먼저 구현하고 핵심 흐름이 안정된 뒤 Android 개발을 시작합니다.

## 개발 원칙

- 공통 제품 경험은 PRD v2를 따릅니다.
- 플랫폼 고유 구현은 Android 문서에 기록합니다.
- iOS 구현 결과를 무조건 복제하지 않고, Android 사용성과 플랫폼 권한 흐름에 맞춰 조정합니다.

## 예정 이정표

### A0. 개발 기반 준비

- [ ] Android 개발 환경 기준 확정
- [ ] 최소 Android 버전 확정
- [ ] 프로젝트 생성
- [ ] 기본 빌드 확인
- [ ] 기본 에뮬레이터 실행 확인

### A1. 도메인 모델과 서비스 경계

- [ ] `CookingLogSession` 모델 작성
- [ ] `StepPreview` 모델 작성
- [ ] `Recipe` 모델 작성
- [ ] `RecipeStep` 모델 작성
- [ ] STT 서비스 경계 정의
- [ ] AI 정리 서비스 경계 정의
- [ ] 레시피 저장소 경계 정의
- [ ] 오디오 가이드 서비스 경계 정의

### A2. MVP 화면 흐름

- [ ] Home
- [ ] Cooking Log
- [ ] AI Review
- [ ] Recipe Detail
- [ ] Audio Player

## 시작 조건

- iOS MVP의 M3 이상 흐름이 안정됩니다.
- 공통 도메인 모델 변경 가능성이 줄어듭니다.
- Android 개발 우선순위가 루트 상태 문서에서 활성화됩니다.
