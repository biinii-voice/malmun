/* 말문 — 도구 페이지 스크립트 (모든 데이터는 localStorage에만 저장) */

const missions = [
  { text: "처음 보는 사람에게 먼저 인사해보기", level: 1 },
  { text: "평소 말이 적었던 사람에게 오늘 어땠는지 물어보기", level: 2 },
  { text: "상대방의 이름을 한 번 불러서 이야기해보기", level: 2 },
  { text: "점심 메뉴나 간식 취향 하나 물어보기", level: 1 },
  { text: "상대방과 공통점 하나 찾아보기", level: 3 },
  { text: "누군가에게 ‘오늘 고생했어요’ 한마디 건네기", level: 2 },
  { text: "쉬는 시간에 옆 사람에게 먼저 가벼운 질문 하나 해보기", level: 3 },
  { text: "오늘 도움받은 사람에게 짧게 고맙다고 말해보기", level: 2 },
  { text: "최근 재미있게 본 콘텐츠가 있는지 물어보기", level: 2 },
  { text: "오늘 아직 대화를 못 나눈 사람에게 한 번 말 걸어보기", level: 4 }
];

const levelLabels = {
  1: "아주 가벼운 한 걸음",
  2: "조금 용기가 필요한 한 걸음",
  3: "먼저 다가가는 한 걸음",
  4: "오늘의 가장 큰 한 걸음",
  5: "무리하지 않아도 괜찮아요"
};

const topics = {
  light: [
    "요즘 제일 자주 먹는 점심 메뉴는 뭐예요?",
    "오늘 일정 끝나고 가장 먼저 하고 싶은 건 뭐예요?",
    "아침형 인간이에요, 밤형 인간이에요?",
    "요즘 출퇴근할 때 주로 뭐 들으세요?",
    "의외로 자주 하는 사소한 습관 있어요?"
  ],
  taste: [
    "여행 가면 계획형 vs 즉흥형?",
    "커피 vs 차, 하나만 고른다면?",
    "영화관에서 보기 vs 집에서 보기?",
    "바다 여행 vs 산 여행?",
    "쉬는 날 완전 집콕 vs 무조건 밖으로?"
  ],
  balance: [
    "평생 여름만 살기 vs 평생 겨울만 살기?",
    "출근 1시간 늦게 vs 퇴근 1시간 일찍?",
    "평생 한 메뉴만 먹기 vs 매일 랜덤 메뉴 먹기?",
    "말을 정말 잘하기 vs 글을 정말 잘 쓰기?",
    "휴대폰 없이 하루 vs 커피 없이 일주일?"
  ],
  work: [
    "이번 교육에서 생각보다 재미있었던 게 있었어요?",
    "처음 왔을 때랑 지금 가장 달라진 점이 뭐예요?",
    "배치받고 가장 기대되는 건 뭐예요?",
    "교육 끝나면 가장 먼저 하고 싶은 게 뭐예요?",
    "요즘 가장 어려운 과목이나 일정 있어요?"
  ],
  deep: [
    "요즘 새롭게 배우고 싶은 게 있어요?",
    "최근 스스로 조금 성장했다고 느낀 순간이 있었어요?",
    "일할 때 어떤 사람이랑 가장 잘 맞는 것 같아요?",
    "올해 꼭 해보고 싶은 일이 하나 있다면?",
    "새로운 환경에서 친해질 때 가장 편한 방식은 뭐예요?"
  ]
};

const starters = {
  training: [
    "혹시 어느 쪽으로 배치받으셨어요?",
    "오늘 교육 생각보다 빡세지 않아요? ㅎㅎ",
    "이번 교육에서 제일 재밌었던 거 뭐였어요?",
    "혹시 여기서 친해진 분들 좀 있어요?",
    "저 아직 이름 외우는 중인데, 다시 한 번 성함 물어봐도 돼요?"
  ],
  lunch: [
    "오늘 뭐 드실 생각이에요?",
    "여기 근처에서 먹어본 데 있어요?",
    "혹시 매운 거 잘 드세요?",
    "점심은 한식파예요, 아무거나파예요?",
    "저 메뉴 고르는 게 제일 어렵던데 추천 하나 해주세요 ㅎㅎ"
  ],
  break: [
    "오늘 컨디션 괜찮으세요?",
    "쉬는 시간 진짜 금방 가는 것 같지 않아요?",
    "오늘 끝나고 뭐 하실 거예요?",
    "아까 내용 이해 잘 되셨어요?",
    "혹시 커피 드시러 가세요?"
  ],
  firstday: [
    "저도 오늘 처음이라 좀 어색하네요. 혹시 어디서 오셨어요?",
    "여기 처음이시죠? 저도 아직 적응 중이에요.",
    "혹시 여기 자리 비었어요?",
    "오늘 몇 시쯤 오셨어요?",
    "저 아직 사람들 이름 외우는 중인데 먼저 인사드릴게요!"
  ],
  network: [
    "혹시 어떤 계기로 오셨어요?",
    "이런 모임 자주 오세요?",
    "오늘 가장 기대했던 세션이 뭐예요?",
    "여기 아는 분 있으세요? 저는 거의 처음이에요.",
    "혹시 하시는 일 여쭤봐도 될까요?"
  ]
};

