# 01: Consolidate demo styling

**What to build:** Keep the current demo page and counter while concentrating shared styling in the existing theme and Button module. Preserve the intended layout and interaction without adding product screens or new styling abstractions.

**Blocked by:** None (can start immediately).

**Status:** ready-for-agent

- [x] The counter uses the existing Button module and increments once per activation, including keyboard activation.
- [x] Shared colors and interaction styles use the existing theme; obsolete demo rules and references to undefined styling tokens are removed or replaced.
- [x] Demo content and intended layout remain intact at desktop and narrow viewport sizes.
- [x] Keyboard focus remains visible, and existing accessibility behavior is preserved.
- [x] Frontend lint and build pass; rendered counter interaction and focus behavior are verified.

## Comments

Scope and breakdown approved in the architecture review conversation. This ticket can proceed independently of frontend ownership consolidation.

Implemented on 2026-10-12. The counter uses the existing Button; native demo links reuse its exported secondary styles. Removed obsolete counter/link interaction CSS and all undefined demo styling tokens. Restored the centered page shell and heading hierarchy while retaining the existing responsive sections, content, images, and links.

Verified: frontend lint and production build/typechecking pass. Headless Chromium checks confirm one increment per mouse, Enter, or Space activation; visible keyboard focus on counter and links; native anchor semantics; loaded images; no horizontal overflow and correct section direction at 1440, 375, and 320 pixels; dark theme background; no runtime exceptions. Standards review found no issues. Spec review identified a redundant global lint exception, which was removed in favor of the existing Button-file exception.
