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

5. (Optional) Run Storybook for component development and preview:
   ```bash
   npm run storybook
   ```
   Open http://localhost:6006

   Storybook provides:
   - Isolated component development
   - Interactive component documentation
   - Visual testing with example data
   - Stories for ModuleNode, SystemFlowchart, ExecutionTimeline with mock data fallbacks

6. (Optional) Run tests:
   ```bash
   npm run test
   ```
   
   For watch mode during development:
   ```bash
   npm run test:watch
   ```

### Backend API Setup

The code executor requires the Cubit backend API to be running.

1. Navigate to the project root:
   ```bash
   cd ..
   ```

2. Install Python dependencies:
   ```bash
   # From project root
   pip3 install -r requirements.txt
   ```
   
   Required packages:
   - fastapi>=0.109.1
   - uvicorn[standard]>=0.27.0
   - pydantic>=2.5.0

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

### Local Development

Create a `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

**Important:** 
- `.env.local` is excluded from git (see `.env.example` for reference)
- If not specified, the default is `http://localhost:8080`
- After creating/modifying `.env.local`, restart the dev server

### Production Deployment

For production deployments, **you must set `NEXT_PUBLIC_API_URL`** as an environment variable in your hosting platform's dashboard:

```env
NEXT_PUBLIC_API_URL=https://your-backend-api.railway.app
```

⚠️ **Critical:** Environment variables starting with `NEXT_PUBLIC_` must be set at **build time**. After changing this variable, you must trigger a rebuild/redeploy.

## Available Scripts

