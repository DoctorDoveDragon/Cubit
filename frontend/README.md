# Cubit — Frontend Starter (Code-first, Designer-focused)

This is a scaffolded frontend starter intended as a modern, code-first designer/developer-friendly UI for the Cubit project.

Features:
- Next.js (App Router) + TypeScript
- Tailwind CSS with CSS variables (design tokens)
- Framer Motion for smooth micro-interactions
- Minimal component set (Header, Sidebar, Card, Button)
- Storybook skeleton for component previews
- Basic interactive commands (Generate description, Export tokens, Copy component, Toggle theme)

Quickstart:
1. cd frontend
2. npm install
3. npm run dev
4. Open http://localhost:3000
5. Run npm run storybook to preview components in Storybook at http://localhost:6006

Code-first interactive buttons on the app page:
- "Generate description": simulates creating a project description; result appears in the Live preview card.
- "Export tokens": copies a JSON representation of the CSS tokens to your clipboard and downloads tokens.json.
- "Copy component": copies a simple TypeScript React component (TSX) to the clipboard so you can paste it into your project.
- "Toggle theme": switches between light and dark token sets.

Developer notes:
- All interactive actions are client-side and require no backend to demonstrate functionality.
- Replace or extend the example "Copy component" snippet with your preferred components or story templates.
- For production features (server-side generation or integration with design systems), wire the UI to backend APIs or CI/CD flows.

If you want additional code-first commands (e.g., export Storybook story, download component .tsx file, copy CSS vars only), reply with the desired button(s) and I will add them.
