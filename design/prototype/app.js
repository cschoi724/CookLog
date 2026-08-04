const icons = {
  chevronLeft: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>`,
  book: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/></svg>`,
  mic: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0M12 17v5M8 22h8"/></svg>`,
  sparkles: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3-1.2 3.8L7 8l3.8 1.2L12 13l1.2-3.8L17 8l-3.8-1.2L12 3Z"/><path d="m5 14-.8 2.2L2 17l2.2.8L5 20l.8-2.2L8 17l-2.2-.8L5 14ZM19 13l-.8 2.2-2.2.8 2.2.8L19 19l.8-2.2 2.2-.8-2.2-.8L19 13Z"/></svg>`,
  play: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 5 11 7-11 7V5Z"/></svg>`,
  search: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>`,
  info: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/></svg>`,
  close: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>`,
  more: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></svg>`
};

const screenStates = {
  home: ["content", "multiple", "ai-ready", "network-error", "menu-open", "delete-confirm", "empty", "loading", "error"],
  library: ["all", "search-title", "search-ingredient", "no-results", "empty"],
  log: ["intro", "permission-denied", "empty", "recording", "processing", "retrying", "steps", "undo-delete", "offline", "record-error", "stt-unsupported", "stt-error", "ai-lock", "ai-offline"],
  review: ["processing", "processing-long", "ready-banner", "editable", "draft-saved", "unsaved-exit", "validation-error", "saving", "save-error", "generation-error", "complete-edit", "complete-saving"],
  detail: ["content", "menu-open", "delete-confirm", "deleted", "loading", "error", "not-found"],
  player: ["ready", "paused", "playing", "step-complete", "last-step", "ingredients", "speed", "handsfree-intro", "permission-denied", "handsfree-active", "listening", "command-next", "command-previous", "command-pause", "command-resume", "command-replay", "command-ingredients", "command-exit", "command-uncertain", "interrupted", "background-ended", "loading", "error", "no-steps"],
  info: ["overview", "data-retention", "contact-consent", "contact-ready", "mail-unavailable", "privacy-loading", "privacy-unconfigured", "privacy-error", "terms-loading", "terms-unconfigured", "terms-error"]
};

const stateLabels = {
  content: "최근 3개", multiple: "여러 진행 기록", "ai-ready": "AI 완료 배너", "menu-open": "진행 기록 메뉴", "delete-confirm": "영구 삭제 확인",
  "network-error": "인터넷 연결 오류",
  all: "전체 · 최근 활동순", "search-title": "검색 · 제목 우선", "search-ingredient": "검색 · 재료 일치", "no-results": "검색 결과 없음",
  empty: "빈 상태", loading: "로딩", error: "오류",
  intro: "첫 기록 안내", "permission-denied": "마이크 권한 거부", recording: "10초 녹음", processing: "기기 내 변환", retrying: "자동 재처리", steps: "STEP 누적", "undo-delete": "삭제·되돌리기", offline: "오프라인 기록",
  "record-error": "녹음 오류", "stt-unsupported": "기기 내 STT 미지원", "stt-error": "STT 최종 실패", "ai-lock": "AI snapshot 잠금", "ai-offline": "오프라인 AI 안내",
  editable: "검토·수정", "processing-long": "10초 이상 처리", "ready-banner": "검토 준비됨", "draft-saved": "임시 저장됨",
  "unsaved-exit": "이탈 확인", "validation-error": "입력 검증", saving: "최종 저장 중", "save-error": "최종 저장 오류",
  "generation-error": "AI 정리 실패", "complete-edit": "완료 레시피 수정", "complete-saving": "수정 저장 중",
  deleted: "삭제 완료", "not-found": "찾을 수 없음",
  ready: "1단계 준비", paused: "일시정지", playing: "재생 중", "step-complete": "단계 완료·대기", "last-step": "마지막 단계",
  ingredients: "재료 듣기", speed: "읽기 속도", "handsfree-intro": "첫 핸즈프리 안내", "handsfree-active": "핸즈프리 켜짐", listening: "명령 듣는 중",
  "command-next": "명령·다음", "command-previous": "명령·이전", "command-pause": "명령·멈춰", "command-resume": "명령·계속",
  "command-replay": "명령·다시 듣기", "command-ingredients": "명령·재료", "command-exit": "명령·종료", "command-uncertain": "명령 불확실",
  interrupted: "오디오 중단", "background-ended": "백그라운드·잠금", "no-steps": "단계 없음",
  overview: "앱 정보", "data-retention": "데이터 보관 안내", "contact-consent": "문의 정보 선택", "contact-ready": "문의 준비됨", "mail-unavailable": "이메일 앱 없음",
  "privacy-loading": "개인정보처리방침 로딩", "privacy-unconfigured": "개인정보 링크 미설정", "privacy-error": "개인정보 링크 오류",
  "terms-loading": "이용약관 로딩", "terms-unconfigured": "이용약관 링크 미설정", "terms-error": "이용약관 링크 오류"
};

const params = new URLSearchParams(window.location.search);
const isEmbedded = params.get("embed") === "1";
const sttPath = ["success", "retry-success", "retry-failure"].includes(params.get("stt-path")) ? params.get("stt-path") : "success";
if (isEmbedded) document.body.classList.add("embed");
if (params.get("text-scale") === "accessibility") document.body.dataset.textScale = "accessibility";
let screen = screenStates[params.get("screen")] ? params.get("screen") : "home";
let state = screenStates[screen].includes(params.get("state")) ? params.get("state") : screenStates[screen][0];
let dark = params.get("theme") === "dark";
let playerStep = 0;
let playerFeedback = "";
let playerPlayback = state === "playing" ? "playing" : "paused";
let playerPlaybackEndsAt = 0;
let playerCommandBoundary = "";
let handsfreeActive = ["handsfree-active", "listening", "command-next", "command-previous", "command-pause", "command-resume", "command-replay", "command-ingredients"].includes(state);
let handsfreeIntroSeen = false;
let handsfreePermission = state === "permission-denied" ? "denied" : "prompt";
let playerSpeed = "보통";
let pendingPlayerSpeed = "";
const stepSamples = [
  "삼겹살을 팬에 넣고 노릇하게 볶았어.",
  "양파 반 개와 간장 두 스푼을 넣었어.",
  "불을 줄이고 설탕 한 작은술을 넣었어.",
  "윤기가 돌 때 불을 끄고 접시에 담았어."
];
const statesWithSteps = ["processing", "retrying", "steps", "undo-delete", "offline", "stt-error", "ai-lock", "ai-offline"];
let recordedSteps = screen === "log" && statesWithSteps.includes(state) ? stepSamples.slice(0, 2) : [];
let deletedStep = state === "undo-delete" ? { copy: stepSamples[1], index: 1 } : null;
if (state === "undo-delete") recordedSteps = stepSamples.slice(0, 1);
let recordSecondsRemaining = 10;
let logFeedback = "";
const undoDurationMs = 5000;
let undoExpiresAt = state === "undo-delete" ? Date.now() + undoDurationMs : 0;
let undoTimer = null;
let reviewDraft = {
  title: "달큰한 간장 삼겹살",
  ingredients: [
    { name: "삼겹살", amount: "300g" },
    { name: "양파", amount: "1/2개" }
  ],
  steps: [
    "삼겹살을 노릇하게 볶아요.",
    "양파와 간장을 넣고 더 볶아요.",
    "불을 줄이고 설탕을 넣어 윤기를 내요."
  ],
  time: "25분",
  memo: "양파가 살짝 투명해질 때 불을 줄이면 좋아요."
};
function cloneRecipeDraft(value) {
  return {
    title: value.title,
    ingredients: value.ingredients.map(item => ({ ...item })),
    steps: [...value.steps],
    time: value.time,
    memo: value.memo
  };
}
let reviewSavedSnapshot = cloneRecipeDraft(reviewDraft);
let completedRecipe = cloneRecipeDraft(reviewDraft);
let completeEditSnapshot = cloneRecipeDraft(completedRecipe);
let pendingRecipeSave = null;
let transitionTimer = null;
let searchQuery = "";
let recordMenuId = "";
let pendingDeleteId = "";
let deleteDialogOpen = false;
let completedDeleteOpen = screen === "detail" && state === "delete-confirm";
let reviewDirty = false;
let removedReviewStep = null;
let finalSaveInFlight = false;
let completedRecipeCreated = false;
let reviewMode = state.startsWith("complete-") ? "complete" : "draft";
if (reviewMode === "complete") {
  reviewDraft = cloneRecipeDraft(completedRecipe);
  completeEditSnapshot = cloneRecipeDraft(completedRecipe);
}
let homeFeedback = "";
let lastMenuTriggerId = "";
let focusIntent = null;
let diagnosticsIncluded = false;
const deletedRecipeIds = new Set();

const recipes = [
  {
    id: "draft-step",
    state: "recording",
    title: "작성 중인 요리",
    status: "기록 중 · STEP 2개",
    activity: "방금 전",
    lastActivityAt: "2026-07-30T14:00:00+09:00",
    detail: "7월 30일 오후 5:20 · 마지막 STEP으로 이동",
    ingredients: [],
    nav: "log",
    navState: "steps"
  },
  {
    id: "draft-organizing",
    state: "organizing",
    title: "삼겹살 요리 기록",
    status: "AI 정리 중 · STEP 4개",
    activity: "8분 전",
    lastActivityAt: "2026-07-30T13:52:00+09:00",
    detail: "다른 화면을 사용해도 정리는 계속돼요.",
    ingredients: [],
    nav: "review",
    navState: "processing"
  },
  {
    id: "draft-review",
    state: "review",
    title: "달큰한 간장 삼겹살",
    status: "검토 준비됨",
    activity: "어제",
    lastActivityAt: "2026-07-29T18:10:00+09:00",
    detail: "삼겹살 · 양파 · 간장",
    ingredients: ["삼겹살", "양파", "간장"],
    nav: "review",
    navState: "editable"
  },
  {
    id: "recipe-tofu",
    state: "complete",
    title: "매콤한 두부조림",
    activity: "7월 27일",
    lastActivityAt: "2026-07-27T12:20:00+09:00",
    detail: "두부 · 대파 · 고춧가루",
    ingredients: ["두부", "대파", "고춧가루"],
    time: "약 20분",
    steps: 4,
    nav: "detail",
    navState: "content"
  },
  {
    id: "recipe-pasta",
    state: "complete",
    title: "토마토 달걀 볶음",
    activity: "7월 24일",
    lastActivityAt: "2026-07-24T19:00:00+09:00",
    detail: "토마토 · 달걀 · 대파",
    ingredients: ["토마토", "달걀", "대파"],
    time: "약 15분",
    steps: 3,
    nav: "detail",
    navState: "content"
  },
  {
    id: "recipe-soup",
    state: "complete",
    title: "구수한 된장국",
    activity: "7월 20일",
    lastActivityAt: "2026-07-20T11:30:00+09:00",
    detail: "두부 · 애호박 · 된장",
    ingredients: ["두부", "애호박", "된장"],
    time: "약 25분",
    steps: 5,
    nav: "detail",
    navState: "content"
  }
];

if (screen === "library") {
  if (state === "search-title") searchQuery = "삼겹살";
  else if (state === "search-ingredient") searchQuery = "애호박";
  else if (state === "no-results") searchQuery = "크림 파스타";
}

const app = document.querySelector("#app");
const announcer = document.querySelector("#announcer");
const screenSelect = document.querySelector("#screen-select");
const stateList = document.querySelector("#state-list");
const themeToggle = document.querySelector("#theme-toggle");
const themeLabel = document.querySelector("#theme-label");
const viewportSelect = document.querySelector("#viewport-select");
const viewportLabel = document.querySelector("#viewport-label");

const initialViewport = params.get("viewport") === "small" ? "small" : "regular";
document.body.dataset.viewport = initialViewport;
viewportSelect.value = initialViewport;
viewportLabel.textContent = initialViewport === "small" ? "375 × 667" : "390 × 844";

if (dark) {
  document.body.dataset.theme = "dark";
  themeToggle.setAttribute("aria-pressed", "true");
  themeLabel.textContent = "Light";
}

function header({ back, backAction = "", backDisabled = false, title = "CookLog", action = "" } = {}) {
  return `<header class="app-header">
    ${back ? `<button class="icon-button back-button" ${backAction ? `data-action="${backAction}"` : `data-nav="${back}"`} aria-label="뒤로" ${backDisabled ? "disabled" : ""}>${icons.chevronLeft}</button>` : `<span class="wordmark">${title}</span>`}
    ${back ? `<span class="wordmark">${title}</span>` : ""}
    ${action || `<span aria-hidden="true" style="width:44px"></span>`}
  </header>`;
}

function visibleRecipes() {
  return recipes
    .filter(item => !deletedRecipeIds.has(item.id))
    .sort((left, right) => Date.parse(right.lastActivityAt) - Date.parse(left.lastActivityAt));
}

