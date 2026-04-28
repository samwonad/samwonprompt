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
    priority: "fast category recognition, strong silhouette, brand memorability, and distance readability",
  },
  conversion: {
    label: "전환 / 방문 유도",
    priority: "CTA clarity, offer hierarchy, immediate benefit recognition, and low-friction action",
  },
  event: {
    label: "행사 / 프로모션",
    priority: "date clarity, audience separation, event title scale, and energetic commercial impact",
  },
  branding: {
    label: "브랜딩 / 신뢰감",
    priority: "consistent tone, refined hierarchy, trust cues, and premium restraint",
  },
};

const variationProfiles = [
  {
    title: "A안. 타이포 중심",
    strategy: "Typography-first information design",
    directive:
      "Make the Korean headline the visual anchor. Win through hierarchy, spacing, contrast, and a 3-second reading order.",
    avoid: "tiny body copy, low-contrast type, decorative effects that weaken legibility, and scattered badges",
  },
  {
    title: "B안. 비주얼 중심",
    strategy: "Visual-led brand recognition",
    directive:
      "Use a strong image, graphic motif, texture, or spatial rhythm to create instant mood while keeping the copy easy to read.",
    avoid: "generic stock-photo feeling, visual noise behind Korean text, copied reference layouts, and unclear focal points",
  },
  {
    title: "C안. 상업 성과 중심",
    strategy: "Conversion-focused commercial layout",
    directive:
      "Prioritize CTA, benefit, offer, and distance readability. Make the design useful for real commercial decision-making.",
    avoid: "poster-like complexity, hidden CTA, over-stylized lettering, weak offer emphasis, and excessive fine detail",
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
    if (width > 0 && height > 0) {
      return { ratio: width / height, width, height };
    }
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
      text:
        "Canvas guidance: custom size or ratio. Keep the layout professional, readable, and close to the user's requested format.",
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
      text:
        `Canvas guidance: use a maximum ${MAX_RATIO}:1 wide commercial layout. Requested: ${requested}. Normalized: ${normalized}. ` +
        "Use strong horizontal reading zones and avoid square poster composition.",
    };
  }

  if (clampedRatio > 1.15) {
    return {
      requested,
      normalized,
      warning,
      text:
        `Canvas guidance: landscape commercial format. Requested: ${requested}. Normalized: ${normalized}. ` +
        "Build a left-to-right hierarchy with clear copy grouping.",
    };
  }

  if (clampedRatio >= 0.85) {
    return {
      requested,
      normalized,
      warning,
      text:
        `Canvas guidance: near-square format. Requested: ${requested}. Normalized: ${normalized}. ` +
        "Use compact composition and keep headline, support copy, and CTA separated.",
    };
  }

  return {
    requested,
    normalized,
    warning,
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

function normalizeBrief(input) {
  const purpose = purposeProfiles[input.commercialPurpose] ?? purposeProfiles.conversion;
  const ratio = getRatioGuidance(input.canvasRatio);
  const referenceCount = input.referenceFiles.length;
  const referenceSummary =
    referenceCount > 0
      ? `${referenceCount} reference image(s) will be manually uploaded by the designer to GPT Image/image2. Analyze them for layout rhythm, typography hierarchy, color contrast, texture, and commercial energy. Do not copy them exactly.`
      : "No reference image is attached. Follow the written style direction instead.";

  return {
    designConcept: input.designConcept,
    useContext: input.useContext || "professional commercial design concept",
    headline: input.headline,
    subcopy: input.subcopy,
    cta: input.cta,
    purpose,
    ratio,
    referenceStyle:
      input.referenceNotes ||
      "Use a clear professional commercial style. Prioritize typography hierarchy, composition discipline, and practical Illustrator refinement.",
    referenceSummary,
  };
}

function createPromptVariation(spec, profile) {
  return {
    title: profile.title,
    strategy: profile.strategy,
    layers: [
      {
        label: "Design Spec 정규화",
        text:
          `Design concept: ${spec.designConcept}. Use context: ${spec.useContext}. Commercial purpose: ${spec.purpose.label}. ` +
          `Canvas request: ${spec.ratio.requested}. Normalized guidance: ${spec.ratio.normalized}. ` +
          `Copy structure: headline "${spec.headline}", support copy "${spec.subcopy}", CTA "${spec.cta}".`,
      },
      {
        label: "image2 실행 프롬프트",
        text:
          `Create a professional Korean commercial design concept for GPT Image/image2. ${spec.ratio.text} ` +
          `Main headline must read as: "${spec.headline}". Supporting copy intent: "${spec.subcopy}". CTA: "${spec.cta}". ` +
          `Use the following style direction: ${spec.referenceStyle}. ${spec.referenceSummary} ` +
          `${profile.directive} Prioritize ${spec.purpose.priority}. Treat this as concept exploration for a professional designer, not final production artwork.`,
      },
      {
        label: "전략형 Variation 지시",
        text:
          `${profile.strategy}. This option must differ by strategy, focal hierarchy, and composition logic, not only by color. ` +
          "Keep Korean typography large, commercially readable, and organized for later Illustrator refinement.",
      },
      {
        label: "금지사항",
        text:
          `${profile.avoid}. Do not invent unreadable Korean text, do not hide required copy, do not exceed a 3:1 wide-layout assumption, and do not make one-click final artwork.`,
      },
      {
        label: "Self-QA",
        text:
          "Check before accepting the result: Can the core message be understood in 3 seconds? Is the headline readable from 10m? Are headline, support copy, and CTA all present? Does the output stay inside the intended brand/style direction? Is the layout commercially useful, not just decorative?",
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

  const spec = normalizeBrief(input);
  const alerts = [];
  if (spec.ratio.warning) alerts.push(spec.ratio.warning);
  if ((referenceInput?.files?.length ?? 0) > MAX_REFERENCE_FILES) {
    alerts.push(`참조 이미지는 상위 ${MAX_REFERENCE_FILES}장만 반영됩니다.`);
  }
  setAlert(alerts.join(" "));
  renderPrompts(variationProfiles.map((profile) => createPromptVariation(spec, profile)));
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
