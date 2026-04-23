const form = document.querySelector("#prompt-form");
const output = document.querySelector("#prompt-output");
const referenceInput = document.querySelector("#reference-images");
const referencePreview = document.querySelector("#reference-preview");

const styleProfiles = {
  "bold-retail-sale": {
    label: "Bold Retail Sale",
    labelKo: "\uac15\ud55c \ub9ac\ud14c\uc77c \uc138\uc77c",
    typography: "oversized bold Korean headline type, large numerals, and compact support copy",
    color: "high-contrast red, yellow, white, and charcoal",
    tone: "urgent, direct, and price-focused",
    avoid: "decorative detail, weak contrast, and small legal-style copy",
  },
  "clean-premium-local": {
    label: "Clean Premium Local",
    labelKo: "\ud504\ub9ac\ubbf8\uc5c4 \ub85c\uceec \ube44\uc988\ub2c8\uc2a4",
    typography: "clean Korean sans-serif type with moderate weight and generous spacing",
    color: "warm white, black, muted green, navy, or soft metallic accents",
    tone: "trustworthy, refined, and professional",
    avoid: "aggressive discount graphics, crowded copy, and loud gradients",
  },
  "friendly-neighborhood-promo": {
    label: "Friendly Neighborhood Promo",
    labelKo: "\uce5c\uadfc\ud55c \ub3d9\ub124 \ud64d\ubcf4",
    typography: "rounded or friendly Korean headline type with clear supporting text",
    color: "warm yellow, cream, green, coral, and deep neutral contrast",
    tone: "approachable, local, and easy to understand",
    avoid: "childish visuals, overly soft contrast, and too many small icons",
  },
  "high-impact-event": {
    label: "High-Impact Event",
    labelKo: "\uace0\uc784\ud329\ud2b8 \uc774\ubca4\ud2b8",
    typography: "bold Korean display type with strong rhythm and clear date hierarchy",
    color: "two vivid colors plus one neutral for strong event recognition",
    tone: "energetic, immediate, and event-focused",
    avoid: "poster-like complexity, hidden dates, and low-contrast atmosphere",
  },
  "food-promotion": {
    label: "Food Promotion",
    labelKo: "\ud478\ub4dc \ud504\ub85c\ubaa8\uc158",
    typography: "bold Korean menu headline type with readable price or benefit text",
    color: "warm reds, oranges, yellows, deep greens, cream, and dark contrast",
    tone: "appetizing, commercial, and offer-driven",
    avoid: "lifestyle imagery that hides the menu, excessive garnish graphics, and unclear offer structure",
  },
  "urgent-limited-time": {
    label: "Urgent Limited-Time",
    labelKo: "\uae30\uac04 \ud55c\uc815 \uae34\uae09 \uc138\uc77c",
    typography: "compressed bold Korean type, large deadline text, and strong callout labels",
    color: "red, black, white, yellow, and sharp accent contrast",
    tone: "urgent without becoming chaotic",
    avoid: "multiple competing badges, panic-like clutter, and tiny date text",
  },
  "informational-service": {
    label: "Informational Service",
    labelKo: "\uc815\ubcf4\ud615 \uc11c\ube44\uc2a4 \ud64d\ubcf4",
    typography: "structured Korean type hierarchy with headline, benefit, and contact zones",
    color: "blue, green, white, charcoal, and restrained emphasis colors",
    tone: "credible, clear, and service-oriented",
    avoid: "vague brand-only layouts, paragraph-heavy copy, and decorative icons",
  },
  "youth-trend-promo": {
    label: "Youth Trend Promo",
    labelKo: "\uc601 \ud2b8\ub80c\ub4dc \ud504\ub85c\ubaa8\uc158",
    typography: "contemporary Korean display type with selective English accent text",
    color: "bright accent colors, black and white contrast, neon accents, or playful pastel contrast",
    tone: "fresh, trendy, and still commercially readable",
    avoid: "illegible experimental type, too many sticker elements, and generic social templates",
  },
};

