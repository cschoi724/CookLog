const subscriptionStates = {
  paywall: [
    "ready", "product-loading", "product-error", "offline", "purchasing",
    "success", "cancelled", "failed", "pending", "restoring", "restored",
    "restore-none", "restore-failed"
  ],
  status: [
    "free-normal", "free-near-limit", "free-exhausted", "pro-active",
    "billing-retry", "grace-period", "cancel-scheduled", "expired",
    "refunded", "verification-unknown"
  ]
};

const labels = {
  ready: "구매 준비", "product-loading": "상품 조회 중", "product-error": "상품 조회 실패",
  offline: "오프라인", purchasing: "구매 중", success: "구매 성공", cancelled: "사용자 취소",
  failed: "구매 실패", pending: "승인 대기", restoring: "복원 중", restored: "복원 성공",
  "restore-none": "복원 항목 없음", "restore-failed": "복원 실패",
  "free-normal": "Free 기본", "free-near-limit": "Free 한도 임박", "free-exhausted": "Free 한도 소진",
  "pro-active": "Pro 활성", "billing-retry": "결제 재시도", "grace-period": "결제 유예",
  "cancel-scheduled": "취소 예정", expired: "만료", refunded: "환불·철회",
  "verification-unknown": "검증 불가"
};

const entryCopy = {
  quota: {
    eyebrow: "FREE LIMIT REACHED",
    title: "이번 달 Free AI 정리를 모두 사용했어요",
    body: "지금까지 남긴 STEP Preview는 안전하게 보관돼요. 9월 1일 이후 다시 정리할 수 있어요.",
    success: "AI 정리 계속하기"
  },
  feature: {
    eyebrow: "PRO FEATURE",
    title: "AI 재정리는 CookLog Pro에서",
    body: "현재 편집한 레시피는 그대로 유지됩니다.",
    success: "레시피로 돌아가기"
  },
  voluntary: {
    eyebrow: "COOKLOG PRO",
    title: "기록은 그대로, AI는 더 넉넉하게",
    body: "10초 기록과 저장 레시피는 Free에서도 계속 사용할 수 있어요.",
    success: "구독 상태 보기"
  }
};

const parentRouteContracts = {
  quota: {
    close: { route: "cooking-log", label: "Cooking Log / STEP Preview", preserved: ["STEP Preview", "녹음 세션"] },
    success: { route: "ai-review-processing", label: "AI Review / Processing", preserved: ["STEP Preview", "녹음 세션"] }
  },
  feature: {
    close: { route: "ai-review-editable", label: "AI Review / Editable", preserved: ["편집 draft"] },
    success: { route: "ai-review-editable", label: "AI Review / Editable", preserved: ["편집 draft"] }
  },
  voluntary: {
    close: { route: "settings", label: "설정", preserved: ["현재 entitlement"] },
    success: { route: "subscription-status-pro", label: "구독 및 사용량 / Pro Active", preserved: ["검증된 Pro entitlement"] }
  }
};

const params = new URLSearchParams(location.search);
let view = subscriptionStates[params.get("view")] ? params.get("view") : "paywall";
let state = subscriptionStates[view].includes(params.get("state")) ? params.get("state") : subscriptionStates[view][0];
let entry = entryCopy[params.get("entry")] ? params.get("entry") : "quota";
let plan = params.get("plan") === "monthly" ? "monthly" : "annual";
let dark = params.get("theme") === "dark";

const app = document.querySelector("#subscription-app");
const viewSelect = document.querySelector("#view-select");
const viewportSelect = document.querySelector("#viewport-select");
const themeToggle = document.querySelector("#theme-toggle");
const themeLabel = document.querySelector("#theme-label");
const stateList = document.querySelector("#state-list");
const entrySelect = document.querySelector("#entry-select");
const entryControl = document.querySelector("#entry-control");
const destinationPanel = document.querySelector("#destination-panel");
const destinationLabel = document.querySelector("#destination-label");
const destinationPreserved = document.querySelector("#destination-preserved");

const viewport = params.get("viewport") === "small" ? "small" : "regular";
document.body.dataset.viewport = viewport;
viewportSelect.value = viewport;
viewSelect.value = view;
entrySelect.value = entry;
if (dark) {
  document.body.dataset.theme = "dark";
  themeToggle.setAttribute("aria-pressed", "true");
  themeLabel.textContent = "Light";
}

function topBar(title, close = true) {
  return `<header class="app-header subscription-header">
    <span class="wordmark">${title}</span>
    ${close ? `<button class="icon-button" type="button" data-action="close" aria-label="닫고 이전 화면으로 돌아가기">×</button>` : `<span aria-hidden="true" style="width:44px"></span>`}
  </header>`;
}

