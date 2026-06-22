# CookLog Git Workflow

이 문서는 CookLog 저장소의 Git 운영 기준을 관리합니다. Git 전략이 바뀌면 이 문서를 우선 수정하고, 다른 문서는 이 문서를 참조합니다.

최종 업데이트: 2026-06-22

## 1. 운영 원칙

현재는 1인 개발 기준으로 단순하게 운영합니다.

- 기본 작업은 `main`에서 직접 진행합니다.
- 기능, 문서, 설정 변경 단위로 작게 커밋합니다.
- 작업이 끝나면 `main`을 바로 원격에 push합니다.
- 큰 실험, 파일 변화가 큰 작업, 며칠 이상 걸릴 작업만 `work/...` 임시 브랜치를 사용합니다.
- 임시 브랜치는 `main`에 merge한 뒤 삭제합니다.
- 작업 전 `git status -sb`로 상태를 확인합니다.
- 사용자 변경사항이 있으면 임의로 되돌리지 않습니다.

## 2. 기본 흐름

```bash
git status -sb
git pull origin main

# 작업

git add -A
git commit -m "feat: iOS 홈 화면 추가"
git push origin main
```

## 3. 임시 브랜치가 필요한 경우

다음 경우에만 `work/...` 임시 브랜치를 사용합니다.

- Xcode 프로젝트 생성처럼 파일 변화가 큰 작업
- 구현 방향이 확실하지 않은 실험
- 며칠 이상 걸릴 기능
- 중간에 `main`을 깨끗하게 유지하고 싶은 작업

브랜치 생성:

```bash
git checkout -b work/ios-project-setup
```

작업 완료 후:

```bash
git checkout main
git pull origin main
git merge work/ios-project-setup
git push origin main
git branch -d work/ios-project-setup
```

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
- `main`에 push

iOS 작업 종료 시 우선 갱신 문서:

- `apps/ios/docs/STATUS.md`
- `apps/ios/docs/DEVELOPMENT_PLAN.md`
- `apps/ios/docs/CHANGELOG.md`

Android 작업 종료 시 우선 갱신 문서:

- `apps/android/docs/STATUS.md`
- `apps/android/docs/DEVELOPMENT_PLAN.md`
- `apps/android/docs/CHANGELOG.md`