const $ = (id) => document.getElementById(id);
const random = (arr) => arr[Math.floor(Math.random() * arr.length)];

/* ---------- 오늘의 용기 1cm ---------- */
function paintMission(m) {
  $("missionResult").textContent = m.text;
  $("missionLevel").innerHTML = Array.from({ length: 5 }, (_, i) =>
    `<div class="dot ${i < m.level ? "on" : ""}"></div>`
  ).join("");
  $("missionLevelText").textContent = levelLabels[m.level] || "";
}

function showMission() {
  const m = random(missions);
  paintMission(m);
  localStorage.setItem("malmun-last-mission", JSON.stringify(m));
}

function initMission() {
  try {
    const saved = JSON.parse(localStorage.getItem("malmun-last-mission"));
    if (saved && saved.text) { paintMission(saved); return; }
  } catch (e) { /* 저장값이 없거나 손상됨 — 새로 뽑습니다 */ }
  showMission();
}

/* ---------- 대화 소재 / 첫 한마디 ---------- */
function pickTopic() {
  $("topicResult").textContent = random(topics[$("topicCategory").value]);
}

/* 첫 한마디 도우미 — AI 생성 (실패 시 정적 문장으로 폴백) */
let starterBusy = false;
let lastOpeners = [];
let starterLoadTimer = null;

const LOADING_MSGS = [
  "상황을 살펴보는 중",
  "어울리는 한마디를 고르는 중",
  "말을 다듬는 중"
];

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function starterHint() {
  $("starterResult").innerHTML = '<p class="ai-hint">상황을 고르고 버튼을 눌러보세요.</p>';
}

function starterLoading() {
  let i = 0;
  $("starterResult").innerHTML =
    '<p class="ai-hint ai-loading">' +
    `<span class="ai-loading-msg">${LOADING_MSGS[0]}</span>` +
    '<span class="ai-dots" aria-hidden="true"><i></i><i></i><i></i></span></p>';
  clearInterval(starterLoadTimer);
  starterLoadTimer = setInterval(() => {
    i = (i + 1) % LOADING_MSGS.length;
    const msgEl = document.querySelector(".ai-loading-msg");
    if (msgEl) msgEl.textContent = LOADING_MSGS[i];
  }, 1100);
}

function stopStarterLoading() {
  clearInterval(starterLoadTimer);
  starterLoadTimer = null;
}

function fallbackStarter() {
  const picks = shuffle(starters[$("situation").value] || []).slice(0, 3);
  return {
    openers: picks,
    followUp: "상대가 답하면 “아 그래요? 그건 어때요?”처럼 되물어보면 자연스러워요.",
    avoid: "처음부터 너무 사적인 질문(나이·연애 등)은 부담이 될 수 있어요."
  };
}

function renderStarter(data) {
  lastOpeners = (data.openers || []).slice(0, 3);
  let html = '<div class="ai-block"><div class="ai-block-title">💬 이렇게 시작해 보세요</div>';
  html += lastOpeners.map((o, i) =>
    `<div class="ai-opener"><span>${escapeHtml(o)}</span>` +
    `<button type="button" class="ai-copy" data-i="${i}">복사</button></div>`
  ).join("");
  html += "</div>";
  if (data.followUp) {
    html += `<div class="ai-block"><div class="ai-block-title">🔁 이어서 물어보면 좋아요</div>` +
      `<p class="ai-line">${escapeHtml(data.followUp)}</p></div>`;
  }
  if (data.avoid) {
    html += `<div class="ai-block"><div class="ai-block-title">🌿 이건 살짝 조심</div>` +
      `<p class="ai-line">${escapeHtml(data.avoid)}</p></div>`;
  }
  $("starterResult").innerHTML = html;
}

