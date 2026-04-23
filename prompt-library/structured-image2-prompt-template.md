# Structured Image2 Prompt Template

Use this template to turn a banner/sign design brief into concept-generation prompts.

The output should support faster starting concepts, not final production artwork.

## Layers

### 1. Subject

Define what the design is about.

Include:

- business or event type
- core message
- target audience
- banner/sign format
- target size or aspect ratio
- required text, if any

Template:

```text
Subject:
Create a concept direction for [banner/sign type] about [business/event/promotion].
Target size or aspect ratio: [size or ratio].
The main message is "[primary message]".
The audience is [target audience].
Required text: [required copy].
```

### 2. Style

Define the visual language.

Include:

- mood
- typography direction
- color direction
- visual references
- commercial tone

Template:

```text
Style:
Use a [mood] visual style with [typography direction].
Color direction: [color palette or contrast direction].
The design should feel [commercial tone] and suitable for [use context].
Avoid over-decorated or final-artwork details.
```

### 3. Composition

Define layout hierarchy and readability.

Include:

- focal point
- text hierarchy
- image or graphic placement
- spacing
- viewing distance

Template:

```text
Composition:
Prioritize clear readability from [viewing distance].
Compose for [size or ratio].
Make [primary message] the strongest focal point.
Use [layout structure] with [image/graphic placement].
Keep secondary information visually subordinate.
Maintain strong spacing and commercial sign readability.
```

### 4. Variation Directives

Define how A/B/C concepts should differ.

Template:

```text
Variation directives:
Generate three distinct concept directions.
A: [variation focus, e.g. bold typography-led layout].
B: [variation focus, e.g. image-led promotional layout].
C: [variation focus, e.g. minimal high-contrast layout].
Each variation should explore a different composition strategy, not just different colors.
```

### 5. Production Notes

Keep practical constraints visible without asking for final files.

Include:

- format constraints
- legibility requirements
- Illustrator handoff considerations
- what not to generate

Template:

```text
Production notes:
Treat the output as concept direction only, not finished artwork.
Respect the intended size or aspect ratio.
Prioritize typography hierarchy, composition, visual impact, and commercial readability.
Keep the concept easy for a designer to rebuild or refine in Illustrator.
Do not generate pixel-perfect production instructions or one-click final design.
```

## Full Prompt Skeleton

```text
Subject:
[subject layer]

Style:
[style layer]

Composition:
[composition layer]

Variation directives:
[variation layer]

Production notes:
[production notes layer]
```

## Example

```text
Subject:
Create a concept direction for a storefront sale banner about a weekend furniture clearance event.
The main message is "Weekend Clearance Sale".
The audience is local shoppers looking for practical home furniture.
Required text: Weekend Clearance Sale, Up to 50% Off, Friday-Sunday.

Style:
Use a confident retail promotional style with bold condensed headline typography.
Color direction: high-contrast red, white, and charcoal with strong price emphasis.
The design should feel urgent, practical, and suitable for a street-facing storefront.
Avoid over-decorated or final-artwork details.

Composition:
Prioritize clear readability from 10-20 meters.
Make "Weekend Clearance Sale" the strongest focal point.
Use a large headline block with a secondary discount badge and simple furniture silhouette placement.
Keep dates and details visually subordinate.
Maintain strong spacing and commercial sign readability.

Variation directives:
Generate three distinct concept directions.
A: bold typography-led layout with oversized headline and discount badge.
B: product-led layout with furniture silhouette framing the sale message.
C: minimal high-contrast layout with maximum distance readability.
Each variation should explore a different composition strategy, not just different colors.

Production notes:
Treat the output as concept direction only, not finished artwork.
Prioritize typography hierarchy, composition, visual impact, and commercial readability.
Keep the concept easy for a designer to rebuild or refine in Illustrator.
Do not generate pixel-perfect production instructions or one-click final design.
```
