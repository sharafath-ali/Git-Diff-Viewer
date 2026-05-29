import { useParams } from 'react-router-dom';
import { useCommit } from '../hooks/useCommit';
import CommitHeader from '../components/CommitHeader';
import DiffViewer from '../components/DiffViewer';

function CommitPage() {
  const { owner, repository, commitSHA } = useParams();
  const { commit, diff, loading, error } = useCommit(owner, repository, commitSHA);

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading commit data...</p>
          <p className="loading-subtext">{owner}/{repository}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="error-container">
          <div className="error-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>
          <h2>Failed to load commit</h2>
          <p className="error-message">{error}</p>
          <button className="retry-btn" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Calculate stats
  const stats = (diff || []).reduce(
    (acc, file) => ({
      filesChanged: acc.filesChanged + 1,
      additions: acc.additions + (file.additions || 0),
      deletions: acc.deletions + (file.deletions || 0),
    }),
    { filesChanged: 0, additions: 0, deletions: 0 }
  );

  return (
    <div className="page-container">
      <nav className="breadcrumb" id="breadcrumb-nav">
        <a href="/" className="breadcrumb-home">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="4" />
            <line x1="1.05" y1="12" x2="7" y2="12" />
            <line x1="17.01" y1="12" x2="22.96" y2="12" />
          </svg>
        </a>
        <span className="breadcrumb-sep">/</span>
        <span className="breadcrumb-item">{owner}</span>
        <span className="breadcrumb-sep">/</span>
        <span className="breadcrumb-item">{repository}</span>
        <span className="breadcrumb-sep">/</span>
        <span className="breadcrumb-item breadcrumb-active">commit</span>
      </nav>

      {commit && (
        <CommitHeader
          commit={commit}
          owner={owner}
          repository={repository}
        />
      )}

      <div className="diff-stats-bar" id="diff-stats-bar">
        <div className="diff-stats-info">
          <span className="stats-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </span>
          <span className="stats-files">{stats.filesChanged} file{stats.filesChanged !== 1 ? 's' : ''} changed</span>
          <span className="stats-additions">+{stats.additions}</span>
          <span className="stats-deletions">-{stats.deletions}</span>
        </div>
      </div>

      {diff && <DiffViewer files={diff} />}
    </div>
  );
}

export default CommitPage;
