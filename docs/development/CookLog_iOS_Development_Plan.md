# CookLog iOS 개발 계획

이 문서는 CookLog iOS MVP 개발의 이정표, 체크리스트, 인수인계 기준을 관리하는 진행 문서입니다. iOS 개발 세션은 작업 시작 전 이 문서를 읽고, 작업 종료 전 진행 상태를 업데이트합니다.

작성일: 2026-06-19
최종 업데이트: 2026-06-22
기준 PRD: `docs/product/CookLog_PRD_v2.md`

## 현재 상태 요약

- 상태: PRD v2 반영 완료, 개발 준비 단계
- iOS 프로젝트: 아직 생성 전
- 현재 로컬 Xcode: 15.2
- 권장 구현: SwiftUI + MVVM + 로컬 저장 + STT 기반 STEP Preview + AI 정리 시점 호출
- 우선 참고 문서: `docs/product/CookLog_PRD_v2.md`

## 개발 원칙

- MVP는 iOS 네이티브 앱으로 먼저 완성합니다.
- 사용자는 레시피를 작성하지 않고 음성으로만 요리 과정을 기록합니다.
- 10초 기록 1회는 STEP Preview 1개를 만드는 단위입니다.
- STEP Preview는 STT 결과 기반이며 실제 AI 구조화 결과가 아닙니다.
- AI는 `AI 정리하기` 시점에만 호출합니다.
- 로그인, 공유, 커뮤니티, Import, OCR, AI 챗, 음성 명령은 만들지 않습니다.
- 개발 진행 중 이 문서의 체크리스트와 다음 작업 항목을 계속 갱신합니다.

## 핵심 MVP 목표

사용자는 요리 중 10초 음성 기록을 반복해서 남기고, 앱은 각 기록을 STEP Preview로 축적합니다. 사용자가 `AI 정리하기`를 누르면 전체 STEP Preview를 레시피로 정리하고, 저장된 레시피는 오디오 가이드로 다시 소비할 수 있어야 합니다.

성공 기준:

- 사용자가 Home에서 요리 기록을 시작할 수 있습니다.
- 사용자가 10초 음성 기록을 남길 수 있습니다.
- STT 결과가 STEP Preview로 즉시 추가됩니다.
- 사용자가 10초 기록을 반복할 수 있습니다.
- 전체 STEP Preview를 AI Review로 정리할 수 있습니다.
- AI Review 결과를 수정하고 저장할 수 있습니다.
- 저장된 레시피 상세를 볼 수 있습니다.
- 저장된 레시피를 단계별 오디오 플레이어로 재생할 수 있습니다.

## 전체 이정표

### M0. 개발 기반 준비

목표: iOS 프로젝트를 만들고 빌드 가능한 기본 앱 상태를 만든다.

체크리스트:

- [ ] Xcode 버전 기준 확정
- [ ] 최소 iOS 버전 확정
- [ ] `apps/ios/` 안에 iOS 프로젝트 생성
- [ ] SwiftUI App 템플릿 적용
- [ ] Unit Test 타겟 포함
- [ ] 앱 이름 `CookLog` 확인
- [ ] 기본 빌드 성공
- [ ] 기본 시뮬레이터 실행 성공
- [ ] 프로젝트 구조 정리
- [ ] `apps/ios/agents.md`에 실제 프로젝트 구조 반영

완료 기준:

- `xcodebuild` 또는 Xcode에서 기본 앱이 빌드됩니다.
- 다음 세션이 프로젝트를 열어 바로 개발을 시작할 수 있습니다.

### M1. 도메인 모델과 서비스 경계

목표: PRD v2 흐름에 맞는 최소 도메인 모델과 서비스 인터페이스를 만든다.

체크리스트:

- [ ] `CookingLogSession` 모델 작성
- [ ] `StepPreview` 모델 작성
- [ ] `Recipe` 모델 작성
- [ ] `RecipeStep` 모델 작성
- [ ] `AIReviewResult` 모델 작성
- [ ] `SpeechRecognitionService` 프로토콜 작성
- [ ] `RecipeAIService` 프로토콜 작성
- [ ] `RecipeStore` 프로토콜 작성
- [ ] `AudioGuideService` 프로토콜 작성
- [ ] Mock 서비스 작성
- [ ] 샘플 STEP Preview와 샘플 Recipe 데이터 작성
- [ ] STEP Preview 추가 로직 단위 테스트 작성

완료 기준:

- UI 없이도 10초 기록 결과를 STEP Preview로 쌓고, 샘플 레시피로 변환할 수 있습니다.

### M2. Home과 레시피 조회