function recipeCard(item, { match = "", menuOpen = false } = {}) {
  const inProgress = item.state !== "complete";
  const stateClass = item.state === "review" ? "is-review" : `is-${item.state}`;
  const matchLabel = match ? `<span class="match-label">${match}</span>` : "";
  const stateMarkup = inProgress
    ? `<span class="recipe-state ${stateClass}"><i class="recipe-state-symbol"></i>${item.status}</span>`
    : `<span class="meta">${item.activity} · ${item.time}</span>`;
  const supporting = item.state === "complete"
    ? `${item.detail} · ${item.steps}단계`
    : `${item.detail} · ${item.activity}`;
  return `<article class="card recipe-card recipe-card-shell" data-recipe-id="${item.id}" data-content-state="${item.state}">
    <button class="recipe-card-main" data-nav="${item.nav}" data-state="${item.navState}" aria-label="${escapeHTML(item.title)}, ${inProgress ? item.status : "레시피 상세"} 열기">
      ${matchLabel}${stateMarkup}
      <h4>${escapeHTML(item.title)}</h4>
      <p>${escapeHTML(supporting)}</p>
      <span class="recipe-arrow" aria-hidden="true">→</span>
    </button>
    ${inProgress ? `<button class="recipe-more" type="button" data-action="open-record-menu" data-id="${item.id}" aria-label="${escapeHTML(item.title)} 메뉴" aria-expanded="${menuOpen}" aria-controls="recipe-menu-${item.id}">${icons.more}</button>` : ""}
    ${menuOpen ? `<div class="recipe-menu" id="recipe-menu-${item.id}" role="menu"><button type="button" role="menuitem" data-action="request-delete-record" data-id="${item.id}">진행 기록 삭제</button></div>` : ""}
  </article>`;
}

function deleteDialog() {
  if (!deleteDialogOpen) return "";
  const item = recipes.find(recipe => recipe.id === pendingDeleteId);
  if (!item) return "";
  return `<div class="dialog-scrim" role="presentation">
    <section class="delete-dialog" role="alertdialog" aria-modal="true" aria-labelledby="delete-title" aria-describedby="delete-copy" tabindex="-1">
      <span class="dialog-icon" aria-hidden="true">×</span>
      <h3 id="delete-title">진행 기록을 영구 삭제할까요?</h3>
      <p id="delete-copy"><strong>${escapeHTML(item.title)}</strong>의 STEP Preview와 임시 저장 내용을 삭제합니다. 삭제한 기록은 복구할 수 없어요.</p>
      <div class="dialog-actions">
        <button class="button button-secondary" type="button" data-action="cancel-delete-record" data-dialog-initial-focus>취소</button>
        <button class="button button-destructive" type="button" data-action="confirm-delete-record">영구 삭제</button>
      </div>
    </section>
  </div>`;
}

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function feedbackCard(kind, title, copy, retry) {
  const icon = kind === "loading" ? `<div class="loader"></div>` : `<div class="empty-icon">${kind === "error" ? "!" : "·"}</div>`;
  const infoFocus = screen === "info" ? ` tabindex="-1" data-info-screen-focus` : "";
  return `<div class="card progress-card">
    <div>${icon}<h3${infoFocus}>${title}</h3><p>${copy}</p>
    ${retry ? `<button class="button button-secondary" style="margin-top:22px" data-state="${retry}">다시 시도</button>` : ""}</div>
  </div>`;
}

function renderHome() {
  if (state === "loading") return `<section class="screen">${header()}${feedbackCard("loading", "레시피를 불러오는 중", "나의 요리 기록을 정리하고 있어요.")}</section>`;
  if (state === "error") return `<section class="screen">${header()}${feedbackCard("error", "레시피를 불러오지 못했어요", "잠시 후 다시 시도해주세요.", "content")}</section>`;
  if (state === "menu-open") {
    recordMenuId = "draft-step";
    deleteDialogOpen = false;
  } else if (state === "delete-confirm") {
    recordMenuId = "";
    pendingDeleteId = "draft-step";
    deleteDialogOpen = true;
  }
  const recent = visibleRecipes().slice(0, 3);
  const content = state === "empty" || recent.length === 0
    ? `<div class="card empty-card"><div><div class="empty-icon">${icons.book}</div><h4>아직 요리 기록이 없어요</h4><p>첫 요리를 10초씩 기록하면 진행 기록과 완성한 레시피가 여기에 쌓입니다.</p></div></div>`
    : `<div class="recipe-list">${recent.map(item => recipeCard(item, { menuOpen: recordMenuId === item.id })).join("")}</div>`;
  return `<section class="screen home-screen">
    ${header({ action: `<div class="header-actions"><button class="icon-button" data-nav="info" data-state="overview" aria-label="앱 정보">${icons.info}</button><button class="icon-button" data-nav="library" data-state="all" aria-label="전체 요리 기록">${icons.book}</button></div>` })}
    <div class="hero">
      <p class="eyebrow">나의 주방 기록</p>
      <h2>오늘의 맛을<br>잊지 않도록</h2>
      <p>요리하면서 10초씩 말해보세요.<br>다시 만들 수 있는 레시피로 남겨드려요.</p>
    </div>
    <button class="button button-primary" data-action="start-new-log">
      ${icons.mic}<span>10초 요리 기록 시작</span>
    </button>
    <p class="preservation-note">새 기록을 시작해도 기존 진행 기록은 그대로 보존됩니다.</p>
    ${state === "ai-ready" ? `<div class="banner banner-success" role="status"><strong aria-hidden="true">✓</strong><div><strong>AI 정리가 끝났어요</strong><p>달큰한 간장 삼겹살 검토본이 준비됐습니다.</p><button class="banner-action" type="button" data-nav="review" data-state="editable">레시피 검토하기</button></div></div>` : ""}
    ${state === "network-error" ? `<div class="banner banner-error" role="alert"><strong aria-hidden="true">!</strong><div><strong>인터넷 연결을 확인해주세요</strong><p>실패한 온라인 행동은 자동으로 다시 실행하지 않았어요. 진행 기록·완료 레시피·검색·버튼 Audio Guide는 계속 사용할 수 있습니다.</p><button class="banner-action" type="button" data-action="retry-network-check">연결 다시 확인</button></div></div>` : ""}
    ${homeFeedback ? `<div class="compact-feedback" role="status">${escapeHTML(homeFeedback)}</div>` : ""}
    <div class="section-head"><div><h3>${state === "empty" ? "나의 요리 기록" : "최근 레시피"}</h3><span>최근 활동순 · 최대 3개</span></div><button class="text-action" data-nav="library" data-state="all">전체 보기</button></div>
    ${content}
    ${deleteDialog()}
  </section>`;
}

function infoMenuItem({ symbol, title, copy, state: nextState, action = "" }) {
  return `<button class="info-menu-item" type="button" ${action ? `data-action="${action}"` : `data-nav="info" data-state="${nextState}"`}>
    <span class="info-menu-symbol" aria-hidden="true">${symbol}</span>
    <span><strong>${title}</strong><small>${copy}</small></span>
    <span class="info-menu-arrow" aria-hidden="true">›</span>
  </button>`;
}

function renderInfo() {
  const infoHeader = header({ back: "home", title: "앱 정보" });
  if (state === "data-retention") {
    return `<section class="screen info-screen">${infoHeader}
      <div class="info-intro"><p class="eyebrow">LOCAL DATA</p><h2 class="screen-title" tabindex="-1" data-info-screen-focus>내 요리 기록은<br>이 기기에 보관돼요</h2><p>첫 출시의 보관 범위와 복구 한계를 정확히 안내합니다.</p></div>
      <div class="retention-summary" role="note"><span aria-hidden="true">⌂</span><div><strong>CookLog 로컬 저장</strong><p>진행 기록, STEP Preview와 완성 레시피는 현재 기기의 앱 저장소에 보관됩니다.</p></div></div>
      <div class="info-section"><h3>유실될 수 있는 경우</h3><ul class="boundary-list"><li><strong>앱 삭제</strong><span>앱과 함께 로컬 기록이 삭제될 수 있어요.</span></li><li><strong>기기 초기화·분실</strong><span>CookLog가 다른 기기에서 기록을 복구할 수 없어요.</span></li><li><strong>저장소 손상</strong><span>손상된 로컬 데이터의 복구를 보장하지 않아요.</span></li></ul></div>
      <div class="alert-card is-warning"><div class="alert-heading"><span class="alert-icon">!</span><div><h3>CookLog 백업·복구·동기화 미제공</h3><p>자체 서버 백업, 기기 간 동기화와 레시피 내보내기는 첫 출시에서 제공하지 않습니다. 운영체제 기기 백업으로 복원될 가능성도 CookLog가 완료 상태로 보장하지 않아요.</p></div></div></div>
      <button class="button button-secondary" type="button" data-nav="info" data-state="overview">앱 정보로 돌아가기</button>
    </section>`;
  }

  if (state === "contact-consent") {
    return `<section class="screen info-screen">${infoHeader}
      <div class="info-intro"><p class="eyebrow">EMAIL SUPPORT</p><h2 class="screen-title" tabindex="-1" data-info-screen-focus>어떤 정보와 함께<br>문의할까요?</h2><p>문의 내용은 사용자가 메일에서 직접 작성합니다.</p></div>
      <div class="privacy-points"><p><strong>사용자 콘텐츠는 첨부하지 않아요</strong><span>음성, STT 본문, 레시피 내용과 검색어를 자동으로 포함하지 않습니다.</span></p><p><strong>앱 버전만 기본 제공</strong><span>CookLog 1.0.0만 기본으로 사용합니다. OS 버전과 진단 정보는 아래에서 선택해야 포함돼요.</span></p></div>
      <button class="diagnostic-choice" type="button" data-action="toggle-diagnostics" aria-pressed="${diagnosticsIncluded}">
        <span class="choice-check" aria-hidden="true">${diagnosticsIncluded ? "✓" : ""}</span><span><strong>비콘텐츠 진단 정보 포함</strong><small>OS 버전, 오류 발생 화면·시각과 비콘텐츠 진단 범주를 포함합니다. 요리 내용은 포함하지 않아요.</small></span>
      </button>
      <p class="legal-placeholder">실제 문의 이메일 주소는 출시 통합 Task에서 연결합니다.</p>
      <div class="stack-actions"><button class="button button-primary" type="button" data-action="prepare-contact">문의 이메일 준비</button><button class="button button-secondary" type="button" data-nav="info" data-state="overview">취소</button></div>
    </section>`;
  }

  if (state === "contact-ready") {
    return `<section class="screen info-screen">${infoHeader}
      <div class="contact-preview"><span class="contact-icon" aria-hidden="true">✉</span><p class="eyebrow">EMAIL DRAFT</p><h2 tabindex="-1" data-info-screen-focus>문의 메일을 준비했어요</h2><p>운영 주소가 연결되면 기기의 이메일 앱에서 아래 정보만 포함해 작성합니다.</p></div>
      <dl class="metadata-list"><div><dt>받는 사람</dt><dd>출시 전 연결 예정</dd></div><div><dt>앱 버전</dt><dd>CookLog 1.0.0</dd></div><div><dt>진단 정보</dt><dd>${diagnosticsIncluded ? "OS 버전 · 오류 화면/시각 · 비콘텐츠 진단 범주" : "포함 안 함"}</dd></div><div><dt>사용자 콘텐츠</dt><dd>자동 첨부 없음</dd></div></dl>
      <div class="banner banner-info" role="status"><strong aria-hidden="true">i</strong><div><strong>이 화면은 안전한 구성 예시예요</strong><p>실제 문의 주소가 확정되기 전에는 외부 메일을 보내지 않습니다.</p></div></div>
      <button class="button button-primary" type="button" data-nav="info" data-state="overview">확인</button>
      <button class="button button-secondary" type="button" data-nav="info" data-state="mail-unavailable">이메일 앱 사용 불가 상태 보기</button>
    </section>`;
  }

  if (state === "mail-unavailable") {
    return `<section class="screen info-screen">${infoHeader}
      <div class="failure-hero"><span aria-hidden="true">✉</span><p class="eyebrow">EMAIL UNAVAILABLE</p><h2 tabindex="-1" data-info-screen-focus>이메일 앱을 열 수 없어요</h2><p>메일 앱이 설치되지 않았거나 계정 설정이 필요할 수 있습니다. CookLog 기록에는 영향을 주지 않아요.</p></div>
      <div class="alert-card"><div class="alert-heading"><span class="alert-icon">i</span><div><h3>문의 내용은 전송되지 않았어요</h3><p>사용자 콘텐츠와 진단 정보도 외부로 보내지지 않았습니다.</p></div></div><div class="alert-actions"><button class="button button-secondary" data-nav="info" data-state="overview">앱 정보로</button><button class="button button-primary" data-nav="info" data-state="contact-consent">다시 준비</button></div></div>
    </section>`;
  }

  const legalType = state.startsWith("privacy") ? "개인정보처리방침" : "이용약관";
  const legalKey = state.startsWith("privacy") ? "privacy" : "terms";
  if (state.endsWith("-loading")) {
    return `<section class="screen info-screen">${infoHeader}${feedbackCard("loading", `${legalType}을 여는 중`, "공개 문서 주소와 연결 상태를 확인하고 있어요.")}</section>`;
  }
  if (state.endsWith("-unconfigured")) {
    return `<section class="screen info-screen">${infoHeader}
      <div class="failure-hero is-neutral"><span aria-hidden="true">↗</span><p class="eyebrow">LINK NOT CONFIGURED</p><h2 tabindex="-1" data-info-screen-focus>${legalType} 주소를<br>준비하고 있어요</h2><p>화면 구조 검토용 placeholder 상태입니다. 공개 출시 전 운영 문서 주소를 연결하고 실제 내용을 검증해야 합니다.</p></div>
      <div class="banner banner-warning" role="status"><strong aria-hidden="true">!</strong><div><strong>아직 공개 문서로 이동하지 않아요</strong><p>미확정 주소나 임시 문서를 실제 법적 문서처럼 표시하지 않습니다.</p></div></div>
      <button class="button button-primary" type="button" data-nav="info" data-state="overview">앱 정보로 돌아가기</button>
    </section>`;
  }
  if (state.endsWith("-error")) {
    return `<section class="screen info-screen">${infoHeader}
      <div class="failure-hero"><span aria-hidden="true">!</span><p class="eyebrow">LINK ERROR</p><h2 tabindex="-1" data-info-screen-focus>${legalType}을<br>열지 못했어요</h2><p>인터넷 연결 또는 문서 주소 문제일 수 있습니다. 다른 로컬 기능은 그대로 사용할 수 있어요.</p></div>
      <div class="stack-actions"><button class="button button-primary" type="button" data-nav="info" data-state="${legalKey}-loading">문서만 다시 열기</button><button class="button button-secondary" type="button" data-nav="info" data-state="overview">앱 정보로</button></div>
    </section>`;
  }

  return `<section class="screen info-screen">${infoHeader}
    <div class="app-identity"><span class="app-mark" aria-hidden="true">C</span><div><p class="eyebrow">COOKLOG</p><h2 tabindex="-1" data-info-screen-focus>나의 요리 기록</h2><p>버전 1.0.0 · 첫 공개 출시</p></div></div>
    <div class="info-menu" aria-label="지원 및 법적 정보">
      ${infoMenuItem({ symbol: "✉", title: "이메일 문의하기", copy: "콘텐츠 자동 첨부 없이 문의", state: "contact-consent" })}
      ${infoMenuItem({ symbol: "⌁", title: "개인정보처리방침", copy: "공개 URL 연결 상태 포함", state: "privacy-loading" })}
      ${infoMenuItem({ symbol: "§", title: "이용약관", copy: "공개 URL 연결 상태 포함", state: "terms-loading" })}
      ${infoMenuItem({ symbol: "⌂", title: "데이터 보관 안내", copy: "로컬 저장과 복구 한계", state: "data-retention" })}
    </div>
    <div class="retention-inline"><strong>기록은 현재 기기에 저장돼요</strong><p>CookLog 자체 백업·복구·기기 간 동기화는 첫 출시에서 제공하지 않습니다.</p><button type="button" data-nav="info" data-state="data-retention">자세히 보기</button></div>
    <p class="info-footnote">실제 문의 주소와 법적 문서 URL은 출시 통합 전에 연결·검증해야 합니다.</p>
  </section>`;
}

