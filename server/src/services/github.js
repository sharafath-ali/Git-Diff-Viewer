const axios = require('axios');

const GITHUB_API_BASE = 'https://api.github.com';

/**
 * Create an Axios instance with optional GitHub token authentication.
 */
function createGitHubClient() {
  const headers = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'git-diff-viewer',
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `token ${process.env.GITHUB_TOKEN}`;
  }

  return axios.create({
    baseURL: GITHUB_API_BASE,
    headers,
    timeout: 15000,
  });
}

const githubClient = createGitHubClient();

/**
 * Fetch commit metadata from GitHub API.
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {string} sha - Commit SHA (40 hex chars)
 * @returns {Object} Commit metadata matching the API spec
 */
async function getCommit(owner, repo, sha) {
  const response = await githubClient.get(
    `/repos/${owner}/${repo}/commits/${sha}`
  );

  const data = response.data;
  const commit = data.commit;

  return {
    oid: data.sha,
    message: commit.message,
    author: {
      name: commit.author.name,
      date: commit.author.date,
      email: commit.author.email,
    },
    committer: {
      name: commit.committer.name,
      date: commit.committer.date,
      email: commit.committer.email,
    },
    parents: (data.parents || []).map((p) => ({ oid: p.sha })),
    avatarUrl: data.author ? data.author.avatar_url : null,
  };
}

/**
 * Fetch commit diff from GitHub API and parse the unified diff patches.
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {string} sha - Commit SHA
 * @returns {Array} Array of file diffs with hunks matching the API spec
 */
async function getCommitDiff(owner, repo, sha) {
  const response = await githubClient.get(
    `/repos/${owner}/${repo}/commits/${sha}`
  );

  const files = response.data.files || [];

  return files.map((file) => {
    const changeKind = mapStatusToChangeKind(file.status);

    return {
      changeKind,
      headFile: {
        path: file.filename,
      },
      baseFile: {
        path: file.previous_filename || file.filename,
      },
      hunks: file.patch ? parsePatch(file.patch) : [],
      additions: file.additions,
      deletions: file.deletions,
      changes: file.changes,
    };
  });
}

/**
 * Map GitHub's file status to the changeKind enum from our API spec.
 */
function mapStatusToChangeKind(status) {
  const mapping = {
    added: 'ADDED',
    removed: 'DELETED',
    modified: 'MODIFIED',
    renamed: 'RENAMED',
    copied: 'COPIED',
    changed: 'MODIFIED',
    unchanged: 'MODIFIED',
  };
  return mapping[status] || 'MODIFIED';
}

/**
 * Parse a unified diff patch string into an array of hunks.
 * Each hunk contains a header and an array of lines with line numbers.
 */
function parsePatch(patch) {
  if (!patch) return [];

  const lines = patch.split('\n');
  const hunks = [];
  let currentHunk = null;
  let baseLine = 0;
  let headLine = 0;

  for (const line of lines) {
    // Match hunk header: @@ -a,b +c,d @@ optional context
    const hunkMatch = line.match(
      /^@@\s+-(\d+)(?:,(\d+))?\s+\+(\d+)(?:,(\d+))?\s+@@(.*)$/
    );

    if (hunkMatch) {
      if (currentHunk) {
        hunks.push(currentHunk);
      }

      baseLine = parseInt(hunkMatch[1], 10);
      headLine = parseInt(hunkMatch[3], 10);

      currentHunk = {
        header: line,
        lines: [],
      };
      continue;
    }

    if (!currentHunk) continue;

    if (line.startsWith('-')) {
      // Deletion: only base line number
      currentHunk.lines.push({
        baseLineNumber: baseLine,
        headLineNumber: null,
        content: '-' + line.substring(1),
      });
      baseLine++;
    } else if (line.startsWith('+')) {
      // Addition: only head line number
      currentHunk.lines.push({
        baseLineNumber: null,
        headLineNumber: headLine,
        content: '+' + line.substring(1),
      });
      headLine++;
    } else if (line.startsWith('\\')) {
      // "No newline at end of file" - skip or add as info
      currentHunk.lines.push({
        baseLineNumber: null,
        headLineNumber: null,
        content: line,
      });
    } else {
      // Context line: both line numbers
      currentHunk.lines.push({
        baseLineNumber: baseLine,
        headLineNumber: headLine,
        content: ' ' + line.substring(1),
      });
      baseLine++;
      headLine++;
    }
  }

  if (currentHunk) {
    hunks.push(currentHunk);
  }

  return hunks;
}

module.exports = {
  getCommit,
  getCommitDiff,
};