목표: 저장된 레시피를 확인하고 요리 기록을 시작할 수 있는 첫 화면을 만든다.

체크리스트:

- [ ] Home 화면 작성
- [ ] 요리 기록 시작 버튼 작성
- [ ] 최근 레시피 영역 작성
- [ ] 레시피 목록 화면 작성
- [ ] 레시피 상세 화면으로 이동 연결
- [ ] 빈 상태 UI 작성
- [ ] 검색을 MVP에 포함할지 보류/확정

완료 기준:

- 사용자가 Home에서 기록을 시작하거나 저장된 레시피 상세로 이동할 수 있습니다.

### M3. 10초 음성 기록과 STEP Preview

목표: 사용자가 10초 음성 기록을 반복하고, 각 기록이 STEP Preview로 쌓이게 한다.

체크리스트:

- [ ] Cooking Log 화면 작성
- [ ] 10초 기록 버튼 작성
- [ ] 녹음 중 상태 UI 작성
- [ ] 남은 시간 표시
- [ ] STT 결과 표시
- [ ] STEP Preview 리스트 작성
- [ ] 10초 기록 반복 동작 작성
- [ ] 기록 실패 상태 작성
- [ ] STT 실패 시 재시도 또는 임시 텍스트 fallback 정책 결정
- [ ] AI 정리하기 버튼 작성
- [ ] STEP Preview가 없을 때 AI 정리하기 비활성화

완료 기준:

- 사용자가 10초 기록을 여러 번 수행하고 STEP Preview를 누적할 수 있습니다.

### M4. A-Lite와 AI Review

목표: STEP Preview는 STT 기반으로 유지하고, `AI 정리하기` 시점에만 레시피 구조화를 수행한다.

체크리스트:

- [ ] `RecipeAIService` Mock 구현 작성
- [ ] 전체 STEP Preview를 AI Review 입력으로 전달
- [ ] AI Review 화면 작성
- [ ] 레시피 제목 표시/수정
- [ ] 재료 표시/수정
- [ ] 조리순서 표시/수정
- [ ] 예상시간 표시/수정
- [ ] 메모 표시/수정
- [ ] 저장 버튼 작성
- [ ] 저장 후 Recipe Detail 이동 연결
- [ ] AI 정리 실패 상태 작성
- [ ] Mock AI 변환 단위 테스트 작성

완료 기준:

- 사용자가 누적한 STEP Preview가 레시피 형태로 정리되고, 모든 내용을 수정한 뒤 저장할 수 있습니다.

### M5. Recipe Detail

목표: 저장된 레시피를 다시 볼 수 있는 상세 화면을 만든다.

체크리스트:

- [ ] Recipe Detail 화면 작성
- [ ] 제목 표시
- [ ] 재료 표시
- [ ] 조리순서 표시
- [ ] 메모 표시
- [ ] 예상시간 표시
- [ ] 오디오 가이드 시작 버튼 작성
- [ ] 삭제 또는 편집 필요 여부 결정

완료 기준:

- 저장된 레시피의 핵심 정보가 읽기 좋게 표시됩니다.
- 오디오 플레이어로 진입할 수 있습니다.

### M6. 오디오 플레이어

목표: 저장된 레시피를 단계별 오디오 가이드로 재생한다.

체크리스트:

- [ ] `AudioGuideService` 구현 작성
- [ ] `AVSpeechSynthesizer` 기반 재생 작성
- [ ] Audio Player 화면 작성
- [ ] 현재 단계 표시
- [ ] 현재 단계 본문 표시
- [ ] 재생 버튼 작성
- [ ] 정지 버튼 작성
- [ ] 이전 단계 버튼 작성
- [ ] 다음 단계 버튼 작성
- [ ] 현재 단계 다시 듣기 버튼 작성
- [ ] 마지막 단계 처리
- [ ] 화면 이탈 시 재생 정리
- [ ] 단계 이동 로직 단위 테스트 작성

완료 기준:

- 사용자가 저장된 레시피를 버튼 기반 오디오 가이드로 소비할 수 있습니다.

### M7. 로컬 영구 저장

목표: 앱을 종료해도 저장된 레시피가 유지되게 한다.

체크리스트:

- [ ] SwiftData 적용 가능 여부 확정
- [ ] SwiftData 모델 또는 저장 모델 작성
- [ ] `RecipeStore` 실제 구현 작성
- [ ] Mock 저장소와 실제 저장소 교체 지점 정리
- [ ] 저장, 조회 동작 확인
- [ ] 앱 재실행 후 데이터 유지 확인
- [ ] 저장 실패 에러 처리 작성

완료 기준:

- 레시피가 로컬에 저장되고 앱 재실행 후에도 유지됩니다.

