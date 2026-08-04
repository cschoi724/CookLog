# T-20260730-006 실행 보고서

작성일: 2026-08-04

담당: AI Ops Agent / Ops Governance Role

결과: `IN_PROGRESS`

## 기준 상태

- public source: `origin/develop@ac927ace6981b75f9e611c278002fa5f06fdc373`
- worktree: `/private/tmp/cooklog-t20260730-006-ops`
- branch: `ops/T-20260730-006-configure-required-checks`
- 선행 `T-20260730-005`: `done`
- 운영 정합성 `T-20260731-003`: `done`
- repository visibility: public

## Product Owner 결정

1. `develop`에 먼저 적용하고 실제 병합 흐름을 검증한다.
2. 문제없으면 `main`에도 동일하게 적용한다.
3. 두 branch 모두 `ios-build`, `ios-xctest`를 required check로 둔다.
4. 긴급 우회는 Product Owner 승인 시에만 허용한다.
5. Budget 50/75/90/100%와 Actions 사용량을 함께 모니터링한다.

단일 collaborator 구성에서는 approval 1개가 자기 승인 금지 정책과 교착하므로,
required approval은 0으로 두고 PR과 두 required check를 기술적 merge gate로 사용한다.
상시 bypass actor는 등록하지 않는다.

## Develop 적용

- ruleset ID: `20340678`
- name: `CookLog develop required checks`
- enforcement: `active`
- target: `refs/heads/develop`
- bypass actors: 없음 (`current_user_can_bypass: never`)
- PR 필수, required approval 0
- merge method: squash only
- strict required checks: `ios-build`, `ios-xctest`
- force push 금지
- branch 삭제 금지
- linear history 필수
- 적용 후 branch `protected`: `true`

## Develop 검증 계획

T-006 문서 변경 PR을 실제 검증 PR로 사용한다.

1. PR 생성 직후 required check 대기 중 merge 차단을 확인한다.
2. 문서 전용 경량 경로에서 두 workflow와 required job이 생성되는지 확인한다.
3. 두 job이 Linux에서 success이고 macOS·artifact가 생략되는지 확인한다.
4. strict 상태와 squash-only PR gate가 정상인지 확인한다.
5. 검증 통과 뒤 `main`에 동일 ruleset을 적용한다.

## Main 적용 대기

`main`은 아직 `protected: false`다. Develop 검증 전에는 확대하지 않는다.

## Budget·사용량

- GitHub native Budget 알림: 75/90/100%
- CookLog 내부 수동 게이트: 50%
- included usage 알림: 90/100%
- 실제 Billing 수치는 `Budgets and alerts` 화면을 source of truth로 사용한다.
- Actions API는 run·re-run·artifact·cache 추세 보조 지표로 사용한다.

## 긴급 우회와 rollback

- 상시 bypass actor가 없으므로 평상시에는 Product Owner도 gate를 우회할 수 없다.
- 긴급 우회는 Product Owner가 사유·대상 branch·시작·종료 시점을 승인한 뒤 ruleset을
  일시 변경하는 방식으로만 수행한다.
- 우회 종료 즉시 active ruleset을 원래 JSON으로 복구하고 두 check를 재확인한다.
- required check 이름·source·strict 동작이 잘못되면 해당 branch ruleset을 rollback하고
  merge를 동결한다.
- Actions quota 소진 시 gate를 자동 해제하지 않고 merge를 동결한다.

## 현재 검증

- develop ruleset API round-trip: 통과
- develop `protected: true`: 확인
- bypass actor 없음: 확인
- required check 이름 2개: 확인
- `.github/`, `apps/` 변경: 없음
- develop 실제 PR gate: 진행 예정
- main 적용: develop 검증 후
