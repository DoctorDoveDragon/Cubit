PATENT_PACKAGE — Cubit provisional filing contents

Files included:
- Provisional_Draft.md — Draft provisional application (narrative, figures references, example code)
- (optional) Figures should be added to PATENT_DRAWINGS/ and referenced here

How to reproduce software artifacts:
1. From repo root:
   - Install dependencies for frontend: cd frontend && npm install
   - Build and run locally: npm run dev (development) or npm run build && npm start (production)
2. To capture figures headlessly:
   - Ensure the frontend dev server is running on http://localhost:3000
   - Run tools/ui_smoke_test/puppeteer_smoke_test.js to capture canvas screenshots and SVG exports.

Metadata to include before filing:
- Commit SHA: (include current commit)
- Software version and package-lock.json
- Hashes of exported SVG/PNG files (SHA-256)

Notes:
- This package is a convenience bundle for provisional filings. Please consult counsel to prepare formal claims and add any required inventor/assignee details.
