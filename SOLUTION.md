# Solution

## Approach & Architecture

### Technology Choices

**Full-Stack JavaScript (Node.js + React)**
- **Backend**: Node.js + Express — Lightweight, fast, and perfectly suited for a proxy API that transforms GitHub data into our spec format.
- **Frontend**: React 18 + Vite — Vite was chosen over CRA for faster dev builds and HMR. React's component model maps naturally to the UI hierarchy (landing → commit header → file list → hunks → lines).
- **Routing**: React Router v6 — Handles the parameterized `/repositories/:owner/:repository/commit/:commitSHA` route with proper client-side navigation.
- **Styling**: Vanilla CSS with CSS custom properties — Full control over the premium design system without framework overhead.
- **HTTP**: Axios (server) + Fetch API (client) — Axios on the server for its robust error handling; native Fetch on the client through the Vite proxy.

**Why no MongoDB?**
The application is stateless by design — it fetches live data from GitHub on each request. A database would add unnecessary complexity. Caching (if added) would be better served by Redis for its TTL support.

### Architectural Decisions

1. **Proxy Architecture**: The frontend never calls GitHub directly. All requests go through our Express API, which:
   - Transforms GitHub's response format into our documented API spec
   - Handles error translation (rate limits, 404s)
   - Keeps the GitHub token secure on the server
   - Allows future caching without client changes

2. **Vite Proxy**: In development, Vite proxies `/repositories/*` requests to the Express backend at port 5000. This eliminates CORS issues, simplifies the fetch logic, and mirrors how a reverse-proxy (nginx) would work in production.

3. **Unified Diff Parser**: GitHub's API returns `patch` strings in unified diff format. The server parses these into structured hunk/line objects with proper `baseLineNumber` and `headLineNumber` tracking, exactly matching the API spec.

4. **Navigation Form**: In addition to direct URL navigation (`/repositories/:owner/:repo/commit/:sha`), a user-friendly form on the landing page allows users to enter owner, repository, and full 40-character commit SHA with client-side validation. This reduces friction and removes the need to manually type long SHA strings in the browser address bar. Example commits are provided for instant exploration.

5. **Component Architecture**: The UI is decomposed into focused components:
   - `NavigateForm` — Landing page form with validation and example commit shortcuts
   - `CommitHeader` — Metadata display with click-to-copy SHA
   - `DiffViewer` → `FileCard` — Collapsible file list with change badges
   - `DiffHunk` — Line-by-line diff rendering with table layout for alignment
   - `FileBadge` — Color-coded change type indicators (A/D/M/R/C)

## Intentional Deviations

- **No MongoDB**: The app is purely a passthrough/transformer for GitHub API data. No persistence needed.
- **Navigation form added**: Beyond the spec requirement, a form was added so users don't need to craft URLs manually. This significantly improves real-world usability.
- **Unified view only (initial)**: Implemented unified diff view as the primary view. Side-by-side can be added as an enhancement.
- **Line number alignment**: Used HTML table layout for diff rendering to ensure base/head line numbers stay perfectly aligned.
- **Parent SHA truncated**: Parent commit SHAs are shown as 7-character short SHAs (industry standard, matching GitHub's UI) rather than the full 40 characters for readability.

## Known Limitations

1. **Rate Limiting**: Without a `GITHUB_TOKEN`, the GitHub API allows only 60 requests/hour. Each page load makes 2 API calls (metadata + diff). With a token, the limit is 5,000/hour.

2. **Large Diffs**: GitHub's API truncates patches for very large files (>300KB). The app will show "Binary file or no diff available" for these cases.

3. **Binary Files**: Binary files have no `patch` data from GitHub. They show a placeholder message.

4. **No Caching**: Every page load fetches fresh data from GitHub. This is intentional for simplicity but means repeated views re-fetch everything.

5. **No Syntax Highlighting**: Code is displayed in monospaced font with diff coloring (green/red) but without language-specific syntax highlighting.

6. **Full SHA Required**: The navigation form requires the full 40-character commit SHA. GitHub also supports shorter prefixes in their web UI, but the backend validates for the full SHA to ensure correctness.

## What I Would Add With More Time

### 1. Redis Caching (High Priority)
**What**: Cache GitHub API responses with a TTL of 5–10 minutes.
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

