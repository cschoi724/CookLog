# T-20260805-005 iOS AI Review·완료 Recipe 편집·삭제 독립 QA 요청

요청일: 2026-08-07
요청 Role: iOS Agent / Execution Role
대상 상태: `verification_ready`
담당: iOS QA Agent / Verification Role

## 독립 검증 범위

- Review 5개 Core Loop 상태와 상태 간 상호 배타성
- 같은 `RecipeRecord.id`·동일 `[StepPreview]` 생성·완료 전환
- 생성 실패 snapshot 잠금 해제와 원본 STEP 보존
- 전체 필드·STEP 편집, 수동 임시 저장과 이탈 snapshot 복원
- 최종 저장 실패 편집본·영속 원본 보존과 동일 동작 재시도
- 완료 Recipe AI 재호출 없는 수정, Detail 최신 값 반영
- Detail 전용 영구 삭제 확인, 삭제 실패 원본 보존·재시도
- SwiftData 통합, 전체 XCTest·build, Light/Dark·작은 화면

## 구현 Agent 증빙

- 보고서: `.ai_project/reports/T-20260805-005_ios-ai-review-recipe-editing-report.md`
- 전체 XCTest: 72/72, 실패·skip 0
- xcresult:
  `/private/tmp/cooklog-derived-t005-rebased/Logs/Test/Test-CookLog-2026.08.07_09-06-25-+0900.xcresult`
- Light Review: `/private/tmp/cooklog-t005-review.png`
- Dark Review: `/private/tmp/cooklog-t005-review-dark2.png`

## QA 기록

iOS QA Agent가 구현 commit을 고정한 별도 worktree에서 검증 대상·환경·반례·결함·판정과
Next Agent Handoff를 이 문서에 이어서 기록합니다.
