# CookLog iOS Agent 안내

이 문서는 `apps/ios/` 전담 Agent의 역할, 기준 문서와 구현 절차를 안내합니다.

제품 기능 목록과 현재 Task 상태를 이 문서에 복제하지 않습니다. 실행 범위는 배정된 Task와 최신 제품 Source of Truth에서 확인합니다.

## 1. 역할과 범위

iOS Agent는 CookLog iOS 앱의 설계·구현·자체 검증과 플랫폼 문서 갱신을 담당합니다.

- 기본 수정 범위는 `apps/ios/`입니다.
- Task의 `allowed_paths`가 더 좁으면 Task 범위를 우선합니다.
- 루트·제품·디자인 문서는 별도 허용 경로와 담당 Lead 조율 없이 수정하지 않습니다.
- 앱 구현과 독립 QA를 같은 역할이 동시에 완료하지 않습니다.

## 2. 작업 시작 순서

1. `git status -sb`
2. `git branch --show-current`
3. 배정된 `.ai_project/tasks/` Task 파일
4. Task의 `source_of_truth`, `depends_on`, `allowed_paths`, `qa_to`
5. `docs/product/CookLog_PRD_v2.md`
6. `docs/product/CookLog_MVP_SCOPE.md`
7. Task가 지정한 Design Source of Truth
8. `apps/ios/docs/STATUS.md`
9. 관련 iOS 기술 문서

제품 범위는 Task와 루트 제품 문서가 우선합니다. iOS 문서가 오래된 Core MVP 이력과 현재 첫 공개 출시 범위를 혼용하면 임의로 해석하지 말고 Development Lead와 Product Lead에 충돌을 보고합니다.

## 3. iOS Source of Truth

| 영역 | 기준 문서 |
|---|---|
| 현재 상태 | `apps/ios/docs/STATUS.md` |
| 개발 단계·이력 | `apps/ios/docs/DEVELOPMENT_PLAN.md` |
| 기술 기준 | `apps/ios/docs/DEVELOPMENT_SPEC.md` |
| 아키텍처 | `apps/ios/docs/ARCHITECTURE.md` |
| 도메인 모델 | `apps/ios/docs/DATA_MODEL.md` |
| 저장 | `apps/ios/docs/PERSISTENCE.md` |
| 내비게이션 | `apps/ios/docs/NAVIGATION.md` |
| 서비스 경계 | `apps/ios/docs/SERVICES.md` |
| 테스트 | `apps/ios/docs/TESTING.md` |
| 플랫폼 결정 | `apps/ios/docs/DECISIONS.md` |
| 변경 기록 | `apps/ios/docs/CHANGELOG.md` |

UI 구현 기준은 `.ai_project/source_of_truth.md`의 UI/UX 원본 항목을 확인합니다. Figma 단독 화면을 최우선 기준으로 사용하지 않습니다.

## 4. 구현 원칙

- SwiftUI와 현재 프로젝트의 아키텍처·주입 방식을 유지합니다.
- Domain, Data, Service, Feature 경계를 지키고 View에 저장·외부 서비스 로직을 직접 넣지 않습니다.
- 실제 서비스와 Mock·Preview·Test Fixture를 명확히 분리합니다.
- 제품 정책을 플랫폼 편의상 변경하지 않습니다.
- 새 의존성이나 외부 SDK는 Task 승인 범위와 기술 결정 기록을 확인합니다.
- 첫 공개 출시 구현과 과거 Mock Core MVP 이력을 구분합니다.

## 5. 검증 원칙

- 테스트 명령과 destination은 `apps/ios/docs/TESTING.md`를 따릅니다.
- CI와 로컬 XCTest의 check 이름, timeout, 로그와 artifact 계약을 임의로 바꾸지 않습니다.
- 기능 변경은 관련 Unit Test, 빌드와 필요한 수동 검증을 수행합니다.
- 실제 기기 품질이 성공 기준인 Task는 Simulator 결과만으로 완료하지 않습니다.
- 자체 검증 후 Task 보고서를 갱신하고 지정된 Verification Agent에 인계합니다.

## 6. Git과 협업

- 일반 Task는 최신 `origin/develop` 기반 전용 worktree에서 수행합니다.
- 현재 루트 WIP 폴더와 다른 Agent의 worktree를 수정하지 않습니다.
- Task의 `allowed_paths`만 수정합니다.
- 사용자 변경사항을 임의로 되돌리지 않습니다.
- Task 상태 전이, commit, push, PR과 merge는 승인 범위를 확인합니다.
- 공용 파일 충돌 가능성이 있으면 Development Lead가 실행 순서를 조율합니다.

## 7. 세션 종료

- 변경 범위와 검증 결과를 보고합니다.
- `apps/ios/docs/STATUS.md`, 관련 기술 문서와 `CHANGELOG.md`의 갱신 필요성을 확인합니다.
- 미해결 제품 결정, 기술 위험과 후속 Task 의존성을 명시합니다.
- 추가 구두 설명 없이 다음 Agent가 이어갈 수 있도록 Task의 Next Agent Handoff를 유지합니다.
