# TCH graphic system

Updated 2026-10-20 from docs/claude-uiux-brief-2026-10-20.md and docs/ui-ux-references-2026-10-20.md. Warm white, charcoal and TCH orange. One local font (Be Vietnam Pro), six type levels, rules instead of boxes, one motion idea.

## Revision 2026-10-21 (late): labs only, ambient light

- The laser-opening stage was tried and withdrawn at the user's request; the hero and the Campus E film cross-fade as in Hero V2 below.
- Classrooms ("Phòng học", ids classroom-*) are kept in data/labs.ts as allSpaces but no longer listed: labs now has 30 entries (directory, counts, home, credits, detail pages).
- Homepage "Không gian & Labs" fills the whole screen on its own: two rows of four labs (image, room and floor, two-line title). The campus band darkens only after the section has mostly left the frame (SiteMotion).
- About video: ambient light. About eight times a second the playing frame is sampled at 48 x 33 px; the average of its vivid, bright pixels (blue while the rays converge, orange when they burst) colours a blurred glow around the frame.

## Revision 2026-10-21 (evening): Hero V2

Source: D:/TCH/outputs/TCH_UI_Review_2026-10-21/CLAUDE_UPDATE_HERO_V2.md. Supersedes the intro and logo descriptions below where they conflict.

- Hero (components/IntroSequence.tsx, .cv-hero2): one screen below the header. Slide blue flow video, UEH eyebrow, the headline "Nơi công nghệ hội tụ. Ý tưởng vươn xa." with the orange emphasis, the two CTAs, and all five groups (laser GIF columns, buildings, names) at their slide positions in a band at the bottom. Everything is present on load and enters with one fade of about 1 s (offsets of at most 150 ms). No pinning, no per-laser reveal. Mobile: a two-column grid of the five groups (the fifth centred), each with its own laser column.
- Campus E film (.cv-film2): a plain 100svh section; the hero dims to charcoal and the film rises in opacity with scroll (cross-fade). No core of light, no circular opening, no controls or overlays; pointer events do not reach the video. It plays when visible, pauses off screen, loops. It first tries with sound; if the browser refuses, it plays muted and gains sound after the first click, tap or key press. Poster stays visible until frames arrive.
- Logo (components/LogoDoor.tsx): zoom only. Wordmark fades, the mark centres and enlarges with scroll (220svh desktop, 180svh mobile), then "Hội tụ tri thức. Lan tỏa giá trị." scales from 0.9 to 1. No beams, contour, charge or glow.
- About video: no button; muted loop while visible; under reduced motion a click or tap on the frame starts it.
- Homepage spaces: three cards in one row (16:9 images, two-line clamps), fits one desktop screen; the rest stays on /labs.

## Revision 2026-10-21 (afternoon): slide laser scene, real lab photos

Source: D:/TCH/outputs/TCH_UI_Review_2026-10-21/CLAUDE_FIX_PROMPT.md. Supersedes the SVG laser description below.

- Intro (components/IntroSequence.tsx, script SCRIPT): black opening with logos, heading and CTAs; the heading scales slightly around a fixed point and fades; the exact slide blue flow video (public/intro/blue-flow.mp4) fills the stage; five groups appear in the slide click order (Laboratory, Living Lab, Makerspace, Sandbox, Field Lab), each as laser GIF strips (two cropped copies, one turned 180°, slide crop 26.563% per side), building artwork and name, at the slide placements (data/operating-models.ts slideModels); a hold; the five columns move to the centre while a core of light gathers; the Campus E film opens from the centre, plays, and fades to charcoal. Scroll lengths in viewport heights: 0.25, 0.8, 0.6, 5 x 0.75, 0.8, 1.3, 0.9, 0.7, 0.5 (x0.72 on compact screens). GIFs keep animating; reduced motion swaps them for still frames through picture/source.
- Default markup is the static layout (no pinning); .is-live is added after initialisation unless reduced motion is set.
- Logo transition (components/LogoDoor.tsx): appear, beams, charge, hold, the mark answers with its contour, wordmark leaves, zoom, then "Hội tụ tri thức. Lan tỏa giá trị." scales from 0.78 to 1 in a fixed frame. Thin glow only. Static mode shows the lockup and the tagline fully.
- Videos are muted by default with small icon controls; About does not autoplay under reduced motion; failed loads keep the poster and offer reload.
- Lab images: 35 illustrative photographs, one per lab.id (data/lab-photos.ts, components/LabPhoto.tsx, public/images/labs at 640 and 1280 px). Credits on /credits and under each detail image. LabIllustration is no longer used.
- Operating models section (components/OperatingModels.tsx): editorial rows summarised from TONGHOP-LABS.docx. Names follow the slide; Laboratory vs Incubator still to be confirmed.
- Statistics use TCH orange at the section size. Partner logos: one continuous ribbon, no pause button, static under reduced motion. Explore route fits the viewport on desktop (app/explore/wayfinding.css, end of file).
- CSS order: graphic.css (system) then intro.css (components), see app/layout.tsx.

