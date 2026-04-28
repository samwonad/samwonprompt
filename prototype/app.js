const form = document.querySelector("#prompt-form");
const output = document.querySelector("#prompt-output");
const referenceInput = document.querySelector("#reference-images");
const referencePreview = document.querySelector("#reference-preview");
const formAlert = document.querySelector("#form-alert");

const MAX_REFERENCE_FILES = 3;
const MAX_RATIO = 3;
let currentPrompts = [];
let previewUrls = [];

const purposeProfiles = {
  awareness: {
    label: "인지 / 발견성",
    priority: "discoverability, simple category recognition, memorable first impression, and distance readability",
  },
  conversion: {
    label: "전환 / 방문 유도",
    priority: "clear benefit, direct CTA, high contrast, and quick decision-making",
  },
  event: {
    label: "행사 / 프로모션",
    priority: "date hierarchy, audience separation, festive impact, and offer clarity",
  },
  branding: {
    label: "브랜딩 / 신뢰감",
    priority: "tone consistency, restrained hierarchy, trust cues, and long-term brand fit",
  },
};

const intentRules = [
  {
    id: "free-offer",
    label: "무료 혜택 강조",
    keywords: ["공짜", "무료", "증정", "사은품", "1+1", "서비스"],
    implication: "The offer is the hook. Make the word FREE or the Korean equivalent visually dominant without making the layout look cheap.",
  },
  {
    id: "family-event",
    label: "가족/기념일 이벤트",
    keywords: ["어린이", "어버이", "가족", "부모", "아이", "기념일", "5월"],
    implication: "Separate audience groups clearly and keep the mood warm, celebratory, and easy to understand.",
  },
  {
    id: "opening",
    label: "오픈/이전/신규 안내",
    keywords: ["오픈", "개업", "이전", "신규", "확장", "재오픈"],
    implication: "Prioritize store name, location recognition, opening message, and trust.",
  },
  {
    id: "price",
    label: "가격/할인 판매",
    keywords: ["할인", "특가", "세일", "원", "%", "가격", "행사"],
    implication: "Use large numerals, compact support copy, and urgency cues. Avoid burying price or benefit.",
  },
  {
    id: "premium",
    label: "프리미엄/신뢰",
    keywords: ["프리미엄", "고급", "전문", "신뢰", "병원", "브랜드"],
    implication: "Reduce decoration, use confident spacing, and make the tone credible rather than loud.",
  },
];

const strategyPool = [
  {
    title: "타이포그래픽 오퍼 락업",
    strategy: "Headline and offer architecture",
    fits: ["free-offer", "price", "family-event"],
    directive:
      "Build a strong typographic lockup where the core benefit is impossible to miss. Use controlled scale jumps, short copy blocks, and high contrast.",
    composition:
      "Place the main headline as the largest object. Split supporting facts into 2-3 compact zones. CTA should sit in a clear terminal position.",
    avoid: "flat list-like copy, equal-sized text, small date details, and decorative effects that compete with the offer",
  },
  {
    title: "대상 분리형 이벤트 구조",
    strategy: "Audience-segmented event layout",
    fits: ["family-event"],
    directive:
      "Analyze the audience groups and give each group its own readable area while keeping one unified event identity.",
    composition:
      "Use a split or tiered layout: one zone for the shared event promise, separate zones for each audience/date/condition, and a simple CTA footer.",
    avoid: "mixing conditions into one paragraph, unclear dates, childish clutter, and tiny eligibility text",
  },
  {
    title: "거리 가독성 우선 구조",
    strategy: "Distance-readable commercial sign logic",
    fits: ["awareness", "conversion", "price"],
    directive:
      "Compress the idea into a street-readable layout. The viewer should understand the offer before reading all supporting copy.",
    composition:
      "Use 3 reading levels only: main hook, proof/condition, action. Keep generous negative space around Korean text.",
    avoid: "poster density, thin type, low-contrast background imagery, and long sentences",
  },
  {
    title: "브랜드 무드 비주얼 시스템",
    strategy: "Mood-led art direction",
    fits: ["branding", "premium", "opening"],
    directive:
      "Turn the brief into a visual language rather than a literal copy board. Use texture, color temperature, and type personality to set the brand mood.",
    composition:
      "Make one visual motif support the message. Keep copy grouped and protected from busy image areas. Use restraint so designers can refine it.",
    avoid: "generic stock look, copied reference imagery, noisy backgrounds behind text, and random decorative stickers",
  },
  {
    title: "CTA 전환형 상업 레이아웃",
    strategy: "Action-driven conversion layout",
    fits: ["conversion", "free-offer", "price"],
    directive:
      "Reframe the input as a commercial action path: why care, what benefit, what to do next.",
    composition:
      "Start with the benefit, support with one proof or condition, then finish with a clear CTA. Make the CTA visible but not larger than the hook.",
    avoid: "hidden CTA, vague benefit, too many badges, and low-priority details fighting the headline",
  },
  {
    title: "정보 정리형 디렉션",
    strategy: "Editorial hierarchy for complex copy",
    fits: ["event", "opening", "awareness"],
    directive:
      "Convert messy input into a clean information hierarchy. The result should feel designed, not merely decorated.",
    composition:
      "Use a structured grid with labeled copy groups. Prioritize exact Korean text intent, but simplify visual grouping for fast scanning.",
    avoid: "copy pasted as a paragraph, equal emphasis on every phrase, unclear reading order, and excessive small labels",
  },
];

