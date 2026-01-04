# Repository Quality Report

Date: 2026-01-04

This report was generated after a quick automated scan for common code-quality and packaging issues: ESLint disables, explicit `any` usage, console logging, TODO/FIXME markers, broad catch blocks, `process.env` usage, and lockfile/vendor signs.

Summary (high level)
- ESLint disables: 2 matches (scoped and intentional in frontend files).
- `any`/loose typing occurrences: multiple across frontend and pedagogical Python modules; prioritize frontend `utils` + `pages/api` tightening.
- `console.log`/`console.error`: many occurrences in tools/docs and some in frontend runtime code. Remove or sanitize sensitive logs in API handlers.
- TODO/FIXME: 2 TODOs in frontend course tabs (GameTabs/ChallengeTabs) referencing unimplemented backend calls.
- Broad catch blocks: multiple occurrences in tools and frontend; prefer typed `catch (err: unknown)` and a `safeErrorMessage` helper.
- `process.env` usage: found in frontend config and API code; verify secrets handling and `.env` docs.
- Lockfiles & node_modules: repository contains top-level and frontend package-lock.json files; `.gitignore` excludes node_modules.

This file lists selected findings and a CSV (`repo_quality_hits.csv`) is included with the raw hits for easy import.

---

## Selected findings (by category)

### ESLint disables
- `frontend/src/app/page.tsx` — snippet: `{/* eslint-disable react/no-unescaped-entities -- instructional text contains quoted labels */}`
- `frontend/src/components/games/AnimatedArt.tsx` — snippet: `/* eslint-disable @typescript-eslint/no-unused-vars */`

Recommendation: keep scoped disables but add a brief comment of intent where not already present.

### TODO / FIXME
- `frontend/src/course/GameTabs.tsx` — `// TODO: Replace with real API call to backend Cubit executor/visualizer`
- `frontend/src/course/ChallengeTabs.tsx` — `// TODO: Replace with real API call to backend Cubit executor`

Recommendation: create tracked issues and/or mark as deferred in-code with issue reference.

### Broad/unnamed catches
Examples (partial):
- `tools/extract_svg_headless.js` — uses `catch (e) { ... }` in multiple places.
- `tools/screenshot-geometries.js` — multiple `catch (err)` blocks.
- `frontend/src/components/NaturalLanguageInput.tsx` — `catch (err) { ... }`.
- `frontend/src/pages/api/generate-cubit.ts` — uses `catch (error: unknown)` in current code (better).

Recommendation: standardize on `catch (err: unknown)` and use a helper:

```ts
function safeErrorMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  try { return String(e); } catch { return 'Unknown error'; }
}
```

### `console.log` / `console.error`
Selected occurrences (partial):
- `tools/screenshot-geometries.js` — lots of `console.log` for progress (acceptable for tools)
- `tools/ui_smoke_test/puppeteer_smoke_test.js` — `console.log('Launching browser...')` etc.
- `tools/ui_smoke_test/playwright_smoke_test.js` — `console.log('Using base URL:', base)`
- `frontend/src/pages/api/generate-cubit.ts` — several `console.error` lines for missing API key / unexpected upstream responses
- `frontend/src/components/ErrorBoundary.tsx` — `console.error('ErrorBoundary caught an error:', error, errorInfo)`

Recommendation: keep tool logs, but avoid logging secrets or large raw upstream responses in API handlers. Consider a small logger util for sanitized logs.

### `process.env` usage
- `frontend/next.config.ts` — uses `process.env.ANALYZE`.
- `frontend/src/pages/api/generate-cubit.ts` — reads `DEEPSEEK_API_KEY`.
- `frontend/src/utils/api.ts` — reads `NEXT_PUBLIC_API_URL`.

Recommendation: validate required non-public env vars at startup and do not log their values.

### Packaging / lockfiles
- Repo contains `package-lock.json` at top-level and `frontend/package-lock.json`.
- `.gitignore` excludes `frontend/node_modules/`.

Recommendation: decide on single lockfile strategy or document the current approach in README. Ensure no `node_modules` committed.

---

## Raw hits CSV
See `repo_quality_hits.csv` in the repo root for a CSV export of the grep hits (category, file, snippet). Import into a spreadsheet or ticket tracker to triage.

If you want, I can:
- Create a small PR that applies low-risk fixes (convert catches to `unknown`, add `safeErrorMessage`, sanitize logs in API handlers). (recommended)
- Produce a full per-file patch set for stricter typing changes (bigger, riskier).

Tell me which you'd like next.