- `npm run dev` - Start development server (http://localhost:3000)
- `npm run build` - Build for production
- `npm run start` - Start production server (uses standalone mode: `node .next/standalone/frontend/server.js`)
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run storybook` - Start Storybook (http://localhost:6006)
- `npm run build-storybook` - Build Storybook for deployment
- `npm run test` - Run tests once
- `npm run test:watch` - Run tests in watch mode

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── architecture/            # System architecture visualization
│   │   │   ├── page.tsx
│   │   │   └── components/
│   │   │       ├── SystemFlowchart.tsx
│   │   │       ├── ModuleNode.tsx
│   │   │       └── ModuleInspector.tsx
│   │   ├── execution/               # Code execution debugger
│   │   │   ├── page.tsx
│   │   │   └── components/
│   │   │       ├── ExecutionTimeline.tsx
│   │   │       ├── VariableInspector.tsx
│   │   │       └── CallStackView.tsx
│   │   ├── system/                  # System monitoring
│   │   │   ├── page.tsx
│   │   │   └── components/
│   │   │       ├── ApiHealthDashboard.tsx
│   │   │       └── ModuleStatusGrid.tsx
│   │   ├── customize/               # Customization options (placeholder)
│   │   │   └── page.tsx
│   │   ├── page.tsx                 # Main application page
│   │   ├── layout.tsx               # Root layout with navigation
│   │   └── globals.css              # Global styles
│   ├── components/                  # Shared components
│   │   ├── CodeExecutor.tsx         # Code execution component
│   │   ├── CreativeCommandsPanel.tsx
│   │   ├── CommandsPanel.tsx
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── Toast.tsx
│   ├── constants/
│   │   └── examples.ts              # Cubit code examples
│   ├── types/
│   │   └── api.d.ts                 # API type definitions
│   ├── utils/
│   │   ├── api.ts                   # API client functions
│   │   ├── bundleAnalyzer.ts
│   │   └── safeError.ts
│   └── test/
│       └── setup.ts                 # Test setup with MSW
├── .storybook/                      # Storybook configuration
│   ├── main.ts
│   └── preview.ts
├── public/                          # Static assets
├── package.json
├── vitest.config.ts                 # Vitest configuration
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

**📖 For Railway deployment (recommended), see [../RAILWAY.md](../RAILWAY.md) for the complete step-by-step guide.**

The frontend is a Next.js application that can be deployed to various hosting platforms.

### Deployment Platforms

#### Railway (Recommended - Primary Platform)

**Complete Railway deployment guide available in [../RAILWAY.md](../RAILWAY.md)**

Railway supports deploying both backend and frontend from the same repository as separate services.

**Required Configuration:**
- **Root Directory**: `/frontend`
- **Build Command**: `npm run build`
- **Start Command**: `npm run start` (runs `node .next/standalone/server.js` for standalone mode)
- **Node Version**: 18+ (configured in `nixpacks.toml`)

**Environment Variables:**
```env
NEXT_PUBLIC_API_URL=https://your-backend-service.railway.app
```

**Steps:**
1. Create a new Railway service from your GitHub repository
2. Set root directory to `/frontend`
3. Add `NEXT_PUBLIC_API_URL` environment variable pointing to your backend service
4. Deploy (Railway will auto-detect Next.js and use `nixpacks.toml`)
5. After setting environment variables, redeploy to apply changes

#### Vercel (Recommended for Frontend-Only)

**Required Configuration:**
- **Root Directory**: `frontend`
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `.next` (auto-detected)
- **Install Command**: `npm ci` (auto-detected)

**Environment Variables:**
```env
NEXT_PUBLIC_API_URL=https://your-backend-api.example.com
```

**Steps:**
1. Import your GitHub repository
2. Set root directory to `frontend`
3. Add `NEXT_PUBLIC_API_URL` environment variable
4. Deploy

#### Netlify

**Required Configuration:**
- **Base Directory**: `frontend`
- **Build Command**: `npm run build`
- **Publish Directory**: `frontend/.next`

**Environment Variables:**
```env
NEXT_PUBLIC_API_URL=https://your-backend-api.example.com
```

**Steps:**
1. Create a new site from Git
2. Set base directory to `frontend`
3. Configure build settings as above
4. Add `NEXT_PUBLIC_API_URL` environment variable
5. Deploy

### General Deployment Requirements

**Node.js Version:** 18 or higher
- Specified in `frontend/nixpacks.toml` for Railway/Nixpacks
- Configure in your platform's settings for others

**Required Environment Variables:**
- `NEXT_PUBLIC_API_URL` - **REQUIRED** - URL of your backend API (e.g., `https://api.example.com`)

**Build Commands:**
```bash
cd frontend           # Navigate to frontend directory
npm ci                # Install exact versions from package-lock.json
npm run build         # Build production bundle
```

**Start Commands:**
```bash
npm run start         # Start Next.js production server (standalone mode)
```

**Note:** The frontend uses Next.js standalone mode (`output: 'standalone'`), which creates an optimized, self-contained server. The start command runs `node .next/standalone/server.js` instead of `next start`.

### Troubleshooting

#### Build Failures

**Issue: `next: not found` or similar build errors**
- **Cause**: Dependencies not installed or wrong Node version
- **Solution**:
  1. Ensure Node.js 18+ is installed
  2. Run `npm ci` before building
  3. Check platform logs for specific error messages

**Issue: Build succeeds but runtime errors occur**
- **Cause**: Missing or incorrect `NEXT_PUBLIC_API_URL`
- **Solution**:
  1. Verify `NEXT_PUBLIC_API_URL` is set in deployment platform
  2. Ensure the URL starts with `http://` or `https://`
  3. Redeploy after changing environment variables

**Issue: Puppeteer installation fails during CI/deployment**
- **Cause**: Network issues downloading Chrome binary
- **Solution**: Set `PUPPETEER_SKIP_DOWNLOAD=true` environment variable (already configured in GitHub Actions)

#### Production API Connection Issues

**Issue: Frontend shows "Failed to fetch" or "API Disconnected"**
- **Cause**: Frontend cannot reach backend API
- **Solutions**:
  1. Verify `NEXT_PUBLIC_API_URL` points to the correct backend URL
  2. Ensure backend service is running (test with `curl https://your-api/health`)
  3. Check for CORS issues in browser console
  4. Verify backend allows requests from frontend domain
  5. After changing `NEXT_PUBLIC_API_URL`, **rebuild** the frontend

**Issue: API health indicator always shows "Disconnected"**
- **Cause**: Backend `/health` endpoint not accessible
- **Solutions**:
  1. Test endpoint directly: `curl https://your-api/health`
  2. Check backend logs for startup errors
  3. Verify CORS configuration in backend `api.py`
  4. Ensure backend is deployed and running

#### Environment Variable Issues

**Issue: Environment variables not taking effect**
- **Cause**: `NEXT_PUBLIC_` vars must be set at build time
- **Solutions**:
  1. Set variables in deployment platform dashboard
  2. Trigger a **new deployment** after changing variables
  3. Clear build cache if supported by your platform
  4. Verify variables are set in build logs

**Issue: API URL shows as "undefined" or "localhost" in production**
- **Cause**: `NEXT_PUBLIC_API_URL` not set during build
- **Solutions**:
  1. Add variable to deployment platform environment settings
  2. Ensure variable name is exactly `NEXT_PUBLIC_API_URL`
  3. Redeploy to rebuild with new variable

#### CSS/Styling Issues

**Issue: Styles not loading or appearing broken**
- **Cause**: Tailwind CSS not properly configured
- **Solutions**:
  1. Ensure `@import "tailwindcss"` is at the top of `globals.css`
  2. Verify `tailwind.config.js` exists
  3. Clear Next.js cache: `rm -rf .next`
  4. Rebuild: `npm run build`

### Local Testing Before Deployment

Always test the production build locally before deploying:

```bash
cd frontend

# Create .env.local with your API URL
echo "NEXT_PUBLIC_API_URL=http://localhost:8080" > .env.local

# Install dependencies (use PUPPETEER_SKIP_DOWNLOAD if needed)
npm ci

# Test production build
npm run build

# Test production server
npm run start

# Visit http://localhost:3000
```

If the local production build works, deployment should succeed with proper environment configuration.

## Contributing

This is a designer-focused scaffold. To contribute:
1. Maintain existing design token structure
2. Keep components modular and reusable
3. Add stories to Storybook for new components
4. Follow TypeScript best practices
5. Test with both light and dark themes

## License

This project is part of the Cubit programming language repository.