function libraryResults(query) {
  const searchable = visibleRecipes().filter(item => item.state === "review" || item.state === "complete");
  const normalized = query.trim().toLocaleLowerCase("ko");
  if (!normalized) return visibleRecipes().map(item => ({ item, match: "" }));
  const titleMatches = searchable
    .filter(item => item.title.toLocaleLowerCase("ko").includes(normalized))
    .map(item => ({ item, match: "제목 일치" }));
  const titleIds = new Set(titleMatches.map(result => result.item.id));
  const ingredientMatches = searchable
    .filter(item => !titleIds.has(item.id) && item.ingredients.some(ingredient => ingredient.toLocaleLowerCase("ko").includes(normalized)))
    .map(item => ({ item, match: "재료 일치" }));
  return [...titleMatches, ...ingredientMatches];
}

function librarySearchState(query, results = libraryResults(query)) {
  if (!query.trim()) return "all";
  if (results.length === 0) return "no-results";
  return results.some(result => result.match === "제목 일치") ? "search-title" : "search-ingredient";
}

function renderLibrary() {
  if (state === "empty") searchQuery = "";
  const results = state === "empty" ? [] : libraryResults(searchQuery);
  const searching = searchQuery.trim().length > 0;
  const resultCopy = searching
    ? `${results.length}개 결과 · ${state === "search-ingredient" ? "재료 일치" : "제목 일치 우선"}`
    : `최근 활동순 · ${results.length}개`;
  const body = results.length
    ? `<div class="recipe-list">${results.map(result => recipeCard(result.item, { match: result.match, menuOpen: recordMenuId === result.item.id })).join("")}</div>`
    : `<div class="card search-empty"><div class="empty-icon">${icons.search}</div><h3>${searching ? "일치하는 레시피가 없어요" : "아직 요리 기록이 없어요"}</h3><p>${searching ? "제목이나 재료명을 다시 확인하거나 검색어를 지워보세요." : "Home에서 첫 요리 기록을 시작해보세요."}</p>${searching ? `<button class="button button-secondary" type="button" data-action="clear-search">검색어 지우기</button>` : ""}</div>`;
  return `<section class="screen library-screen">
    ${header({ back: "home", title: "전체 보기" })}
    <div class="library-intro"><p class="eyebrow">MY COOKLOG</p><h2>모든 요리 기록</h2><p>진행 중인 기록과 완료 레시피를 최근 활동순으로 모았습니다.</p></div>
    <label class="search-field" for="recipe-search">
      <span class="search-icon">${icons.search}</span>
      <input id="recipe-search" type="search" inputmode="search" autocomplete="off" placeholder="제목·재료명 검색" value="${escapeHTML(searchQuery)}" aria-describedby="search-privacy">
      ${searching ? `<button type="button" data-action="clear-search" aria-label="검색어 지우기">${icons.close}</button>` : ""}
    </label>
    <p class="search-privacy" id="search-privacy">기기 안에서만 검색하며 서버나 AI로 보내지 않습니다.</p>
    <div class="library-summary"><strong>${resultCopy}</strong>${searching ? `<span>STEP Preview 초안은 검색에서 제외</span>` : `<span>정렬·필터 없음</span>`}</div>
    ${body}
    ${deleteDialog()}
  </section>`;
}

function stepRows({ includeProcessing = false, locked = false } = {}) {
  const rows = recordedSteps.map((copy, index) =>
    `<div class="step-row ${locked ? "is-locked" : ""}" data-step-index="${index}">
      <span class="step-number">${index + 1}</span>
      <div class="step-copy"><p>${copy}</p><span>${locked ? "AI 정리 snapshot에 포함됨" : "왼쪽으로 밀어 삭제"}</span></div>
      <button class="step-delete" type="button" data-action="delete-step" data-index="${index}" aria-label="STEP ${index + 1} 삭제" ${locked ? "disabled" : ""}>삭제</button>
    </div>`
  ).join("");
  const pending = includeProcessing
    ? `<div class="step-row is-processing"><span class="step-number">${recordedSteps.length + 1}</span><div class="step-copy"><p class="processing-line">방금 말한 기록을 기기에서 변환하고 있어요.</p><span>완료되면 원문 STEP으로 자동 저장</span></div></div>`
    : "";
  return `<div class="step-list">${rows}${pending}</div>`;
}

function logBanner(kind, title, copy, action = "") {
  return `<div class="banner banner-${kind}" role="${kind === "error" ? "alert" : "status"}"><strong aria-hidden="true">${kind === "success" ? "✓" : kind === "error" ? "!" : "i"}</strong><div><strong>${title}</strong><p>${copy}</p>${action}</div></div>`;
}

function logStepSection({ processing = false, locked = false } = {}) {
  if (recordedSteps.length === 0 && !processing) return "";
  return `<div class="section-head"><h3>STEP Preview</h3><span class="meta">${processing ? "기기 내 처리 중" : `${recordedSteps.length}개 · 자동 저장됨`}</span></div>${stepRows({ includeProcessing: processing, locked })}`;
}

function recordAction(label = "10초 기록 시작") {
  return `<button class="button button-primary" type="button" data-action="start-recording">${icons.mic}<span>${label}</span></button>`;
}

function renderLog() {
  const baseHeader = header({ back: "home", title: "요리 기록" });
  if (state === "intro") {
    return `<section class="screen">${baseHeader}
      <div class="permission-hero"><span class="permission-icon">${icons.mic}</span><p class="eyebrow">첫 기록 전에</p><h2 class="screen-title">요리한 순간을<br>10초씩 남겨보세요</h2><p>CookLog는 마이크를 지금 한 일을 텍스트 STEP으로 바꾸는 데만 사용해요. 첫 출시에서는 음성을 서버나 외부 STT 업체로 보내지 않습니다.</p></div>
      <div class="privacy-points"><p><strong>10초 후 자동 종료</strong><span>일시정지나 조기 종료 없이 한 번에 기록해요.</span></p><p><strong>Apple 기기 안에서 변환</strong><span>처리가 끝나면 임시 음성을 삭제해요.</span></p></div>
      <button class="button button-primary" type="button" data-action="continue-mic-permission">마이크 권한 계속</button>
      <button class="button button-secondary" type="button" data-nav="home" data-state="content">나중에 하기</button>
    </section>`;
  }
  if (state === "permission-denied") {
    return `<section class="screen">${baseHeader}
      <div class="hero"><p class="eyebrow">MICROPHONE ACCESS</p><h2 class="screen-title">기록하려면 마이크 권한이 필요해요</h2><p>권한을 허용해도 음성은 Apple 기기 안에서만 STEP으로 변환됩니다.</p></div>
      ${logBanner("warning", "기존 기록은 그대로 사용할 수 있어요", "Home, 저장된 레시피와 오디오 가이드는 권한 없이도 열 수 있습니다.")}
      ${logFeedback ? logBanner("info", logFeedback, "권한을 바꾼 뒤 CookLog로 돌아와 다시 기록해주세요.") : ""}
      <button class="button button-primary" type="button" data-action="open-settings">설정으로 이동</button>
      <button class="button button-secondary" type="button" data-nav="home" data-state="content">Home으로 돌아가기</button>
    </section>`;
  }
  if (state === "record-error") {
    return `<section class="screen">${baseHeader}
      <div class="hero"><p class="eyebrow">RECORDING ERROR</p><h2 class="screen-title">녹음을 시작하지 못했어요</h2><p>다른 앱이 마이크를 사용 중인지 확인하고 다시 시작해주세요.</p></div>
      ${logBanner("error", "새 STEP은 만들어지지 않았어요", "기존 STEP과 진행 기록은 그대로 보존되어 있습니다.")}
      ${logStepSection()}
      ${recordAction("10초 다시 기록")}
    </section>`;
  }
  if (state === "stt-unsupported") {
    return `<section class="screen">${baseHeader}
      <div class="hero"><p class="eyebrow">ON-DEVICE STT</p><h2 class="screen-title">이 기기에서는 음성 기록을 지원하지 않아요</h2><p>지원되는 Apple 기기와 한국어 음성 인식 환경이 필요합니다.</p></div>
      ${logBanner("warning", "원격 STT로 자동 전환하지 않아요", "음성을 Backend나 외부 제공업체로 보내지 않으며 기존 기록과 레시피는 계속 사용할 수 있습니다.")}
      <button class="button button-primary" type="button" data-nav="home" data-state="content">기존 기록 보기</button>
    </section>`;
  }
  if (state === "stt-error") {
    return `<section class="screen">${baseHeader}
      <div class="hero"><p class="eyebrow">TRANSCRIPTION FAILED</p><h2 class="screen-title">이번 음성을 STEP으로 만들지 못했어요</h2><p>기기 내 자동 재처리 1회까지 완료했지만 인식할 수 없었습니다.</p></div>
      ${logBanner("error", "임시 음성을 삭제했어요", "원격 STT로 전환하지 않았고 기존 STEP은 모두 보존했습니다.")}
      ${logStepSection()}
      ${recordAction("다시 기록하기")}
    </section>`;
  }
  const isRecording = state === "recording";
  const isProcessing = state === "processing";
  const isRetrying = state === "retrying";
  const isOffline = state === "offline";
  const isLocked = state === "ai-lock";
  const isAiOffline = state === "ai-offline";
  const isUndo = state === "undo-delete";
  const showSteps = ["processing", "retrying", "steps", "undo-delete", "offline", "ai-lock", "ai-offline"].includes(state);
  const showRecordOrb = ["empty", "recording", "processing", "retrying"].includes(state);
  const eyebrow = isRecording ? "RECORDING" : isProcessing || isRetrying ? "ON-DEVICE STT" : isLocked ? "AI SNAPSHOT" : "STEP PREVIEW";
  const title = isRecording ? "지금 한 일을 말해주세요" : isProcessing ? "기기에서 STEP으로 바꾸는 중" : isRetrying ? "한 번 더 인식하고 있어요" : isLocked ? "정리에 사용한 STEP을 잠갔어요" : "짧게 말하고 계속 요리하세요";
  const description = isRecording
    ? "10초가 지나면 자동으로 종료됩니다. 중간에 멈추거나 늘리지 않아요."
    : isProcessing ? "음성을 외부로 보내지 않고 Apple 기기 안에서 변환합니다."
    : isRetrying ? "같은 기기 내 인식으로 자동 재처리하는 마지막 1회입니다."
    : isLocked ? "AI 정리가 끝날 때까지 이 snapshot은 추가하거나 삭제할 수 없어요."
    : "STEP은 말한 원문과 녹음 시간순으로 자동 저장됩니다.";
  return `<section class="screen">
    ${baseHeader}
    <div class="hero">
      <p class="eyebrow">${eyebrow}</p>
      <h2 class="screen-title" tabindex="-1" data-log-state-focus>${title}</h2>
      <p>${description}</p>
    </div>
    ${isOffline ? logBanner("success", "오프라인에서도 기록할 수 있어요", "지원되는 기기에서는 10초 기록과 STEP Preview 생성이 계속됩니다.") : ""}
    ${isAiOffline ? logBanner("warning", "AI 정리에는 인터넷 연결이 필요해요", "STEP Preview는 그대로 보존했습니다. 연결 후 다시 선택해주세요.") : ""}
    ${isRetrying ? logBanner("info", "자동 재처리 1/1", "이후에도 실패하면 새 STEP을 만들지 않고 임시 음성을 삭제합니다.") : ""}
    ${logFeedback ? logBanner("success", logFeedback, "텍스트 초안을 이 기기에 자동 저장했습니다.") : ""}
    ${showRecordOrb ? `<div class="record-orb ${isRecording ? "recording" : ""}">
      <div class="record-core" ${isRecording ? `role="timer" tabindex="-1" data-recording-focus aria-label="${recordSecondsRemaining}초 남음"` : ""}>
        <span class="record-time" data-recording-timer aria-hidden="true">${isRecording ? String(recordSecondsRemaining).padStart(2, "0") : isProcessing || isRetrying ? "···" : "10"}</span>
        <span class="record-label" aria-hidden="${isRecording}">${isRecording ? "초 남음" : isProcessing ? "기기 내 변환 중" : isRetrying ? "자동 재처리 중" : "초 기록"}</span>
      </div>
    </div>` : ""}
    ${state === "empty" ? recordAction(recordedSteps.length ? "10초 더 기록" : "10초 기록 시작") : ""}
    ${showSteps ? logStepSection({ processing: isProcessing || isRetrying, locked: isLocked }) : ""}
    ${isUndo && deletedStep ? `<div class="undo-toast" role="status"><p><strong>STEP을 삭제했어요</strong><span>5초 안에 되돌릴 수 있어요. 변경 사항은 자동 저장됐습니다.</span></p><button type="button" data-action="undo-step" data-undo-step>되돌리기</button></div>` : ""}
    ${(state === "steps" || isUndo || isAiOffline || isOffline) ? `<div class="banner banner-info" role="status"><strong aria-hidden="true">i</strong><div><strong>아직 AI가 정리한 결과가 아니에요</strong><p>말한 원문과 녹음 순서대로 쌓인 STEP Preview입니다.</p></div></div>
      <div class="log-actions">
        <button class="button button-secondary" type="button" data-action="start-recording">${icons.mic}<span>10초 더 기록</span></button>
        <button class="button button-primary" type="button" data-action="${isAiOffline ? "retry-ai-online" : isOffline ? "show-ai-offline" : "start-ai-organizing"}">${icons.sparkles}<span>${isAiOffline ? "연결 후 다시 확인" : "AI 정리하기"}</span></button>
      </div>` : ""}
    ${isLocked ? `<div class="log-actions"><button class="button button-secondary" type="button" disabled>${icons.mic}<span>정리 중에는 기록 추가 불가</span></button><button class="button button-primary is-loading" type="button" data-nav="review" data-state="processing"><span class="inline-loader" aria-hidden="true"></span><span>AI 정리 상태 보기</span></button></div>` : ""}
  </section>`;
}

