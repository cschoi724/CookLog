# CookLog Android agents.md

이 문서는 `apps/android/` 전담 개발 에이전트가 추가 컨텍스트 없이 CookLog Android 앱을 개발하기 위한 기준입니다.

## 역할

이 폴더의 에이전트는 CookLog Android 앱을 실제로 설계하고 구현합니다.

- 작업 범위는 기본적으로 `apps/android/` 안으로 제한합니다.
- 공통 제품 기준은 `docs/product/CookLog_PRD_v2.md`를 따릅니다.
- Android 개발 상태와 계획은 `apps/android/docs/` 문서를 따릅니다.
- 루트 문서나 제품 문서를 수정해야 하면 변경 이유를 명확히 남깁니다.
- 구현 중 제품 판단이 필요한 경우 현재 MVP 범위를 우선합니다.

## 현재 상태

Android 개발은 아직 대기 상태입니다. iOS MVP 흐름이 안정된 뒤 Android 개발을 시작합니다.

## 제품 기준

CookLog는 개인 요리 기록 앱입니다. 사용자가 요리 중 10초 음성 기록을 반복하면 앱은 STT 결과를 STEP Preview로 축적하고, 사용자가 `AI 정리하기`를 선택했을 때 레시피로 정리합니다. 저장된 레시피는 오디오 가이드로 다시 재생할 수 있어야 합니다.

## MVP 포함 기능

- 10초 음성 기록
- STT
- STEP Preview 생성
- 10초 기록 반복
- AI 정리
- 레시피 검토
- 레시피 저장
- 레시피 목록
- 레시피 상세 조회
- 단계별 오디오 플레이어
- 이전 단계, 재생/정지, 다음 단계, 다시 듣기

## MVP 제외 기능

- 로그인
- 회원가입
- 공유
- 커뮤니티
- 공개 레시피
- 블로그 Import
- 유튜브 Import
- 이미지 OCR
- AI 챗
- 음성 명령

## 개발 시작 전 확인 문서

1. `docs/product/CookLog_PRD_v2.md`
2. `apps/android/docs/STATUS.md`
3. `apps/android/docs/DEVELOPMENT_PLAN.md`
4. `apps/android/docs/DEVELOPMENT_SPEC.md`
5. `apps/android/docs/DECISIONS.md`

## 개발 절차

1. 작업 전 `git status -sb`를 확인합니다.
2. `apps/android/docs/STATUS.md`에서 현재 상태와 다음 작업을 확인합니다.
3. Android 프로젝트가 없다면 `apps/android/` 안에 생성합니다.
4. 기능은 사용자 흐름 단위로 작게 구현합니다.
5. 빌드 또는 테스트를 실행하고 결과를 남깁니다.
6. 사용자 변경사항은 임의로 되돌리지 않습니다.

## Git 기준

- Git 운영 기준은 `../../docs/GIT_WORKFLOW.md`를 따릅니다.
- 작업 전 `git status -sb`로 상태를 확인합니다.
- 사용자 변경사항이 있으면 임의로 되돌리지 않습니다.

작업 종료 전에는 가능하면 다음 문서를 갱신합니다.

- `apps/android/docs/STATUS.md`
- `apps/android/docs/DEVELOPMENT_PLAN.md`
- `apps/android/docs/CHANGELOG.md`