async function generateStarter() {
  if (starterBusy) return;
  starterBusy = true;
  $("starterBtn").disabled = true;
  $("starterAgain").disabled = true;
  starterLoading();

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const resp = await fetch("/api/generate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        situation: $("situation").value,
        context: $("starterContext").value
      }),
      signal: controller.signal
    });
    const data = await resp.json();
    if (resp.ok && data && !data.error && Array.isArray(data.openers) && data.openers.length) {
      renderStarter(data);
    } else {
      renderStarter(fallbackStarter());
    }
  } catch (e) {
    renderStarter(fallbackStarter());
  } finally {
    clearTimeout(timer);
    stopStarterLoading();
    starterBusy = false;
    $("starterBtn").disabled = false;
    $("starterAgain").disabled = false;
  }
}

function copyText(text, btn) {
  const done = () => {
    const prev = btn.textContent;
    btn.textContent = "복사됐어요";
    setTimeout(() => { btn.textContent = prev; }, 1200);
  };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(done).catch(done);
  } else {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); } catch (e) { /* 복사 미지원 브라우저 */ }
    document.body.removeChild(ta);
    done();
  }
}

/* ---------- 작은 성장 기록 ---------- */
function escapeHtml(str) {
  return str.replace(/[&<>"']/g, (m) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[m]));
}

function readHistory() {
  try { return JSON.parse(localStorage.getItem("malmun-reflections") || "[]"); }
  catch (e) { return []; }
}

function renderHistory() {
  const items = readHistory();
  $("history").innerHTML = items.length
    ? items.slice().reverse().map((item) =>
        `<div class="history-item"><span>${escapeHtml(item.text)}</span><time>${escapeHtml(item.date)}</time></div>`
      ).join("")
    : `<div class="history-item"><span>아직 기록이 없어요. 아주 작은 일부터 남겨보세요 🌱</span></div>`;
}

/* ---------- 이벤트 ---------- */
$("nextMission").addEventListener("click", showMission);

$("completeMission").addEventListener("click", () => {
  const btn = $("completeMission");
  btn.textContent = "오늘의 1cm, 저장했어요 🌱";
  localStorage.setItem("malmun-mission-done", new Date().toISOString());
  setTimeout(() => { btn.textContent = "오늘 해볼게요 ✓"; }, 1800);
});

$("pickTopic").addEventListener("click", pickTopic);
$("topicCategory").addEventListener("change", pickTopic);
$("starterBtn").addEventListener("click", generateStarter);
$("starterAgain").addEventListener("click", generateStarter);
$("situation").addEventListener("change", starterHint);
$("starterResult").addEventListener("click", (e) => {
  const btn = e.target.closest && e.target.closest(".ai-copy");
  if (!btn) return;
  const text = lastOpeners[Number(btn.getAttribute("data-i"))];
  if (text != null) copyText(text, btn);
});

const energyMessages = {
  100: "에너지 가득 😆 오늘은 먼저 한마디 걸어봐도 좋겠어요.",
  80: "컨디션 괜찮아요 🙂 가벼운 대화 하나면 충분해요.",
  60: "보통인 날 😐 무리하지 말고 자연스럽게.",
  35: "조금 방전됐네요 😵 오늘은 인사만 해도 충분합니다.",
  15: "집에 가고 싶은 날 🫠 나를 챙기는 것도 중요한 용기예요."
};

document.querySelectorAll(".mood").forEach((btn) => {
  btn.addEventListener("click", () => {
    const energy = Number(btn.dataset.energy);
    document.querySelectorAll(".mood").forEach((b) => b.classList.remove("on"));
    btn.classList.add("on");
    $("energyBar").style.width = energy + "%";
    $("energyText").textContent = energyMessages[energy];
    localStorage.setItem("malmun-energy", String(energy));
  });
});

$("saveReflection").addEventListener("click", () => {
  const text = $("reflection").value.trim();
  if (!text) {
    $("reflection").focus();
    return;
  }
  const items = readHistory();
  const now = new Date();
  items.push({ text, date: `${now.getMonth() + 1}/${now.getDate()}` });
  localStorage.setItem("malmun-reflections", JSON.stringify(items.slice(-20)));
  $("reflection").value = "";
  renderHistory();
});

$("clearHistory").addEventListener("click", () => {
  localStorage.removeItem("malmun-reflections");
  renderHistory();
});

/* ---------- 초기화 ---------- */
initMission();
pickTopic();
starterHint();
renderHistory();

const savedEnergy = localStorage.getItem("malmun-energy");
if (savedEnergy) {
  $("energyBar").style.width = savedEnergy + "%";
  $("energyText").textContent = energyMessages[savedEnergy] || $("energyText").textContent;
  const savedBtn = document.querySelector(`.mood[data-energy="${savedEnergy}"]`);
  if (savedBtn) savedBtn.classList.add("on");
}
