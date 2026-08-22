/*
 * 말문 — AI 생성 (Vercel 서버리스 함수)
 *
 * 보안: Claude API 키는 Vercel 환경변수 ANTHROPIC_API_KEY 에서만 읽습니다.
 *       코드에 키를 하드코딩하지 마세요. 브라우저로 절대 전달되지 않습니다.
 *
 * 요청: POST { mode: "starter" | "battery", ... }
 *   - starter: { situation: "<key>", context?: "<한 줄 맥락>" }
 *              → { openers: string[3], followUp: string, avoid: string }
 *   - battery: { energy: 100|80|60|35|15 }
 *              → { voice: string, tip: string }
 *   실패 시: { error: "<코드>" }
 */

var SITUATIONS = {
  training: "신입교육 · 처음 만난 동기",
  lunch: "점심시간",
  break: "쉬는시간",
  firstday: "첫 출근 · 새 학기",
  network: "모임 · 네트워킹"
};

var ENERGY_LABELS = {
  "100": "가득 (에너지 충만)",
  "80": "괜찮음",
  "60": "보통",
  "35": "방전 직전",
  "15": "집에 가고 싶은, 거의 소진된 상태"
};

/* ---------- mode별 설정 ---------- */

function starterConfig(body) {
  var situation = SITUATIONS[String(body.situation || "")] || "낯선 사람과 처음 마주친 상황";
  var context = String(body.context || "").replace(/\s+/g, " ").trim().slice(0, 100);
  return {
    maxTokens: 600,
    system:
      "당신은 '말문' 프로젝트의 따뜻한 조력자입니다. 첫 한마디가 어려운 사람이 낯선 상황에서 자연스럽게 대화를 시작하도록 돕습니다. " +
      "주어진 상황과 선택적 맥락에 맞춰 openers(첫 한마디 3개, 실제로 입 밖에 낼 수 있는 짧고 담백한 문장, 부담 낮은 순: 가벼운 인사→가벼운 질문→살짝 적극적), " +
      "followUp(대화가 끊기지 않게 이어서 물어보기 좋은 질문 1개), avoid(이 상황에서 피하면 좋은 것 한 줄)를 제안하세요. " +
      "규칙: 담백하고 따뜻한 존댓말, 과장·이모지 남발 금지, 작업 멘트·외모 평가·과한 친밀 표현 금지, " +
      "첫 대화에 부적절한 사생활 질문(나이·연애·수입·종교)은 openers에 넣지 말고 필요하면 avoid로 안내, 정치·종교·민감 주제 금지.",
    user:
      "상황: " + situation + "\n" +
      (context ? "추가 맥락: " + context + "\n" : "") +
      "이 상황에 맞는 첫 한마디를 제안해줘.",
    schema: {
      type: "object",
      properties: {
        openers: { type: "array", items: { type: "string" } },
        followUp: { type: "string" },
        avoid: { type: "string" }
      },
      required: ["openers", "followUp", "avoid"],
      additionalProperties: false
    },
    shape: function (p) {
      return {
        openers: Array.isArray(p.openers) ? p.openers.map(String).slice(0, 3) : [],
        followUp: p.followUp ? String(p.followUp) : "",
        avoid: p.avoid ? String(p.avoid) : ""
      };
    }
  };
}

function batteryConfig(body) {
  var energy = String(body.energy != null ? body.energy : "");
  var label = ENERGY_LABELS[energy] || "보통";
  return {
    maxTokens: 300,
    system:
      "당신은 '말문' 사용자의 '소셜 배터리'입니다. 사용자가 오늘의 사교 에너지를 %로 알려주면, 배터리가 사용자에게 직접 말을 거는 것처럼 1인칭으로 반응하세요. " +
      "voice: 배터리가 건네는 한마디(그날 에너지를 반영, 따뜻하고 장난기 살짝, 대략 15~40자). " +
      "tip: 그 에너지에 딱 맞는 아주 작은 제안 한 줄. 단, 에너지가 낮으면(35% 이하) 제안 대신 '~해도 괜찮아요' 같은 허락·면제의 말로. " +
      "규칙: 방전을 나무라거나('왜 이렇게 방전됐어') 사교를 강요하지 않기, 높은 에너지에도 '꼭 해야 한다'는 압박 금지, 담백하고 따뜻하게, 이모지는 0~2개만. " +
      "매번 조금씩 다른 표현으로.",
    user: "지금 내 소셜 배터리: " + (energy || "?") + "% (" + label + "). 배터리가 나에게 한마디 건네줘.",
    schema: {
      type: "object",
      properties: {
        voice: { type: "string" },
        tip: { type: "string" }
      },
      required: ["voice", "tip"],
      additionalProperties: false
    },
    shape: function (p) {
      return {
        voice: p.voice ? String(p.voice) : "",
        tip: p.tip ? String(p.tip) : ""
      };
    }
  };
}

/* ---------- 핸들러 ---------- */

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "method_not_allowed" });
    return;
  }

  var apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "server_misconfigured" });
    return;
  }

  var body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch (e) { body = {}; }
  }
  body = body || {};

  var cfg = String(body.mode || "starter") === "battery"
    ? batteryConfig(body)
    : starterConfig(body);

  try {
    var upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5",
        max_tokens: cfg.maxTokens,
        system: cfg.system,
        messages: [{ role: "user", content: cfg.user }],
        output_config: { format: { type: "json_schema", schema: cfg.schema } }
      })
    });

    if (!upstream.ok) {
      res.status(502).json({ error: "upstream_error" });
      return;
    }

    var data = await upstream.json();

    if (data.stop_reason === "refusal") {
      res.status(200).json({ error: "refusal" });
      return;
    }

    var textBlock = (data.content || []).filter(function (b) { return b.type === "text"; })[0];
    if (!textBlock) {
      res.status(502).json({ error: "no_content" });
      return;
    }

    var parsed;
    try { parsed = JSON.parse(textBlock.text); } catch (e) {
      res.status(502).json({ error: "parse_error" });
      return;
    }

    res.status(200).json(cfg.shape(parsed));
  } catch (e) {
    res.status(502).json({ error: "network_error" });
  }
};
