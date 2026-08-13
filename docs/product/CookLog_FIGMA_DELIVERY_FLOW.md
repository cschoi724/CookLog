# CookLog 비공개 Figma 전달 흐름

작성일: 2026-08-12
Task: `T-20260812-004`
기본 viewport: `390×844pt`

## 1. 결론

CookLog의 다음 UI/UX 원본은 T-20260812-003에서 구축하는 비공개 Figma baseline이다. 기존 로컬 Prototype·Manifest·handoff와 완료 디자인 산출물은 삭제하지 않고 `Legacy/Baseline`으로 보존한다.

Figma 핵심 흐름 전체가 완성되고 Product Owner 시각 승인과 독립 Design QA를 통과하기 전에는 iOS UI를 부분 동기화하지 않는다. 승인된 baseline 이후 변경 범위를 한 번에 iOS에 반영한다.

## 2. 비공개 운영 규칙

- Product Owner가 지정한 비공개 Draft 파일 하나에서만 작업한다.
- 파일 URL·키, 팀·조직·초대 대상은 저장소·Task·보고서·스크린샷에 기록하지 않는다.
- 공개 링크, Community 게시, 외부 공개 export를 만들지 않는다.
- 회사 또는 다른 프로젝트의 Library·Variables·폰트·자산에 의존하지 않는다.
- CookLog 전용 로컬 Variables·Components·Styles·자산만 사용한다.
- Figma MCP를 사용하더라도 지정 파일과 CookLog 산출물 범위 밖을 탐색하지 않는다.

## 3. Task 재정렬 결과

| Task | 처리 | 보존·후속 기준 |
|---|---|---|
| `T-20260812-003` | 주 실행 Task 유지 | 비공개 Figma 전체 핵심 흐름, 로컬 디자인 시스템, 시각 승인, 독립 Design QA, baseline 고정을 담당한다. |
| `T-20260811-002` | `cancelled`, T-003 흡수 | 선택된 팝 키치 방향과 컨셉 시안을 Legacy 입력으로 보존한다. |
| `T-20260811-008` | `cancelled`, T-003 흡수 | Prototype 결과와 미병합 WIP를 보존하고 Home 고충실도 작업을 Figma에서 다시 수행한다. |
| `T-20260811-005` | `cancelled`, T-003 흡수 | Log·Review·Detail 화면·상태 계약을 Figma 범위로 이전한다. |
| `T-20260811-006` | `cancelled`, T-003 흡수 | Player·Info·오류 화면·복구 계약을 Figma 범위로 이전한다. |
| `T-20260811-007` | `cancelled`, T-003 흡수 | 82개 상태·접근성·handoff 독립 QA를 T-003의 Figma Design QA로 이전한다. |
| `T-20260805-008` | `blocked` 유지·재범위화 | Figma baseline 뒤 iOS 일괄 동기화, 기능 82개·기술 접근성 QA를 수행한다. |
| `T-20260812-001` | `scoped` 유지·재범위화 | 고정 Figma baseline과 고정 iOS commit의 Visual Fidelity를 비교한다. |
| `T-20260728-003` | `scoped` 유지·의존성 교체 | T-003 → T-20260805-008 → T-20260812-001 완료 후 상위 완료 리뷰를 진행한다. |
| Backend 독립 Task | 현행 유지 | UI 원천 전환과 무관한 범위는 계속 진행한다. |

## 4. Canonical 실행 순서

```text
T-20260812-004 완료
  → T-20260812-003 Design Lead scope
  → Product Owner Figma 실행 승인
  → 비공개 Figma 전체 핵심 흐름 완성
  → Product Owner 시각 승인
  → 독립 Design QA
  → Figma baseline 고정
  → Development Lead iOS 일괄 동기화 범위 확정
  → iOS 구현·기능 82개·기술 접근성 QA (T-20260805-008)
  → Figma 대비 iOS Visual Fidelity QA (T-20260812-001)
  → 상위 iOS Task 완료 리뷰 (T-20260728-003)
```

## 5. Figma 완료 게이트

T-20260812-003은 아래 조건을 모두 만족해야 완료할 수 있다.

1. `390×844pt` 기준 Home, Library, Cooking Log, AI Review, Recipe Detail, Audio Guide, App Info 핵심 흐름이 완성된다.
2. T-20260812-002의 82개 상태·routing·데이터 보존·오류 회복 계약이 추적된다.
3. CookLog 전용 로컬 Foundations·Components·Styles가 구성되고 외부 Library 의존성이 없다.
4. Product Owner가 전체 핵심 흐름의 시각 방향을 승인한다.
5. Design QA가 흐름·상태·접근성·handoff·비공개 운영 경계를 독립 검증한다.
6. baseline 식별자는 민감한 Figma URL·파일 키 없이 내부 승인 시점과 revision으로 기록한다.

## 6. Viewport와 접근성 기준

- 전체 디자인 기본값은 `390×844pt`다.
- `375×667pt` 전체 화면 설계·QA는 필수 완료 조건이 아니다.
- 작은 화면에서는 CTA 가림, 스크롤 도달 불가, 키보드 회피 실패, 긴 텍스트 충돌처럼 실제 구현 위험이 있는 상태만 후속 범위로 다룬다.
- Light/Dark, Accessibility 3, 최소 44pt 터치 영역과 필수 상태 의미는 계속 보존한다.

## 7. Legacy/Baseline 보존 규칙

- `design/prototype/`, `design/figma-build/manifest.json`, 기존 handoff는 기능·상태 계약과 과거 비교를 위한 Legacy다.
- 기존 완료 산출물과 T-008 별도 worktree의 미병합 WIP를 삭제하거나 새 baseline으로 오인하지 않는다.
- Figma와 Legacy가 시각적으로 충돌하면 승인된 Figma baseline을 따른다.
- 기능·routing·데이터 보존·오류 회복이 충돌하면 PRD·User Flow·T-20260812-002의 82개 계약을 우선하고 Design Lead가 임의 변경하지 않는다.

## 8. iOS 동기화 원칙

- Figma 화면 일부가 완성될 때마다 iOS를 수정하지 않는다.
- Figma 전체 핵심 흐름의 승인·QA 통과 이후 차이 목록과 구현 범위를 한 번에 확정한다.
- 기존 완료 iOS 기능은 재구현하지 않고, 고정 Figma와 다른 UI/UX만 동기화한다.
- 기능·기술 접근성 검증과 Visual Fidelity 판정을 분리한다.
- iOS 동기화 전후에도 Backend 독립 흐름을 불필요하게 중단하지 않는다.
