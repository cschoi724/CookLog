# T-20260729-013 독립 Design QA 재검증 보고서

작성일: 2026-07-31
검증자: Design QA Agent / Verification Role
판정: `PASS`
Task 전이: `verification_ready -> verification_passed`
인계 대상: Design Lead Agent / Completion Role

## 1. 검증 대상과 환경

- 전용 worktree: `/private/tmp/cooklog-t20260729-013-rework`
- 브랜치: `task/T-20260729-013-design-app-info-rework`
- 재작업 기준 HEAD: `0014935ea38e7e1c64a3480eb919bc9b5738f501`
- 검증 시점 `origin/develop`: `153bc4432400253cb97c14313efaedbed46938fd`
- merge base: `0014935ea38e7e1c64a3480eb919bc9b5738f501`
- Prototype revision: `app-info-data-service-failures-20260731`
- 검증 대상:
  - `design/prototype/`
  - `design/figma-build/manifest.json`
  - `.ai_project/reports/T-20260729-013_design-app-info-data-and-service-failure-states-report.md`
  - `.ai_project/tasks/active/T-20260729-013_design-app-info-data-and-service-failure-states.md`

검증 시점 `origin/develop`에는 재작업 기준점 이후 Backend T-024 관련 커밋 2개가
추가돼 있다. 해당 커밋은 Prototype·Manifest를 변경하지 않으므로 고정된 T-013
디자인 산출물의 판정에는 영향을 주지 않는다.

## 2. 재검증 방법

- 로컬 HTTP 서버와 실제 headless Chrome 런타임
- Home에서 App Info 진입 후 활성 요소와 다음 Tab 순서 확인
- Overview, 문의, 문의 준비, 이메일 앱 미사용, 데이터 보관, 법적 링크 화면 전환 포커스 확인
- 개인정보처리방침·이용약관 로딩, 완료와 재시도 포커스 확인
- 문의 기본값·선택형 진단 정보·준비 결과의 포함 범위 대조
- 데이터 보관, 인터넷·STT·AI·로컬 저장 실패의 보존 데이터와 CTA 회귀 확인
- 375×667 Light·Dark, 일반·접근성 글자 크기 App Info 44개 조합 검사
- WCAG AA 핵심 색상 대비 계산
- JavaScript, Manifest, revision과 diff 정적 검사

## 3. 기존 결함 재검증

### DQA-MEDIUM-013-001 — 해소

Home의 `앱 정보`를 실행한 직후 활성 요소는 `BODY`가 아니라 App Info Overview의
`나의 요리 기록` `H2`다. 다음 Tab은 첫 메뉴 항목인 `이메일 문의하기`로 이동한다.
review와 embedded 실행에서 같은 결과를 확인했다.

하위 화면도 다음과 같이 전환 직후 제목 포커스와 3px 가시적 포커스 링을 제공한다.

- 문의 정보 선택: `어떤 정보와 함께 문의할까요?`
- 문의 준비: `문의 메일을 준비했어요`
- 이메일 앱 미사용: `이메일 앱을 열 수 없어요`
- 데이터 보관: `내 요리 기록은 이 기기에 보관돼요`
- 개인정보처리방침·이용약관 로딩: 각 `문서를 여는 중` `H3`
- 법적 링크 오류: 해당 문서를 열지 못했다는 `H2`

법적 링크 로딩 완료 후에는 안전한 복귀 control인 `앱 정보로 돌아가기`에 포커스가
유지된다. 모든 확인 대상에서 포커스 링이 실제 계산 스타일 `solid 3px`로 표시됐다.

### DQA-MEDIUM-013-002 — 해소

- 기본 선택값: `aria-pressed="false"`
- 기본 제공: `CookLog 1.0.0` 앱 버전만 표시
- 기본 문의 준비 결과: 진단 정보 `포함 안 함`
- 선택 control: `OS 버전`, `오류 발생 화면·시각`, `비콘텐츠 진단 범주`를 모두 열거
- 선택 후: `aria-pressed="true"`와 control 포커스 유지
- 선택 문의 준비 결과: 동일한 세 범위를 다시 열거
- 사용자 콘텐츠: 음성, STT 본문, 레시피와 검색어 자동 첨부 없음

Prototype 문구와 Manifest의 `defaultMetadata`, `optionalMetadata`,
`optionalMetadataRequiresExplicitSelection` 계약이 일치한다.

## 4. 기존 통과 항목 무회귀

### 앱 정보·데이터 보관·법적 링크

- Overview에서 문의, 개인정보처리방침, 이용약관과 데이터 보관 4개 목적지 제공
- 진행 기록·STEP Preview·완료 레시피의 현재 기기 저장 안내
- 앱 삭제, 기기 초기화·분실, 저장소 손상 시 유실 위험 구분
- CookLog 자체 백업·복구·기기 간 동기화·내보내기 미제공 명시
- 운영체제 백업을 CookLog가 보장하지 않는다고 명시
- 이메일 앱 사용 불가 시 미전송과 로컬 데이터 무영향 안내
- 법적 URL 미설정 상태가 placeholder를 공개 문서로 오인시키지 않음
- 이용약관 오류 재시도는 선택한 문서만 `loading -> unconfigured`로 전이

### 서비스 장애와 데이터 보존

- 인터넷 오류: 최근 로컬 카드 3개 유지, 실패한 온라인 행동 자동 재실행 없음
- STT 최종 실패: 기존 STEP 2개 유지, 임시 음성 삭제, 원격 STT 전환 없음
- AI 실패: STEP Preview 보존과 snapshot 잠금 해제, AI 정리만 재시도
- 로컬 저장 실패: 네트워크 장애와 구분, 편집 제목 보존
- 로컬 저장 재시도: 보존 제목으로 저장 후 Recipe Detail에 동일 제목 반영
- 내부 오류 코드, provider 이름과 서버 구조 노출 없음

## 5. 접근성·시각·정적 결과

- 375×667 App Info 11개 상태 × Light·Dark × 일반·접근성 글자 크기 = `44/44`
  - 가로 overflow: 0
  - 화면 밖 clipping: 0
  - 활성 행동 44×44 미만: 0
- WCAG AA 핵심 대비:
  - Light primary/base `16.04:1`
  - Light secondary/base `8.65:1`
  - Light on accent `5.23:1`
  - Dark primary/base `17.55:1`
  - Dark secondary/base `14.15:1`
  - Dark on accent `7.89:1`
- `node --check design/prototype/app.js`: 통과
- `jq empty design/figma-build/manifest.json`: 통과
- `git diff --check`: 통과
- Prototype·README·Manifest revision 일치
- 변경 경로는 Task `allowed_paths` 안에 있음

## 6. 판정과 인계

기존 `DQA-MEDIUM-013-001~002`가 모두 해소됐고 기존 통과 항목에도 회귀가 없다.
신규 HIGH·MEDIUM 결함은 확인되지 않았다.

- 최종 판정: `PASS`
- Task 상태: `verification_passed`
- 다음 담당: `Design Lead Agent / Completion Role`
- Task를 `done`으로 변경하지 않음
- commit, push와 merge를 수행하지 않음
