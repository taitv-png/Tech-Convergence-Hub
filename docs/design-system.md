# TCH graphic system

Updated 2026-10-20 from docs/claude-uiux-brief-2026-10-20.md and docs/ui-ux-references-2026-10-20.md. Warm white, charcoal and TCH orange. One local font (Be Vietnam Pro), six type levels, rules instead of boxes, one motion idea.

## Direction: "Trường hội tụ"

The homepage opens on a full-width hero. A canvas field (components/ConvergenceField.tsx) draws twelve thin signal paths, one per technology direction, that converge on one node. The paths draw in once over about 1 s, then slow orange pulses travel inward on a loop. The pointer bends the field slightly towards itself; text, headings and the two CTAs never move. The canvas stops when the hero leaves the viewport or the tab is hidden, caps device pixel ratio at 2, and renders one static frame under reduced motion. A warm-white gradient keeps the reading column calm.

References are used as principles only: EPFL+ECAL Lab for scale and motion, SUTD ASD for the story rhythm, MIT.nano for "what can I use, where", ETH AI Center for grouping research, Stanford d.school for intent-based entries, MIT Design Lab for monochrome restraint and rules.

## Tokens

All tokens live in app/graphic.css (loaded last). The `body[data-scroll-theme="campus"]` block mixes every colour token towards charcoal while Campus Explorer passes through the viewport (SiteMotion.tsx sets `--journey-light-share`).

| Token | Value | Use |
| --- | --- | --- |
| --bg | #fbfaf7 | Page |
| --tint | #f3f1ec | Footer, image placeholders |
| --text | #22211f | Charcoal text |
| --muted | #6b6762 | Secondary text |
| --accent | #d94d12 | Emphasis, active states, numbers |
| --line / --line-strong | #e4e0d8 / #c9c3b9 | Rules and section tops |

| Type token | Size | Use |
| --- | --- | --- |
| --type-display | clamp 40 to 64 px | Page h1, contact line, figures |
| --type-section | clamp 32 to 48 px | Section h2, section numbers, explorer result, lab detail h1 |
| --type-title | 20 px | Card titles, section decks, ledes |
| --type-body | 16 px | Reading text, technology picker |
| --type-sm | 14 px | Controls, links, card text |
| --type-xs | 12 px | Metadata, codes, captions |

Spacing: `--space-section` 64 to 112 px between sections, `--space-block` 40 to 56 px inside sections, `--space-heading` 32 to 48 px below a section heading. Headings use weight 500 and -0.035em tracking.

## Components and rules

- SectionHeading: number (aria-hidden), real h2 title, supporting deck. Every homepage chapter (01 to 07) starts with a strong rule and this heading. The deck is always smaller than the title.
- CTAs: one primary (`.button.button-orange`), one secondary (`.text-link` with arrow). Shared wording: "Khám phá labs" and "Tham quan Campus E". The header button follows the page palette.
- TechnologyExplorer: twelve buttons in two columns (Arrow keys, Home and End move focus; Enter and Space select). The section heading sits in its own row, so selection cannot move it. The result area reserves the height of the largest theme on desktop and lists every matching lab with room, floor and a map link (lib/explorer-link.ts keeps the E402/E403 and E602/E603 aliases).
- Lists over cards: clusters, lab rows, campus features and detail facts use horizontal rules. No shadows, glow or decorative frames.
- Images: room renders keep colour and are labelled "Phối cảnh thiết kế" as plain metadata. Illustrative reference photos are shown in grayscale and regain colour on hover. Credits live in docs/image-sources.md, not on the page. The AI illustration is no longer used on the homepage.
- Lab directory: keyword, floor, technology direction and cluster filters on open fields; result count, active filters, clear action and an empty state. Deep links `?theme=` and `?cluster=` still work.
- Lab detail: breadcrumb, room and floor first, "Tìm trên bản đồ" as the primary action, image secondary, then ruled rows for technology, applications, capabilities, outcomes, audiences and labs in the same cluster.
- Campus Explorer page: heading uses the section size; the wayfinding map and 3D tour code is unchanged.

## Validation (2026-10-20)

TypeScript (`npx tsc --noEmit`) and the static export (`npm run build`) pass. Browser checks at 1440 and 390 px: no horizontal overflow, no console or hydration errors, all twelve technology selections keep the heading at the same position and size (48 px desktop, 32 px mobile), no overlapping labels, campus passage reaches full charcoal with light text, reduced motion stops the canvas and entry animation, 200% zoom has no overflow, lab filters and deep links work, and E104 opens in the explorer. Visual gate 6/6 by user request; targeted screenshots only, no visual-design-loop or e2e suite.
