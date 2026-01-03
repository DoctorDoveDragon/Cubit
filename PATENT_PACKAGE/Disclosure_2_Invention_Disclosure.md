# Invention Disclosure — Concept B: Reproducible Export & Audit Pipeline

Field of Invention
Computer-implemented systems and methods for producing auditable, patent-ready figure exports from an interactive visual editor, including metadata, watermarking, and deterministic packaging for legal filings.

Problem
Legal and procedural uses (e.g., provisional patent filings) require reproducible, timestamped figures and provenance. Manual exports are error-prone and may not produce consistent, verifiable artifacts.

Summary of Solution
An automated export pipeline that: (1) allows UI control of caption, figure number, inventor metadata; (2) exposes the vector export via an in-page variable for headless extraction; (3) includes a headless tool that triggers the UI export, captures the SVG, timestamps and saves it; and (4) assembles the final PDF with consistent layout and DRAFT watermarking.

Key Steps / Implementation
- UI controls added to `ComputationalGeometry` for caption, scale, figure number, caption font size/color, and inventor name.
- `exportSVG()` writes the SVG string to `window.__lastExportSVG` and triggers a download when running in a browser.
- `tools/extract_svg_headless.js` opens the running frontend, triggers the export, waits for the SVG, and saves a timestamped file to `PATENT_DRAWINGS/`.
- `tools/svg_to_pdf.js` (added) composes the SVGs into a single 8.5x11 PDF for filing.

Evidence & Artifacts
- Timestamped SVGs: `PATENT_DRAWINGS/ComputationalGeometry_Export_*.svg`.
- Automated headless extractor: `tools/extract_svg_headless.js`.
- Combined PDF generator: `tools/svg_to_pdf.js` (this script).