function spinner() {
  return `<span class="inline-loader" aria-hidden="true"></span>`;
}

function notice(kind, title, body, role = "status") {
  const icon = kind === "success" ? "✓" : kind === "error" ? "!" : kind === "pending" ? "…" : "i";
  return `<div class="subscription-notice is-${kind}" role="${role}">
    <strong class="notice-icon" aria-hidden="true">${icon}</strong>
    <div><h3>${title}</h3><p>${body}</p></div>
  </div>`;
}

function planCard(key, title, price, detail, badge = "") {
  const selected = plan === key;
  return `<button class="plan-card ${selected ? "is-selected" : ""}" type="button" role="radio" aria-checked="${selected}" tabindex="${selected ? "0" : "-1"}" data-plan="${key}">
    <span class="plan-radio" aria-hidden="true">${selected ? "●" : "○"}</span>
    <span class="plan-copy"><strong>${title}</strong><span>${price}</span><small>${detail}</small></span>
    ${badge ? `<em>${badge}</em>` : ""}
    <span class="sr-only">${selected ? "선택됨" : "선택 안 됨"}</span>
  </button>`;
}

function comparison() {
  return `<section class="comparison" aria-labelledby="compare-title">
    <h3 id="compare-title">Free와 Pro 비교</h3>
    <div class="compare-head"><span>기능</span><strong>Free</strong><strong>Pro</strong></div>
    <div><span>10초 기록·로컬 저장</span><b>제공</b><b>제공</b></div>
    <div><span>기본 오디오 가이드</span><b>제공</b><b>제공</b></div>
    <div><span>AI 레시피 정리</span><b>3회*</b><b>30회*</b></div>
    <div><span>AI 재정리</span><b>—</b><b>제공 예정*</b></div>
    <p>* 정책 확정 전 가설값</p>
  </section>`;
}

function legal() {
  return `<div class="legal-copy">
    <p>결제는 Apple ID로 청구되며 현재 기간 종료 24시간 전까지 해지하지 않으면 자동 갱신됩니다. App Store 설정에서 관리하거나 해지할 수 있습니다.</p>
    <div><button type="button">이용약관</button><span aria-hidden="true">·</span><button type="button">개인정보처리방침</button></div>
  </div>`;
}

function readyPaywall(message = "") {
  const copy = entryCopy[entry];
  return `<section class="screen paywall-screen">
    ${topBar("CookLog Pro")}
    <div class="paywall-hero"><p class="eyebrow">${copy.eyebrow}</p><h2>${copy.title}</h2><p>${copy.body}</p></div>
    ${message}
    ${comparison()}
    <div class="plan-group" role="radiogroup" aria-label="CookLog Pro 구독 기간">
      ${planCard("monthly", "월간", "월 4,900원*", "매월 자동 갱신")}
      ${planCard("annual", "연간", "연 39,000원*", "월 3,250원 수준 · 오늘 연간 총액 청구", "약 34%* ")}
    </div>
    <div class="purchase-area">
      <button class="button button-primary" type="button" data-action="purchase">${plan === "annual" ? "연간" : "월간"} Pro 시작하기</button>
      <p>${plan === "annual" ? "오늘 연 39,000원* 결제 후 매년 자동 갱신" : "월 4,900원* 결제 후 매월 자동 갱신"}</p>
      <button class="restore-button" type="button" data-action="restore">구매 복원</button>
    </div>
    ${legal()}
  </section>`;
}

function blockingState(kind, title, body) {
  const messageRole = kind === "error" ? "alert" : "status";
  const live = messageRole === "status" ? ` aria-live="polite" aria-atomic="true"` : "";
  return `<section class="screen paywall-screen">
    ${topBar("CookLog Pro", !["purchasing", "restoring"].includes(state))}
    <div class="center-state">
      <div class="async-message" role="${messageRole}"${live}>
        <div class="state-symbol is-${kind}">${kind === "loading" ? spinner() : kind === "success" ? "✓" : kind === "error" ? "!" : "…"}</div>
        <h2>${title}</h2><p>${body}</p>
      </div>
      <p class="data-safe">저장한 레시피와 기본 오디오 가이드는 계속 사용할 수 있어요.</p>
    </div>
  </section>`;
}