### M8. MVP 정리와 검증

목표: PRD v2 MVP 흐름을 끝까지 다듬고 다음 단계로 넘길 수 있게 한다.

체크리스트:

- [ ] 전체 기록 흐름 수동 테스트
- [ ] 10초 기록 반복 흐름 수동 테스트
- [ ] AI Review 수정/저장 수동 테스트
- [ ] 전체 다시 요리 흐름 수동 테스트
- [ ] 주요 단위 테스트 실행
- [ ] 빈 상태와 에러 상태 확인
- [ ] 권한 거부 상태 확인
- [ ] 작은 화면에서 레이아웃 확인
- [ ] 다크 모드 필요 여부 확인
- [ ] 앱 아이콘 또는 임시 아이콘 결정
- [ ] README 또는 실행 방법 문서 업데이트
- [ ] 남은 이슈 정리

완료 기준:

- iOS MVP의 핵심 흐름이 하나의 앱 안에서 동작합니다.
- 다음 작업자가 남은 작업을 문서만 보고 이어갈 수 있습니다.

## 세션 시작 체크리스트

새 iOS 개발 세션은 작업 시작 시 다음을 확인합니다.

- [ ] `git status -sb` 확인
- [ ] 루트 `agents.md` 확인
- [ ] `apps/ios/agents.md` 확인
- [ ] `docs/product/CookLog_PRD_v2.md` 확인
- [ ] 이 개발 계획 문서 확인
- [ ] 최근 작업 로그 확인
- [ ] 현재 이정표와 다음 작업 확인

## 세션 종료 체크리스트

작업을 마치기 전 다음을 업데이트합니다.

- [ ] 완료한 체크리스트 항목 체크
- [ ] 현재 이정표 상태 업데이트
- [ ] 다음 작업 항목 업데이트
- [ ] 새로 생긴 결정은 의사결정 로그에 기록
- [ ] 빌드 또는 테스트 결과 기록
- [ ] 막힌 점이 있으면 명확히 기록

## 현재 진행 위치

현재 이정표: M0. 개발 기반 준비

다음 작업:

1. Xcode 버전 기준 확정
2. 최소 iOS 버전 확정
3. `apps/ios/`에 SwiftUI iOS 프로젝트 생성
4. 기본 빌드와 시뮬레이터 실행 확인
5. 실제 프로젝트 구조를 `apps/ios/agents.md`에 반영

## 최근 작업 로그

### 2026-06-22

- `docs/product/CookLog PRD v2.pdf`를 기준으로 PRD v2 Markdown 문서를 추가했습니다.
- 제품 문서, MVP 범위, 사용자 흐름, 와이어프레임, 로드맵을 PRD v2 기준으로 업데이트했습니다.
- iOS 개발 계획을 10초 음성 기록, STEP Preview, A-Lite Strategy, AI Review 중심으로 재정리했습니다.

### 2026-06-19

- 루트 `agents.md`를 전체 서비스 관리 에이전트 기준으로 재정리했습니다.
- `apps/ios/agents.md`를 추가해 iOS 개발 에이전트 기준을 만들었습니다.
- `docs/development/CookLog_iOS_Development_Environment.md`를 추가해 iOS 개발 환경 권장안을 정리했습니다.
- 이 개발 계획 문서를 추가했습니다.

## 열린 질문

- 실제 프로젝트 생성 시 Xcode 15.2를 그대로 사용할지, 최신 안정 Xcode로 업데이트한 뒤 시작할지 결정이 필요합니다.
- 최소 iOS 버전을 iOS 17 이상으로 확정할지, iOS 16 지원을 고려할지 결정이 필요합니다.
- 로컬 저장을 SwiftData로 바로 시작할지, 프로젝트 생성 환경에 따라 JSON 저장으로 먼저 시작할지 결정이 필요합니다.
- STT 실패 시 텍스트 fallback을 개발용으로만 허용할지, 사용자 기능으로 노출할지 결정이 필요합니다.
- 레시피 검색을 MVP에 포함할지 PRD v2 기준으로 재확정이 필요합니다.

## 관련 문서

- `docs/product/CookLog_PRD_v2.md`
- `docs/product/CookLog_PRODUCT.md`
- `docs/product/CookLog_MVP_SCOPE.md`
- `docs/product/CookLog_USER_FLOW.md`
- `docs/product/CookLog_WIREFRAME.md`
- `docs/product/CookLog_ROADMAP.md`
- `docs/development/CookLog_iOS_Development_Environment.md`
- `docs/development/CookLog_iOS_Decision_Log.md`
- `apps/ios/agents.md`
