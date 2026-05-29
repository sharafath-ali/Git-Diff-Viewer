# Git Diff Viewer

A full-stack web application that displays code differences for any given commit from any open-source GitHub repository. Features a premium landing page with a navigation form so you can explore any commit without constructing URLs manually.

## Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Frontend | React 18, Vite, React Router v6, Vanilla CSS |
| Backend  | Node.js, Express, Axios             |
| API      | GitHub REST API v3                  |
| Proxy    | Vite dev proxy (eliminates CORS)    |

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- npm v9 or later
- (Optional but **recommended**) [GitHub Personal Access Token](https://github.com/settings/tokens)

## Quick Start

### 1. Install dependencies

```bash
npm run install:all
```

### 2. Configure GitHub Token (optional but recommended)

Without a token the GitHub API is limited to **60 req/hour**. With one you get **5 000 req/hour**.

Edit `server/.env`:

```env
GITHUB_TOKEN=your_github_personal_access_token
PORT=5000
```

### 3. Start both servers

```bash
npm run dev
```

This starts:

| Service  | URL                          |
|----------|------------------------------|
| Frontend | http://localhost:1234        |
| Backend  | http://localhost:5000        |

### 4. Use the app

Open **http://localhost:1234** in your browser.

**Option A — Navigation form (recommended)**  
Use the form on the landing page: enter a GitHub **owner**, **repository**, and full 40-character **commit SHA**, then click *View Diff*.

**Option B — Direct URL**  
Navigate to:
```
http://localhost:1234/repositories/:owner/:repository/commit/:commitSHA
```

Example:
```
http://localhost:1234/repositories/golemfactory/clay/commit/a1bf367b3af680b1182cc52bb77ba095764a11f9
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/repositories/:owner/:repo/commits/:oid` | Commit metadata |
| `GET` | `/api/repositories/:owner/:repo/commits/:oid/diff` | Parsed diff |

## Project Structure

```
gitdiff/
├── server/
│   ├── src/
│   │   ├── index.js              # Express entry point
│   │   ├── routes/commits.js     # API route handlers
│   │   └── services/github.js    # GitHub API + diff parser
│   ├── .env                      # Environment config (add GITHUB_TOKEN here)
│   └── package.json
├── client/
│   ├── src/
│   │   ├── main.jsx              # React entry point
│   │   ├── App.jsx               # Router + landing page
│   │   ├── index.css             # Global design system
│   │   ├── hooks/useCommit.js    # Data fetching hook
│   │   ├── pages/CommitPage.jsx  # Commit diff page
│   │   └── components/
│   │       ├── NavigateForm.jsx  # Landing page navigation form
│   │       ├── CommitHeader.jsx  # Commit metadata display
│   │       ├── DiffViewer.jsx    # Collapsible file list
│   │       ├── DiffHunk.jsx      # Unified diff hunk
│   │       └── FileBadge.jsx     # Change type badge (A/M/D/R/C)
│   ├── index.html
│   ├── vite.config.js            # Vite + dev proxy config
│   └── package.json
├── SOLUTION.md                   # Architecture notes & trade-offs
├── README.md
└── package.json                  # Root workspace scripts
```

## Packaging

```bash
npm pack
```

This creates a `.tgz` archive excluding `node_modules` (via `.gitignore`/`npmignore`).

## License

MIT