const variationProfiles = [
  {
    title: "\u0031\uc548. \uc784\ud329\ud2b8 \uce74\ud53c\ud615",
    directive:
      "Make the requested message the main product. Win through headline scale, offer clarity, and a fast reading order.",
    composition:
      "Use a headline-first structure. Primary message first, benefit or key information second, supporting detail third. Keep graphic elements minimal and subordinate.",
  },
  {
    title: "\u0032\uc548. \ube44\uc8fc\uc5bc \uc778\uc9c0\ud615",
    directive:
      "Make the business category, product, or service immediately understandable while keeping the requested message readable and commercially direct.",
    composition:
      "Use a balanced structure where a product, service, or category cue supports the headline. Keep all copy grouped into clear reading zones.",
  },
  {
    title: "\u0033\uc548. \uc7a5\uac70\ub9ac \uac00\ub3c5\ud615",
    directive:
      "Reduce detail and maximize contrast so the message works for street-facing banners and signs at a glance.",
    composition:
      "Use a simple block layout with strong figure-ground contrast, large type, and enough spacing for distance readability.",
  },
];

const intentProfiles = [
  {
    label: "Event / Campaign",
    labelKo: "\uc774\ubca4\ud2b8 / \ucea0\ud398\uc778",
    keywords: ["\uc774\ubca4\ud2b8", "\ud589\uc0ac", "\uc5b4\ub9b0\uc774\ub0a0", "\uc5b4\ubc84\uc774\ub0a0", "\uae30\ub150", "\ucd95\uc81c", "\uc2dc\uc98c", "\ucea0\ud398\uc778"],
    priority:
      "date clarity, event title visibility, target audience separation, and festive commercial impact",
  },
  {
    label: "Sale / Discount",
    labelKo: "\uc138\uc77c / \ud560\uc778",
    keywords: ["\ud560\uc778", "\uc138\uc77c", "\ud2b9\uac00", "\uacf5\uc9dc", "\ubb34\ub8cc", "1+1", "\uac00\uaca9", "\uc6d0", "%", "\ud55c\uc815"],
    priority:
      "offer readability, price or benefit scale, urgency, and fast street-level recognition",
  },
  {
    label: "Menu / Product Push",
    labelKo: "\uba54\ub274 / \uc0c1\ud488 \uac15\uc870",
    keywords: ["\uba54\ub274", "\uc2e0\uba54\ub274", "\uace0\uae30", "\ucee4\ud53c", "\uc74c\ub8cc", "\uc810\uc2ec", "\uc138\ud2b8", "\ub300\ud45c", "\ucd94\ucc9c"],
    priority:
      "product desirability, product name hierarchy, price or benefit clarity, and visual recognition",
  },
  {
    label: "Opening / Relocation",
    labelKo: "\uc624\ud508 / \uc774\uc804",
    keywords: ["\uc624\ud508", "\uac1c\uc5c5", "\uc2e0\uc7a5", "\uc774\uc804", "\ud655\uc7a5", "\uc7ac\uc624\ud508", "\uc2e0\uaddc"],
    priority:
      "business name visibility, location clarity, opening message strength, and trust",
  },
  {
    label: "Service Information",
    labelKo: "\uc11c\ube44\uc2a4 \uc548\ub0b4",
    keywords: ["\uc0c1\ub2f4", "\uc9c4\ub8cc", "\uc218\uc5c5", "\ud504\ub85c\uadf8\ub7a8", "\uc11c\ube44\uc2a4", "\uc608\uc57d", "\ubb38\uc758", "\ud61c\ud0dd"],
    priority:
      "service category clarity, benefit hierarchy, credibility, and contact/action readability",
  },
  {
    label: "Recruitment / Notice",
    labelKo: "\ubaa8\uc9d1 / \uacf5\uc9c0",
    keywords: ["\ubaa8\uc9d1", "\ucc44\uc6a9", "\uc54c\ub9bc", "\uacf5\uc9c0", "\ub4f1\ub85d", "\uc811\uc218", "\uc601\uc5c5\uc2dc\uac04", "\ud734\ubb34"],
    priority:
      "notice purpose, required action, conditions, schedule, and contact readability",
  },
  {
    label: "Brand / Storefront Recognition",
    labelKo: "\ube0c\ub79c\ub4dc / \ub9e4\uc7a5 \uc778\uc9c0",
    keywords: ["\uac04\ud310", "\uc678\uad00", "\ub9e4\uc7a5", "\ube0c\ub79c\ub4dc", "\ub85c\uace0", "\uc0c1\ud638", "\ud30c\uc0ac\ub4dc", "\uc785\uad6c"],
    priority:
      "business name visibility, category recognition, facade compatibility, and distance readability",
  },
];

