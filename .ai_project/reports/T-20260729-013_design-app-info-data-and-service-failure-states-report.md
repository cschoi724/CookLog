# 앱 정보·데이터 보관·법적 문서·서비스 장애 디자인 실행 보고서

작성일: 2026-07-31
작성자: UI/UX Design Agent
판정: `verification_ready`

## 1. 작업 결과

사용자가 Home에서 앱 정보로 진입해 문의·법적 문서·데이터 보관 범위를 확인하고, 온라인 장애와 로컬 저장 실패에서 사용 가능한 기능과 다음 행동을 구분할 수 있게 공식 로컬 UI Source of Truth를 갱신했다.

- 시각·인터랙션 원본: `design/prototype/`
- 토큰·컴포넌트·상태 계약: `design/figma-build/manifest.json`
- Prototype revision: `app-info-data-service-failures-20260731`
- Figma는 수정하지 않았으며 로컬 원본과 이후 동기화할 버전 미러다.

## 2. 앱 정보와 지원

- Home 상단에 44pt 이상의 `앱 정보` 진입을 추가했다.
- 앱 정보 Overview에서 이메일 문의하기, 개인정보처리방침, 이용약관과 데이터 보관 안내에 접근한다.
- 문의 메일에 음성, STT 본문, 레시피 내용과 검색어를 자동 첨부하지 않는다고 명시했다.
- 앱 버전만 기본 비콘텐츠 정보로 안내하고, OS 버전·오류 화면과 시각·비콘텐츠 진단 범주는 사용자가 직접 선택할 때만 포함한다.
- 문의 주소 미확정 상태를 운영 가능한 주소처럼 표시하지 않고 출시 통합 전 연결 대상으로 안내한다.
- 이메일 앱 사용 불가 시 문의와 진단 정보가 전송되지 않았음을 확인하고 앱 정보 또는 문의 준비로 복귀한다.

## 3. 데이터 보관

- 진행 기록, STEP Preview와 완성 레시피가 현재 기기의 앱 저장소에 보관됨을 안내한다.
- 앱 삭제, 기기 초기화·분실과 로컬 저장소 손상 시 유실 가능성을 각각 설명한다.
- CookLog 자체 서버 백업, 복구, 기기 간 동기화와 레시피 내보내기를 첫 출시에서 제공하지 않는다고 명시한다.
- 운영체제 기기 백업으로 복원될 가능성도 CookLog가 백업 완료나 복구 가능 상태로 보장하지 않는다.

## 4. 법적 문서

- 개인정보처리방침과 이용약관 각각에 로딩, 운영 URL 미설정과 열기 실패 상태를 제공한다.
- URL 미설정 상태는 placeholder나 임시 문안을 공개 법적 문서처럼 표시하지 않는다.
- 열기 실패는 선택한 문서 링크만 다시 시도하며 앱 정보와 로컬 기능을 차단하지 않는다.
- 실제 법률 문안과 운영 URL은 이번 Task에서 작성하거나 확정하지 않았다.

## 5. 서비스 장애

- Home 인터넷 오류는 연결 범주와 다음 행동을 안내하고 진행·완료 레시피, 검색과 버튼 Audio Guide를 유지한다.
- 인터넷 연결 재확인은 실패했던 온라인 행동을 자동 실행하지 않는다.
- 기기 내 음성 변환 최종 실패는 기존 STEP을 보존하고 사용자가 다시 기록하게 한다.
- AI 정리 실패는 STEP Preview와 잠금 상태를 복구하고 `AI 정리만 다시 시도`를 제공한다.
- 로컬 저장 실패는 네트워크 오류와 구분하고 현재 편집값을 유지한 채 `로컬 저장 다시 시도`를 제공한다.
- 내부 오류 코드, 제공업체명과 서버 구조는 사용자 화면에 노출하지 않는다.

## 6. 제공 상태

App Info에 11개 상태를 제공한다.

- Overview
- Data Retention
- Contact Consent
- Contact Ready
- Mail Unavailable
- Privacy Loading
- Privacy URL Unconfigured
- Privacy Open Error
- Terms Loading
- Terms URL Unconfigured
- Terms Open Error

Home에는 Network Error 상태를 추가하고 기존 Cooking Log STT Final Failure, AI Review Generation Error와 Save Error를 장애 계약에 맞게 정합화했다.

## 7. 변경 파일

- `design/prototype/index.html`
- `design/prototype/app.js`
- `design/prototype/styles.css`
- `design/prototype/gallery.html`
- `design/prototype/README.md`
- `design/figma-build/manifest.json`
- T-013 Task, 실행 보고서와 관련 Task Board

## 8. 자체 검증