function normalizeInput(value, fallback = "") {
  const trimmed = String(value ?? "").trim();
  return trimmed.length > 0 ? trimmed : fallback;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function parseRatio(rawValue) {
  const value = String(rawValue ?? "").toLowerCase().replaceAll(",", "");
  const dimensionMatch = value.match(/(\d+(?:\.\d+)?)\s*(?:x|\*|×|:)\s*(\d+(?:\.\d+)?)/);

  if (dimensionMatch) {
    const width = Number(dimensionMatch[1]);
    const height = Number(dimensionMatch[2]);
    if (width > 0 && height > 0) return { ratio: width / height, width, height };
  }

  if (value.includes("정사각") || value.includes("square")) return { ratio: 1 };
  if (value.includes("세로") || value.includes("vertical")) return { ratio: 0.56 };
  if (value.includes("가로") || value.includes("banner") || value.includes("현수막")) return { ratio: 3 };
  return { ratio: null };
}

function getRatioGuidance(rawValue) {
  const parsed = parseRatio(rawValue);
  const requested = normalizeInput(rawValue, "custom canvas");

  if (parsed.ratio === null) {
    return {
      requested,
      normalized: requested,
      warning: "",
      orientation: "custom",
      text:
        "Canvas guidance: custom size or ratio. Keep the layout professional, readable, and close to the requested format.",
    };
  }

  const clampedRatio = Math.min(parsed.ratio, MAX_RATIO);
  const normalized = `${clampedRatio.toFixed(2).replace(/\.00$/, "")}:1`;
  const warning =
    parsed.ratio > MAX_RATIO
      ? `입력 비율이 약 ${parsed.ratio.toFixed(2)}:1이라 3:1 기준으로 보정 안내를 추가했습니다.`
      : "";

  if (clampedRatio >= 2.6) {
    return {
      requested,
      normalized,
      warning,
      orientation: "wide",
      text:
        `Canvas guidance: use a maximum ${MAX_RATIO}:1 wide commercial layout. Requested: ${requested}. Normalized: ${normalized}. ` +
        "Use horizontal reading zones, not a square poster composition.",
    };
  }

  if (clampedRatio > 1.15) {
    return {
      requested,
      normalized,
      warning,
      orientation: "landscape",
      text:
        `Canvas guidance: landscape commercial format. Requested: ${requested}. Normalized: ${normalized}. ` +
        "Use left-to-right hierarchy with protected copy areas.",
    };
  }

  if (clampedRatio >= 0.85) {
    return {
      requested,
      normalized,
      warning,
      orientation: "square",
      text:
        `Canvas guidance: near-square format. Requested: ${requested}. Normalized: ${normalized}. ` +
        "Use compact poster-like hierarchy only because the ratio supports it.",
    };
  }

  return {
    requested,
    normalized,
    warning,
    orientation: "vertical",
    text:
      `Canvas guidance: vertical format. Requested: ${requested}. Normalized: ${normalized}. ` +
      "Use top-to-bottom reading order and avoid wide banner assumptions.",
  };
}

function getReferenceFiles() {
  return Array.from(referenceInput?.files ?? []).slice(0, MAX_REFERENCE_FILES);
}

function setAlert(message) {
  if (!formAlert) return;
  formAlert.textContent = message;
  formAlert.hidden = message.length === 0;
}

function validateInput(input) {
  const missing = [];
  if (!input.designConcept) missing.push("디자인 컨셉");
  if (!input.headline) missing.push("헤드라인");
  if (!input.subcopy) missing.push("서브카피");
  if (!input.cta) missing.push("CTA");
  return missing;
}

function includesAny(text, keywords) {
  return keywords.some((keyword) => text.includes(keyword.toLowerCase()));
}

function analyzeBrief(input) {
  const raw = [input.designConcept, input.useContext, input.headline, input.subcopy, input.cta, input.referenceNotes]
    .join(" ")
    .toLowerCase();
  const purpose = purposeProfiles[input.commercialPurpose] ?? purposeProfiles.conversion;
  const ratio = getRatioGuidance(input.canvasRatio);
  const detectedIntents = intentRules.filter((rule) => includesAny(raw, rule.keywords));
  const intentLabels = detectedIntents.map((intent) => intent.label);
  const inferredAudience = inferAudience(raw);
  const inferredTone = inferTone(raw, input.referenceNotes, purpose);
  const copyDiagnosis = diagnoseCopy(input, detectedIntents);
  const hierarchy = buildHierarchy(input, detectedIntents, purpose);
  const refinedCopy = buildRefinedCopy(input, detectedIntents, purpose);
  const referenceSummary = buildReferenceSummary(input);
  const risks = detectRisks(input, ratio, detectedIntents);

  return {
    raw,
    purpose,
    ratio,
    detectedIntents,
    intentLabels,
    inferredAudience,
    inferredTone,
    copyDiagnosis,
    hierarchy,
    refinedCopy,
    referenceSummary,
    risks,
    referenceStyle:
      input.referenceNotes ||
      "No manual style direction was provided. Use the inferred commercial intent, copy hierarchy, and context to choose an appropriate professional direction.",
  };
}

function inferAudience(raw) {
  const groups = [];
  if (raw.includes("어린이") || raw.includes("아이")) groups.push("children / family visitors");
  if (raw.includes("어르신") || raw.includes("부모") || raw.includes("어버이")) groups.push("older adults / parents");
  if (raw.includes("학부모")) groups.push("parents comparing education options");
  if (raw.includes("직장") || raw.includes("점심")) groups.push("nearby workers");
  if (raw.includes("sns") || raw.includes("인스타")) groups.push("mobile social viewers");
  return groups.length > 0 ? groups.join(", ") : "local commercial viewers who decide quickly";
}

function inferTone(raw, referenceNotes, purpose) {
  const style = `${raw} ${String(referenceNotes ?? "").toLowerCase()}`;
  if (style.includes("재미") || style.includes("유쾌") || style.includes("축제")) {
    return "energetic, playful, and commercially clear";
  }
  if (style.includes("프리미엄") || style.includes("고급") || purpose === purposeProfiles.branding) {
    return "confident, restrained, premium, and trustworthy";
  }
  if (style.includes("강한") || style.includes("임팩트") || style.includes("할인")) {
    return "bold, direct, high-contrast, and urgent";
  }
  return "practical, professional, readable, and concept-ready";
}

function diagnoseCopy(input, intents) {
  const facts = [];
  if (input.headline) facts.push(`main hook: ${input.headline}`);
  if (input.subcopy) facts.push(`supporting facts: ${input.subcopy}`);
  if (input.cta) facts.push(`action: ${input.cta}`);
  if (intents.length > 0) facts.push(`detected intent: ${intents.map((intent) => intent.label).join(", ")}`);
  return facts.join(" / ");
}

function buildHierarchy(input, intents, purpose) {
  const hasFreeOffer = intents.some((intent) => intent.id === "free-offer");
  const hasFamilyEvent = intents.some((intent) => intent.id === "family-event");

  if (hasFreeOffer && hasFamilyEvent) {
    return [
      `1. Shared event promise: ${input.headline}`,
      "2. Separate date/audience/benefit blocks so children and older adults are not confused",
      `3. CTA: ${input.cta}`,
    ];
  }

  if (hasFreeOffer) {
    return [`1. Benefit first: ${input.headline}`, `2. Conditions: ${input.subcopy}`, `3. CTA: ${input.cta}`];
  }

  if (purpose === purposeProfiles.branding) {
    return [`1. Brand concept: ${input.designConcept}`, `2. Key message: ${input.headline}`, `3. CTA or next step: ${input.cta}`];
  }

  return [`1. Main message: ${input.headline}`, `2. Reason to care: ${input.subcopy}`, `3. Action: ${input.cta}`];
}

function buildRefinedCopy(input, intents, purpose) {
  const hasFreeOffer = intents.some((intent) => intent.id === "free-offer");
  const hasFamilyEvent = intents.some((intent) => intent.id === "family-event");
  const concept = input.designConcept.replace(/\s+/g, " ");

  if (hasFreeOffer && hasFamilyEvent) {
    return {
      headline: "5월 가족 감사 고기 이벤트",
      subcopy: "어린이날은 어린이 혜택, 어버이날은 어르신 혜택을 날짜별로 분리해 크게 보여주세요.",
      cta: input.cta || "가족과 함께 방문하세요",
      note:
        "The generated copy may improve wording and grouping, but must not invent new dates, discounts, menu items, or eligibility conditions.",
    };
  }

  if (hasFreeOffer) {
    return {
      headline: `${input.headline}을 가장 강한 오퍼로 재구성`,
      subcopy: "무료/증정 조건을 짧은 혜택 문장과 조건 문장으로 분리하세요.",
      cta: input.cta,
      note:
        "The model may rewrite the expression for clarity, but the actual offer and conditions must remain faithful to the user's input.",
    };
  }

  if (purpose === purposeProfiles.branding) {
    return {
      headline: concept,
      subcopy: "브랜드 신뢰와 전문성을 짧은 가치 문장으로 정리하세요.",
      cta: input.cta,
      note:
        "The model may create a refined brand-facing line if it stays consistent with the brief and does not add unsupported claims.",
    };
  }

  return {
    headline: input.headline,
    subcopy: "Rewrite the support copy into a concise commercial message if the original is too literal or too long.",
    cta: input.cta,
    note:
      "The model may propose improved Korean copy and grouping. Preserve factual meaning, but do not mechanically paste the input.",
  };
}

function buildReferenceSummary(input) {
  const referenceCount = input.referenceFiles.length;
  if (referenceCount === 0) {
    return "No reference image is attached. Derive style from the written brief and reference style notes only.";
  }

  return (
    `${referenceCount} reference image(s) will be manually uploaded to GPT Image/image2. ` +
    "Analyze them for hierarchy, contrast, spatial rhythm, type personality, color behavior, texture, and commercial layout logic. Use them as direction, not as assets to copy."
  );
}

function detectRisks(input, ratio, intents) {
  const risks = [];
  const subcopyLength = input.subcopy.length;
  if (subcopyLength > 80) risks.push("supporting copy is long, so it needs grouping instead of one paragraph");
  if (ratio.orientation === "wide") risks.push("wide canvas can become empty or over-stretched unless information zones are planned");
  if (ratio.orientation === "square") risks.push("near-square format can become poster-like, so keep commercial readability first");
  if (intents.some((intent) => intent.id === "family-event")) risks.push("multiple audiences/dates can be confused unless separated visually");
  if (!input.referenceNotes) risks.push("style direction is open, so the prompt must infer tone from commercial purpose and copy intent");
  return risks.length > 0 ? risks : ["no major brief risk detected; maintain readable hierarchy and practical production discipline"];
}

function scoreStrategy(strategy, analysis, input) {
  let score = 0;
  const fitIds = [
    input.commercialPurpose,
    ...analysis.detectedIntents.map((intent) => intent.id),
    analysis.ratio.orientation,
  ];

  strategy.fits.forEach((fit) => {
    if (fitIds.includes(fit)) score += 3;
  });

  if (analysis.risks.join(" ").includes("long") && strategy.strategy.includes("Editorial")) score += 2;
  if (analysis.risks.join(" ").includes("wide") && strategy.strategy.includes("Distance")) score += 2;
  if (analysis.referenceStyle.length > 40 && strategy.strategy.includes("Mood")) score += 1;
  return score;
}

function selectStrategies(analysis, input) {
  return strategyPool
    .map((strategy, index) => ({ ...strategy, score: scoreStrategy(strategy, analysis, input), index }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, 3)
    .map((strategy, index) => ({
      ...strategy,
      title: `${["A", "B", "C"][index]}안. ${strategy.title}`,
    }));
}

function createPromptVariation(input, analysis, strategy) {
  const intentImplications =
    analysis.detectedIntents.length > 0
      ? analysis.detectedIntents.map((intent) => `${intent.label}: ${intent.implication}`).join(" ")
      : "No narrow intent detected. Build a clear commercial concept from the stated purpose and copy hierarchy.";

  return {
    title: strategy.title,
    strategy: strategy.strategy,
    layers: [
      {
        label: "입력 분석",
        text:
          `Do not paste the user's form fields literally. Interpret the brief first. ` +
          `Detected intent: ${analysis.intentLabels.join(", ") || "general commercial message"}. ` +
          `Audience: ${analysis.inferredAudience}. Tone: ${analysis.inferredTone}. ` +
          `Copy diagnosis: ${analysis.copyDiagnosis}.`,
      },
      {
        label: "재구성된 디자인 브리프",
        text:
          `Design a Korean commercial concept for ${input.useContext || "a professional commercial placement"}. ` +
          `Concept: ${input.designConcept}. Commercial purpose: ${analysis.purpose.label}. ` +
          `Reading hierarchy: ${analysis.hierarchy.join(" / ")}. ` +
          `Suggested rewritten copy direction: headline "${analysis.refinedCopy.headline}", support "${analysis.refinedCopy.subcopy}", CTA "${analysis.refinedCopy.cta}". ` +
          `${analysis.ratio.text}`,
      },
      {
        label: "image2 실행 프롬프트",
        text:
          `Create one professional GPT Image/image2 concept direction. ${strategy.directive} ` +
          `${strategy.composition} ${intentImplications} ` +
          `Use this style direction as art direction, not decoration: ${analysis.referenceStyle}. ` +
          `${analysis.referenceSummary} You may rewrite and improve the Korean copy for a stronger design concept instead of pasting the form text literally. ` +
          `Original input for factual grounding: headline "${input.headline}", support "${input.subcopy}", CTA "${input.cta}". ` +
          `${analysis.refinedCopy.note}`,
      },
      {
        label: "디렉터 판단",
        text:
          `This option is chosen because the brief suggests: ${analysis.risks.join("; ")}. ` +
          `Prioritize ${analysis.purpose.priority}. Make this direction meaningfully different from the other options through hierarchy, composition, and persuasion strategy.`,
      },
      {
        label: "금지사항 / QA",
        text:
          `Avoid ${strategy.avoid}. Do not create a final artwork claim, do not copy references exactly, and do not let style overpower readability. ` +
          "Self-check: core message in 3 seconds, headline readable from 10m, all required copy present, CTA visible, brand tone intact, and layout useful for Illustrator refinement.",
      },
    ],
  };
}

function promptToText(prompt) {
  return prompt.layers.map((layer) => `${layer.label}:\n${layer.text}`).join("\n\n");
}

async function copyPrompt(index) {
  const prompt = currentPrompts[index];
  if (!prompt) return;

  const button = document.querySelector(`[data-copy-index="${index}"]`);
  await navigator.clipboard.writeText(promptToText(prompt));

  if (button) {
    const original = button.textContent;
    button.textContent = "복사됨";
    setTimeout(() => {
      button.textContent = original;
    }, 1200);
  }
}

function renderPrompts(prompts) {
  currentPrompts = prompts;
  output.innerHTML = prompts
    .map(
      (prompt, index) => `
        <article class="prompt-card">
          <header>
            <div>
              <h3>${escapeHtml(prompt.title)}</h3>
              <span class="tag">${escapeHtml(prompt.strategy)}</span>
            </div>
            <button class="copy-button" type="button" data-copy-index="${index}">프롬프트 복사</button>
          </header>
          <dl class="layer-list">
            ${prompt.layers
              .map(
                (layer) => `
                  <div class="layer">
                    <dt>${escapeHtml(layer.label)}</dt>
                    <dd>${escapeHtml(layer.text)}</dd>
                  </div>
                `,
              )
              .join("")}
          </dl>
        </article>
      `,
    )
    .join("");
}

function clearPreviewUrls() {
  previewUrls.forEach((url) => URL.revokeObjectURL(url));
  previewUrls = [];
}

function renderReferencePreview() {
  const files = Array.from(referenceInput?.files ?? []);
  clearPreviewUrls();

  if (!referencePreview) return;
  if (files.length > MAX_REFERENCE_FILES) {
    setAlert(`참조 이미지는 ${MAX_REFERENCE_FILES}장까지만 프롬프트에 반영됩니다. 현재 선택: ${files.length}장`);
  }

  referencePreview.innerHTML = files
    .slice(0, MAX_REFERENCE_FILES)
    .map((file) => {
      const url = URL.createObjectURL(file);
      previewUrls.push(url);
      return `
        <figure class="reference-thumb">
          <img src="${url}" alt="${escapeHtml(file.name)}" />
          <figcaption>${escapeHtml(file.name)}</figcaption>
        </figure>
      `;
    })
    .join("");
}

function getInput() {
  const formData = new FormData(form);
  return {
    designConcept: normalizeInput(formData.get("designConcept")),
    useContext: normalizeInput(formData.get("useContext")),
    canvasRatio: normalizeInput(formData.get("canvasRatio"), "3:1 or smaller commercial canvas"),
    headline: normalizeInput(formData.get("headline")),
    subcopy: normalizeInput(formData.get("subcopy")),
    cta: normalizeInput(formData.get("cta")),
    commercialPurpose: normalizeInput(formData.get("commercialPurpose"), "conversion"),
    referenceNotes: normalizeInput(formData.get("referenceNotes")),
    referenceFiles: getReferenceFiles(),
  };
}

function generateFromForm() {
  const input = getInput();
  const missing = validateInput(input);

  if (missing.length > 0) {
    currentPrompts = [];
    output.innerHTML = "";
    setAlert(`필수 항목을 입력해주세요: ${missing.join(", ")}`);
    return;
  }

  const analysis = analyzeBrief(input);
  const alerts = [];
  if (analysis.ratio.warning) alerts.push(analysis.ratio.warning);
  if ((referenceInput?.files?.length ?? 0) > MAX_REFERENCE_FILES) {
    alerts.push(`참조 이미지는 상위 ${MAX_REFERENCE_FILES}장만 반영됩니다.`);
  }
  setAlert(alerts.join(" "));

  const strategies = selectStrategies(analysis, input);
  renderPrompts(strategies.map((strategy) => createPromptVariation(input, analysis, strategy)));
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  generateFromForm();
});

output.addEventListener("click", (event) => {
  const button = event.target.closest("[data-copy-index]");
  if (!button) return;
  copyPrompt(Number(button.dataset.copyIndex));
});

referenceInput?.addEventListener("change", () => {
  renderReferencePreview();
  generateFromForm();
});

window.addEventListener("beforeunload", clearPreviewUrls);

generateFromForm();
