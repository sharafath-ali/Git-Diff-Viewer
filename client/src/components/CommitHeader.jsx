import { useState } from 'react';
import { Link } from 'react-router-dom';

function CommitHeader({ commit, owner, repository }) {
  const [copied, setCopied] = useState(false);

  // Split message into subject and body
  const messageParts = commit.message.split('\n');
  const subject = messageParts[0];
  const body = messageParts.slice(1).join('\n').trim();

  const commitDate = new Date(commit.author.date);
  const authorRelative = getRelativeTime(commitDate);

  // Committer info (may differ from author)
  const committerName = commit.committer?.name || commit.author.name;
  const committerDate = commit.committer?.date
    ? new Date(commit.committer.date)
    : commitDate;
  const committerRelative = getRelativeTime(committerDate);
  const showCommitter = committerName !== commit.author.name;

  function handleCopySHA() {
    navigator.clipboard.writeText(commit.oid).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="commit-header" id="commit-header">
      {/* Avatar column */}
      <div className="commit-avatar-col">
        {commit.avatarUrl ? (
          <img
            src={commit.avatarUrl}
            alt={commit.author.name}
            className="author-avatar"
            id="author-avatar"
          />
        ) : (
          <div className="author-avatar-placeholder" id="author-avatar-placeholder">
            {commit.author.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* Main column: subject + author + body */}
      <div className="commit-main-col">
        <h1 className="commit-subject" id="commit-subject">
          {subject}
        </h1>
        <p className="commit-author-line">
          Authored by <strong>{commit.author.name}</strong> {authorRelative}
        </p>
        {body && (
          <p className="commit-body-text" id="commit-body">
            {body}
          </p>
        )}
      </div>

      {/* Right column: committer + commit hash + parent */}
      <div className="commit-right-col">
        {showCommitter && (
          <p className="commit-committer-line">
            Committed by <strong>{committerName}</strong> {committerRelative}
          </p>
        )}
        {!showCommitter && (
          <p className="commit-committer-line">
            Committed by <strong>{committerName}</strong> {committerRelative}
          </p>
        )}

        <div className="commit-sha-row">
          <span className="commit-sha-label">Commit</span>
          <span
            className="commit-sha-hash"
            onClick={handleCopySHA}
            title="Click to copy full SHA"
            id="commit-sha"
          >
            {commit.oid}
            {copied && <span className="copied-tooltip">Copied!</span>}
          </span>
        </div>

        {commit.parents && commit.parents.length > 0 && (
          <div className="commit-parent-row">
            <span className="commit-sha-label">Parent</span>
            <span>
              {commit.parents.map((parent, i) => (
                <Link
                  key={parent.oid}
                  to={`/repositories/${owner}/${repository}/commit/${parent.oid}`}
                  className="parent-sha-link"
                  id={`parent-sha-${i}`}
                >
                  {parent.oid.slice(0, 7)}
                </Link>
              ))}
            </span>
          </div>
        )}
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