function reviewStepCards({ disabled = false, validation = false } = {}) {
  return reviewDraft.steps.map((step, index) => {
    const empty = validation && !step.trim();
    return `<article class="step-edit-card ${empty ? "is-error" : ""}" draggable="${!disabled}" data-review-step-card data-index="${index}">
      <span class="step-edit-number" aria-hidden="true">${index + 1}</span>
      <div class="step-edit-content">
        <label for="review-step-${index}">STEP ${index + 1}</label>
        <textarea class="textarea" id="review-step-${index}" data-draft-field="step" data-draft-index="${index}" ${disabled ? "disabled" : ""}>${escapeHTML(step)}</textarea>
        ${empty ? `<p class="field-error" id="step-error-${index}">조리 내용을 입력하거나 빈 단계를 삭제해주세요.</p>` : ""}
        <div class="step-edit-actions" aria-label="STEP ${index + 1} 순서와 삭제">
          <button type="button" data-action="move-review-step" data-direction="-1" data-index="${index}" ${disabled || index === 0 ? "disabled" : ""} aria-label="STEP ${index + 1} 위로 이동">↑</button>
          <button type="button" data-action="move-review-step" data-direction="1" data-index="${index}" ${disabled || index === reviewDraft.steps.length - 1 ? "disabled" : ""} aria-label="STEP ${index + 1} 아래로 이동">↓</button>
          <button type="button" class="is-destructive" data-action="remove-review-step" data-index="${index}" ${disabled ? "disabled" : ""} aria-label="STEP ${index + 1} 삭제">삭제</button>
        </div>
      </div>
      <span class="step-edit-handle" aria-hidden="true">⠿</span>
    </article>`;
  }).join("");
}

function reviewForm({ disabled = false, mode = "draft", validation = false } = {}) {
  const ingredientRows = reviewDraft.ingredients.map((ingredient, index) =>
    `<div class="ingredient-row">
      <input class="input" aria-label="재료 이름" data-draft-field="ingredient-name" data-draft-index="${index}" value="${escapeHTML(ingredient.name)}" ${disabled ? "disabled" : ""}>
      <input class="input" aria-label="재료 양" data-draft-field="ingredient-amount" data-draft-index="${index}" value="${escapeHTML(ingredient.amount)}" ${disabled ? "disabled" : ""}>
      <button class="remove-button" type="button" data-action="remove-ingredient" data-index="${index}" aria-label="${escapeHTML(ingredient.name)} 삭제" ${disabled ? "disabled" : ""}>×</button>
    </div>`
  ).join("");
  const titleError = validation && !reviewDraft.title.trim();
  const stepError = validation && !reviewDraft.steps.some(step => step.trim());
  const amountOnlyError = validation && reviewDraft.ingredients.some(item => !item.name.trim() && item.amount.trim());
  return `<form class="form" onsubmit="return false">
    <div class="field ${titleError ? "has-error" : ""}">
      <span class="field-state-label">확정</span><label for="title">제목</label>
      <input class="input" id="title" data-draft-field="title" value="${escapeHTML(reviewDraft.title)}" aria-invalid="${titleError}" ${disabled ? "disabled" : ""}>
      ${titleError ? `<p class="field-error">레시피 제목을 입력해주세요.</p>` : ""}
    </div>
    <div class="field is-estimated ${amountOnlyError ? "has-error" : ""}">
      <span class="field-state-label">AI 추정</span><span class="group-label">재료와 양</span>
      ${ingredientRows}
      <button class="subtle-add" type="button" data-action="add-ingredient" ${disabled ? "disabled" : ""}>+ 재료 추가</button>
      <p class="field-support is-estimated">말한 기록에서 추정했어요. 이름이 없는 재료의 양은 저장할 수 없습니다.</p>
      ${amountOnlyError ? `<p class="field-error">양을 입력한 행에는 재료 이름도 입력해주세요.</p>` : ""}
    </div>
    <div class="field ${stepError ? "has-error" : ""}">
      <span class="field-state-label">확정 + AI 추정</span><span class="group-label">조리 순서</span>
      <p class="field-support">카드를 끌거나 위·아래 버튼으로 순서를 바꿀 수 있어요. 저장 시 빈 단계는 제외되고 번호가 다시 매겨집니다.</p>
      <div class="review-step-list">${reviewStepCards({ disabled, validation })}</div>
      <button class="subtle-add" type="button" data-action="add-review-step" ${disabled ? "disabled" : ""}>+ STEP 추가</button>
      ${stepError ? `<p class="field-error">내용이 있는 조리 단계가 최소 1개 필요합니다.</p>` : ""}
    </div>
    <div class="field is-estimated"><span class="field-state-label">AI 추정</span><label for="time">예상 시간</label><input class="input" id="time" data-draft-field="time" value="${escapeHTML(reviewDraft.time)}" ${disabled ? "disabled" : ""}><p class="field-support is-estimated">기록 간격과 조리 표현을 바탕으로 추정했어요.</p></div>
    <div class="field is-missing"><span class="field-state-label">누락 · 선택</span><label for="memo">메모</label><textarea class="textarea" id="memo" data-draft-field="memo" placeholder="다음 요리를 위한 팁을 남겨보세요" ${disabled ? "disabled" : ""}>${escapeHTML(reviewDraft.memo)}</textarea><p class="field-support">비워두어도 저장할 수 있어요.</p></div>
    <div class="sticky-action review-save-actions">
      ${mode === "draft" ? `<button class="button button-secondary" type="button" data-action="save-review-draft" ${disabled ? "disabled" : ""}>임시 저장</button>` : ""}
      <button class="button button-primary ${disabled ? "is-loading" : ""}" type="button" data-action="${mode === "complete" ? "save-completed-edit" : "save-recipe"}" ${disabled ? "disabled" : ""}>${disabled ? `<span class="inline-loader" aria-hidden="true"></span><span>${mode === "complete" ? "수정 중" : "저장 중"}</span>` : mode === "complete" ? "수정 완료" : "레시피 저장"}</button>
    </div>
  </form>`;
}

