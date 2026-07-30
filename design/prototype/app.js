const icons = {
  chevronLeft: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>`,
  book: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/></svg>`,
  mic: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0M12 17v5M8 22h8"/></svg>`,
  sparkles: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3-1.2 3.8L7 8l3.8 1.2L12 13l1.2-3.8L17 8l-3.8-1.2L12 3Z"/><path d="m5 14-.8 2.2L2 17l2.2.8L5 20l.8-2.2L8 17l-2.2-.8L5 14ZM19 13l-.8 2.2-2.2.8 2.2.8L19 19l.8-2.2 2.2-.8-2.2-.8L19 13Z"/></svg>`,
  play: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 5 11 7-11 7V5Z"/></svg>`,
  search: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>`,
  close: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>`,
  more: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></svg>`
};

const screenStates = {
  home: ["content", "multiple", "menu-open", "delete-confirm", "empty", "loading", "error"],
  library: ["all", "search-title", "search-ingredient", "no-results", "empty"],
  log: ["intro", "permission-denied", "empty", "recording", "processing", "retrying", "steps", "undo-delete", "offline", "record-error", "stt-unsupported", "stt-error", "ai-lock", "ai-offline"],
  review: ["processing", "editable", "error", "saving", "save-error"],
  detail: ["content", "loading", "error", "not-found"],
  player: ["paused", "playing", "loading", "error", "no-steps"]
};

const stateLabels = {
  content: "최근 3개", multiple: "여러 진행 기록", "menu-open": "진행 기록 메뉴", "delete-confirm": "영구 삭제 확인",
  all: "전체 · 최근 활동순", "search-title": "검색 · 제목 우선", "search-ingredient": "검색 · 재료 일치", "no-results": "검색 결과 없음",
  empty: "빈 상태", loading: "로딩", error: "오류",
  intro: "첫 기록 안내", "permission-denied": "마이크 권한 거부", recording: "10초 녹음", processing: "기기 내 변환", retrying: "자동 재처리", steps: "STEP 누적", "undo-delete": "삭제·되돌리기", offline: "오프라인 기록",
  "record-error": "녹음 오류", "stt-unsupported": "기기 내 STT 미지원", "stt-error": "STT 최종 실패", "ai-lock": "AI snapshot 잠금", "ai-offline": "오프라인 AI 안내",
  editable: "검토·수정", saving: "저장 중", "save-error": "저장 오류", "not-found": "찾을 수 없음",
  paused: "일시정지", playing: "재생 중", "no-steps": "단계 없음"
};

const params = new URLSearchParams(window.location.search);
const isEmbedded = params.get("embed") === "1";
const sttPath = ["success", "retry-success", "retry-failure"].includes(params.get("stt-path")) ? params.get("stt-path") : "success";
if (isEmbedded) document.body.classList.add("embed");
let screen = screenStates[params.get("screen")] ? params.get("screen") : "home";
let state = screenStates[screen].includes(params.get("state")) ? params.get("state") : screenStates[screen][0];
let dark = params.get("theme") === "dark";
let playerStep = 1;
let playerFeedback = "";
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
  steps: "1. 삼겹살을 노릇하게 볶아요.\n2. 양파와 간장을 넣고 더 볶아요.",
  time: "25분",
  memo: "양파가 살짝 투명해질 때 불을 줄이면 좋아요."
};
let transitionTimer = null;
let searchQuery = "";
let recordMenuId = "";
let pendingDeleteId = "";
let deleteDialogOpen = false;
let homeFeedback = "";
let lastMenuTriggerId = "";
let focusIntent = null;
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
    status: "검토 필요",
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

function header({ back, title = "CookLog", action = "" } = {}) {
  return `<header class="app-header">
    ${back ? `<button class="icon-button back-button" data-nav="${back}" aria-label="뒤로">${icons.chevronLeft}</button>` : `<span class="wordmark">${title}</span>`}
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
  return `<div class="card progress-card">
    <div>${icon}<h3>${title}</h3><p>${copy}</p>
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
    ${header({ action: `<button class="icon-button" data-nav="library" data-state="all" aria-label="전체 요리 기록">${icons.book}</button>` })}
    <div class="hero">
      <p class="eyebrow">나의 주방 기록</p>
      <h2>오늘의 맛을<br>잊지 않도록</h2>
      <p>요리하면서 10초씩 말해보세요.<br>다시 만들 수 있는 레시피로 남겨드려요.</p>
    </div>
    <button class="button button-primary" data-action="start-new-log">
      ${icons.mic}<span>10초 요리 기록 시작</span>
    </button>
    <p class="preservation-note">새 기록을 시작해도 기존 진행 기록은 그대로 보존됩니다.</p>
    ${homeFeedback ? `<div class="compact-feedback" role="status">${escapeHTML(homeFeedback)}</div>` : ""}
    <div class="section-head"><div><h3>${state === "empty" ? "나의 요리 기록" : "최근 레시피"}</h3><span>최근 활동순 · 최대 3개</span></div><button class="text-action" data-nav="library" data-state="all">전체 보기</button></div>
    ${content}
    ${deleteDialog()}
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
    ? `<div class="step-row is-processing" aria-live="polite"><span class="step-number">${recordedSteps.length + 1}</span><div class="step-copy"><p class="processing-line">방금 말한 기록을 기기에서 변환하고 있어요.</p><span>완료되면 원문 STEP으로 자동 저장</span></div></div>`
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
      <h2 class="screen-title">${title}</h2>
      <p>${description}</p>
    </div>
    ${isOffline ? logBanner("success", "오프라인에서도 기록할 수 있어요", "지원되는 기기에서는 10초 기록과 STEP Preview 생성이 계속됩니다.") : ""}
    ${isAiOffline ? logBanner("warning", "AI 정리에는 인터넷 연결이 필요해요", "STEP Preview는 그대로 보존했습니다. 연결 후 다시 선택해주세요.") : ""}
    ${isRetrying ? logBanner("info", "자동 재처리 1/1", "이후에도 실패하면 새 STEP을 만들지 않고 임시 음성을 삭제합니다.") : ""}
    ${logFeedback ? logBanner("success", logFeedback, "텍스트 초안을 이 기기에 자동 저장했습니다.") : ""}
    ${showRecordOrb ? `<div class="record-orb ${isRecording ? "recording" : ""}">
      <div class="record-core">
        <span class="record-time" aria-live="polite">${isRecording ? String(recordSecondsRemaining).padStart(2, "0") : isProcessing || isRetrying ? "···" : "10"}</span>
        <span class="record-label">${isRecording ? "초 남음" : isProcessing ? "기기 내 변환 중" : isRetrying ? "자동 재처리 중" : "초 기록"}</span>
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

function reviewForm({ disabled = false } = {}) {
  const ingredientRows = reviewDraft.ingredients.map((ingredient, index) =>
    `<div class="ingredient-row">
      <input class="input" aria-label="재료 이름" data-draft-field="ingredient-name" data-draft-index="${index}" value="${escapeHTML(ingredient.name)}" ${disabled ? "disabled" : ""}>
      <input class="input" aria-label="재료 양" data-draft-field="ingredient-amount" data-draft-index="${index}" value="${escapeHTML(ingredient.amount)}" ${disabled ? "disabled" : ""}>
      <button class="remove-button" type="button" data-action="remove-ingredient" data-index="${index}" aria-label="${escapeHTML(ingredient.name)} 삭제" ${disabled ? "disabled" : ""}>×</button>
    </div>`
  ).join("");
  return `<form class="form" onsubmit="return false">
    <div class="field"><label for="title">제목</label><input class="input" id="title" data-draft-field="title" value="${escapeHTML(reviewDraft.title)}" ${disabled ? "disabled" : ""}></div>
    <div class="field">
      <span class="group-label">재료</span>
      ${ingredientRows}
      <button class="subtle-add" type="button" data-action="add-ingredient" ${disabled ? "disabled" : ""}>+ 재료 추가</button>
    </div>
    <div class="field"><label for="steps">조리 순서</label><textarea class="textarea" id="steps" data-draft-field="steps" ${disabled ? "disabled" : ""}>${escapeHTML(reviewDraft.steps)}</textarea></div>
    <div class="field"><label for="time">예상 시간</label><input class="input" id="time" data-draft-field="time" value="${escapeHTML(reviewDraft.time)}" ${disabled ? "disabled" : ""}></div>
    <div class="field"><label for="memo">메모</label><textarea class="textarea" id="memo" data-draft-field="memo" ${disabled ? "disabled" : ""}>${escapeHTML(reviewDraft.memo)}</textarea></div>
    <div class="sticky-action"><button class="button button-primary ${disabled ? "is-loading" : ""}" type="button" data-action="save-recipe" ${disabled ? "disabled" : ""}>${disabled ? `<span class="inline-loader" aria-hidden="true"></span><span>저장 중</span>` : "레시피 저장"}</button></div>
  </form>`;
}

function renderReview() {
  if (state === "processing") return `<section class="screen">${header({ back: "log", title: "AI 레시피 정리" })}${feedbackCard("loading", "레시피로 정리하는 중", "STEP Preview를 재료와 조리 순서로 바꾸고 있어요.")}<button class="button button-secondary" data-state="editable">결과 미리 보기</button></section>`;
  if (state === "error") return `<section class="screen">${header({ back: "log", title: "AI 레시피 정리" })}${feedbackCard("error", "정리하지 못했어요", "기록은 그대로 보관되어 있어요. 다시 시도할 수 있습니다.", "processing")}</section>`;
  const saving = state === "saving";
  const saveError = state === "save-error";
  return `<section class="screen">
    ${header({ back: "log", title: "레시피 검토" })}
    <div class="hero"><p class="eyebrow">AI DRAFT</p><h2 class="screen-title">내 요리와 맞는지<br>한 번만 확인하세요</h2><p>모든 내용은 저장 전에 수정할 수 있어요.</p></div>
    ${saving ? `<div class="banner banner-success" role="status"><strong aria-hidden="true">✓</strong><div><strong>저장하고 있어요</strong><p>완료되면 레시피 상세로 이동합니다.</p></div></div>` : ""}
    ${saveError ? `<div class="banner banner-error" role="alert"><strong aria-hidden="true">!</strong><div><strong>레시피를 저장하지 못했어요</strong><p>수정한 내용은 그대로 유지됩니다. 다시 저장해주세요.</p><button class="banner-action" type="button" data-action="save-recipe">저장 다시 시도</button></div></div>` : ""}
    ${reviewForm({ disabled: saving })}
  </section>`;
}

function renderDetail() {
  if (state === "loading") return `<section class="screen">${header({ back: "home", title: "레시피" })}${feedbackCard("loading", "레시피를 여는 중", "저장된 요리 기록을 불러오고 있어요.")}</section>`;
  if (state === "error") return `<section class="screen">${header({ back: "home", title: "레시피" })}${feedbackCard("error", "레시피를 열지 못했어요", "잠시 후 다시 시도해주세요.", "content")}</section>`;
  if (state === "not-found") return `<section class="screen">${header({ back: "home", title: "레시피" })}${feedbackCard("empty", "레시피를 찾을 수 없어요", "삭제되었거나 아직 저장되지 않은 레시피입니다.")}</section>`;
  return `<section class="screen">
    ${header({ back: "home", title: "레시피" })}
    <div class="detail-hero">
      <p class="eyebrow">MY COOKLOG</p><h2>달큰한 간장<br>삼겹살</h2>
      <div class="pill-row"><span class="pill">약 25분</span><span class="pill">2인분</span><span class="pill">4단계</span></div>
    </div>
    <button class="button button-primary" data-nav="player" data-state="paused">${icons.play}<span>오디오 가이드 시작</span></button>
    <section class="content-section"><h3>재료</h3><ul class="ingredient-list"><li><span>삼겹살</span><span>300g</span></li><li><span>양파</span><span>1/2개</span></li><li><span>간장</span><span>2큰술</span></li><li><span>설탕</span><span>1작은술</span></li></ul></section>
    <section class="content-section"><h3>조리 순서</h3><ol class="method-list"><li>달군 팬에 삼겹살을 넣고 겉면이 노릇해질 때까지 볶아요.</li><li>양파 반 개를 넣고 투명해질 때까지 함께 볶아요.</li><li>간장과 설탕을 넣고 불을 줄여 양념을 입혀요.</li><li>윤기가 돌면 불을 끄고 접시에 담아요.</li></ol></section>
    <section class="content-section"><h3>메모</h3><div class="card note-card">양파가 살짝 투명해질 때 불을 줄이면 양념이 타지 않아요.</div></section>
  </section>`;
}

const playerSteps = [
  "달군 팬에 삼겹살을 넣고 겉면이 노릇해질 때까지 볶아요.",
  "양파 반 개를 넣고 투명해질 때까지 함께 볶아요.",
  "간장과 설탕을 넣고 불을 줄여 양념을 입혀요.",
  "윤기가 돌면 불을 끄고 접시에 담아요."
];

function renderPlayer() {
  if (state === "loading") return `<section class="screen">${header({ back: "detail", title: "오디오 가이드" })}${feedbackCard("loading", "가이드를 준비하는 중", "단계별 음성을 만들고 있어요.")}</section>`;
  if (state === "error") return `<section class="screen">${header({ back: "detail", title: "오디오 가이드" })}${feedbackCard("error", "오디오를 준비하지 못했어요", "잠시 후 다시 시도해주세요.", "paused")}</section>`;
  if (state === "no-steps") return `<section class="screen">${header({ back: "detail", title: "오디오 가이드" })}${feedbackCard("empty", "재생할 단계가 없어요", "조리 순서가 있는 레시피만 오디오로 들을 수 있습니다.")}</section>`;
  const playing = state === "playing";
  return `<section class="screen player-screen">
    ${header({ back: "detail", title: "오디오 가이드" })}
    <div class="player-progress" aria-label="${playerStep + 1} / 4 단계"><span style="width:${(playerStep + 1) * 25}%"></span></div>
    <div class="player-stage">
      <span class="step-chip">STEP ${playerStep + 1} / 4</span>
      <h2>현재 단계</h2>
      <p>${playerSteps[playerStep]}</p>
      <div class="wave ${playing ? "playing" : ""}" aria-hidden="true">${"<i></i>".repeat(15)}</div>
      <p class="player-feedback" aria-live="polite">${playerFeedback || (playing ? "현재 단계를 재생하고 있어요." : "재생 준비가 되었어요.")}</p>
    </div>
    <div class="player-controls">
      <button class="player-control" data-player="prev" aria-label="이전 단계" ${playerStep === 0 ? "disabled" : ""}>‹</button>
      <button class="player-control" data-player="replay" aria-label="현재 단계 다시 듣기">↺</button>
      <button class="player-control main" data-state="${playing ? "paused" : "playing"}" aria-label="${playing ? "일시정지" : "재생"}">${playing ? "Ⅱ" : "▶"}</button>
      <button class="player-control" data-player="next" aria-label="다음 단계" ${playerStep === 3 ? "disabled" : ""}>›</button>
    </div>
    <div class="control-labels" aria-hidden="true"><span>이전</span><span>다시</span><span>${playing ? "정지" : "재생"}</span><span>다음</span></div>
  </section>`;
}

function renderStateList() {
  stateList.innerHTML = screenStates[screen].map(item =>
    `<button class="state-button" data-state="${item}" aria-pressed="${state === item}">${stateLabels[item]}</button>`
  ).join("");
}

function applyFocusIntent() {
  let intent = focusIntent;
  focusIntent = null;
  if (!intent && deleteDialogOpen) intent = { type: "dialog-cancel" };
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
    "record-action": "[data-action=\"start-recording\"]"
  };
  const target = document.querySelector(selectors[intent.type]);
  if (target) target.focus({ preventScroll: true });
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
  const renderers = { home: renderHome, library: renderLibrary, log: renderLog, review: renderReview, detail: renderDetail, player: renderPlayer };
  app.innerHTML = renderers[screen]();
  screenSelect.value = screen;
  renderStateList();
  applyFocusIntent();
  if (!isEmbedded && screen === "log" && state === "recording") {
    transitionTimer = window.setTimeout(() => {
      recordSecondsRemaining -= 1;
      if (recordSecondsRemaining <= 0) {
        state = "processing";
        recordSecondsRemaining = 10;
      }
      render();
    }, 1000);
  } else if (!isEmbedded && screen === "log" && ["processing", "retrying"].includes(state)) {
    transitionTimer = window.setTimeout(advanceTranscription, 1600);
  } else if (screen === "review" && state === "processing") {
    transitionTimer = window.setTimeout(() => { state = "editable"; render(); }, 1800);
  } else if (screen === "review" && state === "saving") {
    transitionTimer = window.setTimeout(() => navigate("detail", "content"), 1400);
  }
  if (!isEmbedded && screen === "log" && state === "undo-delete" && deletedStep) scheduleUndoExpiration();
}

