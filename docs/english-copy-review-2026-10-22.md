# English copy and logo transition review

Reviewed against the Vietnamese website content, the current lab catalogue and the user-approved English room-sign list dated 2026-10-14.

## Editorial changes

- Use **Research themes** for the 12 research areas, **Operating models** for the five ways spaces operate, and **Capability clusters** for the seven groups. These are separate classifications; their keys and assignments stay intact.
- Replace literal marketing translations such as "Value spreads", "Converge / Charge / Spread" and "Meet at the intersection" with contextual English: "Creating lasting impact", "Converge / Build momentum / Extend impact" and "Where disciplines meet".
- Refine descriptions, equipment labels, applications, model summaries, news headlines and map instructions. Retain approved lab names, including their established spelling of Center and Human-Centered.
- Describe the complete directory as labs and innovation spaces because it also includes shared workspaces and a lounge. Counts come from the catalogue.
- Keep Vietnamese names and descriptions in bilingual search, with stable IDs and query parameters across language switches.
- The English-first routes and Vietnamese routes are statically exported. Page titles, descriptions and alternate-language links use the relevant locale.

## Source limits

This is an editorial review, not approval of institutional facts or a certified translation. Room names already approved on signs are retained even where they differ from literal translations of the Vietnamese catalogue. In particular, the sign list labels E502/E503 as Advanced Initiative of Science & Technology Lab, while the current website data treats them as classrooms. Their classification has not been changed without an updated room catalogue. Vietnamese lettering embedded in source films remains part of those films.

## Motion

The TCH mark and wordmark start in warm white. Orange light appears gradually inside the mark as it grows. A short, frame-rate-independent scroll interpolation smooths changes without taking over native scrolling. Three faint peripheral LED rails add depth without crossing the logo. The animation respects reduced-motion preferences and cancels pending frames on unmount.

## Verification

- TypeScript and GitHub Pages production build passed.
- Static export audit: 77 HTML files, including 30 English lab detail pages; no missing internal link/media targets or untranslated Vietnamese body copy on English content pages.
- Browser: confirmed white logo, scroll zoom, English directory search using a Vietnamese phrase, and EN/VI switching with query preservation.
- Kamisoft is absent from both partner lists.

Generated build output, environment files, caches, backup files and unused prototype components are excluded from the release.