function resultState(kind, title, body, action, actionAttributes) {
  return `<section class="screen paywall-screen">
    ${topBar("CookLog Pro")}
    <div class="center-state">
      <div class="async-message" role="status" aria-live="polite" aria-atomic="true">
        <div class="state-symbol is-${kind}">${kind === "success" ? "✓" : "…"}</div>
        <h2>${title}</h2><p>${body}</p>
      </div>
      <button class="button ${kind === "success" ? "button-primary" : "button-secondary"}" type="button" ${actionAttributes}>${action}</button>
      <p class="data-safe">저장한 레시피와 기본 오디오 가이드는 계속 사용할 수 있어요.</p>
    </div>
  </section>`;
}

function productIssueState({ offline = false } = {}) {
  const title = offline ? "인터넷 연결을 확인해주세요" : "구독 상품을 불러오지 못했어요";
  const body = offline
    ? "연결 후 App Store의 현재 가격과 기존 구매를 다시 확인할 수 있어요."
    : "가격을 확인할 수 없어 신규 구매를 진행할 수 없습니다.";
  return `<section class="screen paywall-screen">
    ${topBar("CookLog Pro")}
    <div class="center-state">
      <div class="async-message" role="alert">
        <div class="state-symbol is-error">!</div><h2>${title}</h2><p>${body}</p>
      </div>
      <div class="issue-actions">
        <button class="button button-secondary" type="button" data-set-state="product-loading">다시 확인</button>
        <button class="restore-button" type="button" data-action="restore" ${offline ? `disabled aria-describedby="offline-restore-reason"` : ""}>구매 복원</button>
        ${offline ? `<p id="offline-restore-reason">구매 복원은 네트워크 연결 후 사용할 수 있어요.</p>` : ""}
      </div>
      <p class="data-safe">저장한 레시피와 기본 오디오 가이드는 계속 사용할 수 있어요.</p>
    </div>
  </section>`;
}

function renderPaywall() {
  if (state === "ready") return readyPaywall();
  if (state === "cancelled") return readyPaywall(notice("info", "구매를 취소했어요", "결제되지 않았습니다. Free 기능은 그대로 사용할 수 있어요."));
  if (state === "failed") return readyPaywall(notice("error", "구매를 완료하지 못했어요", "결제되지 않았습니다. 잠시 후 다시 시도해주세요.", "alert"));
  if (state === "restore-none") return readyPaywall(notice("info", "복원할 구매를 찾지 못했어요", "현재 Apple ID에서 활성 구독을 확인하지 못했습니다."));
  if (state === "restore-failed") return readyPaywall(notice("error", "구매를 복원하지 못했어요", "네트워크와 App Store 계정을 확인한 뒤 다시 시도해주세요.", "alert"));
  if (state === "product-loading") return blockingState("loading", "구독 상품을 확인하고 있어요", "App Store의 현재 가격을 불러옵니다.");
  if (state === "product-error") return productIssueState();
  if (state === "offline") return productIssueState({ offline: true });
  if (state === "purchasing") return blockingState("loading", "구매를 확인하고 있어요", "StoreKit 거래와 entitlement 검증 결과를 기다리고 있습니다.");
  if (state === "success") return resultState("success", "CookLog Pro가 시작됐어요", "검증된 구독 상태를 반영했습니다.", entryCopy[entry].success, `data-parent-action="success"`);
  if (state === "pending") return resultState("pending", "승인을 기다리고 있어요", "승인이 완료되면 검증 후 구독 상태에 자동으로 반영됩니다. 중복 구매할 필요가 없어요.", "확인", `data-set-state="ready"`);
  if (state === "restoring") return blockingState("loading", "구매 내역을 확인하고 있어요", "StoreKit 동기화와 entitlement 검증 결과를 기다리고 있습니다.");
  if (state === "restored") return resultState("success", "CookLog Pro를 복원했어요", "검증된 구독 상태를 이 기기에 반영했습니다.", "구독 상태 보기", `data-parent-action="restore-success"`);
  return readyPaywall();
}

