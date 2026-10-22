Redesign the UI of my gamified hiking Pomodoro website to match the visual style of the attached reference (Folk's landing page). Keep all existing functionality (timer, sessions, progress, hiking gamification) and only change the look, layout, and feel. Use my existing stack; don't introduce new frameworks unless necessary.

## Reference style to replicate
- Soft, airy, minimal. Light neutral gray page background with a slightly lighter centered container. Generous whitespace, very large rounded corners (24-32px on cards, full pill on buttons).
- Bold geometric sans-serif headings (Plus Jakarta Sans, Outfit, or similar), tight letter-spacing, centered. One key word in each headline is rendered in muted gray for emphasis, with a small mascot or icon inline.
- Slim top nav: logo left, 3-4 small text links center, one soft-shadowed pill button right.
- Primary CTA is a dark, near-black pill with small white text.
- Floating die-cut "sticker" objects scattered around the hero focal point: thick white outline, soft drop shadow, glossy, each tilted at a different angle, gently bobbing.
- Below the hero: a small centered mascot, a section heading, then bento-style cards with pastel gradient backgrounds (lavender/pink, mint), a small icon + label at top-left, a bold headline at bottom-left, and a UI snippet illustration inside.

## Key change: mountain instead of phone
- The hero focal point is a 3D pixel-art (voxel/isometric) mountain, centered where the phone is in the reference. Snow cap, pine trees, and a winding trail up the slope. Soft shadow beneath it on the gray background.
- A tiny pixel hiker sits on the trail and moves up the mountain as the Pomodoro timer progresses (timer progress = climb progress). A floating pill near the summit shows the countdown (e.g. 24:35) and the current session label.
- Build the mountain as either a pre-rendered pixel-art image/sprite asset or a lightweight three.js voxel scene, whichever is simpler to maintain. Add a subtle idle animation (slow rotation or floating) and respect prefers-reduced-motion.

## Floating stickers (replace the reference's)
Pixel-art or flat-glossy stickers with white outlines, placed around the mountain like the reference: hiking boots, backpack, compass, tent, campfire, water bottle, trail map, summit flag, tomato (Pomodoro mascot), hourglass, a "LOCK IN" style badge (e.g. "FOCUS"). Each has a different rotation and a slow float animation. Hide or reduce them on mobile.

## Hero copy (placeholder, keep it short)
Headline: "The climb that finally keeps you focused." (with "climb" in muted gray plus a small pixel hiker inline)
CTA pill: "Start climbing, free" / secondary text: "No account needed"

## Sections below the hero
Centered pixel mascot (hiker meditating), heading "Focus does more for you.", then 2-3 bento cards:
1. "The climb that keeps you on track" – session/timer UI snippet
2. "Streaks that don't melt" – daily streak and summit log
3. "Badges worth bragging about" – achievements/elevation reached
Cards use pastel gradients (lavender, mint, warm peach), with muted-gray highlighted words in the headlines.

## Design tokens
- Use the existing palette from `frontend/src/index.css`; these colors take precedence over the reference's gray, lavender, pink, and mint palette.
- Background: cream `--cream` #F5F0E4; container and cards: paper `--paper` #FFFDF7
- Text: forest ink `--ink` #183F35; stronger emphasis: deep ink `--ink-deep` #0D2D26; secondary text: `--muted-foreground` #65776F
- Primary CTA: pine `--pine` #2F6150 with paper #FFFDF7 text; hover: deep ink #0D2D26
- Accents: fern `--fern` #9EB49A for decorative highlights; sun `--sun` #F2BF52 for rewards and focus rings; coral `--coral` #D66B4D for warm accents and destructive actions
- Supporting surfaces: `--secondary` #E5EBDF and `--muted` #E7EADF; bento gradients: paper-to-secondary or paper-to-cream, with fern, sun, and coral details
- Borders: `--line` #183F3529 (forest ink at 16% opacity)
- Radius: 28px cards, 999px pills
- Shadows: soft, low-opacity, large blur, tinted with forest ink (e.g. `0 12px 32px rgba(24, 63, 53, 0.10)`)
- Typography: heavy weights for headings, small (13-14px) regular weight for nav and labels

## Behavior and quality
- Fully responsive (mobile-first); the mountain scales down and stickers collapse to 3-4 on small screens.
- Smooth, subtle motion only (float, hover lift on cards, button press); no heavy parallax.
- Accessible: sufficient contrast, labeled timer controls, reduced-motion support.
- Keep the code clean and componentized (Hero, StickerLayer, MountainScene, BentoCard, Nav).

First show me a brief plan (component structure and how you'll build the mountain), then implement.
