# Contributing to Cubit

Thank you for your interest in contributing to Cubit! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Reporting Issues](#reporting-issues)

## Code of Conduct

This project adheres to a code of conduct that all contributors are expected to follow:

- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on what is best for the community
- Show empathy towards other community members

## Getting Started

### Prerequisites

- **Node.js**: Version 20.x (use `.nvmrc` for version management)
- **Python**: Version 3.11 or higher
- **npm**: Comes with Node.js
- **Git**: For version control

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/Cubit.git
   cd Cubit
   ```
3. Add the upstream repository:
   ```bash
   git remote add upstream https://github.com/DoctorDoveDragon/Cubit.git
   ```

## Development Setup

### Automated Setup (Recommended)

**Unix/Linux/Mac:**
```bash
chmod +x setup.sh
./setup.sh
```

**Windows:**
```batch
setup.bat
```

### Manual Setup

1. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Install frontend dependencies:**
   ```bash
   cd frontend
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   # Copy the example environment file
   cp .env.example .env.local
   
   # Edit .env.local with your configuration
   ```

### Docker Development (Alternative)

```bash
# Start both frontend and backend in development mode
docker-compose --profile dev up

# Or use the npm script
cd frontend
npm run docker:dev
```

## Development Workflow

### 1. Create a Branch

Always create a new branch for your work:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-description
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Adding or updating tests
- `chore/` - Maintenance tasks

### 2. Make Your Changes

- Write clean, readable code
- Follow the coding standards (see below)
- Add or update tests as needed
- Update documentation if required

### 3. Test Your Changes

**Backend testing:**
```bash
# Start the backend API
python3 api.py

# Run tests
pytest -q
```

**Frontend testing:**
```bash
cd frontend

# Type checking
npm run type-check

# Linting
npm run lint

# Build verification
npm run build

# Format checking
npm run format:check
```

### 4. Commit Your Changes

Write clear, descriptive commit messages:

```bash
git add .
git commit -m "feat: add new feature X"
```

Commit message format:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

### 5. Keep Your Branch Updated

Regularly sync with the upstream repository:

```bash
git fetch upstream
git rebase upstream/main
```

## Coding Standards

### Python (Backend)

- Follow [PEP 8](https://pep8.org/) style guide
- Use 4 spaces for indentation
- Maximum line length: 120 characters
- Use type hints where appropriate
- Write docstrings for functions and classes

Example:
```python
def execute_code(code: str) -> dict:
    """
    Execute Cubit code and return the result.
    
    Args:
        code: The Cubit source code to execute
        
    Returns:
        A dictionary containing output, result, and error information
    """
    # Implementation
    pass
```

### TypeScript/JavaScript (Frontend)

- Follow the existing code style
- Use TypeScript for type safety
- Use 2 spaces for indentation
- Maximum line length: 100 characters
- Use functional components with hooks
- Prefer named exports over default exports

Example:
```typescript
export function CodeEditor({ initialCode }: CodeEditorProps): JSX.Element {
  const [code, setCode] = useState(initialCode);
  
  // Component logic
  
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

### General Guidelines

- Use meaningful variable and function names
- Keep functions small and focused (single responsibility)
- Add comments for complex logic
- Remove commented-out code and console.logs before committing
- Use EditorConfig for consistent formatting (`.editorconfig` in repo)

## Testing Guidelines

### Backend Tests

- Write tests for new features and bug fixes
- Use pytest for testing
- Place tests in the `tests/` directory
- Test both success and error cases

```python
def test_execute_simple_code():
    result = execute_code("let x = 10\nprint x")
    assert result['output'] == "10\n"
    assert result['error'] is None
```

### Frontend Tests

- Currently, the project doesn't have a comprehensive test suite
- When adding tests, use the testing framework that integrates with Next.js
- Focus on testing user interactions and critical functionality

## Pull Request Process

### Before Submitting

1. **Ensure all tests pass:**
   ```bash
   # Backend
   pytest -q
   
   # Frontend
   cd frontend
   npm run type-check
   npm run lint
   npm run build
   ```

2. **Format your code:**
   ```bash
   cd frontend
   npm run format
   ```

3. **Update documentation** if you've changed functionality

4. **Commit all changes** and push to your fork:
   ```bash
   git push origin your-branch-name
   ```

### Submitting the PR

1. Go to the original Cubit repository on GitHub
2. Click "New Pull Request"
3. Select your fork and branch
4. Fill out the PR template with:
   - **Description**: What changes you made and why
   - **Related Issues**: Link to any related issues (e.g., "Fixes #123")
   - **Screenshots**: If applicable, add screenshots showing the changes
   - **Testing**: Describe how you tested your changes

### PR Review Process

- A maintainer will review your PR
- You may be asked to make changes
- Once approved, your PR will be merged
- Congratulations! 🎉

### PR Guidelines

- Keep PRs focused on a single feature or fix
- Make sure CI/CD checks pass (automated tests, linting, build)
- Respond to feedback promptly
- Be patient - maintainers are volunteers

## Reporting Issues

### Before Reporting

- Search existing issues to avoid duplicates
- Verify the issue exists in the latest version
- Collect relevant information (error messages, screenshots, steps to reproduce)

### Creating an Issue

Use the GitHub issue tracker and include:

1. **Clear title** describing the issue
2. **Description** with:
   - What you expected to happen
   - What actually happened
   - Steps to reproduce
   - Environment details (OS, Node.js version, browser, etc.)
3. **Screenshots or error logs** if applicable
4. **Possible solution** if you have one

### Issue Labels

- `bug` - Something isn't working
- `enhancement` - New feature request
- `documentation` - Documentation improvements
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed

## Getting Help

- **Documentation**: Check the [README.md](README.md) and other docs
- **Issues**: Browse existing issues or create a new one
- **Discussions**: Use GitHub Discussions for questions and ideas

## Recognition

Contributors will be recognized in:
- The project's GitHub contributors list
- Release notes (for significant contributions)

Thank you for contributing to Cubit! Your efforts help make this project better for everyone. 🚀
