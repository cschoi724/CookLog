# T-20260805-006 iOS Audio Guide·핸즈프리 UI·공통 action model 구현 보고서

작성일: 2026-08-07
작성 Role: iOS Agent / Execution Role
상태: `verification_ready` — iOS QA 독립 검증 대기
public source: `origin/develop@8d3712d`

## 결과

저장된 Recipe의 단계·재료를 단일 원본으로 사용해 Audio Player 5개 Core Loop 상태와
not-found subtype을 구현했습니다. 7개 핸즈프리 명령은 `AudioGuideAction` 하나로 정의해
버튼과 테스트 입력이 같은 reducer 경계를 사용합니다. 진입·중단·복귀에서 자동 재생하거나
핸즈프리를 자동 활성화하지 않습니다.

## 구현 범위

- `PLAYER-PAUSED`, `PLAYER-PLAYING`, `PLAYER-LOADING`, `PLAYER-ERROR`,
  `PLAYER-NO-STEPS`와 not-found subtype
- 첫 단계 준비와 자동 재생·자동 핸즈프리 비활성
- 이전·다음·멈춰·계속·다시 들려줘·재료 알려줘·핸즈프리 종료 공통 action model
- 이전·다음·재생/일시정지·다시 듣기·재료 안내·핸즈프리 버튼 fallback
- 첫/마지막 단계 경계에서 index 보존·일시정지·명확한 안내
- 불확실 입력에서 단계·재생 위치·핸즈프리 상태 보존
- 오디오 중단·백그라운드·잠금 시 일시정지와 핸즈프리 종료, 명시적 수동 재개
- 화면 이탈·가이드 종료 시 재생 stop과 핸즈프리 종료
- Mock AudioGuide prepare·step·ingredients·pause·resume·stop 경계
- CookLog `bg/base|subtle|elevated`, accent·error Light/Dark 토큰과 Dynamic Type
- SF Symbols와 SwiftUI 네이티브 Button, 44pt 이상 핵심 컨트롤

## 자체 검증

- AudioPlayer 집중 XCTest `13/13`, 실패·skip 0
- 전체 XCTest `77/77`, 실패·skip 0
  - log: `/var/folders/2_/vyvgp5h54fg0vy8j133f4mph0000gn/T/CookLog-XCTest/20260807-105633-13127/xcodebuild.log`
  - xcresult: `/var/folders/2_/vyvgp5h54fg0vy8j133f4mph0000gn/T/CookLog-XCTest/20260807-105633-13127/CookLogTests.xcresult`
- iPhone 15 iOS 17.2 build: 성공
- 390×844·375×667 Light/Dark UIWindow 렌더링 `4/4`
  - xcresult: `/private/tmp/T006Visual3.xcresult`
  - attachments: `/private/tmp/T006Attachments3/`
- 시각 관찰: Light/Dark 토큰 전환, 스크롤 본문, 고정 재생 control, overflow·clipping 없음
- 44pt: 이전·다시·재생/일시정지·다음·재료·핸즈프리 핵심 Button frame 확인
- 금지 system 화면 배경·accent·status 색상 검색 0건
- 변경 파일은 Task `allowed_paths` 안에 있음
- `git diff --check`: 통과

## 독립 QA 요청

- 5개 Player 상태와 not-found가 서로 겹치지 않고 재시도가 같은 recipe ID를 유지하는지
- 진입 시 STEP 1·Paused·핸즈프리 Off이며 play 호출이 0인지
- 7개 action이 버튼과 테스트 명령 모두 같은 `send(_:)` reducer를 통과하는지
- 첫 이전·마지막 다음에서 index와 Paused, 경계 안내가 보존되는지
- 불확실 입력과 핸즈프리 종료가 재생·단계를 초기화하지 않는지
- 재료 안내가 현재 단계를 변경하지 않고 종료 후 Paused인지
- 오디오 중단·백그라운드·잠금 후 자동 재생·자동 핸즈프리 없음과 수동 재개 확인
- 화면 이탈·가이드 종료에서 stop·핸즈프리 종료 확인
- 390×844·375×667 Light/Dark, 44pt, Dynamic Type 기본 크기와 스크롤 회귀 확인

## 제외 범위와 잔여 위험

- 실제 System TTS와 실제 재생 위치 보존은 `T-20260729-006` 범위입니다.
- 실제 마이크·Speech 권한 요청과 음성 인식 엔진은 후속 구현 범위입니다.
- 백그라운드 오디오와 자동 잠금 제어는 이번 Task에 포함하지 않습니다.
- 권한·오프라인·전역 서비스 장애는 T-007, VoiceOver·Accessibility 3·통합 82/23 상태
  시각 회귀는 T-008에서 수행합니다.

## 인계

- worktree: `/private/tmp/cooklog-t20260805-006-ios-audio-guide`
- branch: `task/T-20260805-006-implement-ios-audio-guide`
- 상태: `verification_ready`
- lock: 해제
- 다음 담당: iOS QA Agent / Verification Role
