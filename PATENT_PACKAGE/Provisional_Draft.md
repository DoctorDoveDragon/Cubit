# Provisional Application Draft — Cubit: Visual-to-Code & Reproducible Export

This provisional draft is intended to capture the best-mode implementations and provide a priority filing package for subsequent attorney refinement. It includes background, a summary, a detailed description of key modules and methods, example inputs/outputs, and references to figures produced in `PATENT_DRAWINGS/`.

1. Field
This disclosure relates to computer-implemented systems and methods for converting interactive visual geometries into executable program representations and for producing reproducible, auditable, patent-ready figure exports from an interactive visual editor.

2. Background
Visual programming and diagrammatic editors have been used to teach programming concepts and to prototype software designs. However, existing systems often suffer from non-deterministic mapping from visuals to program structures, inconsistent exports for legal or archival filings, and lack of auditable provenance. This disclosure addresses these limitations by providing deterministic mapping, canonical serialization, and an automated export pipeline.

3. Summary
Representative embodiments include:
- A deterministic visual-to-code mapping engine that normalizes primitives, establishes canonical ordering, parses relationships, maps primitives to typed templates, and produces an AST and executable output;
- A provenance and audit subsystem that computes cryptographic digests of generated artifacts, timestamps exports, and records software version and inventor metadata;
- A headless extraction and packaging pipeline that triggers client-side exports, collects vector assets, annotates images with captions and watermarks, and composes a filing-ready PDF.

4. Brief Description of the Drawings
- Figure 1 — Example Node (fractal) geometry exported as SVG (see `PATENT_DRAWINGS/Figure_2_Node.png` and corresponding SVGs).
- Figure 2 — Circle, Square, Triangle examples (see `PATENT_DRAWINGS/Figure_3_Circle.png`, etc.).
- Figure 3 — Export pipeline flowchart: UI export → headless extractor → timestamped SVG storage → PDF composition (produced by `tools/svg_to_pdf.js`).

5. Detailed Description

5.1 System Overview
The system comprises a client UI (interactive canvas and control panel), a mapping engine, a provenance generator, and a headless automation toolset. The client UI allows users to draw primitives: circles, squares, triangles, lines, arcs, matrices, and nodes. Each primitive is stored with attributes: type, x, y, size, color, id, and type-specific properties (e.g., rows/cols for matrix).

5.2 Shape Detection & Normalization
On input, the shape detection module collects primitives and attributes, converts screen coordinates to a canonical coordinate space (e.g., fixed viewBox), and optionally snaps to a quantization grid. Normalization includes scaling, translation to origin, and rounding to a fixed number of decimal places to ensure reproducible numeric representations.

5.3 Canonical Ordering
To remove ambiguity in mapping, primitives are given a deterministic ordering computed by a canonicalizer. One embodiment computes keys for each primitive: (yBlock, xBlock, shapePriority, stableUUID) and sorts ascending. shapePriority is a fixed ranking (node > circle > square > triangle > matrix > line > arc). stableUUID is derived from creation timestamp plus a deterministic salt.

5.4 Relationship Parsing
Lines and arcs are parsed by tracing their endpoints; candidate endpoints are matched by nearest-neighbor using Euclidean distance subject to a maximum radius. When multiple candidates exist, the parser applies tie-breakers: smallest distance, then shapePriority, then canonical order.

5.5 Mapping Engine
The mapping engine maps primitives to code templates. Example mapping rules:
- circle → variable/container template
- square → rule/block template (if/for/while skeleton)
- triangle → transformation or assignment template
- matrix → array/grid declaration with rows and cols
Templates use primitive attributes to fill parameters (names, sizes, indices). The mapping engine emits a JSON AST and runs a deterministic template renderer to produce Cubit source code.

5.6 Provenance & Packaging
When exporting, the system computes: AST hash (SHA-256), SVG content hash, software version, and timestamp. These values are written to an accompanying metadata JSON file and optionally embedded as comments in the SVG. The headless extractor saves timestamped SVGs to `PATENT_DRAWINGS/`.

5.7 Headless Extraction & PDF Composition
An automation script (e.g., `tools/extract_svg_headless.js`) launches a headless browser, navigates to the running client UI, triggers export through an exposed in-page variable or simulated click, waits for `window.__lastExportSVG`, and writes the string to disk. A compositor script (`tools/svg_to_pdf.js`) embeds each SVG into a letter-sized HTML page, then prints to a single PDF with consistent margins and DRAFT watermarking as needed.

6. Example
Example: A user draws two circles connected by a line and sets caption "Computational Geometry — Shapes & Mappings" and inventor name. The client normalizes and orders the primitives, maps them to an AST representing two containers and a data flow, renders Cubit code, computes hashes, and the headless tool saves `ComputationalGeometry_Export_<timestamp>.svg` and `Patent_Figures_Letter.pdf`.

7. Best Mode
The best-mode implementation uses the deterministic key ordering described in 5.3, SHA-256 for hashing, Puppeteer for headless extraction, and CSS-based letter page composition for PDF generation. Example code references are in the repository files: `frontend/src/components/games/ComputationalGeometry.tsx`, `tools/extract_svg_headless.js`, `tools/svg_to_pdf.js`, and `tools/make-pdf-from-images.js`.

8. Claims
Insert the claims drafted in `Claims_Draft.md` (representative independent and dependent claims). The provisional should include those claim sketches but an attorney should rephrase into formal claim language for filing.

9. Figures
Include SVG and PNG figures from `PATENT_DRAWINGS/` and the composed `Patent_Figures_Letter.pdf` as attachments.

10. Appendix — Example Code Snippet
(Excerpt adapted from the repository to illustrate the export handshake used by the headless extractor)

```javascript
// exportSVG excerpt (from frontend/src/components/games/ComputationalGeometry.tsx)
const svg = svgParts.join('\n');
// expose on window for automation and also trigger a download
// @ts-ignore
if (typeof window !== 'undefined') {
// @ts-ignore
window.__lastExportSVG = svg;
const blob = new Blob([svg], { type: 'image/svg+xml' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = `${figPart}ComputationalGeometry_Export.svg`;
document.body.appendChild(a);
a.click();
a.remove();
URL.revokeObjectURL(url);
}
```

11. Inventor & Contact
Inventor: A Tuvares Thompson
Phone: 984-305-8004
Mailing address: Billing address on file (202 johnson Branch Rd Goldsboro NC, 27534)
Email: (fathershands@icloud.com)
Assignee: (if applicable, provide assignee name and address)

Signature: _X_Tuvares Thompson____________________    Date: 01-03-2026____________________

Notes: I have inserted the inventor name and phone as requested. Please provide the full postal billing address and an email address to include in the provisional prior to submission to counsel. If you want me to proceed using the billing address you have on file with the project, please confirm and I will update the document and repackage the provisional ZIP.
