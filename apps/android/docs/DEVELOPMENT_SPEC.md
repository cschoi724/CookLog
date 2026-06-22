# CookLog Android Development Spec

최종 업데이트: 2026-06-22
기준 PRD: `../../../docs/product/CookLog_PRD_v2.md`

## 현재 상태

Android 개발은 아직 시작하지 않았습니다. 이 문서는 Android 착수 전 최소 기준만 기록합니다.

## 권장 방향

초기 권장안:

- 언어: Kotlin
- UI: Jetpack Compose 우선 검토
- 아키텍처: 가벼운 MVVM
- 저장소: 로컬 저장 우선
- STT: Android SpeechRecognizer 또는 대체 STT 방식 검토
- 오디오 안내: Android TextToSpeech 우선 검토
- AI 정리: STEP Preview 누적 후 `AI 정리하기` 시점에만 호출

## 공통 도메인 개념

- `CookingLogSession`
- `StepPreview`
- `Recipe`
- `RecipeStep`
- `AIReviewResult`

## 보류 중인 결정

- 최소 Android 버전
- 로컬 저장 방식
- STT 구현 방식
- TTS 구현 방식
- iOS와 공유할 수 있는 스키마 관리 방식
