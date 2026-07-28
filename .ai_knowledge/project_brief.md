# Project Brief

작성일: 2026-07-27
프로젝트: CookLog

## 한 줄 요약

요리 중 10초 음성 기록을 반복하면 STEP Preview를 쌓고, AI가 개인 레시피로 정리하며, 다음 요리에서는 오디오 가이드로 재사용할 수 있게 하는 서비스다.

## 목표

기록 부담을 최소화해 사용자가 우연히 만든 요리를 개인 레시피로 축적하고 다시 재현할 수 있게 한다.

## 현재 단계

iOS MVP Core Loop 조건부 통과 후 안정화와 실서비스 확장 준비 단계다. Backend는 AI 프록시·인증·동기화를 위한 foundation phase이고 Android는 보류 상태다.

## 중요한 결정

- 제품 기준은 PRD v2다.
- iOS가 현재 최우선 플랫폼이다.
- 실제 AI API는 앱 직접 호출보다 Backend 프록시를 우선 검토한다.
- 운영은 Product, Design, Core Development, Quality, AI Ops 멀티팀 구조를 사용한다.
- `.ai_knowledge/`는 source of truth가 아니다.

## 주요 원본

| 문서 | 역할 |
|---|---|
| `docs/product/CookLog_PRD_v2.md` | 제품 요구사항과 성공 기준 |
| `docs/PROJECT_STATUS.md` | 전체 현재 상태 |
| `apps/ios/docs/STATUS.md` | iOS 현재 상태 |
| `apps/ios/docs/ARCHITECTURE.md` | iOS 아키텍처 |
| `.ai_project/operating_model.md` | AI 운영 구성 |
| `.ai_project/source_of_truth.md` | 원본 우선순위와 충돌 처리 |

## 주의

이 문서는 Agent 온보딩용 요약이다. 구현, 계약, 정책 판단 전에는 반드시 원본 문서를 확인한다.
