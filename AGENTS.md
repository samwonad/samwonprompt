# AGENTS.md

# PROJECT

Name:
Design Copilot MVP

Purpose:
Prompt-driven copilot for banner/sign design using image2 workflows.
This product assists designers in concept generation.
It does NOT replace final design production.

Primary Goal

- Reduce concept-start time by 30%
- Improve idea exploration speed
- Support professional designers using Illustrator workflows

--------------------------------------------------
# PRODUCT PRINCIPLES
--------------------------------------------------

Always optimize for:

1. Faster concept exploration
2. Simpler workflows
3. Human-in-the-loop design
4. Small MVP scope

Never optimize for:

- fully automatic final artwork generation
- over-engineered AI systems
- speculative features
- unnecessary complexity
- direct paid image API usage in the MVP

Engine priority:

- GPT Image / image2 first.
- Do not optimize prompts for generic image models.
- Do not assume Gemini, Midjourney, or Stable Diffusion will interpret prompts the same way.
- The MVP should generate prompts that designers manually paste into GPT Image/image2.

--------------------------------------------------
# MVP MODULES
--------------------------------------------------

Current scope only:

Module A
Prompt Builder
Generate structured image2 prompts from design briefs.
Prompts must account for target size or aspect ratio.

Module B
Reference Analyzer
Analyze 2-3 references and extract style directions.

Module C
Variation Generator
Produce A/B/C concept directions.

Out of scope:

- poster engine
- production plugin implementation
- full adobe automation
- generative "one click final design"

--------------------------------------------------
# WORKING RULES FOR CODEX
--------------------------------------------------

Before coding:

- Challenge scope.
- Reduce requirements if possible.
- Prefer smallest shippable MVP.

Default mode:
Plan first.
Prototype second.
Code third.

When uncertain:
Ask whether complexity is justified.

Prefer:

- web prototype first
- mock data first
- modular components
- reviewable small diffs

Avoid:

- giant rewrites
- premature backend complexity
- plugin-first development

--------------------------------------------------
# TECH STACK DEFAULTS
--------------------------------------------------

Frontend:
Next.js + TypeScript

Prototype first:
UI-only where possible

Use:
Mock data before APIs.

Do not introduce extra dependencies unless justified.

API rule:
No paid image generation API calls in the MVP.
Prefer copy-and-paste prompt output so users can run prompts directly in GPT Image/image2.

--------------------------------------------------
# UX PRINCIPLES
--------------------------------------------------

Target users:
Working designers, not consumers.

UI should feel:
Fast
Minimal
Practical
Production-oriented

Every feature must answer:
"How does this save designer time?"

--------------------------------------------------
# DESIGN DOMAIN RULES
--------------------------------------------------

Treat outputs as concept directions, not finished art.

Support these categories:

- event banners
- signboard concepts
- promotional layouts

Prioritize:

- typography hierarchy
- composition suggestions
- visual impact
- commercial readability
- target size and aspect-ratio fit

--------------------------------------------------
# DEVELOPMENT PROCESS
--------------------------------------------------

Use this sequence:

Problem
-> Prompt workflow
-> Prototype
-> User test
-> Iterate

Never jump directly to scaling.

--------------------------------------------------
# ACCEPTANCE CRITERIA
--------------------------------------------------

A feature is done only if it:

- reduces design-start friction
- improves variation exploration
- can be tested by real designers
- stays within MVP scope

--------------------------------------------------
# TASK EXECUTION RULE
--------------------------------------------------

For each task return:

1. problem framing
2. proposed approach
3. simplified alternative
4. implementation recommendation

Challenge bad assumptions.

--------------------------------------------------
# DO NOT FORGET
--------------------------------------------------

This project is:
A productivity copilot.

It is NOT:
An automatic design generator.
