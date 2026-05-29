import { useState } from 'react';

function CommitHeader({ commit, owner, repository }) {
  const [copied, setCopied] = useState(false);

  const shortSHA = commit.oid.substring(0, 7);
  const commitDate = new Date(commit.author.date);
  const relativeDate = getRelativeTime(commitDate);

  // Split message into subject and body
  const messageParts = commit.message.split('\n');
  const subject = messageParts[0];
  const body = messageParts.slice(1).join('\n').trim();

  const [showFullMessage, setShowFullMessage] = useState(false);

  function handleCopySHA() {
    navigator.clipboard.writeText(commit.oid).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="commit-header" id="commit-header">
      <div className="commit-header-top">
        <div className="commit-message-section">
          <h1 className="commit-subject" id="commit-subject">{subject}</h1>
          {body && (
            <>
              <button
                className="toggle-message-btn"
                onClick={() => setShowFullMessage(!showFullMessage)}
                id="toggle-message-btn"
              >
                {showFullMessage ? '▲ Hide details' : '▼ Show details'}
              </button>
              {showFullMessage && (
                <pre className="commit-body" id="commit-body">{body}</pre>
              )}
            </>
          )}
        </div>
      </div>

      <div className="commit-meta">
        <div className="commit-author-section">
          {commit.avatarUrl && (
            <img
              src={commit.avatarUrl}
              alt={commit.author.name}
              className="author-avatar"
              id="author-avatar"
            />
          )}
          {!commit.avatarUrl && (
            <div className="author-avatar-placeholder" id="author-avatar-placeholder">
              {commit.author.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="author-info">
            <span className="author-name" id="author-name">{commit.author.name}</span>
            <span className="author-email">{commit.author.email}</span>
          </div>
        </div>

        <div className="commit-details">
          <div className="commit-sha-row">
            <span className="detail-label">Commit</span>
            <button
              className="sha-badge"
              onClick={handleCopySHA}
              title="Click to copy full SHA"
              id="sha-badge"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              <code>{shortSHA}</code>
              {copied && <span className="copied-tooltip">Copied!</span>}
            </button>
          </div>

          <div className="commit-date-row">
            <span className="detail-label">Committed</span>
            <time
              dateTime={commit.author.date}
              title={commitDate.toLocaleString()}
              className="commit-date"
              id="commit-date"
            >
              {relativeDate}
            </time>
          </div>

          {commit.parents && commit.parents.length > 0 && (
            <div className="commit-parents-row">
              <span className="detail-label">Parent{commit.parents.length > 1 ? 's' : ''}</span>
              <div className="parent-shas">
                {commit.parents.map((parent) => (
                  <a
                    key={parent.oid}
                    href={`/repositories/${owner}/${repository}/commit/${parent.oid}`}
                    className="parent-sha-link"
                  >
                    <code>{parent.oid.substring(0, 7)}</code>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getRelativeTime(date) {
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

  if (diffYear > 0) return `${diffYear} year${diffYear > 1 ? 's' : ''} ago`;
  if (diffMonth > 0) return `${diffMonth} month${diffMonth > 1 ? 's' : ''} ago`;
  if (diffDay > 0) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
  if (diffHour > 0) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
  if (diffMin > 0) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
  return 'just now';
}

export default CommitHeader;
