# Git Diff Viewer

A full-stack MERN application that displays code differences for any given commit from any open-source GitHub repository.

## Tech Stack

- **Frontend**: React 18, Vite, React Router v6, Vanilla CSS
- **Backend**: Node.js, Express, Axios
- **API**: GitHub REST API v3

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- npm (v9+)
- (Optional) [GitHub Personal Access Token](https://github.com/settings/tokens) for higher rate limits

## Quick Start

### 1. Install dependencies

```bash
npm run install:all
```

### 2. (Optional) Configure GitHub Token

Create/edit `server/.env`:
```env
GITHUB_TOKEN=your_github_personal_access_token
PORT=5000
```

### 3. Run the application

```bash
npm run dev
```

This starts both servers:
- **Frontend**: http://localhost:1234
- **Backend**: http://localhost:5000

### 4. Open in browser

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
| GET | `/repositories/:owner/:repo/commits/:oid` | Get commit metadata |
| GET | `/repositories/:owner/:repo/commits/:oid/diff` | Get commit diff |

## Project Structure

```
gitdiff/
├── server/
│   ├── src/
│   │   ├── index.js              # Express entry point
│   │   ├── routes/commits.js     # API route handlers
│   │   └── services/github.js    # GitHub API integration + diff parser
│   ├── .env                      # Environment config
│   └── package.json
├── client/
│   ├── src/
│   │   ├── main.jsx              # React entry point
│   │   ├── App.jsx               # Router setup
│   │   ├── index.css             # Global styles
│   │   ├── hooks/useCommit.js    # Data fetching hook
│   │   ├── pages/CommitPage.jsx  # Commit page
│   │   └── components/
│   │       ├── CommitHeader.jsx  # Commit metadata display
│   │       ├── DiffViewer.jsx    # File list with diffs
│   │       ├── DiffHunk.jsx      # Individual diff hunk
│   │       └── FileBadge.jsx     # Change type badge
├── SOLUTION.md
├── README.md
└── package.json
```

## Packaging

```bash
npm pack
```

## License

MIT
