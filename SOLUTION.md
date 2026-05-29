# Solution

## Approach & Architecture

### Technology Choices

**MERN Stack (MongoDB-less variant)**
- **Backend**: Node.js + Express — Lightweight, fast, and perfectly suited for a proxy API that transforms GitHub data into our spec format.
- **Frontend**: React 18 + Vite — Vite was chosen over CRA for faster dev builds and HMR. React's component model maps naturally to the UI hierarchy (commit header → file list → hunks → lines).
- **Routing**: React Router v6 — Handles the parameterized `/repositories/:owner/:repository/commit/:commitSHA` route.
- **Styling**: Vanilla CSS with CSS custom properties — Full control over the dark theme design system without framework overhead.
- **HTTP**: Axios (server) + Fetch API (client) — Axios on the server for its robust error handling and interceptors when calling GitHub API. Native Fetch on the client since we're proxying through Vite anyway.

**Why no MongoDB?**
The application is stateless by design — it fetches live data from GitHub on each request. A database would add unnecessary complexity. Caching (if added) would be better served by Redis for its TTL support.

### Architectural Decisions

1. **Proxy Architecture**: The frontend never calls GitHub directly. All requests go through our Express API, which:
   - Transforms GitHub's response format into our documented API spec
   - Handles error translation (rate limits, 404s)
   - Keeps the GitHub token secure on the server
   - Allows future caching without client changes

2. **Unified Diff Parser**: GitHub's API returns `patch` strings in unified diff format. The server parses these into structured hunk/line objects with proper `baseLineNumber` and `headLineNumber` tracking, exactly matching the API spec.

3. **Vite Proxy**: In development, the client proxies `/repositories/*` requests to the backend at port 5000, eliminating CORS issues and simplifying the fetch logic.

4. **Component Architecture**: The UI is decomposed into focused components:
   - `CommitHeader` — Metadata display with glassmorphism design
   - `DiffViewer` → `FileCard` — Collapsible file list
   - `DiffHunk` — Line-by-line diff rendering with a table layout for alignment
   - `FileBadge` — Color-coded change type indicators (A/D/M/R/C)

## Intentional Deviations

- **No MongoDB**: As explained above — the app is purely a passthrough/transformer for GitHub API data.
- **Unified view only (initial)**: Implemented unified diff view as the primary view. Side-by-side can be added as an enhancement.
- **Line number alignment**: Used HTML table layout for diff rendering to ensure base/head line numbers stay perfectly aligned, rather than flexbox or grid.

## Known Limitations

1. **Rate Limiting**: Without a `GITHUB_TOKEN`, the GitHub API allows only 60 requests/hour. Each page load makes 2 API calls (metadata + diff). With a token, the limit is 5000/hour.

2. **Large Diffs**: GitHub's API truncates patches for very large files (>300KB). The app will show "Binary file or no diff available" for these cases.

3. **Binary Files**: Binary files have no `patch` data from GitHub. They show a placeholder message.

4. **No Caching**: Every page load fetches fresh data from GitHub. This is intentional for simplicity but means repeated views re-fetch everything.

5. **No Syntax Highlighting**: Code is displayed in monospaced font with diff coloring (green/red) but without language-specific syntax highlighting.

## What I Would Add With More Time

### 1. Redis Caching (High Priority)
**What**: Cache GitHub API responses with a TTL of 5-10 minutes.
**How**: Use `ioredis` with a cache-aside pattern. Key format: `commit:{owner}:{repo}:{sha}`. Check cache before GitHub API call.
**Why**: Dramatically reduces GitHub API usage, improves response times, and prevents rate limiting issues.

### 2. Syntax Highlighting (High Priority)
**What**: Language-aware code highlighting in diff views.
**How**: Integrate `highlight.js` or `Prism.js` on the client. Detect language from file extension, apply syntax classes to code tokens.
**Why**: Makes diffs much more readable, especially for large files with mixed content.

### 3. Side-by-Side Diff View (Medium Priority)
**What**: Toggle between unified and split-pane diff views.
**How**: Add a view mode toggle in the UI. Create a `SplitDiffView` component that pairs deletion and addition lines side-by-side.
**Why**: Some developers prefer side-by-side for complex changes. GitHub itself offers this option.

### 4. File Tree Sidebar (Medium Priority)
**What**: A collapsible sidebar showing all changed files as a tree structure.
**How**: Group files by directory path, render as a nested tree with expand/collapse. Clicking a file scrolls to its diff.
**Why**: Easier navigation for commits touching many files across different directories.

### 5. Comprehensive Testing (Medium Priority)
**What**: Unit tests for the diff parser, integration tests for API routes, and component tests.
**How**: Jest + Supertest for backend. React Testing Library for frontend. Mock GitHub API responses.
**Why**: Ensures correctness of the diff parsing logic and prevents regressions.

### 6. Error Boundaries & Retry Logic (Low Priority)
**What**: React error boundaries around each file diff, exponential backoff for failed API calls.
**How**: Wrap file cards in error boundaries so one failed render doesn't break the whole page. Add retry with backoff to the `useCommit` hook.
**Why**: Improves resilience for edge cases like malformed patches or temporary GitHub outages.

### 7. URL-based State Management (Low Priority)
**What**: Persist UI state (expanded/collapsed files, view mode) in URL search params.
**How**: Use `useSearchParams` from React Router to encode state.
**Why**: Allows sharing direct links to specific file diffs within a commit.