## Opening journey (2026-10-21, replaces the canvas hero)

Source brief: user update of 2026-10-21 (flow mở đầu, video và zoom logo TCH). References: SmartCityLab Milano (sticky logo opening that scales until it fills the screen) and Apple Store (spacious shelves, two-tone headings). Principles only; no assets copied.

1. Lasers (components/IntroSequence.tsx). A sticky stage (320svh desktop, 260svh mobile). Five lasers are drawn as SVG lines from one convergence point to five destinations, one per operating model, in the slide rhythm (beam 0 to 0.6 of a beat, destination 0.35 to 0.8, label 0.55 to 1). Order: centre first, then outwards. State is a pure function of scroll, so reversing is smooth and nothing replays. A white head runs along a beam while it draws; finished beams keep a slow pulse. Labels are HTML. No numbering. "Khám phá ngay" skips to Về TCH.
2. Campus E film. From 0.68 to 0.86 of the stage the film opens as a circle from the convergence point, then fills the screen. It plays at normal speed, muted by default, with Phát/Tạm dừng and Bật tiếng controls; it pauses off screen. Source: `D:/TCH/04_Video/Cac_ban_xuat/Giới thiệu CS E.mp4` exported to public/media/campus-e-1080.mp4 and campus-e-720.mp4 (loaded only after the first fifth of the stage), poster campus-e-poster.webp.
3. Logo door (components/LogoDoor.tsx, 200svh desktop, 170svh mobile). The film ends on the TCH lockup; the door starts on the same lockup on charcoal. The wordmark fades, the mark centres, then the mark (an opening in an SVG mask) scales exponentially around a point inside its right stem until the warm-white scene "Hội tụ tri thức. Lan tỏa giá trị." fills the screen. The navigation logo, text and CTAs never scale. Logo paths are traced from the 4167 px original PNG (components/tch-logo.ts), because the DXF contains several overlapping drafts and text-only lettering.
4. Về TCH (components/AboutConvergence.tsx). Copy left, V9 film right. Only the right information panel is used: crop x=2370, y=0, w=1470, h=2160 from the 3840 × 2160 source, then rotate 90° clockwise to 2160 × 1470 (public/media/tch-convergence-v9-1280.mp4 and -854.mp4). The frame keeps the 2160:1470 ratio. The film loads when the section is one viewport away and plays muted while visible.

The page stays charcoal until the door opens (marker `.cv-dark-end`, read by SiteMotion), turns warm white, and goes charcoal again only through Campus Explorer. Reduced motion: no pinning, all lasers drawn, the film is an in-flow 16:9 block that plays only on request, the door shows the static lockup.

Operating models live in data/operating-models.ts and are distinct from the 12 technology directions. Unconfirmed: Laboratory (laser slide) vs Incubator (classification supplied by the user).

## Earlier direction: "Trường hội tụ" (2026-10-20)

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

- SectionHeading: real h2 title and supporting deck. No decorative numbers anywhere (sections, technology picker, clusters, campus links). The deck is always smaller than the title.
- CTAs: one primary (`.button.button-orange`), one secondary (`.text-link` with arrow). Shared wording: "Khám phá labs" and "Tham quan Campus E". The header button follows the page palette.
- TechnologyExplorer: twelve buttons in two columns (Arrow keys, Home and End move focus; Enter and Space select). The section heading sits in its own row, so selection cannot move it. The result area reserves the height of the largest theme on desktop and lists every matching lab with room, floor and a map link (lib/explorer-link.ts keeps the E402/E403 and E602/E603 aliases).
- Lists over cards: clusters, lab rows, campus features and detail facts use horizontal rules. No shadows, glow or decorative frames.
- Lab images: every lab has its own line illustration (components/LabIllustration.tsx), drawn from a motif that matches its function and varied by a seed from the lab id; cards say "Minh họa". The user's room renders are no longer used as promotional images, and the off-topic stock files in public/lab-images are no longer shown. News cards keep toned reference photos; credits live in docs/image-sources.md.
- Lab directory: keyword, floor, technology direction and cluster filters on open fields; result count, active filters, clear action and an empty state. Deep links `?theme=` and `?cluster=` still work.
- Lab detail: breadcrumb, room and floor first, "Tìm trên bản đồ" as the primary action, image secondary, then ruled rows for technology, applications, capabilities, outcomes, audiences and labs in the same cluster.
- Campus Explorer page: heading uses the section size; the wayfinding map and 3D tour code is unchanged.

## Validation (2026-10-20)

TypeScript (`npx tsc --noEmit`) and the static export (`npm run build`) pass. Browser checks at 1440 and 390 px: no horizontal overflow, no console or hydration errors, all twelve technology selections keep the heading at the same position and size (48 px desktop, 32 px mobile), no overlapping labels, campus passage reaches full charcoal with light text, reduced motion stops the canvas and entry animation, 200% zoom has no overflow, lab filters and deep links work, and E104 opens in the explorer. Visual gate 6/6 by user request; targeted screenshots only, no visual-design-loop or e2e suite.
