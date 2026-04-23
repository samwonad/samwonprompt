# Samwon Prompt

GPT Image/image2용 한국 상업 배너/간판 프롬프트 디렉터 MVP입니다.

이 프로젝트는 최종 디자인을 자동 생성하는 도구가 아니라, 디자이너가 GPT Image에 직접 붙여넣을 수 있는 실무형 콘셉트 프롬프트를 빠르게 만드는 도구입니다.

## Structure

```text
samwonprompt/
├── AGENTS.md
├── IDEAS.md
├── README.md
├── prompt-library/
├── prototype/
├── reference-analyzer/
└── research/
```

## Folders

- `prompt-library/` - reusable prompts, prompt tests, evaluation notes, and example inputs/outputs.
- `prototype/` - static web prototype for the prompt director.
- `reference-analyzer/` - reference-analysis notes and future module guidance.
- `research/` - product research, user notes, source material, and competitive analysis.

## Current Prototype

Open:

```text
prototype/index.html
```

Or serve the folder locally:

```bash
cd prototype
python -m http.server 4173
```

Then visit:

```text
http://localhost:4173
```

## MVP Rules

- No paid image generation API calls.
- Generate copy-ready prompts only.
- Designers manually paste prompts into GPT Image/image2.
- Keep outputs as concept directions, not finished production artwork.
- Prioritize Korean commercial readability, size/ratio fit, and Illustrator refinement.

## Next Steps

1. Test generated prompts with real GPT Image outputs.
2. Save strong examples and weak examples.
3. Refine Korean commercial style presets.
4. Decide whether GitHub Pages should host the prototype.