- `node --check design/prototype/app.js`: 통과
- Manifest JSON 파싱과 revision 일치: 통과
- Chrome 동적 검증:
  - Home 앱 정보 진입과 4개 정보 목적지: 통과
  - 문의 기본 콘텐츠 비첨부·선택적 진단 정보·준비 결과: 통과
  - 이메일 앱 사용 불가 시 미전송 확인: 통과
  - 앱 삭제·기기 초기화·분실·저장소 손상 유실 경계: 통과
  - 자체 백업·복구·동기화 미제공 안내: 통과
  - 법적 URL 미설정·열기 실패·선택 문서만 재시도: 통과
  - 인터넷·음성 변환·AI 정리·로컬 저장 실패별 보존 데이터와 CTA: 통과
- 375×667 App Info Light·Dark 상태 조합 `22/22`: overflow·clipping·44pt 실패 없음
- 375×667 접근성 글자 크기 Light·Dark 상태 조합 `22/22`: overflow·clipping·44pt 실패 없음
- `git diff --check`: 통과

## 9. Design QA 요청

- Home에서 앱 정보의 발견 가능성과 키보드 접근성
- 문의 기본값에서 사용자 콘텐츠가 포함되지 않는지
- 선택적 진단 정보가 명시적 사용자 선택 뒤에만 포함되는지
- 데이터 보관 문구가 운영체제 백업을 CookLog 보장처럼 오해하게 하지 않는지
- 실제 URL·문의 주소 미설정 상태가 운영 가능한 링크처럼 보이지 않는지
- 인터넷·음성 변환·AI·로컬 저장 실패가 서로 다른 다음 행동을 제공하는지
- 실패한 행동만 다시 실행하고 로컬 기능을 불필요하게 차단하지 않는지
- Light·Dark, 390×844·375×667, 접근성 글자 크기와 44pt 무회귀

## 10. 미확정 운영 값

- 문의 이메일 주소
- 개인정보처리방침 공개 URL과 실제 문안
- 이용약관 공개 URL과 실제 문안

위 값은 화면 구조와 placeholder 상태 검증을 차단하지 않지만 실제 링크 검증과 공개 출시 전 반드시 확정해야 한다.

## 11. Figma 및 Git

Figma 원본은 수정하지 않았다. 로컬 Prototype과 Manifest가 구현 및 Design QA 우선 기준이다. `git add`, commit, push, PR과 merge를 수행하지 않았다.

실행 worktree 기준점은 `cbbe2ab`이며 실행 시점 `origin/develop`보다 3커밋 뒤다. 후속 upstream은 프로젝트 공용 상태·Git guardrail 문서와 Task Board를 변경하며 Prototype·Manifest는 변경하지 않았다. 공용 Board는 병합 전 최신 develop 기준 정합화가 필요하다.

## 12. 인계

- worktree: `/private/tmp/cooklog-t20260729-013-rework`
- 브랜치: `task/T-20260729-013-design-app-info-rework`
- Task 상태: `verification_ready`
- 다음 담당: `Design QA Agent / Verification Role`
- 실행 lock: 해제

## 13. Design QA 재작업 결과

Product Owner가 승인한 `DQA-MEDIUM-013-001~002`만 보완했다.

- App Info Overview와 모든 하위 정보 화면의 제목을 프로그래밍 방식 포커스 대상으로 지정했다.
- Home의 앱 정보 진입, 정보 메뉴 전환, 문의 준비와 상태 보드 전환 뒤 새 화면 제목으로 포커스를 이동한다.
- 법적 문서 로딩 상태에도 포커스 가능한 로딩 제목을 제공하며 기존 로딩 완료의 안전한 복귀 control 포커스는 유지한다.
- 문의 기본 제공 정보는 `CookLog 1.0.0` 앱 버전뿐임을 명시했다.
- 선택형 진단 정보는 `OS 버전`, `오류 발생 화면·시각`, `비콘텐츠 진단 범주`로 열거하고 사용자의 명시적 선택 뒤에만 포함한다.
- 문의 준비 결과에서 선택한 진단정보 세 범위를 다시 확인할 수 있게 했다.

재작업 자체 검증:

- 실제 Chrome에서 Home → App Info 제목 포커스: 통과
- App Info → 문의 동의 및 문의 준비 제목 포커스: 통과
- 진단정보 기본 미선택, 선택 control 포커스 유지와 선택 결과 범위: 통과
- 기존 데이터 보관·법적 링크·메일 미사용·인터넷·STT·AI·로컬 저장 실패 회귀: 통과
- 375×667 App Info Light·Dark `22/22`: overflow·clipping·44pt 실패 없음
- 375×667 접근성 글자 크기 Light·Dark `22/22`: overflow·clipping·44pt 실패 없음
- `node --check design/prototype/app.js`: 통과
- `jq empty design/figma-build/manifest.json`: 통과
- `git diff --check`: 통과
- 변경 경로: Task `allowed_paths` 안

Figma, iOS 코드와 수익화 문서는 수정하지 않았다. commit, push, PR과 merge도 수행하지 않았다.
