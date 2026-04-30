# MyDashboard - Copilot Instructions

## Project Overview
MyDashboard is a React web application built with **Create React App (CRA)** using React 19.2.5. It's a modern dashboard frontend project focusing on clean component architecture and comprehensive testing.

**Stack:** React 19.2.5 | React DOM 19.2.5 | Testing Library | Jest | react-scripts 5.0.1

---

## Quick Start

### Core Commands
- **Start development server:** `npm start` → Opens http://localhost:3000 with hot reload
- **Run tests:** `npm test` → Jest test runner in watch mode (interactive mode by default)
- **Build for production:** `npm run build` → Creates optimized build in `/build` folder
- **Eject configuration:** `npm run eject` → ⚠️ One-way operation; exposes webpack/Babel config (avoid unless necessary)

### Testing
- Test files use naming convention: `*.test.js` or `*.spec.js`
- Run specific test: `npm test -- App.test.js`
- Stop watch mode: Press `q` in test runner
- No snapshot tests currently; focus on behavioral assertions

---

## Project Structure

```
src/
├── App.js              # Root component (main entry point)
├── App.css             # App-level styles
├── App.test.js         # App component tests
├── index.js            # React DOM render entry point
├── index.css           # Global styles
├── logo.svg            # Logo asset
├── reportWebVitals.js  # Web vitals measurement
└── setupTests.js       # Jest test configuration
```

### Key Conventions
- **Components:** Functional components using hooks (no class components)
- **Styling:** CSS modules or plain CSS (currently using CSS imports)
- **Testing:** React Testing Library preferred over Enzyme (already configured via CRA)
- **Assets:** Place in `src/` and import directly (webpack handles bundling)

---

## Development Conventions

### Component Standards
1. **Functional Components Only** – All components must be functional components with hooks
2. **Props Interface** – Document props with JSDoc comments:
   ```javascript
   /**
    * Component description
    * @param {Object} props
    * @param {string} props.title - Display title
    * @param {Function} props.onSubmit - Callback handler
    */
   ```
3. **Export Pattern** – Export default at component level:
   ```javascript
   function MyComponent() { ... }
   export default MyComponent;
   ```

### Testing Conventions
- Test files located in `src/` alongside components
- Use React Testing Library queries (prefer `getByRole`, `getByLabelText` over `getByTestId`)
- Test behavior, not implementation details
- Mock external dependencies; avoid testing third-party libraries

**Example test pattern:**
```javascript
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const link = screen.getByRole('link', { name: /learn react/i });
  expect(link).toBeInTheDocument();
});
```

### CSS Organization
- Component styles in same directory as component (e.g., `App.css` with `App.js`)
- Global styles in `index.css`
- Avoid inline styles; use CSS classes
- No CSS-in-JS libraries currently (use standard CSS if adding new styling)

---

## ESLint Configuration
Project extends `react-app` and `react-app/jest` configs (provided by CRA). No custom ESLint rules currently configured. Run linting via `npm test` or IDE integration.

---

## Common Tasks

### Add a New Component
1. Create `.js` file in `src/` (or subdirectory)
2. Use functional component pattern
3. Create `.test.js` file alongside with basic tests
4. Import in parent component or App.js

### Add Dependencies
- Use `npm install <package>` (not yarn; project uses npm)
- Update only dependencies needed; CRA optimizes tree-shaking
- Avoid ejecting if possible; file issues against CRA for blockers

### Debugging
- Use browser DevTools (F12) with React DevTools extension enabled
- Chrome DevTools Profiler available in development mode
- Check console for warnings/errors
- Use `console.log` or debugger statements (breakpoints in dev tools)

### Build Issues
- Clear node_modules and reinstall: `rm -r node_modules && npm install` (or `rmdir /s node_modules` on Windows)
- Clear cache: Delete `.eslintcache` if linting errors persist
- Check Node.js version: Ensure Node 14+ installed
- Windows users: May need to use `npm run build` from PowerShell if cmd fails

---

## AI Agent Guidelines

### When Making Changes
1. **Always run tests first** – `npm test` to catch regressions
2. **Verify exports** – Ensure components are properly exported before referencing
3. **Consider component composition** – Break large components into smaller, testable units
4. **Check dependencies** – Verify new imports exist before using them
5. **Test in dev mode** – `npm start` and manually verify UI/UX

### File Modification Patterns
- Use `.test.js` suffix consistently for test files
- Keep component and test file names matching exactly
- Avoid renaming files without updating imports across the codebase
- Use relative paths for local imports (`./Component` not `/src/Component`)

### Common Pitfalls
- **Hot reload delays:** If changes don't reflect, check browser cache or restart dev server
- **Import errors:** Verify file exists and exports are correct before running code
- **Test failures:** Clear Jest cache with `npm test -- --clearCache` if odd test behavior occurs
- **Package conflicts:** CRA pins specific versions; avoid manual version bumps in package-lock.json

---

## Performance & Best Practices

### React Performance
- Use React.memo for expensive components that receive stable props
- Leverage lazy loading with React.lazy() for code splitting
- Consider useCallback and useMemo carefully (avoid premature optimization)

### Bundle Optimization
- CRA handles tree-shaking automatically; trust the build
- Analyze bundle: Create build and use tools like `source-map-explorer`
- Avoid large monolithic components; split into reusable pieces

---

## Resources

- [Create React App Docs](https://create-react-app.dev/)
- [React 19 Docs](https://react.dev/)
- [Testing Library Docs](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest Docs](https://jestjs.io/)

---

## Next Steps (Suggestions)

- Establish folder structure for components (e.g., `src/components/`, `src/pages/`) as project grows
- Add environment variables via `.env` file (CRA supports with `REACT_APP_` prefix)
- Consider adding type safety (TypeScript) for larger projects
- Set up CI/CD pipeline (GitHub Actions recommended)
- Add pre-commit hooks (husky + lint-staged) for code quality

---

## Agent Bootstrap

- **Project scripts:** See [package.json](package.json) for `start`, `test`, and `build` scripts.
- **Key files:** Routing in [src/routes/AppRoutes.js](src/routes/AppRoutes.js), layout in [src/layouts/AppLayout.js](src/layouts/AppLayout.js), context in [src/context/AppContext.js](src/context/AppContext.js).
- **Tests:** Test setup in [src/setupTests.js](src/setupTests.js); example tests in [src/App.test.js](src/App.test.js).

## Agent Quick Prompts (examples)

- "Run the test suite and report failures." — runs `npm test` and summarizes failures.
- "Add a new component `X` with tests." — scaffolds `src/components/X.js` and `src/components/X.test.js` following project conventions.
- "Refactor `WorkerProfilePage` to extract a subcomponent." — suggests and implements a small refactor with accompanying tests.

## Suggested Agent Customizations

- Create an agent instruction for frontend tasks that prioritizes: run tests, lint, update components, and open a PR draft.
- Add an `applyTo` rule for `src/pages/**` to provide page-specific guidance when editing files.

If you'd like, I can generate the example prompts as ready-to-use agent prompts or scaffold the suggested agent customization files.

