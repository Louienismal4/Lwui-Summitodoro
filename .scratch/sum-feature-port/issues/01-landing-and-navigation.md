# 01: Landing page and shared navigation

**What to build:** Replace the starter homepage with Summitodoro's mountain-focus introduction, responsive brand header/footer, and working home navigation. Adapt the reference's hero and three explanatory cards to the capabilities available here.

**Blocked by:** None (can start immediately).

**Status:** ready-for-agent

- [x] Home loads directly and after refresh; browser navigation works and unknown public URLs return home without interfering with API or health requests.
- [x] Homepage has a clear product heading, three feature cards, and the virtual-route disclaimer: this is a productivity experience, not hiking navigation or safety guidance.
- [x] Use existing UI/theme conventions and a shared page shell. Navigation shows only implemented destinations; later tickets add About, Changelog, and sign-in.
- [x] Omit the expedition action until a real expedition destination exists. Describe unimplemented mountain, rewards, and co-op capabilities as planned or omit them.
- [x] Remove starter counter/framework/community content. Logo loads with appropriate alternative text; footer contains no no-op legal links or unconfirmed contact details.
- [x] Header and content work at 320px and desktop widths with semantic headings, native links, visible focus, and accessible mobile navigation if needed.
- [x] Frontend lint/build pass; verify loaded assets, direct loading, keyboard navigation, and narrow/desktop layouts through the canonical development entry point.

## Comments

2026-10-13: User approved this slice after invoking To Tickets. Combines the initial navigation and landing drafts into one independently demoable page. Reference: sum's homepage and shared public layout. No curtain transitions or new animation system required.

2026-10-13: Implemented the landing page and reusable SiteLayout with native Home links, reference logo, planned-feature cards, route disclaimer, and keyboard skip link. Reused the existing theme and button variants; existing Nginx/Vite fallback serves unknown public URLs without changing API/health handling. Verified at http://localhost:8080 with Chromium at 320px and 1440px: loaded logo, no horizontal overflow, visible keyboard focus, skip-link targeting, direct/refresh public fallback, and back/forward navigation. API paths return Laravel 404; /up returns 200. Frontend lint and typecheck/build pass; all three existing backend tests pass. Browser assertions and screenshots were generated under /tmp/summitodoro-browser-check and /tmp/summitodoro-{320,1440}.png without adding project dependencies. No frontend test runner or pre-agreed automated seam exists, so validation used browser assertions rather than a TDD cycle.
