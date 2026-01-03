# Cubit — Frontend Starter (Designer-focused)

This is a scaffolded frontend starter intended as a modern, designer-friendly UI for the Cubit project.

Features:
- Next.js (App Router) + TypeScript
- Tailwind CSS with CSS variables (design tokens)
- Framer Motion for smooth micro-interactions
- Minimal component set (Header, Sidebar, Card, Button)
- Storybook skeleton for component previews
- Basic interactive commands (Generate description, Export tokens, Open Figma, Toggle theme)

Quickstart:
1. cd frontend
2. npm install
3. npm run dev
4. Open http://localhost:3000
5. Run npm run storybook to preview components in Storybook at http://localhost:6006

Interactive buttons on the app page:
- "Generate description": simulates creating a project description; result appears in the Live preview card.
- "Export tokens": copies CSS token declarations to your clipboard.
- "Open Figma": opens Figma in a new tab (replace with your file link).
- "Toggle theme": switches between light and dark token sets.

Deployment notes:
- This is a client-side-first scaffold; buttons perform client-side actions and require no backend to demonstrate functionality.
- For production, replace placeholder actions (like open Figma) with real endpoints or integration hooks.

If you'd like, I can:
- Add persistent server-backed commands (API endpoints) in the repo.
- Wire the scaffold to the existing Cubit backend API.
- Expand Storybook stories and deploy Storybook to a public preview.

To update the branch or PR, reply with any desired changes.