function renderReview() {
  if (state === "processing" || state === "processing-long") {
    const isLong = state === "processing-long";
    return `<section class="screen">${header({ back: "home", title: "AI 레시피 정리" })}
      ${feedbackCard("loading", isLong ? "정리에 시간이 조금 더 걸리고 있어요" : "레시피로 정리하는 중", isLong ? "10초가 지났지만 실패가 아니에요. STEP snapshot은 잠겨 있고 정리는 계속됩니다." : "같은 요청으로 하나의 검토본만 만들고 있어요. 화면은 자동으로 바뀌지 않습니다.")}
      <div class="alert-card"><div class="alert-heading"><span class="alert-icon">↗</span><div><h3>다른 화면을 이용해도 괜찮아요</h3><p>완료되면 앱 안에서 알려드리고 Home에 ‘검토 준비됨’ 카드가 나타납니다.</p></div></div><div class="alert-actions is-single"><button class="button button-secondary" data-nav="home" data-state="content">Home으로 가기</button></div></div>
    </section>`;
  }
  if (state === "ready-banner") return `<section class="screen">${header()}
    <div class="hero"><p class="eyebrow">AI 정리 완료</p><h2 class="screen-title">검토할 레시피가<br>준비됐어요</h2><p>자동으로 화면을 바꾸지 않았어요. 준비됐을 때 직접 열어보세요.</p></div>
    <div class="banner banner-success" role="status"><strong aria-hidden="true">✓</strong><div><strong>달큰한 간장 삼겹살 · 검토 준비됨</strong><p>STEP snapshot 3개로 만든 검토본 1개입니다.</p><button class="banner-action" type="button" data-action="open-ready-review">레시피 검토하기</button></div></div>
    <button class="button button-secondary" data-nav="home" data-state="content">나중에 Home에서 확인</button>
  </section>`;
  if (state === "generation-error") return `<section class="screen">${header({ back: "log", title: "AI 레시피 정리" })}
    <div class="alert-card is-error" role="alert"><div class="alert-heading"><span class="alert-icon">!</span><div><h3>현재 AI 정리를 사용할 수 없어요</h3><p>인터넷 연결 또는 CookLog AI 서비스 문제일 수 있어요. STEP Preview는 그대로 보존했고 AI snapshot 잠금을 해제했습니다.</p></div></div><div class="alert-actions"><button class="button button-secondary" data-action="back-to-log">기록으로 돌아가기</button><button class="button button-primary" data-action="retry-ai-generation">AI 정리만 다시 시도</button></div></div>
    <div class="banner banner-info" role="status"><strong aria-hidden="true">i</strong><div><strong>로컬 기능은 계속 사용할 수 있어요</strong><p>진행·완료 레시피, 검색과 버튼 Audio Guide는 이 장애로 차단되지 않습니다.</p></div></div>
    <p class="preservation-note">서비스가 복구돼도 자동 재시도하거나 화면을 자동 전환하지 않습니다.</p>
  </section>`;
  const completeMode = reviewMode === "complete";
  const saving = state === "saving" || state === "complete-saving";
  const saveError = state === "save-error";
  const validation = state === "validation-error";
  const draftSaved = state === "draft-saved";
  const unsavedExit = state === "unsaved-exit";
  return `<section class="screen">
    ${header({ back: completeMode ? "detail" : "log", backAction: "request-review-exit", backDisabled: saving, title: completeMode ? "레시피 수정" : "레시피 검토" })}
    <div class="hero"><p class="eyebrow">${completeMode ? "SAVED RECIPE" : "AI DRAFT"}</p><h2 class="screen-title">${completeMode ? "완성한 레시피를 수정해요" : "내 요리와 맞는지<br>한 번만 확인하세요"}</h2><p>${completeMode ? "AI를 다시 호출하지 않고 기존 레시피를 바로 갱신합니다." : "확정·AI 추정·누락 표시를 확인하고 자유롭게 수정하세요."}</p></div>
    ${draftSaved ? `<div class="toast is-info" role="status"><strong>✓</strong><p>임시 저장했어요. 계속 편집할 수 있습니다.</p><button class="toast-action" data-action="dismiss-review-feedback" aria-label="알림 닫기">닫기</button></div>` : ""}
    ${removedReviewStep ? `<div class="toast" role="status"><strong>−</strong><p>STEP을 삭제했어요. 저장 전까지 되돌릴 수 있습니다.</p><button class="toast-action" data-action="undo-review-step">되돌리기</button></div>` : ""}
    ${validation ? `<div class="banner banner-error" role="alert"><strong aria-hidden="true">!</strong><div><strong>저장할 내용을 확인해주세요</strong><p>제목과 내용이 있는 조리 단계가 최소 1개 필요합니다.</p></div></div>` : ""}
    ${saving ? `<div class="banner banner-success" role="status"><strong aria-hidden="true">✓</strong><div><strong>저장하고 있어요</strong><p>완료되면 레시피 상세로 이동합니다.</p></div></div>` : ""}
    ${saveError ? `<div class="banner banner-error" role="alert"><strong aria-hidden="true">!</strong><div><strong>기기에 레시피를 저장하지 못했어요</strong><p>네트워크 장애가 아닌 로컬 저장 실패입니다. 현재 편집값은 그대로 유지했어요.</p><button class="banner-action" type="button" data-action="save-recipe">로컬 저장 다시 시도</button></div></div>` : ""}
    ${unsavedExit ? `<div class="dialog-scrim" role="presentation"><section class="delete-dialog unsaved-dialog" role="alertdialog" aria-modal="true" aria-labelledby="unsaved-title" aria-describedby="unsaved-copy" tabindex="-1"><span class="dialog-icon is-warning" aria-hidden="true">!</span><h3 id="unsaved-title">저장하지 않은 변경이 있어요</h3><p id="unsaved-copy">${completeMode ? "수정을 버리면 마지막으로 저장된 완성 레시피로 돌아갑니다." : "마지막 임시 저장 이후의 변경을 어떻게 처리할지 선택해주세요."}</p><div class="exit-actions">${completeMode ? "" : `<button class="button button-primary" data-action="save-draft-leave">임시 저장하고 나가기</button>`}<button class="button button-destructive" data-action="discard-review-leave">${completeMode ? "수정 버리고 상세로" : "변경 버리고 나가기"}</button><button class="button button-secondary" data-action="continue-review-editing" data-unsaved-dialog-focus>계속 편집</button></div></section></div>` : ""}
    ${reviewForm({ disabled: saving || unsavedExit, mode: completeMode ? "complete" : "draft", validation })}
  </section>`;
}

function renderDetail() {
  if (state === "loading") return `<section class="screen">${header({ back: "home", title: "레시피" })}${feedbackCard("loading", "레시피를 여는 중", "저장된 요리 기록을 불러오고 있어요.")}</section>`;
  if (state === "error") return `<section class="screen">${header({ back: "home", title: "레시피" })}${feedbackCard("error", "레시피를 열지 못했어요", "잠시 후 다시 시도해주세요.", "content")}</section>`;
  if (state === "not-found") return `<section class="screen">${header({ back: "home", title: "레시피" })}${feedbackCard("empty", "레시피를 찾을 수 없어요", "삭제되었거나 아직 저장되지 않은 레시피입니다.")}</section>`;
  if (state === "deleted") return `<section class="screen">${header()}${feedbackCard("empty", "레시피를 삭제했어요", "완성된 레시피와 오디오 가이드를 영구 삭제했습니다.")}<button class="button button-primary" data-nav="home" data-state="content">Home으로</button></section>`;
  const menuOpen = state === "menu-open";
  const deleteConfirm = state === "delete-confirm";
  const visibleIngredients = completedRecipe.ingredients.filter(item => item.name.trim());
  const visibleSteps = completedRecipe.steps.filter(step => step.trim());
  return `<section class="screen">
    ${header({ back: "home", title: "레시피", action: `<div class="detail-menu-wrap"><button class="icon-button" type="button" data-action="toggle-detail-menu" aria-label="레시피 메뉴" aria-expanded="${menuOpen}">${icons.more}</button>${menuOpen ? `<div class="detail-menu" role="menu"><button role="menuitem" data-action="edit-completed-recipe">레시피 수정</button><button role="menuitem" class="is-destructive" data-action="request-delete-completed">레시피 삭제</button></div>` : ""}</div>` })}
    <div class="detail-hero">
      <p class="eyebrow">MY COOKLOG</p><h2>${escapeHTML(completedRecipe.title)}</h2>
      <div class="pill-row"><span class="pill">${escapeHTML(completedRecipe.time || "시간 미정")}</span><span class="pill">${visibleIngredients.length}개 재료</span><span class="pill">${visibleSteps.length}단계</span></div>
    </div>
    <button class="button button-primary" data-nav="player" data-state="ready">${icons.play}<span>오디오 가이드 시작</span></button>
    <section class="content-section"><h3>재료</h3><ul class="ingredient-list">${visibleIngredients.map(item => `<li><span>${escapeHTML(item.name)}</span><span>${escapeHTML(item.amount)}</span></li>`).join("")}</ul></section>
    <section class="content-section"><h3>조리 순서</h3><ol class="method-list">${visibleSteps.map(step => `<li>${escapeHTML(step)}</li>`).join("")}</ol></section>
    <section class="content-section"><h3>메모</h3><div class="card note-card">${escapeHTML(completedRecipe.memo || "남긴 메모가 없어요.")}</div></section>
    ${deleteConfirm ? `<div class="dialog-scrim" role="presentation"><section class="delete-dialog" role="alertdialog" aria-modal="true" aria-labelledby="completed-delete-title" aria-describedby="completed-delete-copy"><span class="dialog-icon" aria-hidden="true">×</span><h3 id="completed-delete-title">완성된 레시피를 영구 삭제할까요?</h3><p id="completed-delete-copy"><strong>${escapeHTML(completedRecipe.title)}</strong>과 오디오 가이드를 삭제합니다. 이 작업은 되돌릴 수 없어요.</p><div class="dialog-actions"><button class="button button-secondary" data-action="cancel-delete-completed" data-completed-dialog-focus>취소</button><button class="button button-destructive" data-action="confirm-delete-completed">영구 삭제</button></div></section></div>` : ""}
  </section>`;
}

function playerSteps() {
  return completedRecipe.steps.filter(step => step.trim());
}

function playerIngredients() {
  return completedRecipe.ingredients
    .filter(item => item.name.trim())
    .map(item => `${item.name}${item.amount.trim() ? ` ${item.amount}` : ""}`)
    .join(", ");
}

function startPlayerPlayback({ restart = true } = {}) {
  playerPlayback = "playing";
  if (restart || playerPlaybackEndsAt <= Date.now()) playerPlaybackEndsAt = Date.now() + 2200;
}

function pausePlayerPlayback() {
  playerPlayback = "paused";
  playerPlaybackEndsAt = 0;
}

function preparePlayerState(nextState, initial = false) {
  const steps = playerSteps();
  const lastIndex = Math.max(steps.length - 1, 0);
  playerStep = Math.min(playerStep, lastIndex);
  playerCommandBoundary = "";
  if (nextState === "ready") {
    playerStep = 0;
    pausePlayerPlayback();
    handsfreeActive = false;
    playerFeedback = "STEP 1이 준비됐어요. 자동 재생하지 않습니다.";
  } else if (nextState === "playing") {
    startPlayerPlayback();
  } else if (nextState === "paused" || nextState === "step-complete") {
    pausePlayerPlayback();
  } else if (nextState === "last-step") {
    playerStep = lastIndex;
    pausePlayerPlayback();
  } else if (nextState === "ingredients" || nextState === "command-ingredients") {
    pausePlayerPlayback();
    if (nextState === "command-ingredients") handsfreeActive = true;
  } else if (nextState === "handsfree-active" || nextState === "listening") {
    handsfreeActive = true;
  } else if (nextState === "command-next") {
    handsfreeActive = true;
    if (playerStep >= lastIndex) {
      playerCommandBoundary = "last";
      pausePlayerPlayback();
      playerFeedback = "마지막 단계예요. 다음 단계는 없습니다.";
    } else {
      if (initial || playerStep < lastIndex) playerStep = Math.min(playerStep + 1, lastIndex);
      startPlayerPlayback();
    }
  } else if (nextState === "command-previous") {
    handsfreeActive = true;
    if (playerStep === 0) {
      playerCommandBoundary = "first";
      pausePlayerPlayback();
      playerFeedback = "첫 단계예요. 이전 단계는 없습니다.";
    } else {
      if (initial || playerStep > 0) playerStep = Math.max(playerStep - 1, 0);
      startPlayerPlayback();
    }
  } else if (nextState === "command-pause") {
    pausePlayerPlayback();
    handsfreeActive = true;
  } else if (nextState === "command-resume" || nextState === "command-replay") {
    startPlayerPlayback({ restart: nextState === "command-replay" });
    handsfreeActive = true;
  } else if (nextState === "command-exit") {
    handsfreeActive = false;
  } else if (nextState === "command-uncertain") {
    handsfreeActive = true;
  } else if (nextState === "permission-denied") {
    handsfreeActive = false;
    handsfreePermission = "denied";
  } else if (nextState === "interrupted" || nextState === "background-ended") {
    pausePlayerPlayback();
    handsfreeActive = false;
  }
}

if (screen === "player") preparePlayerState(state, true);