function navigate(nextScreen, nextState) {
  screen = nextScreen;
  state = nextState || screenStates[screen][0];
  recordMenuId = "";
  if (state !== "delete-confirm") deleteDialogOpen = false;
  if (screen === "library") {
    if (state === "search-title") searchQuery = "삼겹살";
    else if (state === "search-ingredient") searchQuery = "애호박";
    else if (state === "no-results") searchQuery = "크림 파스타";
    else searchQuery = "";
  }
  if (screen === "log") prepareLogState(state);
  if (screen !== "player") playerFeedback = "";
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
  render();
}

function completeTranscription() {
  if (screen !== "log" || !["processing", "retrying"].includes(state)) return;
  if (recordedSteps.length < stepSamples.length) recordedSteps.push(stepSamples[recordedSteps.length]);
  state = "steps";
  logFeedback = `STEP ${recordedSteps.length}을 추가했어요`;
  render();
}

function advanceTranscription() {
  if (screen !== "log") return;
  if (state === "processing" && sttPath !== "success") {
    state = "retrying";
    render();
    return;
  }
  if (state === "retrying" && sttPath === "retry-failure") {
    state = "stt-error";
    logFeedback = "";
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

function startSaving() {
  state = "saving";
  render();
}

document.addEventListener("click", event => {
  const target = event.target.closest("button");
  if (!target) return;
  if (target.dataset.action === "complete-transcription") completeTranscription();
  else if (target.dataset.action === "save-recipe") startSaving();
  else if (target.dataset.action === "start-recording") startRecording();
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
    render();
  } else if (target.dataset.action === "remove-ingredient") {
    reviewDraft.ingredients.splice(Number(target.dataset.index), 1);
    render();
  } else if (target.dataset.nav) navigate(target.dataset.nav, target.dataset.state);
  else if (target.dataset.state) {
    state = target.dataset.state;
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
    render();
  } else if (target.dataset.player === "next" && playerStep < 3) {
    playerStep += 1;
    playerFeedback = `STEP ${playerStep + 1}로 이동했습니다.`;
    render();
  } else if (target.dataset.player === "prev" && playerStep > 0) {
    playerStep -= 1;
    playerFeedback = `STEP ${playerStep + 1}로 이동했습니다.`;
    render();
  } else if (target.dataset.player === "replay") {
    state = "playing";
    playerFeedback = `STEP ${playerStep + 1}을 처음부터 다시 재생합니다.`;
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
  if (field === "ingredient-name" || field === "ingredient-amount") {
    const ingredient = reviewDraft.ingredients[Number(target.dataset.draftIndex)];
    if (!ingredient) return;
    ingredient[field === "ingredient-name" ? "name" : "amount"] = target.value;
    return;
  }
  reviewDraft[field] = target.value;
});

let stepSwipe = null;
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
  if (deleteDialogOpen) {
    const dialog = document.querySelector('[role="alertdialog"]');
    if (!dialog) return;
    if (event.key === "Escape") {
      event.preventDefault();
      cancelDeleteRecord();
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
  }
});

document.addEventListener("focusin", event => {
  if (!deleteDialogOpen) return;
  const dialog = document.querySelector('[role="alertdialog"]');
  if (!dialog || dialog.contains(event.target)) return;
  document.querySelector("[data-dialog-initial-focus]")?.focus({ preventScroll: true });
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
