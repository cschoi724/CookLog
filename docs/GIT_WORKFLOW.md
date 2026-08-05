# CookLog Git Workflow

이 문서는 CookLog 저장소의 Git 운영 기준을 관리합니다. Git 전략이 바뀌면 이 문서를 우선 수정하고, 다른 문서는 이 문서를 참조합니다.

최종 업데이트: 2026-08-05

## 1. 운영 원칙

CookLog는 승인된 `feature_branch_pr` 전략을 사용합니다.

- 기준 브랜치는 `main`입니다.
- `main`에서 직접 작업하거나 직접 push하지 않습니다.
- Task별 브랜치는 `task/<task-id>-<slug>` 형식을 사용합니다.
- 기능, 문서, 설정 변경 단위로 작게 커밋합니다.
- commit은 해당 Execution Role이 담당합니다.
- push와 merge는 Product Owner인 사용자의 승인 후 진행합니다.
- PR은 필수이며 Verification Role의 독립 검토를 거칩니다.
- merge 방식은 squash를 기본으로 하고 merge 후 Task 브랜치를 삭제합니다.
- 작업 전 `git status -sb`로 상태를 확인합니다.
- 사용자 변경사항이 있으면 임의로 되돌리지 않습니다.

## 2. 기본 흐름

```bash
git status -sb
git pull origin main
git checkout -b task/T-YYYYMMDD-NNN-short-slug

# 작업

git add -A
git commit -m "feat: iOS 홈 화면 추가"
git push -u origin task/T-YYYYMMDD-NNN-short-slug

# PR 생성 후 Verification Role 검토
# Product Owner 승인 후 squash merge
```

push, PR 생성과 merge는 각각 사용자 승인을 확인한 뒤 실행합니다.

## 3. 브랜치와 PR 기준

모든 실행 Task는 원칙적으로 별도 Task 브랜치를 사용합니다.

- 브랜치: `task/<task-id>-<slug>`
- base: `main`
- PR 생성: Execution Role
- PR 검토: Verification Role
- merge 권고: Development Lead Agent
- merge 승인: Product Owner
- CI 준비 전: Task에 지정된 빌드·테스트·수동 QA 결과를 PR에 기록

예시:

```bash
git checkout main
git pull origin main
git checkout -b task/T-20260805-001-sync-agent-policy
```

직접 merge하지 않고 승인된 PR 흐름을 사용합니다.

긴급 수정이나 예외적으로 `main` 직접 작업이 필요한 경우에도 Product Owner의 사전 승인이 필요합니다.

## 4. 커밋 메시지

커밋 메시지는 한글 설명을 기본으로 작성하고, 변경 성격을 알 수 있도록 영문 타입 prefix를 붙입니다.

예시:

- `docs: iOS 개발 문서 정리`
- `feat: iOS 홈 화면 추가`
- `feat: 레시피 로컬 저장 구현`
- `fix: 오디오 플레이어 단계 이동 수정`
- `chore: Xcode 설정 정리`

주요 타입:

- `feat`: 사용자 기능 추가 또는 변경
- `fix`: 버그 수정
- `docs`: 문서 추가 또는 수정
- `design`: 디자인 산출물 또는 UI 스타일 변경
- `refactor`: 동작 변경 없는 코드 구조 개선
- `test`: 테스트 추가 또는 수정
- `chore`: 설정, 빌드, 저장소 관리 작업

## 5. 커밋 단위

기준:

- 되돌릴 수 있는 단위로 작게 커밋합니다.
- 문서 변경과 코드 변경은 가능하면 커밋을 분리합니다.
- 작업 상태를 바꾸는 문서 업데이트는 관련 기능 커밋에 포함해도 됩니다.
- 빌드가 깨진 상태의 커밋은 피합니다.

## 6. 작업 종료 체크리스트

작업 종료 전 확인:

- `git status -sb`로 변경사항 확인
- 필요한 문서 업데이트
- 가능하면 빌드 또는 테스트 실행
- 의미 있는 단위로 커밋
- 사용자 승인 후 Task 브랜치 push 및 PR 생성
- Verification 결과 기록
- Development Lead의 merge 판단과 Product Owner 승인 확인

iOS 작업 종료 시 우선 갱신 문서:

- `apps/ios/docs/STATUS.md`
- `apps/ios/docs/DEVELOPMENT_PLAN.md`
- `apps/ios/docs/CHANGELOG.md`

Android 작업 종료 시 우선 갱신 문서:

- `apps/android/docs/STATUS.md`
- `apps/android/docs/DEVELOPMENT_PLAN.md`
- `apps/android/docs/CHANGELOG.md`