function renderPlayer() {
  if (state === "loading") return `<section class="screen">${header({ back: "detail", title: "오디오 가이드" })}${feedbackCard("loading", "가이드를 준비하는 중", "기기에 저장된 레시피로 로컬 음성을 준비하고 있어요.")}</section>`;
  if (state === "no-steps") return `<section class="screen">${header({ back: "detail", title: "오디오 가이드" })}${feedbackCard("empty", "재생할 단계가 없어요", "조리 순서가 있는 레시피만 오디오로 들을 수 있습니다.")}</section>`;
  const steps = playerSteps();
  const lastIndex = Math.max(steps.length - 1, 0);
  playerStep = Math.min(playerStep, lastIndex);
  const ttsError = state === "error";
  const commandCopy = {
    "command-next": playerCommandBoundary === "last"
      ? ["마지막 단계예요", "다음 단계가 없어 현재 단계에서 일시정지합니다."]
      : ["“다음”을 실행했어요", "이동한 단계를 처음부터 읽습니다."],
    "command-previous": playerCommandBoundary === "first"
      ? ["첫 단계예요", "이전 단계가 없어 현재 단계에서 일시정지합니다."]
      : ["“이전”을 실행했어요", "이전 단계를 처음부터 읽습니다."],
    "command-pause": ["“멈춰”를 실행했어요", "읽던 단어가 끝난 위치에서 멈췄습니다."],
    "command-resume": ["“계속”을 실행했어요", "멈춘 위치부터 이어서 읽습니다."],
    "command-replay": ["“다시 들려줘”를 실행했어요", "현재 단계를 처음부터 읽습니다."],
    "command-ingredients": ["“재료 알려줘”를 실행했어요", "단계는 바꾸지 않고 재료만 읽습니다."],
    "command-exit": ["핸즈프리를 종료했어요", "마이크만 꺼졌어요. 버튼과 현재 오디오는 유지됩니다."]
  };
  const isCommand = Boolean(commandCopy[state]);
  const playing = playerPlayback === "playing" && !ttsError && !["step-complete", "last-step", "ingredients", "interrupted", "background-ended", "command-pause"].includes(state);
  const notice = ttsError
    ? ["음성 재생을 준비하지 못했어요", "레시피 내용과 단계 이동·가이드 종료는 사용할 수 있어요. 다시 시도하거나 화면을 보며 계속하세요.", "error"]
    : state === "ready"
    ? ["재생 준비가 되었어요", "자동으로 재생하지 않아요. 재생 또는 핸즈프리 시작을 선택하세요.", "info"]
    : state === "step-complete"
      ? ["현재 단계를 모두 들었어요", "자동으로 다음 단계로 넘어가지 않습니다.", "success"]
      : state === "last-step"
        ? ["마지막 단계예요", "이 화면에 머물러요. 필요하면 다시 듣거나 가이드를 종료하세요.", "info"]
        : state === "ingredients" || state === "command-ingredients"
          ? ["재료를 읽고 있어요", `${escapeHTML(playerIngredients() || "저장된 재료가 없습니다.")}. 현재 단계는 바뀌지 않으며 낭독 후 일시정지합니다.`, "info"]
          : state === "interrupted"
            ? ["다른 오디오로 일시정지했어요", "전화·Siri·다른 오디오 또는 Bluetooth 연결이 끝나도 자동 재생하지 않습니다.", "warning"]
            : state === "background-ended"
              ? ["핸즈프리가 종료됐어요", "앱을 백그라운드로 보내거나 기기를 직접 잠갔습니다. 돌아와도 자동으로 켜지지 않아요.", "warning"]
              : state === "command-uncertain"
                ? ["명령을 이해하지 못했어요", "아무 행동도 실행하지 않았고 재생 위치는 그대로입니다. 아래 버튼으로 바로 이어가세요.", "error"]
                : isCommand
                  ? [...commandCopy[state], "success"]
                  : null;
  const denied = state === "permission-denied";
  const intro = state === "handsfree-intro";
  const listening = state === "listening";
  const active = handsfreeActive && !["command-exit", "interrupted", "background-ended", "permission-denied"].includes(state);
  return `<section class="screen player-screen">
    ${header({ back: "detail", title: "오디오 가이드", action: `<button class="text-action guide-exit" data-action="end-guide">종료</button>` })}
    <div class="player-progress" aria-label="${playerStep + 1} / ${steps.length} 단계"><span style="width:${((playerStep + 1) / steps.length) * 100}%"></span></div>
    <div class="player-stage player-stage-compact">
      <span class="step-chip">STEP ${playerStep + 1} / ${steps.length}</span>
      <h2>${playerStep === lastIndex ? "마지막 단계" : "현재 단계"}</h2>
      <p>${escapeHTML(steps[playerStep])}</p>
      <div class="wave ${playing ? "playing" : ""}" aria-hidden="true">${"<i></i>".repeat(15)}</div>
      <p class="player-feedback" aria-live="polite">${playerFeedback || (playing ? "현재 단계를 재생하고 있어요." : "재생 준비가 되었어요.")}</p>
    </div>
    ${notice ? `<div class="toast is-${notice[2]}" role="${notice[2] === "error" ? "alert" : "status"}"><strong aria-hidden="true">${notice[2] === "error" ? "!" : notice[2] === "warning" ? "Ⅱ" : "✓"}</strong><p><strong>${notice[0]}</strong><br>${notice[1]}</p>${state === "interrupted" || state === "background-ended" ? `<button class="toast-action" data-action="resume-manually">수동 재개</button>` : ""}</div>` : ""}
    ${intro ? `<div class="alert-card"><div class="alert-heading"><span class="alert-icon">${icons.mic}</span><div><h3>${handsfreeIntroSeen ? "권한을 허용해주세요" : "손을 쓰지 않고 조리해요"}</h3><p>말로 다음·이전·멈춤을 조작하려면 마이크와 음성인식 권한이 필요합니다. Audio Guide 밖에서는 듣지 않아요.</p></div></div><div class="alert-actions"><button class="button button-secondary" data-action="cancel-handsfree-intro">나중에</button><button class="button button-primary" data-action="allow-handsfree">권한 계속</button></div></div>` : ""}
    ${denied ? `<div class="alert-card is-error"><div class="alert-heading"><span class="alert-icon">!</span><div><h3>핸즈프리 권한이 꺼져 있어요</h3><p>시스템 권한창을 반복하지 않습니다. 설정에서 마이크·음성인식을 허용하거나 버튼으로 계속하세요.</p></div></div><div class="alert-actions"><button class="button button-secondary" data-action="dismiss-handsfree-error">버튼으로 계속</button><button class="button button-primary" data-action="open-handsfree-settings">설정으로 이동</button></div></div>` : ""}
    ${!intro && !denied ? `<div class="handsfree-card ${active ? listening ? "is-listening" : "" : "is-inactive"} ${["interrupted", "background-ended"].includes(state) ? "is-interrupted" : ""} ${state === "command-uncertain" ? "is-failed" : ""}">
      <div class="handsfree-status"><span class="handsfree-orb" aria-hidden="true">${active ? listening ? "◉" : "✓" : "○"}</span><div class="handsfree-copy"><strong>${active ? listening ? "명령을 듣고 있어요" : "핸즈프리 켜짐" : "핸즈프리 꺼짐"}</strong><p>${active ? "다음 · 이전 · 멈춰 · 계속 · 다시 들려줘 · 재료 알려줘 · 핸즈프리 종료" : "사용자가 시작하기 전에는 마이크를 사용하지 않습니다."}</p></div></div>
      <button class="button ${active ? "button-secondary" : "button-primary"}" data-action="${active ? "end-handsfree" : "start-handsfree"}">${active ? "핸즈프리 종료" : "핸즈프리 시작"}</button>
    </div>` : ""}
    <div class="player-secondary-actions">
      <button class="button button-secondary" data-action="read-ingredients" ${ttsError ? "disabled" : ""}>재료 듣기</button>
      <div class="speed-control" role="group" aria-label="읽기 속도">${["느리게", "보통", "빠르게"].map(speed => `<button data-speed="${speed}" aria-pressed="${playerSpeed === speed}">${speed}</button>`).join("")}</div>
    </div>
    ${ttsError ? `<button class="button button-primary" data-action="retry-player-audio">음성 다시 시도</button>` : ""}
    <div class="player-controls">
      <button class="player-control" data-player="prev" aria-label="이전 단계" ${playerStep === 0 ? "disabled" : ""}>‹</button>
      <button class="player-control" data-player="replay" aria-label="현재 단계 다시 듣기" ${ttsError ? "disabled" : ""}>↺</button>
      <button class="player-control main" data-action="toggle-playback" aria-label="${playing ? "일시정지" : "재생"}" ${ttsError ? "disabled" : ""}>${playing ? "Ⅱ" : "▶"}</button>
      <button class="player-control" data-player="next" aria-label="다음 단계">›</button>
    </div>
    <div class="control-labels" aria-hidden="true"><span>이전</span><span>다시</span><span>${playing ? "정지" : "재생"}</span><span>다음</span></div>
    <p class="wake-lock-note">화면을 보고 조리하는 동안 자동 잠금을 방지합니다. 직접 잠그면 핸즈프리는 종료돼요.</p>
  </section>`;
}

function renderStateList() {
  const contextualLabels = {
    review: { processing: "AI 정리 중", editable: "검토·수정", saving: "최종 저장 중" },
    detail: { content: "레시피 상세", "menu-open": "완료 레시피 메뉴", "delete-confirm": "완료 레시피 삭제 확인" },
    player: { "permission-denied": "핸즈프리 권한 거부", error: "로컬 TTS 오류", loading: "로컬 TTS 준비" },
    info: { overview: "앱 정보 홈" }
  };
  stateList.innerHTML = screenStates[screen].map(item =>
    `<button class="state-button" data-state="${item}" aria-pressed="${state === item}">${contextualLabels[screen]?.[item] || stateLabels[item]}</button>`
  ).join("");
}

function applyFocusIntent() {
  let intent = focusIntent;
  focusIntent = null;
  if (!intent && deleteDialogOpen) intent = { type: "dialog-cancel" };
  if (!intent && completedDeleteOpen) intent = { type: "completed-dialog-cancel" };
  if (!intent && screen === "review" && state === "unsaved-exit") intent = { type: "unsaved-dialog-cancel" };
  if (!intent && recordMenuId) intent = { type: "menu-item", id: recordMenuId };
  if (!intent) return;

  const selectors = {
    "dialog-cancel": "[data-dialog-initial-focus]",
    "menu-item": `[data-action="request-delete-record"][data-id="${intent.id || ""}"]`,
    "menu-trigger": `[data-action="open-record-menu"][data-id="${intent.id || ""}"]`,
    "start-new-log": "[data-action=\"start-new-log\"]",
    "library-search": "#recipe-search",
    "undo-step": "[data-undo-step]",
    "step-delete": `[data-action="delete-step"][data-index="${intent.index ?? ""}"]`,
    "record-action": "[data-action=\"start-recording\"]",
    "recording-status": "[data-recording-focus]",
    "log-state": "[data-log-state-focus]",
    "review-title": "#title",
    "review-step": `#review-step-${intent.index ?? ""}`,
    "review-step-undo": "[data-action=\"undo-review-step\"]",
    "review-back": "[data-action=\"request-review-exit\"]",
    "unsaved-dialog-cancel": "[data-unsaved-dialog-focus]",
    "completed-dialog-cancel": "[data-completed-dialog-focus]",
    "detail-menu-trigger": "[data-action=\"toggle-detail-menu\"]",
    "detail-menu-item": "[data-action=\"edit-completed-recipe\"]",
    "player-playback": "[data-action=\"toggle-playback\"]",
    "player-ingredients": "[data-action=\"read-ingredients\"]",
    "player-prev": "[data-player=\"prev\"]",
    "player-next": "[data-player=\"next\"]",
    "player-replay": "[data-player=\"replay\"]",
    "player-speed": `[data-speed="${intent.speed || ""}"]`,
    "handsfree-toggle": "[data-action=\"start-handsfree\"], [data-action=\"end-handsfree\"]",
    "handsfree-intro-action": "[data-action=\"cancel-handsfree-intro\"]",
    "handsfree-denied-action": "[data-action=\"dismiss-handsfree-error\"]",
    "player-resume": "[data-action=\"toggle-playback\"]",
    "player-retry": "[data-action=\"retry-player-audio\"]",
    "diagnostic-choice": "[data-action=\"toggle-diagnostics\"]",
    "info-screen-start": "[data-info-screen-focus]",
    "contact-confirm": "[data-nav=\"info\"][data-state=\"overview\"]",
    "legal-result": "[data-nav=\"info\"][data-state=\"overview\"]",
    "network-retry": "[data-action=\"retry-network-check\"]"
  };
  const target = document.querySelector(selectors[intent.type]);
  if (target) target.focus({ preventScroll: true });
}

function announce(message) {
  if (!announcer) return;
  announcer.textContent = "";
  window.requestAnimationFrame(() => { announcer.textContent = message; });
}

function scheduleRecordingCountdown() {
  transitionTimer = window.setTimeout(() => {
    if (screen !== "log" || state !== "recording") return;
    recordSecondsRemaining -= 1;
    if (recordSecondsRemaining <= 0) {
      state = "processing";
      recordSecondsRemaining = 10;
      focusIntent = { type: "log-state" };
      announce("녹음이 끝났습니다. 기기에서 STEP으로 변환합니다.");
      render();
      return;
    }
    const timer = document.querySelector("[data-recording-timer]");
    const timerGroup = document.querySelector("[data-recording-focus]");
    if (timer) timer.textContent = String(recordSecondsRemaining).padStart(2, "0");
    if (timerGroup) timerGroup.setAttribute("aria-label", `${recordSecondsRemaining}초 남음`);
    scheduleRecordingCountdown();
  }, 1000);
}

function cancelDeleteRecord() {
  deleteDialogOpen = false;
  pendingDeleteId = "";
  if (screen === "home") state = "content";
  focusIntent = lastMenuTriggerId
    ? { type: "menu-trigger", id: lastMenuTriggerId }
    : { type: "start-new-log" };
  render();
}

