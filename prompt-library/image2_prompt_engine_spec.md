# Image2 Prompt Engine Spec

# Purpose

Define the specialized prompt system for Design Copilot MVP using a gpt image2 workflow.

This engine turns a short commercial design brief into structured concept prompts for Korean banner and sign design.
It does not generate final production artwork.
It does not call paid image generation APIs in the MVP.

# Core Positioning

Design Copilot should behave like a senior commercial design planner, not a generic image prompt writer.

It should optimize for:

- faster concept starts
- clearer visual hierarchy
- commercial readability
- practical Illustrator refinement
- distinct A/B/C directions

It should not optimize for:

- beautiful but unreadable images
- final artwork completion
- excessive visual detail
- generic poster aesthetics
- one-click design replacement
- cross-model prompt compatibility

# Engine Target

Primary target:

- GPT Image / image2

Out of scope for MVP:

- Gemini image prompt compatibility
- Midjourney prompt compatibility
- Stable Diffusion prompt compatibility
- direct paid image API generation

The MVP output should be a copy-ready prompt that designers paste manually into GPT Image/image2.
This keeps cost low and preserves human control.

# Engine Inputs

Keep MVP inputs minimal:

1. business category
2. target size or aspect ratio
3. request content / required copy
4. design style category

Optional future inputs:

- format: horizontal banner, vertical banner, facade sign, window sign
- viewing distance
- required copy split: headline, offer, date, location
- reference style notes

# Internal Prompt Layers

Every generated prompt must contain:

1. subject
2. style
3. composition
4. variation directives
5. production notes

# Professional Additions

The engine should add these design constraints internally:

## Korean Copy Handling

- preserve Korean promotion copy as visible text intent
- prioritize headline and offer readability
- avoid excessive small Korean text
- make numerals, discounts, dates, and prices visually clear

## Commercial Layout Logic

- define the main reading order
- separate headline, offer, support copy, and callout zones
- choose a dominant visual strategy per variation
- avoid changing only palette between A/B/C
- compose for the requested size or aspect ratio
- avoid square-poster layouts when the target is a long horizontal banner

## Sign And Banner Readability

- mention distance readability
- avoid fine detail
- use strong figure-ground contrast
- keep layouts rebuildable in Illustrator

## Concept-Only Boundary

- request concept direction, not final artwork
- avoid print-ready, fabrication-ready, or pixel-perfect instructions
- keep outputs useful as designer starting points

# Variation Strategy

Generate three variations with different commercial strategies:

## A. Message Dominance

Best when promotion copy is the product.

Focus:

- oversized headline
- strong offer hierarchy
- minimal supporting elements
- fast scanning

## B. Category Recognition

Best when customers need to understand the business quickly.

Focus:

- product, service, or category cue
- balanced headline and visual support
- practical storefront or banner recognition

## C. Distance Impact

Best for street-facing banners and signs.

Focus:

- maximum contrast
- reduced detail
- simple block layout
- high legibility from distance

# Image2 Prompt Skeleton

```text
Subject:
Create a Korean commercial [banner/sign] concept direction for [business category].
Target size or aspect ratio: [target size or ratio].
Required content: "[request content / required copy]".
This is for concept exploration by a professional designer, not final production artwork.

Style:
Use [style category] with [typography direction], [color direction], and [commercial tone].
The style should support Korean promotional readability and practical Illustrator refinement.

Composition:
Use [variation composition strategy].
Compose for [target size or ratio].
Define a clear reading order: primary message first, offer or benefit second, supporting copy third.
Prioritize typography hierarchy, strong spacing, and distance readability.

Variation directives:
Generate this as variation [A/B/C].
This variation must differ by layout strategy, focal point, and hierarchy, not just color.

Production notes:
Treat the output as a concept direction only.
Respect the intended size or aspect ratio.
Avoid pixel-perfect final artwork, excessive small text, and over-detailed decoration.
Keep the design easy for a human designer to rebuild, adjust, and finish in Illustrator.
```

# Recommended MVP Behavior

For v0.2:

- keep one page
- keep three inputs
- expand style selector to the 8 Korean commercial style categories
- improve mock prompt quality
- do not add API calls yet
- provide copy-ready prompt output

# Acceptance

The engine is successful only if a designer can look at the three outputs and quickly choose a usable starting direction.
