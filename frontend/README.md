# Cubit — Frontend Interactive Playground

This is a modern, designer-friendly UI for the Cubit programming language with a fully functional code executor and creative command panel.

## Features

### Core Components
- Next.js (App Router) + TypeScript
- Tailwind CSS with CSS variables (design tokens)
- Framer Motion for smooth micro-interactions
- Component library (Header, Sidebar, Card, Button, Toast)
- Storybook skeleton for component previews

### Code Execution
- **CodeExecutor Component**: Interactive code editor with syntax highlighting
- **Live Code Execution**: Run Cubit code via backend API
- **Example Snippets**: Quick-load examples (Hello World, Fibonacci, Variables, Conditionals, Loops)
- **Real-time Output**: Display standard output, result values, and error messages
- **Loading States**: Visual feedback during code execution

### Creative Commands Panel
Organized into 4 categories with 20+ commands:

#### 🧠 AI & Code Generation
- Generate Function - AI suggests functions from descriptions
- Refactor Code - Code improvement suggestions
- Write Tests - Unit test generation
- Explain Code - AI code explanations
- Optimize - Performance optimization tips

#### 🎨 Design & Theming
- Generate Color Palette - Cohesive color schemes
- Theme Wizard - Step-by-step theme creator
- Add Animations - Framer Motion suggestions
- Design Trends - Glassmorphism, neumorphism, etc.
- Accessibility Check - A11y compliance scanning

#### 🚀 Workflow & Productivity
- Deploy Preview - Deployment simulation
- Export Package - Bundle components as NPM package
- Share Playground - Generate shareable links
- Screenshot Gallery - Capture component screenshots
- Record Demo - Screen recording simulation

#### 🔍 Code Intelligence
- Debug Assistant - Error analysis and fixes
- Bundle Analyzer - Size breakdown visualization
- Security Scan - Vulnerability checking
- Performance Audit - Lighthouse-style metrics
- Code Complexity - Cyclomatic complexity analysis

## Getting Started

### Prerequisites
- Node.js 18+ installed
- Python 3.8+ (for backend API)

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open http://localhost:3000 in your browser

5. (Optional) Run Storybook for component previews:
   ```bash
   npm run storybook
   ```
   Open http://localhost:6006

### Backend API Setup

The code executor requires the Cubit backend API to be running.

1. Navigate to the project root:
   ```bash
   cd ..
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Start the API server:
   ```bash
   python api.py
   ```

The API server runs on http://localhost:8080 by default.

## Usage

### Code Executor

1. **Select an Example**: Choose from the dropdown menu (Hello World, Fibonacci, etc.)
2. **Edit Code**: Modify the code in the editor textarea
3. **Run Code**: Click the "Run Code" button
4. **View Results**: See output, results, and any errors displayed below

### Creative Commands

1. **Toggle Panel**: Click "Show Creative Commands" to expand the panel
2. **Browse Categories**: Click category headers to expand/collapse sections
3. **Execute Commands**: Click any command button to trigger its action
4. **View Results**: Commands show toast notifications, modals, or download files

### Original Design Commands

- **Generate description**: Simulates creating content from a prompt
- **Export tokens**: Copies CSS tokens to clipboard
- **Open Figma**: Opens Figma in a new tab
- **Toggle theme**: Switches between light and dark themes

## API Configuration

The frontend connects to the backend API via the `NEXT_PUBLIC_API_URL` environment variable.

Create a `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

Default is `http://localhost:8080` if not specified.

## Available Scripts

- `npm run dev` - Start development server (http://localhost:3000)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run storybook` - Start Storybook (http://localhost:6006)
- `npm run build-storybook` - Build Storybook for deployment

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Main application page
│   │   ├── layout.tsx        # Root layout
│   │   └── globals.css       # Global styles
│   ├── components/
│   │   ├── CodeExecutor.tsx          # Code execution component
│   │   ├── CreativeCommandsPanel.tsx # Creative commands panel
│   │   ├── CommandsPanel.tsx         # Original commands
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── Toast.tsx
│   ├── constants/
│   │   └── examples.ts       # Cubit code examples
│   └── utils/
│       └── api.ts            # API client functions
├── public/                   # Static assets
├── package.json
└── README.md
```

## Design Guidelines

- **Consistent Styling**: Uses Tailwind CSS with CSS variables for theming
- **Dark Theme Optimized**: Primary dark theme with light theme toggle
- **Accessibility**: ARIA labels and keyboard navigation support
- **Responsive Design**: Mobile-first approach with breakpoints
- **Performance**: Optimized animations and lazy loading

## Technology Stack

- **Framework**: Next.js 16.1.1 (App Router)
- **UI Library**: React 19.2.3
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion 12.23.26
- **Language**: TypeScript 5
- **Dev Tools**: ESLint, Storybook

## Deployment

The frontend is a static Next.js app that can be deployed to:
- Vercel (recommended)
- Netlify
- GitHub Pages
- Any static hosting service

For production deployment:
1. Update `NEXT_PUBLIC_API_URL` to point to your production API
2. Run `npm run build`
3. Deploy the `.next` directory

## Contributing

This is a designer-focused scaffold. To contribute:
1. Maintain existing design token structure
2. Keep components modular and reusable
3. Add stories to Storybook for new components
4. Follow TypeScript best practices
5. Test with both light and dark themes

## License

This project is part of the Cubit programming language repository.

