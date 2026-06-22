# CookLog iOS Changelog

이 문서는 iOS 앱 개발 변경 기록을 관리합니다.

## 2026-06-22

- iOS 개발 문서를 `apps/ios/docs/` 구조로 이동했습니다.
- `DEVELOPMENT_PLAN.md`를 PRD v2 기준으로 업데이트했습니다.
- `DEVELOPMENT_SPEC.md`에 10초 음성 기록, STEP Preview, A-Lite Strategy, 확장 가능한 Repository/DataSource/Service 경계를 반영했습니다.
- `DECISIONS.md`에 PRD v2와 STEP Preview 관련 결정사항을 반영했습니다.
- `STATUS.md`를 추가해 iOS 세션 시작 지점을 명확히 했습니다.
- Xcode 15.2, iOS 17 이상, SwiftData 사용, 레시피 검색 MVP 제외를 결정사항으로 기록했습니다.
- STT 실패 fallback 정책과 실제 AI API 연동 방향을 결정사항으로 기록했습니다.
- 프로젝트 직접 생성, DI 라이브러리 미사용, 도메인 모델과 SwiftData 모델 분리를 결정사항으로 기록했습니다.
- Feature 중심 MVVM + UseCase + Repository/DataSource 구조를 결정사항으로 기록했습니다.
- NavigationStack/AppRoute, AppError, 제한적 ViewState, Mock/Preview/Test 데이터 분리를 결정사항으로 기록했습니다.
- `DEVELOPMENT_SPEC.md`를 최상위 기술 기준과 문서 인덱스 역할로 축소했습니다.
- 아키텍처, 도메인 모델, 저장소, 내비게이션, 서비스, 테스트 기준을 역할별 문서로 분리했습니다.
- `DEVELOPMENT_PLAN.md`의 M0-M7 실행 순서와 체크리스트를 세분화해 다음 iOS 개발 세션의 시작 기준을 명확히 했습니다.

## 2026-06-19

- iOS 개발 에이전트 문서를 추가했습니다.
- iOS 개발 환경 권장안, 개발 계획, 의사결정 로그를 최초 작성했습니다.
