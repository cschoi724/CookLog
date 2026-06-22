# CookLog iOS Testing

이 문서는 CookLog iOS 앱의 테스트 기준을 관리합니다.

최종 업데이트: 2026-06-22
상태: 확정

## 1. 테스트 원칙

- MVP 초기에는 Unit Test를 우선합니다.
- 도메인 모델, UseCase, Repository Mock, Service Mock 중심으로 검증합니다.
- UI 테스트는 핵심 흐름이 안정된 뒤 추가합니다.
- Mock, Preview, Test Fixture는 용도별로 분리합니다.

## 2. 우선순위

우선 테스트 대상:

- STEP Preview 누적 로직
- Mock STT 결과 처리
- Mock AI 정리 결과 생성
- RecipeDraft -> Recipe 변환
- Recipe 저장/조회
- Audio Player 단계 이동 로직

## 3. Mock과 Fixture

기준:

- 테스트용 Mock은 테스트 타겟 또는 테스트 helper에 둡니다.
- 앱 실행용 Mock DataSource/Service는 앱 타겟에 둘 수 있지만 이름에 `Mock`을 명확히 붙입니다.
- SwiftUI Preview 샘플은 `PreviewSupport/`에 둡니다.
- 테스트 Fixture는 Preview 샘플과 공유하지 않는 것을 기본으로 합니다.

## 4. 검증 시점

각 이정표 종료 시 최소 검증:

- M1: 도메인 모델과 STEP Preview 누적 로직 단위 테스트
- M3: Mock STT 기반 10초 기록 흐름 수동 테스트
- M4: Mock AI 변환 단위 테스트
- M6: Audio Player 단계 이동 로직 단위 테스트
- M7: 저장/조회 동작 확인
- M8: 전체 MVP 흐름 수동 테스트

## 5. 빌드 확인

프로젝트 생성 후에는 가능한 경우 다음을 확인합니다.

```text
xcodebuild build
xcodebuild test
```

정확한 scheme, destination은 프로젝트 생성 후 이 문서에 갱신합니다.
