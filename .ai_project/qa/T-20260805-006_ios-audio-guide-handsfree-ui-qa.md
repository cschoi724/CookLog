# T-20260805-006 iOS Audio Guide·핸즈프리 UI 독립 QA 요청

요청일: 2026-08-07
요청 Role: iOS Agent / Execution Role
대상 상태: `verification_ready`
검증 Role: iOS QA Agent / Verification Role
기준 상태: `origin/develop@8d3712d`

## 대상

- 보고서: `.ai_project/reports/T-20260805-006_ios-audio-guide-handsfree-ui-report.md`
- 구현 브랜치: `task/T-20260805-006-implement-ios-audio-guide`
- 허용 경로: Task frontmatter `allowed_paths`

## 구현 Agent 증빙

- AudioPlayer 집중 XCTest: 13/13
- 전체 XCTest: 77/77, 실패·skip 0
- build: iPhone 15 iOS 17.2 성공
- Light/Dark viewport: 390×844·375×667 4/4
- visual xcresult: `/private/tmp/T006Visual3.xcresult`
- full xcresult:
  `/var/folders/2_/vyvgp5h54fg0vy8j133f4mph0000gn/T/CookLog-XCTest/20260807-105633-13127/CookLogTests.xcresult`

## 필수 독립 반례

1. 로딩·조회 오류·준비 오류·단계 없음·not-found에서 재생 control 노출과 stop 상태
2. 진입 직후 STEP 1·Paused·핸즈프리 Off, 자동 play 0회
3. 버튼과 테스트 명령의 7개 `AudioGuideAction` reducer 동등성
4. 첫 이전·마지막 다음의 index·Paused·경계 안내 보존
5. 불확실 입력·핸즈프리 종료의 현재 단계·재생 상태 보존
6. 재료 안내의 step 불변과 종료 후 Paused
7. 전화/Siri 등 중단과 background/lock 후 자동 재생·자동 핸즈프리 없음
8. 수동 재개 시 재생만 복구되고 핸즈프리는 자동 활성화되지 않음
9. 화면 이탈·가이드 종료에서 stop과 핸즈프리 종료
10. 390×844·375×667 Light/Dark·44pt·Dynamic Type 기본 무회귀

## 판정 기록

- QA Agent가 별도 worktree와 고정 구현 commit으로 작성합니다.
- 통과 시 `verification_passed`, 결함 발견 시 `rework_requested`로 전환합니다.
- 독립 QA Agent가 구현 commit·push·merge 또는 Task `done`을 수행하지 않습니다.