function render() {
  window.clearTimeout(transitionTimer);
  window.clearTimeout(undoTimer);
  const renderers = { home: renderHome, library: renderLibrary, log: renderLog, review: renderReview, detail: renderDetail, player: renderPlayer, info: renderInfo };
  app.innerHTML = renderers[screen]();
  screenSelect.value = screen;
  renderStateList();
  applyFocusIntent();
  if (!isEmbedded && screen === "log" && state === "recording") {
    scheduleRecordingCountdown();
  } else if (!isEmbedded && screen === "log" && ["processing", "retrying"].includes(state)) {
    transitionTimer = window.setTimeout(advanceTranscription, 1600);
  } else if (!isEmbedded && screen === "review" && state === "processing") {
    transitionTimer = window.setTimeout(() => { state = "processing-long"; render(); }, 10000);
  } else if (screen === "review" && state === "saving") {
    transitionTimer = window.setTimeout(() => {
      finalSaveInFlight = false;
      completedRecipeCreated = true;
      reviewDirty = false;
      if (pendingRecipeSave) completedRecipe = cloneRecipeDraft(pendingRecipeSave);
      pendingRecipeSave = null;
      navigate("detail", "content");
    }, 1400);
  } else if (screen === "review" && state === "complete-saving") {
    transitionTimer = window.setTimeout(() => {
      finalSaveInFlight = false;
      reviewDirty = false;
      if (pendingRecipeSave) completedRecipe = cloneRecipeDraft(pendingRecipeSave);
      reviewDraft = cloneRecipeDraft(completedRecipe);
      completeEditSnapshot = cloneRecipeDraft(completedRecipe);
      pendingRecipeSave = null;
      navigate("detail", "content");
    }, 1400);
  } else if (!isEmbedded && screen === "info" && ["privacy-loading", "terms-loading"].includes(state)) {
    transitionTimer = window.setTimeout(() => {
      state = state.startsWith("privacy") ? "privacy-unconfigured" : "terms-unconfigured";
      focusIntent = { type: "legal-result" };
      render();
    }, 900);
  } else if (!isEmbedded && screen === "player" && playerPlayback === "playing" && playerPlaybackEndsAt > 0) {
    const remainingPlaybackMs = Math.max(playerPlaybackEndsAt - Date.now(), 0);
    transitionTimer = window.setTimeout(() => {
      pausePlayerPlayback();
      if (pendingPlayerSpeed) {
        playerSpeed = pendingPlayerSpeed;
        pendingPlayerSpeed = "";
      }
      state = playerStep === playerSteps().length - 1 ? "last-step" : "step-complete";
      playerFeedback = playerStep === playerSteps().length - 1 ? "마지막 단계를 모두 들었어요." : "다음 행동을 기다리고 있어요.";
      focusIntent = { type: "player-playback" };
      render();
    }, remainingPlaybackMs);
  }
  if (!isEmbedded && screen === "log" && state === "undo-delete" && deletedStep) scheduleUndoExpiration();
}

function navigate(nextScreen, nextState) {
  screen = nextScreen;
  state = nextState || screenStates[screen][0];
  if (screen === "info") focusIntent = { type: "info-screen-start" };
  if (screen === "review") reviewMode = state.startsWith("complete-") ? "complete" : "draft";
  completedDeleteOpen = screen === "detail" && state === "delete-confirm";
  recordMenuId = "";
  if (state !== "delete-confirm") deleteDialogOpen = false;
  if (screen === "library") {
    if (state === "search-title") searchQuery = "삼겹살";
    else if (state === "search-ingredient") searchQuery = "애호박";
    else if (state === "no-results") searchQuery = "크림 파스타";
    else searchQuery = "";
  }
  if (screen === "log") prepareLogState(state);
  if (screen === "player") preparePlayerState(state);
  else playerFeedback = "";
  render();
}

function prepareLogState(nextState) {
  logFeedback = "";
  if (nextState === "recording") recordSecondsRemaining = 10;
  if (nextState === "empty" || nextState === "intro" || nextState === "permission-denied") {
    recordedSteps = [];
    deletedStep = null;
  } else if (statesWithSteps.includes(nextState) && recordedSteps.length === 0) {
    recordedSteps = stepSamples.slice(0, 2);
  }
  if (nextState === "undo-delete") {
    deletedStep = { copy: recordedSteps[recordedSteps.length - 1] || stepSamples[1], index: Math.max(recordedSteps.length - 1, 0) };
    if (recordedSteps.length > 1) recordedSteps.splice(deletedStep.index, 1);
    undoExpiresAt = Date.now() + undoDurationMs;
  } else {
    deletedStep = null;
    undoExpiresAt = 0;
  }
}

function startRecording() {
  window.clearTimeout(undoTimer);
  deletedStep = null;
  undoExpiresAt = 0;
  state = "recording";
  recordSecondsRemaining = 10;
  logFeedback = "";
  focusIntent = { type: "recording-status" };
  announce("녹음을 시작했습니다. 10초 뒤 자동 종료됩니다.");
  render();
}

function completeTranscription() {
  if (screen !== "log" || !["processing", "retrying"].includes(state)) return;
  if (recordedSteps.length < stepSamples.length) recordedSteps.push(stepSamples[recordedSteps.length]);
  state = "steps";
  logFeedback = `STEP ${recordedSteps.length}을 추가했어요`;
  focusIntent = { type: "record-action" };
  announce(`STEP ${recordedSteps.length}을 추가했습니다.`);
  render();
}

function advanceTranscription() {
  if (screen !== "log") return;
  if (state === "processing" && sttPath !== "success") {
    state = "retrying";
    focusIntent = { type: "log-state" };
    render();
    return;
  }
  if (state === "retrying" && sttPath === "retry-failure") {
    state = "stt-error";
    logFeedback = "";
    focusIntent = { type: "record-action" };
    render();
    return;
  }
  completeTranscription();
}

function scheduleUndoExpiration() {
  const remaining = Math.max(undoExpiresAt - Date.now(), 0);
  undoTimer = window.setTimeout(expireStepUndo, remaining);
}

function expireStepUndo() {
  if (!deletedStep || state !== "undo-delete") return;
  const deletedIndex = deletedStep.index;
  const shouldRestoreFocus = document.activeElement?.matches("[data-undo-step]");
  deletedStep = null;
  undoExpiresAt = 0;
  state = "steps";
  logFeedback = "STEP 삭제가 확정됐어요";
  if (shouldRestoreFocus) {
    focusIntent = recordedSteps.length
      ? { type: "step-delete", index: Math.min(deletedIndex, recordedSteps.length - 1) }
      : { type: "record-action" };
  }
  render();
}

function deleteStep(index) {
  if (screen !== "log" || state === "ai-lock" || !recordedSteps[index]) return;
  deletedStep = { copy: recordedSteps[index], index };
  recordedSteps.splice(index, 1);
  state = "undo-delete";
  undoExpiresAt = Date.now() + undoDurationMs;
  logFeedback = "";
  focusIntent = { type: "undo-step" };
  render();
}

function undoStepDeletion() {
  if (!deletedStep) return;
  const restoredIndex = deletedStep.index;
  window.clearTimeout(undoTimer);
  recordedSteps.splice(deletedStep.index, 0, deletedStep.copy);
  deletedStep = null;
  undoExpiresAt = 0;
  state = "steps";
  logFeedback = "삭제한 STEP을 되돌렸어요";
  focusIntent = { type: "step-delete", index: restoredIndex };
  render();
}

function reviewIsValid() {
  return reviewDraft.title.trim()
    && reviewDraft.steps.some(step => step.trim())
    && !reviewDraft.ingredients.some(item => !item.name.trim() && item.amount.trim());
}

function normalizedRecipeDraft(value) {
  const normalized = cloneRecipeDraft(value);
  normalized.title = normalized.title.trim();
  normalized.ingredients = normalized.ingredients
    .map(item => ({ name: item.name.trim(), amount: item.amount.trim() }))
    .filter(item => item.name || item.amount);
  normalized.steps = normalized.steps.map(step => step.trim()).filter(Boolean);
  normalized.time = normalized.time.trim();
  normalized.memo = normalized.memo.trim();
  return normalized;
}

function startSaving(mode = reviewMode) {
  if (finalSaveInFlight || completedRecipeCreated && mode === "draft") return;
  if (!reviewIsValid()) {
    state = "validation-error";
    render();
    return;
  }
  finalSaveInFlight = true;
  removedReviewStep = null;
  reviewDraft = normalizedRecipeDraft(reviewDraft);
  pendingRecipeSave = cloneRecipeDraft(reviewDraft);
  state = mode === "complete" ? "complete-saving" : "saving";
  render();
}