const statusContent = {
  "free-normal": { eyebrow: "COOKLOG FREE", title: "Free 플랜", body: "이번 주기 AI 정리 2회 남음", detail: "9월 1일에 다시 3회가 제공돼요.", quota: { used: 1, limit: 3 }, cta: "Pro 알아보기", action: "paywall" },
  "free-near-limit": { eyebrow: "LIMIT NEAR", title: "AI 정리가 1회 남았어요", body: "마지막 1회도 결과가 생성될 때만 차감돼요.", detail: "9월 1일에 다시 사용할 수 있어요.", quota: { used: 2, limit: 3 }, cta: "Pro 알아보기", action: "paywall" },
  "free-exhausted": { eyebrow: "FREE LIMIT REACHED", title: "Free AI 정리를 모두 사용했어요", body: "새 AI 정리만 잠시 제한됩니다.", detail: "저장 레시피와 기본 오디오 가이드는 그대로예요.", quota: { used: 3, limit: 3 }, cta: "Pro 알아보기", action: "paywall" },
  "pro-active": { eyebrow: "COOKLOG PRO", title: "CookLog Pro 사용 중", body: "Pro AI 정리 27/30회 남음*", detail: "다음 초기화: 9월 1일*", quota: { used: 3, limit: 30 }, cta: "구독 관리", action: "manage" },
  "billing-retry": { eyebrow: "BILLING RETRY", title: "결제를 다시 확인하고 있어요", body: "App Store에서 결제 복구를 시도하고 있습니다.", detail: "결제 문제와 별개로 확인된 AI 사용량을 표시합니다.", quota: { used: 3, limit: 30 }, cta: "결제 방법 확인", action: "manage" },
  "grace-period": { eyebrow: "GRACE PERIOD", title: "결제 정보를 확인해주세요", body: "일시적인 결제 문제로 갱신을 완료하지 못했어요.", detail: "유예 기간에도 확인된 AI 사용량을 표시합니다.", quota: { used: 3, limit: 30 }, cta: "구독 관리", action: "manage" },
  "cancel-scheduled": { eyebrow: "CANCELLATION SCHEDULED", title: "9월 18일까지 Pro를 사용할 수 있어요", body: "현재 기간이 끝나면 Free로 전환됩니다.", detail: "기간 종료 전까지 Pro AI 사용량이 적용됩니다.", quota: { used: 3, limit: 30 }, cta: "구독 관리", action: "manage" },
  expired: { eyebrow: "SUBSCRIPTION ENDED", title: "CookLog Free로 전환됐어요", body: "Free AI 사용량 기준이 적용됩니다.", detail: "현재 주기 Free AI 정리를 모두 사용했어요.", quota: { used: 3, limit: 3 }, cta: "Pro 다시 시작", action: "paywall" },
  refunded: { eyebrow: "SUBSCRIPTION ENDED", title: "구독이 종료되어 Free로 전환됐어요", body: "환불·철회 상태가 확인됐습니다.", detail: "현재 주기 Free AI 정리를 모두 사용했어요.", quota: { used: 3, limit: 3 }, cta: "Pro 알아보기", action: "paywall" },
  "verification-unknown": { eyebrow: "STATUS UNAVAILABLE", title: "구독 상태를 확인할 수 없어요", body: "새 유료 AI 사용은 상태 확인 후 진행해주세요.", detail: "사용량은 상태 확인 후 다시 표시됩니다.", quota: null, cta: "상태 다시 확인", action: "refresh" }
};

function renderStatus() {
  const item = statusContent[state] || statusContent["free-normal"];
  const warning = ["billing-retry", "grace-period", "cancel-scheduled", "expired", "refunded", "verification-unknown"].includes(state);
  const quota = item.quota;
  const usedPercent = quota ? Math.round((quota.used / quota.limit) * 100) : null;
  const remaining = quota ? Math.max(quota.limit - quota.used, 0) : null;
  return `<section class="screen status-screen">
    ${topBar("구독 및 사용량")}
    <div class="status-hero"><p class="eyebrow">${item.eyebrow}</p><h2>${item.title}</h2><p>${item.body}</p></div>
    ${warning ? notice(state === "verification-unknown" ? "error" : "pending", item.title, item.detail, state === "verification-unknown" ? "alert" : "status") : ""}
    <section class="usage-card" aria-label="AI 정리 사용량">
      <div><span>AI 정리 사용량</span><strong>${quota ? `${quota.used}/${quota.limit}회 사용` : "확인 불가"}</strong></div>
      ${quota ? `<div class="usage-track" role="progressbar" aria-label="AI 정리 사용량" aria-valuemin="0" aria-valuemax="${quota.limit}" aria-valuenow="${quota.used}" aria-valuetext="${quota.limit}회 중 ${quota.used}회 사용, ${remaining}회 남음"><span style="width:${usedPercent}%"></span></div>` : ""}
      <p>${item.detail}${quota ? ` · ${remaining}회 남음` : ""}</p>
    </section>
    <section class="data-promise"><span aria-hidden="true">♡</span><div><h3>내 요리 기록은 계속 내 곁에</h3><p>구독 상태와 상관없이 로컬 레시피 조회·수정과 기본 오디오 가이드를 사용할 수 있어요.</p></div></section>
    <button class="button ${item.action === "paywall" ? "button-primary" : "button-secondary"}" type="button" data-status-action="${item.action}">${item.cta}</button>
    <button class="restore-button status-restore" type="button" data-action="restore">구매 복원</button>
    <p class="hypothesis-note">* 가격·quota·초기화 시점은 정책 확정 전 가설값입니다.</p>
  </section>`;
}

