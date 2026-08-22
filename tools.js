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

function showStarter() {
  $("starterResult").textContent = random(starters[$("situation").value]);
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
$("starterBtn").addEventListener("click", showStarter);
$("starterAgain").addEventListener("click", showStarter);
$("situation").addEventListener("change", showStarter);

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
showStarter();
renderHistory();

const savedEnergy = localStorage.getItem("malmun-energy");
if (savedEnergy) {
  $("energyBar").style.width = savedEnergy + "%";
  $("energyText").textContent = energyMessages[savedEnergy] || $("energyText").textContent;
  const savedBtn = document.querySelector(`.mood[data-energy="${savedEnergy}"]`);
  if (savedBtn) savedBtn.classList.add("on");
}
