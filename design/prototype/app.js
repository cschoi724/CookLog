const icons = {
  chevronLeft: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>`,
  book: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/></svg>`,
  mic: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0M12 17v5M8 22h8"/></svg>`,
  sparkles: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3-1.2 3.8L7 8l3.8 1.2L12 13l1.2-3.8L17 8l-3.8-1.2L12 3Z"/><path d="m5 14-.8 2.2L2 17l2.2.8L5 20l.8-2.2L8 17l-2.2-.8L5 14ZM19 13l-.8 2.2-2.2.8 2.2.8L19 19l.8-2.2 2.2-.8-2.2-.8L19 13Z"/></svg>`,
  play: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 5 11 7-11 7V5Z"/></svg>`
};

const screenStates = {
  home: ["content", "empty", "loading", "error"],
  log: ["empty", "recording", "processing", "steps", "error"],
  review: ["processing", "editable", "error", "saving", "save-error"],
  detail: ["content", "loading", "error", "not-found"],
  player: ["paused", "playing", "loading", "error", "no-steps"]
};

const stateLabels = {
  content: "기본 콘텐츠", empty: "빈 상태", loading: "로딩", error: "오류",
  recording: "녹음 중", processing: "처리 중", steps: "STEP 누적",
  editable: "검토·수정", saving: "저장 중", "save-error": "저장 오류", "not-found": "찾을 수 없음",
  paused: "일시정지", playing: "재생 중", "no-steps": "단계 없음"
};

const params = new URLSearchParams(window.location.search);
if (params.get("embed") === "1") document.body.classList.add("embed");
let screen = screenStates[params.get("screen")] ? params.get("screen") : "home";
let state = screenStates[screen].includes(params.get("state")) ? params.get("state") : screenStates[screen][0];
let dark = params.get("theme") === "dark";
let playerStep = 1;
let playerFeedback = "";
let recordedStepCount = screen === "log" && ["steps", "processing"].includes(state) ? 2 : 0;
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

function recipeCard() {
  return `<button class="card recipe-card" data-nav="detail" data-state="content">
    <span class="meta">어제 · 약 25분</span>
    <h4>달큰한 간장 삼겹살</h4>
    <p>삼겹살 · 양파 · 간장&nbsp;&nbsp;|&nbsp;&nbsp;4단계</p>
    <span class="recipe-arrow" aria-hidden="true">→</span>
  </button>`;
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
  const content = state === "empty"
    ? `<div class="card empty-card"><div><div class="empty-icon">${icons.book}</div><h4>아직 저장된 레시피가 없어요</h4><p>첫 요리를 10초씩 기록하면 여기에 나만의 레시피가 쌓입니다.</p></div></div>`
    : recipeCard();
  return `<section class="screen home-screen">
    ${header({ action: `<button class="icon-button" aria-label="저장된 레시피">${icons.book}</button>` })}
    <div class="hero">
      <p class="eyebrow">나의 주방 기록</p>
      <h2>오늘의 맛을<br>잊지 않도록</h2>
      <p>요리하면서 10초씩 말해보세요.<br>다시 만들 수 있는 레시피로 남겨드려요.</p>
    </div>
    <button class="button button-primary" data-nav="log" data-state="empty">
      ${icons.mic}<span>10초 요리 기록 시작</span>
    </button>
    <div class="section-head"><h3>${state === "empty" ? "나의 레시피" : "최근 레시피"}</h3><button class="text-action">전체 보기</button></div>
    ${content}
  </section>`;
}

function stepRows(includeProcessing = false) {
  const samples = [
    "삼겹살을 팬에 넣고 노릇하게 볶았어.",
    "양파 반 개와 간장 두 스푼을 넣었어.",
    "불을 줄이고 설탕 한 작은술을 넣었어.",
    "윤기가 돌 때 불을 끄고 접시에 담았어."
  ];
  const count = recordedStepCount;
  const rows = samples.slice(0, count).map((copy, index) =>
    `<div class="step-row"><span class="step-number">${index + 1}</span><p>${copy}</p></div>`
  ).join("");
  const pending = includeProcessing
    ? `<div class="step-row is-processing"><span class="step-number">${count + 1}</span><p class="processing-line">방금 말한 기록을 변환하고 있어요.</p></div>`
    : "";
  return `<div class="step-list">${rows}${pending}</div>`;
}