function normalizeInput(value, fallback) {
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

function parseRatio(rawSize) {
  const size = String(rawSize ?? "").toLowerCase().replaceAll(",", "");
  const dimensionMatch = size.match(/(\d+(?:\.\d+)?)\s*(?:x|\*|×|:)\s*(\d+(?:\.\d+)?)/);

  if (!dimensionMatch) {
    if (size.includes("1:1") || size.includes("\uc815\uc0ac\uac01")) return { ratio: 1, label: "1:1 square format" };
    if (size.includes("\uc138\ub85c")) return { ratio: 0.5, label: "vertical banner format" };
    if (size.includes("\uac00\ub85c") || size.includes("\ud604\uc218\ub9c9")) return { ratio: 4, label: "wide horizontal banner format" };
    return { ratio: null, label: "custom size or ratio" };
  }

  const width = Number(dimensionMatch[1]);
  const height = Number(dimensionMatch[2]);
  if (!width || !height) return { ratio: null, label: "custom size or ratio" };

  return {
    ratio: width / height,
    label: `${width}:${height} ratio, approximately ${(width / height).toFixed(2)}:1`,
  };
}

function getRatioGuidance(rawSize) {
  const parsed = parseRatio(rawSize);

  if (parsed.ratio === null) {
    return `Canvas guidance: ${parsed.label}. Follow the user's requested physical size or aspect ratio.`;
  }

  if (parsed.ratio >= 4) {
    return `Canvas guidance: ultra-wide horizontal banner, ${parsed.label}. Use a long panoramic layout. Do not compose as a square poster or vertical flyer. Spread information left-to-right with large horizontal reading zones.`;
  }

  if (parsed.ratio >= 2) {
    return `Canvas guidance: wide horizontal banner, ${parsed.label}. Use a landscape layout with clear left-center-right hierarchy. Do not use a square poster composition.`;
  }

  if (parsed.ratio > 1.15) {
    return `Canvas guidance: landscape format, ${parsed.label}. Use horizontal composition and avoid vertical poster framing.`;
  }

  if (parsed.ratio >= 0.85) {
    return `Canvas guidance: near-square format, ${parsed.label}. Use a compact poster-like composition only because the requested ratio is near square.`;
  }

  return `Canvas guidance: vertical format, ${parsed.label}. Use a top-to-bottom reading order and avoid wide banner composition.`;
}

function inferIntent(rawBrief) {
  const brief = String(rawBrief ?? "").toLowerCase();
  const scored = intentProfiles
    .map((intent) => ({
      ...intent,
      score: intent.keywords.filter((keyword) => brief.includes(keyword.toLowerCase())).length,
    }))
    .sort((a, b) => b.score - a.score);

  return scored[0].score > 0
    ? scored[0]
    : {
        label: "General Commercial Message",
        labelKo: "\uc77c\ubc18 \uc0c1\uc5c5 \uba54\uc2dc\uc9c0",
        priority:
          "message clarity, commercial readability, strong hierarchy, and practical designer refinement",
      };
}

function createPromptVariation(
  { businessCategory, designSize, promotionCopy, designStyle, referenceNotes, referenceFiles },
  profile,
) {
  const style = styleProfiles[designStyle] ?? styleProfiles["bold-retail-sale"];
  const intent = inferIntent(promotionCopy);
  const targetSize = normalizeInput(designSize, "banner or sign format not specified");
  const ratioGuidance = getRatioGuidance(targetSize);
  const referenceSummary =
    referenceFiles.length > 0
      ? `The user has selected ${referenceFiles.length} reference image(s) in the prompt tool. The designer must upload the same reference image(s) directly into GPT Image/image2 together with this prompt. Analyze the uploaded reference image(s) for style, composition, typography hierarchy, color contrast, visual energy, and commercial layout direction. Use them only as references, not as assets to copy exactly.`
      : "No reference images attached.";
  const referenceDirection =
    referenceNotes.length > 0
      ? `Reference style direction from user: ${referenceNotes}.`
      : "No manual reference style notes provided.";

  return {
    title: profile.title,
    styleLabel: `${style.labelKo} / ${intent.labelKo}`,
    layers: [
      {
        name: "subject",
        label: "\uc8fc\uc81c / \uc694\uccad \uc815\ub9ac",
        text: `Create a Korean commercial banner or sign concept for ${businessCategory}. Target size or aspect ratio: ${targetSize}. ${ratioGuidance} User brief and required content: "${promotionCopy}". Inferred content intent: ${intent.label}. This is for professional concept exploration, not final artwork production.`,
      },
      {
        name: "style",
        label: "\uc2a4\ud0c0\uc77c \ubc29\ud5a5",
        text: `Use ${style.label}: ${style.typography}. Color direction: ${style.color}. The tone should feel ${style.tone}. ${referenceSummary} ${referenceDirection}`,
      },
      {
        name: "composition",
        label: "\uad6c\uc131 / \ub808\uc774\uc544\uc6c3",
        text: `${profile.composition} ${ratioGuidance} For this content type, prioritize ${intent.priority}. If the reference images suggest a useful layout rhythm, typography hierarchy, color contrast, or graphic treatment, adapt that direction while keeping the new brief original. Preserve a clear Korean reading order and keep the layout practical for Illustrator refinement.`,
      },
      {
        name: "variation directives",
        label: "\ubcc0\ud615 \uc9c0\uc2dc\uc0ac\ud56d",
        text: `${profile.directive} This variation must differ by layout strategy, focal point, and hierarchy, not just color or decoration. Adapt the direction to the inferred content intent instead of assuming every brief is an event.`,
      },
      {
        name: "production notes",
        label: "\uc0dd\uc131 / \uc791\uc5c5 \uc8fc\uc758\uc0ac\ud56d",
        text: `Treat this as a GPT Image / image2 concept prompt only. This app does not call paid image APIs; the designer will manually paste this prompt into GPT Image/image2. If reference images were selected in this tool, upload those same images directly into GPT Image/image2 before running the prompt; otherwise the model cannot see them. Prompt instructions are written in English for better model control, but preserve required Korean copy exactly as Korean text intent. Respect the intended size or ratio: ${targetSize}. If GPT Image offers an aspect-ratio or canvas setting, choose the closest match before generation. Keep all important Korean copy large enough to evaluate. Avoid ${style.avoid}. Do not copy reference images exactly, do not create pixel-perfect final artwork, fabrication instructions, or one-click finished design.`,
      },
    ],
  };
}

function getReferenceFiles() {
  return Array.from(referenceInput?.files ?? []).map((file) => file.name);
}

function renderReferencePreview() {
  const files = Array.from(referenceInput?.files ?? []);
  if (!referencePreview) return;

  referencePreview.innerHTML = files
    .slice(0, 3)
    .map((file) => {
      const url = URL.createObjectURL(file);
      return `
        <figure class="reference-thumb">
          <img src="${url}" alt="${escapeHtml(file.name)}" />
          <figcaption>${escapeHtml(file.name)}</figcaption>
        </figure>
      `;
    })
    .join("");
}

function promptToText(prompt) {
  return prompt.layers.map((layer) => `${layer.name}:\n${layer.text}`).join("\n\n");
}

async function copyPrompt(index) {
  const prompt = currentPrompts[index];
  if (!prompt) return;

  const button = document.querySelector(`[data-copy-index="${index}"]`);
  await navigator.clipboard.writeText(promptToText(prompt));

  if (button) {
    const original = button.textContent;
    button.textContent = "\ubcf5\uc0ac\ub428";
    setTimeout(() => {
      button.textContent = original;
    }, 1200);
  }
}

let currentPrompts = [];

function renderPrompts(prompts) {
  currentPrompts = prompts;
  output.innerHTML = prompts
    .map(
      (prompt, index) => `
        <article class="prompt-card">
          <header>
            <div>
              <h3>${escapeHtml(prompt.title)}</h3>
              <span class="tag">${escapeHtml(prompt.styleLabel)}</span>
            </div>
            <button class="copy-button" type="button" data-copy-index="${index}">\ud504\ub86c\ud504\ud2b8 \ubcf5\uc0ac</button>
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

function generateFromForm() {
  const formData = new FormData(form);
  const input = {
    businessCategory: normalizeInput(formData.get("businessCategory"), "local retail shop"),
    designSize: normalizeInput(formData.get("designSize"), "horizontal banner format"),
    promotionCopy: normalizeInput(formData.get("promotionCopy"), "limited-time promotion"),
    designStyle: formData.get("designStyle"),
    referenceNotes: normalizeInput(formData.get("referenceNotes"), ""),
    referenceFiles: getReferenceFiles(),
  };

  renderPrompts(variationProfiles.map((profile) => createPromptVariation(input, profile)));
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

referenceInput?.addEventListener("change", renderReferencePreview);

generateFromForm();