document.addEventListener("click", event => {
  const target = event.target.closest("button");
  if (!target) return;
  if (target.dataset.action === "complete-transcription") completeTranscription();
  else if (target.dataset.action === "retry-network-check") {
    state = "content";
    homeFeedback = "연결 상태를 다시 확인했어요. 실패했던 온라인 행동은 자동 실행하지 않습니다.";
    focusIntent = { type: "start-new-log" };
    render();
  } else if (target.dataset.action === "toggle-diagnostics") {
    diagnosticsIncluded = !diagnosticsIncluded;
    focusIntent = { type: "diagnostic-choice" };
    render();
  } else if (target.dataset.action === "prepare-contact") {
    state = "contact-ready";
    focusIntent = { type: "info-screen-start" };
    render();
  }
  else if (target.dataset.action === "save-recipe") startSaving("draft");
  else if (target.dataset.action === "save-completed-edit") startSaving("complete");
  else if (target.dataset.action === "save-review-draft") {
    reviewSavedSnapshot = cloneRecipeDraft(reviewDraft);
    reviewDirty = false;
    removedReviewStep = null;
    state = "draft-saved";
    render();
  } else if (target.dataset.action === "dismiss-review-feedback") {
    state = reviewMode === "complete" ? "complete-edit" : "editable";
    render();
  } else if (target.dataset.action === "request-review-exit") {
    if (reviewDirty && !finalSaveInFlight) {
      state = "unsaved-exit";
      focusIntent = { type: "unsaved-dialog-cancel" };
      render();
    } else {
      navigate(reviewMode === "complete" ? "detail" : "log", reviewMode === "complete" ? "content" : "steps");
    }
  } else if (target.dataset.action === "save-draft-leave") {
    if (reviewMode === "complete") return;
    reviewSavedSnapshot = cloneRecipeDraft(reviewDraft);
    reviewDirty = false;
    navigate("log", "steps");
  } else if (target.dataset.action === "discard-review-leave") {
    reviewDraft = cloneRecipeDraft(reviewMode === "complete" ? completeEditSnapshot : reviewSavedSnapshot);
    reviewDirty = false;
    navigate(reviewMode === "complete" ? "detail" : "log", reviewMode === "complete" ? "content" : "steps");
  } else if (target.dataset.action === "continue-review-editing") {
    state = reviewMode === "complete" ? "complete-edit" : "editable";
    focusIntent = { type: "review-title" };
    render();
  } else if (target.dataset.action === "open-ready-review") {
    reviewMode = "draft";
    reviewDirty = false;
    state = "editable";
    render();
  } else if (target.dataset.action === "retry-ai-generation") {
    state = "processing";
    render();
  } else if (target.dataset.action === "back-to-log") {
    navigate("log", "steps");
  } else if (target.dataset.action === "add-review-step") {
    reviewDraft.steps.push("");
    reviewDirty = true;
    focusIntent = { type: "review-step", index: reviewDraft.steps.length - 1 };
    render();
  } else if (target.dataset.action === "remove-review-step") {
    const index = Number(target.dataset.index);
    if (!reviewDraft.steps[index] && reviewDraft.steps[index] !== "") return;
    removedReviewStep = { value: reviewDraft.steps[index], index };
    reviewDraft.steps.splice(index, 1);
    reviewDirty = true;
    focusIntent = { type: "review-step-undo" };
    render();
  } else if (target.dataset.action === "undo-review-step" && removedReviewStep) {
    reviewDraft.steps.splice(removedReviewStep.index, 0, removedReviewStep.value);
    focusIntent = { type: "review-step", index: removedReviewStep.index };
    removedReviewStep = null;
    reviewDirty = true;
    render();
  } else if (target.dataset.action === "move-review-step") {
    const index = Number(target.dataset.index);
    const nextIndex = index + Number(target.dataset.direction);
    if (nextIndex < 0 || nextIndex >= reviewDraft.steps.length) return;
    [reviewDraft.steps[index], reviewDraft.steps[nextIndex]] = [reviewDraft.steps[nextIndex], reviewDraft.steps[index]];
    reviewDirty = true;
    focusIntent = { type: "review-step", index: nextIndex };
    render();
  } else if (target.dataset.action === "toggle-detail-menu") {
    state = state === "menu-open" ? "content" : "menu-open";
    focusIntent = state === "menu-open" ? { type: "detail-menu-item" } : { type: "detail-menu-trigger" };
    render();
  } else if (target.dataset.action === "edit-completed-recipe") {
    reviewMode = "complete";
    reviewDirty = false;
    completeEditSnapshot = cloneRecipeDraft(completedRecipe);
    reviewDraft = cloneRecipeDraft(completedRecipe);
    navigate("review", "complete-edit");
  } else if (target.dataset.action === "request-delete-completed") {
    state = "delete-confirm";
    completedDeleteOpen = true;
    focusIntent = { type: "completed-dialog-cancel" };
    render();
  } else if (target.dataset.action === "cancel-delete-completed") {
    state = "content";
    completedDeleteOpen = false;
    focusIntent = { type: "detail-menu-trigger" };
    render();
  } else if (target.dataset.action === "confirm-delete-completed") {
    completedDeleteOpen = false;
    state = "deleted";
    render();
  } else if (target.dataset.action === "end-guide") {
    handsfreeActive = false;
    pausePlayerPlayback();
    navigate("detail", "content");
  } else if (target.dataset.action === "toggle-playback") {
    if (playerPlayback === "playing") pausePlayerPlayback();
    else startPlayerPlayback({ restart: false });
    state = playerPlayback;
    playerFeedback = playerPlayback === "playing" ? "멈춘 위치부터 이어서 읽어요." : "읽던 단어가 끝난 위치에서 멈췄어요.";
    focusIntent = { type: "player-playback" };
    render();
  } else if (target.dataset.action === "read-ingredients") {
    pausePlayerPlayback();
    state = "ingredients";
    playerFeedback = "재료 낭독 후 현재 단계에서 일시정지합니다.";
    focusIntent = { type: "player-ingredients" };
    render();
  } else if (target.dataset.action === "start-handsfree") {
    if (handsfreePermission !== "granted") {
      state = "handsfree-intro";
    } else {
      handsfreeActive = true;
      state = "handsfree-active";
      playerFeedback = "핸즈프리를 시작했어요.";
    }
    focusIntent = state === "handsfree-intro" ? { type: "handsfree-intro-action" } : { type: "handsfree-toggle" };
    render();
  } else if (target.dataset.action === "allow-handsfree") {
    handsfreeIntroSeen = true;
    handsfreePermission = "granted";
    handsfreeActive = true;
    state = "handsfree-active";
    playerFeedback = "7개 명령을 사용할 수 있어요.";
    focusIntent = { type: "handsfree-toggle" };
    render();
  } else if (target.dataset.action === "cancel-handsfree-intro") {
    handsfreeIntroSeen = true;
    handsfreeActive = false;
    state = "paused";
    playerFeedback = "버튼으로 가이드를 계속할 수 있어요.";
    focusIntent = { type: "handsfree-toggle" };
    render();
  } else if (target.dataset.action === "end-handsfree") {
    handsfreeActive = false;
    state = "command-exit";
    playerFeedback = "마이크만 껐어요. 현재 오디오는 그대로 유지됩니다.";
    focusIntent = { type: "handsfree-toggle" };
    render();
  } else if (target.dataset.action === "dismiss-handsfree-error") {
    handsfreeActive = false;
    state = "paused";
    playerFeedback = "버튼 기반 Audio Guide를 계속 사용합니다.";
    focusIntent = { type: "handsfree-toggle" };
    render();
  } else if (target.dataset.action === "open-handsfree-settings") {
    playerFeedback = "설정에서 마이크와 음성인식 권한을 허용해주세요.";
    focusIntent = { type: "handsfree-denied-action" };
    render();
  } else if (target.dataset.action === "resume-manually") {
    handsfreeActive = false;
    startPlayerPlayback({ restart: false });
    state = "playing";
    playerFeedback = "현재 위치부터 수동으로 재개했어요.";
    focusIntent = { type: "player-resume" };
    render();
  } else if (target.dataset.action === "retry-player-audio") {
    pausePlayerPlayback();
    state = "ready";
    playerFeedback = "음성을 다시 준비했어요. 재생을 선택하면 시작합니다.";
    focusIntent = { type: "player-playback" };
    render();
  } else if (target.dataset.action === "start-recording") startRecording();
  else if (target.dataset.action === "continue-mic-permission") {
    state = "empty";
    render();
  } else if (target.dataset.action === "open-settings") {
    logFeedback = "설정 앱에서 마이크 권한을 허용해주세요";
    render();
  } else if (target.dataset.action === "delete-step") {
    deleteStep(Number(target.dataset.index));
  } else if (target.dataset.action === "undo-step") {
    undoStepDeletion();
  } else if (target.dataset.action === "start-ai-organizing") {
    state = "ai-lock";
    render();
  } else if (target.dataset.action === "show-ai-offline") {
    state = "ai-offline";
    render();
  } else if (target.dataset.action === "retry-ai-online") {
    state = "steps";
    logFeedback = "연결 상태를 다시 확인했어요";
    render();
  } else if (target.dataset.action === "start-new-log") {
    homeFeedback = "새 진행 기록을 시작했습니다. 기존 기록은 그대로 보존돼요.";
    navigate("log", "intro");
  } else if (target.dataset.action === "open-record-menu") {
    recordMenuId = recordMenuId === target.dataset.id ? "" : target.dataset.id;
    lastMenuTriggerId = target.dataset.id;
    deleteDialogOpen = false;
    if (screen === "home") state = recordMenuId ? "menu-open" : "content";
    focusIntent = recordMenuId
      ? { type: "menu-item", id: recordMenuId }
      : { type: "menu-trigger", id: lastMenuTriggerId };
    render();
  } else if (target.dataset.action === "request-delete-record") {
    pendingDeleteId = target.dataset.id;
    lastMenuTriggerId = target.dataset.id;
    recordMenuId = "";
    deleteDialogOpen = true;
    if (screen === "home") state = "delete-confirm";
    focusIntent = { type: "dialog-cancel" };
    render();
  } else if (target.dataset.action === "cancel-delete-record") {
    cancelDeleteRecord();
  } else if (target.dataset.action === "confirm-delete-record") {
    if (pendingDeleteId) deletedRecipeIds.add(pendingDeleteId);
    deleteDialogOpen = false;
    pendingDeleteId = "";
    homeFeedback = "진행 기록을 영구 삭제했어요.";
    if (screen === "home") state = "content";
    focusIntent = { type: screen === "home" ? "start-new-log" : "library-search" };
    render();
  } else if (target.dataset.action === "clear-search") {
    searchQuery = "";
    state = "all";
    render();
  } else if (target.dataset.action === "add-ingredient") {
    reviewDraft.ingredients.push({ name: "새 재료", amount: "적당량" });
    reviewDirty = true;
    render();
  } else if (target.dataset.action === "remove-ingredient") {
    reviewDraft.ingredients.splice(Number(target.dataset.index), 1);
    reviewDirty = true;
    render();
  } else if (target.dataset.nav) navigate(target.dataset.nav, target.dataset.state);
  else if (target.dataset.state) {
    state = target.dataset.state;
    if (screen === "info") focusIntent = { type: "info-screen-start" };
    if (screen === "review") reviewMode = state.startsWith("complete-") ? "complete" : "draft";
    if (screen === "detail") completedDeleteOpen = state === "delete-confirm";
    if (screen === "home") {
      recordMenuId = state === "menu-open" ? "draft-step" : "";
      pendingDeleteId = state === "delete-confirm" ? "draft-step" : "";
      deleteDialogOpen = state === "delete-confirm";
    }
    if (screen === "library") {
      if (state === "search-title") searchQuery = "삼겹살";
      else if (state === "search-ingredient") searchQuery = "애호박";
      else if (state === "no-results") searchQuery = "크림 파스타";
      else searchQuery = "";
    }
    if (screen === "log") prepareLogState(state);
    if (screen === "player") preparePlayerState(state);
    render();
  } else if (target.dataset.player === "next") {
    if (playerStep >= playerSteps().length - 1) {
      pausePlayerPlayback();
      state = "last-step";
      playerFeedback = "마지막 단계예요. 다음 단계는 없습니다.";
    } else {
      playerStep += 1;
      startPlayerPlayback();
      state = "playing";
      playerFeedback = `STEP ${playerStep + 1}을 처음부터 읽습니다.`;
    }
    focusIntent = { type: "player-next" };
    render();
  } else if (target.dataset.player === "prev" && playerStep > 0) {
    playerStep -= 1;
    startPlayerPlayback();
    state = "playing";
    playerFeedback = `STEP ${playerStep + 1}을 처음부터 읽습니다.`;
    focusIntent = { type: "player-prev" };
    render();
  } else if (target.dataset.player === "replay") {
    startPlayerPlayback();
    state = "playing";
    playerFeedback = `STEP ${playerStep + 1}을 처음부터 다시 재생합니다.`;
    focusIntent = { type: "player-replay" };
    render();
  } else if (target.dataset.speed) {
    if (playerPlayback === "playing") {
      pendingPlayerSpeed = target.dataset.speed;
      playerFeedback = `${target.dataset.speed} 속도는 현재 문장이 끝난 뒤 적용됩니다.`;
    } else {
      playerSpeed = target.dataset.speed;
      playerFeedback = `읽기 속도를 ${playerSpeed}로 저장했어요. 다음 가이드에도 유지됩니다.`;
    }
    focusIntent = { type: "player-speed", speed: target.dataset.speed };
    render();
  }
});

document.addEventListener("input", event => {
  const target = event.target;
  if (target.id === "recipe-search") {
    searchQuery = target.value;
    const results = libraryResults(searchQuery);
    state = librarySearchState(searchQuery, results);
    render();
    const searchInput = document.querySelector("#recipe-search");
    if (searchInput) {
      searchInput.focus();
      searchInput.setSelectionRange(searchInput.value.length, searchInput.value.length);
    }
    return;
  }
  const field = target.dataset.draftField;
  if (!field) return;
  reviewDirty = true;
  if (field === "ingredient-name" || field === "ingredient-amount") {
    const ingredient = reviewDraft.ingredients[Number(target.dataset.draftIndex)];
    if (!ingredient) return;
    ingredient[field === "ingredient-name" ? "name" : "amount"] = target.value;
    return;
  }
  if (field === "step") {
    reviewDraft.steps[Number(target.dataset.draftIndex)] = target.value;
    return;
  }
  reviewDraft[field] = target.value;
});

let stepSwipe = null;
let draggedReviewStep = null;
document.addEventListener("dragstart", event => {
  const card = event.target.closest("[data-review-step-card]");
  if (!card) return;
  draggedReviewStep = Number(card.dataset.index);
  event.dataTransfer.effectAllowed = "move";
});
document.addEventListener("dragover", event => {
  if (draggedReviewStep === null || !event.target.closest("[data-review-step-card]")) return;
  event.preventDefault();
});
document.addEventListener("drop", event => {
  const card = event.target.closest("[data-review-step-card]");
  if (!card || draggedReviewStep === null) return;
  event.preventDefault();
  const destination = Number(card.dataset.index);
  const [moved] = reviewDraft.steps.splice(draggedReviewStep, 1);
  reviewDraft.steps.splice(destination, 0, moved);
  draggedReviewStep = null;
  reviewDirty = true;
  focusIntent = { type: "review-step", index: destination };
  render();
});
document.addEventListener("dragend", () => { draggedReviewStep = null; });

document.addEventListener("pointerdown", event => {
  const row = event.target.closest(".step-row[data-step-index]");
  if (!row || event.target.closest("button") || state === "ai-lock") return;
  stepSwipe = { index: Number(row.dataset.stepIndex), x: event.clientX };
});

document.addEventListener("pointerup", event => {
  if (!stepSwipe) return;
  const distance = event.clientX - stepSwipe.x;
  const index = stepSwipe.index;
  stepSwipe = null;
  if (distance <= -56) deleteStep(index);
});

document.addEventListener("keydown", event => {
  const unsavedDialogOpen = screen === "review" && state === "unsaved-exit";
  if (deleteDialogOpen || completedDeleteOpen || unsavedDialogOpen) {
    const dialog = document.querySelector('[role="alertdialog"]');
    if (!dialog) return;
    if (event.key === "Escape") {
      event.preventDefault();
      if (unsavedDialogOpen) {
        state = reviewMode === "complete" ? "complete-edit" : "editable";
        focusIntent = { type: "review-back" };
        render();
      } else if (completedDeleteOpen) {
        completedDeleteOpen = false;
        state = "content";
        focusIntent = { type: "detail-menu-trigger" };
        render();
      } else {
        cancelDeleteRecord();
      }
      return;
    }
    if (event.key !== "Tab") return;
    const focusable = [...dialog.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])')];
    if (focusable.length === 0) {
      event.preventDefault();
      dialog.focus();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!dialog.contains(document.activeElement)) {
      event.preventDefault();
      first.focus();
    } else if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
    return;
  }

  if (recordMenuId && event.key === "Escape") {
    event.preventDefault();
    const triggerId = recordMenuId;
    recordMenuId = "";
    if (screen === "home") state = "content";
    focusIntent = { type: "menu-trigger", id: triggerId };
    render();
    return;
  }

  if (screen === "detail" && state === "menu-open" && event.key === "Escape") {
    event.preventDefault();
    state = "content";
    focusIntent = { type: "detail-menu-trigger" };
    render();
  }
});

document.addEventListener("focusin", event => {
  const unsavedDialogOpen = screen === "review" && state === "unsaved-exit";
  if (!deleteDialogOpen && !completedDeleteOpen && !unsavedDialogOpen) return;
  const dialog = document.querySelector('[role="alertdialog"]');
  if (!dialog || dialog.contains(event.target)) return;
  document.querySelector("[data-dialog-initial-focus], [data-completed-dialog-focus], [data-unsaved-dialog-focus]")?.focus({ preventScroll: true });
});

screenSelect.addEventListener("change", event => navigate(event.target.value));
viewportSelect.addEventListener("change", event => {
  document.body.dataset.viewport = event.target.value;
  viewportLabel.textContent = event.target.value === "small" ? "375 × 667" : "390 × 844";
});
themeToggle.addEventListener("click", () => {
  dark = !dark;
  document.body.dataset.theme = dark ? "dark" : "light";
  themeToggle.setAttribute("aria-pressed", String(dark));
  themeLabel.textContent = dark ? "Light" : "Dark";
});

render();