function renderLog() {
  if (state === "error") {
    return `<section class="screen">${header({ back: "home", title: "요리 기록" })}
      <div class="hero"><p class="eyebrow">STEP PREVIEW</p><h2 class="screen-title">기록을 이어가세요</h2></div>
      <div class="banner"><strong aria-hidden="true">!</strong><div><strong>음성을 인식하지 못했어요</strong><p>조금 더 가까이에서 다시 말해주세요.</p></div></div>
      <div class="record-orb"><div class="record-core"><span class="record-time">10</span><span class="record-label">다시 녹음하기</span></div></div>
      <button class="button button-primary" data-state="recording">${icons.mic}<span>10초 다시 기록</span></button>
    </section>`;
  }
  const isRecording = state === "recording";
  const isProcessing = state === "processing";
  const hasSteps = (state === "steps" && recordedStepCount > 0) || isProcessing;
  return `<section class="screen">
    ${header({ back: "home", title: "요리 기록" })}
    <div class="hero">
      <p class="eyebrow">${isRecording ? "RECORDING" : isProcessing ? "TRANSCRIBING" : "STEP PREVIEW"}</p>
      <h2 class="screen-title">${isRecording ? "지금 말해주세요" : isProcessing ? "STEP으로 바꾸는 중" : "짧게 말하고 계속 요리하세요"}</h2>
      <p>${isRecording ? "남은 시간 안에 지금 한 일을 편하게 말해보세요." : "AI 정리는 마지막에 한 번만 진행합니다."}</p>
    </div>
    <div class="record-orb ${isRecording ? "recording" : ""}">
      <div class="record-core">
        <span class="record-time">${isRecording ? "07" : isProcessing ? "···" : "10"}</span>
        <span class="record-label">${isRecording ? "초 남음" : isProcessing ? "음성 변환 중" : "초 기록"}</span>
      </div>
    </div>
    ${state === "empty" ? `<button class="button button-primary" data-state="recording">${icons.mic}<span>10초 기록 시작</span></button>` : ""}
    ${hasSteps ? `<div class="section-head"><h3>STEP Preview</h3><span class="meta">${isProcessing ? "처리 중" : `${recordedStepCount}개 기록`}</span></div>${stepRows(isProcessing)}` : ""}
    ${isRecording ? `<button class="button button-secondary" data-state="processing">기록 완료</button>` : ""}
    ${isProcessing ? `<button class="button button-secondary" data-action="complete-transcription">STEP 추가 완료 보기</button>` : ""}
    ${state === "steps" ? `<div class="banner banner-info" role="status"><strong aria-hidden="true">i</strong><div><strong>아직 AI가 정리한 결과가 아니에요</strong><p>말한 순서대로 쌓인 STEP Preview입니다.</p></div></div>
      <div class="log-actions">
        <button class="button button-secondary" data-state="recording">${icons.mic}<span>10초 더 기록</span></button>
        <button class="button button-primary" data-nav="review" data-state="processing">${icons.sparkles}<span>AI 정리하기</span></button>
      </div>` : ""}
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

function render() {
  window.clearTimeout(transitionTimer);
  const renderers = { home: renderHome, log: renderLog, review: renderReview, detail: renderDetail, player: renderPlayer };
  app.innerHTML = renderers[screen]();
  screenSelect.value = screen;
  renderStateList();
  if (screen === "log" && state === "processing") {
    transitionTimer = window.setTimeout(completeTranscription, 1600);
  } else if (screen === "review" && state === "processing") {
    transitionTimer = window.setTimeout(() => { state = "editable"; render(); }, 1800);
  } else if (screen === "review" && state === "saving") {
    transitionTimer = window.setTimeout(() => navigate("detail", "content"), 1400);
  }
}

function navigate(nextScreen, nextState) {
  screen = nextScreen;
  state = nextState || screenStates[screen][0];
  if (screen === "log" && state === "empty") recordedStepCount = 0;
  if (screen !== "player") playerFeedback = "";
  render();
}

function completeTranscription() {
  if (screen !== "log" || state !== "processing") return;
  recordedStepCount = Math.min(Math.max(recordedStepCount + 1, 1), 4);
  state = "steps";
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
  else if (target.dataset.action === "add-ingredient") {
    reviewDraft.ingredients.push({ name: "새 재료", amount: "적당량" });
    render();
  } else if (target.dataset.action === "remove-ingredient") {
    reviewDraft.ingredients.splice(Number(target.dataset.index), 1);
    render();
  } else if (target.dataset.nav) navigate(target.dataset.nav, target.dataset.state);
  else if (target.dataset.state) {
    state = target.dataset.state;
    if (screen === "log" && state === "steps" && recordedStepCount === 0) recordedStepCount = 2;
    if (screen === "log" && state === "recording") playerFeedback = "";
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