function renderStateList() {
  stateList.innerHTML = subscriptionStates[view].map(key => `<button class="state-button" type="button" data-panel-state="${key}" aria-pressed="${state === key}">${labels[key]}</button>`).join("");
  entryControl.hidden = view !== "paywall";
}

function render() {
  app.innerHTML = view === "paywall" ? renderPaywall() : renderStatus();
  renderStateList();
}

function setState(next) {
  if (subscriptionStates[view].includes(next)) state = next;
  else if (subscriptionStates.status.includes(next)) { view = "status"; state = next; viewSelect.value = view; }
  render();
}

function selectPlan(nextPlan, { focus = false } = {}) {
  plan = nextPlan;
  render();
  if (focus) app.querySelector(`[data-plan="${plan}"]`)?.focus();
}

function parentDestination(action) {
  if (action === "status-close") {
    return { route: "settings", label: "설정", preserved: [`entitlement 표시: ${state}`] };
  }
  if (action === "restore-success") {
    return { route: "subscription-status-pro", label: "구독 및 사용량 / Pro Active", preserved: ["검증된 Pro entitlement"] };
  }
  return parentRouteContracts[entry]?.[action];
}

function requestParentNavigation(action) {
  const destination = parentDestination(action);
  if (!destination) return;
  const detail = {
    action,
    entry: view === "paywall" ? entry : "status",
    sourceView: view,
    sourceState: state,
    route: destination.route,
    label: destination.label,
    preserved: [...destination.preserved]
  };

  window.CookLogSubscriptionAdapter?.navigate?.(detail);
  window.dispatchEvent(new CustomEvent("cooklog:subscription-route", { detail }));

  destinationPanel.hidden = false;
  destinationPanel.dataset.route = detail.route;
  destinationPanel.dataset.sourceState = detail.sourceState;
  destinationPanel.dataset.entry = detail.entry;
  destinationLabel.textContent = detail.label;
  destinationPreserved.textContent = `보존: ${detail.preserved.join(", ")}`;
}

document.addEventListener("click", event => {
  const panel = event.target.closest("[data-panel-state]");
  if (panel) return setState(panel.dataset.panelState);
  const planButton = event.target.closest("[data-plan]");
  if (planButton) return selectPlan(planButton.dataset.plan, { focus: true });
  const next = event.target.closest("[data-set-state]");
  if (next) return setState(next.dataset.setState);
  const parentAction = event.target.closest("[data-parent-action]")?.dataset.parentAction;
  if (parentAction) return requestParentNavigation(parentAction);
  const action = event.target.closest("[data-action]")?.dataset.action;
  if (action === "purchase") return setState("purchasing");
  if (action === "restore") { view = "paywall"; viewSelect.value = view; return setState("restoring"); }
  if (action === "close") return requestParentNavigation(view === "paywall" ? "close" : "status-close");
  const statusAction = event.target.closest("[data-status-action]")?.dataset.statusAction;
  if (statusAction === "paywall") { view = "paywall"; state = "ready"; viewSelect.value = view; entry = "voluntary"; entrySelect.value = entry; return render(); }
  if (statusAction === "refresh") return setState("pro-active");
});

document.addEventListener("keydown", event => {
  const radio = event.target.closest("[role=radio][data-plan]");
  if (!radio) return;
  const keys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"];
  if (!keys.includes(event.key)) return;
  event.preventDefault();
  const plans = ["monthly", "annual"];
  const currentIndex = plans.indexOf(radio.dataset.plan);
  let nextPlan;
  if (event.key === "Home") nextPlan = plans[0];
  else if (event.key === "End") nextPlan = plans[plans.length - 1];
  else {
    const delta = event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 1;
    nextPlan = plans[(currentIndex + delta + plans.length) % plans.length];
  }
  selectPlan(nextPlan, { focus: true });
});

viewSelect.addEventListener("change", () => {
  view = viewSelect.value;
  state = subscriptionStates[view][0];
  destinationPanel.hidden = true;
  render();
});
entrySelect.addEventListener("change", () => { entry = entrySelect.value; destinationPanel.hidden = true; render(); });
viewportSelect.addEventListener("change", () => { document.body.dataset.viewport = viewportSelect.value; });
themeToggle.addEventListener("click", () => {
  dark = !dark;
  document.body.dataset.theme = dark ? "dark" : "light";
  themeToggle.setAttribute("aria-pressed", String(dark));
  themeLabel.textContent = dark ? "Light" : "Dark";
});

render();
