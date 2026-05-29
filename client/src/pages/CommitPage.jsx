import { useParams, Link } from 'react-router-dom';
import { useCommit } from '../hooks/useCommit';
import CommitHeader from '../components/CommitHeader';
import DiffViewer from '../components/DiffViewer';

function CommitPage() {
  const { owner, repository, commitSHA } = useParams();
  const { commit, diff, loading, error } = useCommit(owner, repository, commitSHA);

  if (loading) {
    return (
      <div className="page-container skeleton-page">
        {/* Skeleton breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingBottom: 16 }}>
          <div className="skeleton" style={{ width: 14, height: 14, borderRadius: 3 }} />
          <div className="skeleton" style={{ width: 6, height: 10, borderRadius: 2 }} />
          <div className="skeleton skeleton-line" style={{ width: 70 }} />
          <div className="skeleton" style={{ width: 6, height: 10, borderRadius: 2 }} />
          <div className="skeleton skeleton-line" style={{ width: 50 }} />
        </div>

        {/* Skeleton commit header */}
        <div className="skeleton-header">
          <div className="skeleton skeleton-avatar" />
          <div className="skeleton-header-body">
            <div className="skeleton skeleton-line-title" />
            <div className="skeleton skeleton-line skeleton-line-sm" />
          </div>
          <div className="skeleton-header-right">
            <div className="skeleton skeleton-line" style={{ width: '80%' }} />
            <div className="skeleton skeleton-line-sm" />
            <div className="skeleton skeleton-line skeleton-line-sm" style={{ width: '45%' }} />
          </div>
        </div>

        {/* Skeleton stats bar */}
        <div className="skeleton-stats-bar">
          <div className="skeleton skeleton-line" style={{ width: 110 }} />
          <div className="skeleton skeleton-line" style={{ width: 40 }} />
          <div className="skeleton skeleton-line" style={{ width: 40 }} />
        </div>

        {/* Skeleton file cards */}
        <div className="skeleton-diff-viewer">
          {[8, 5, 6].map((rows, cardIdx) => (
            <div className="skeleton-file-card" key={cardIdx}>
              <div className="skeleton-file-header">
                <div className="skeleton" style={{ width: 12, height: 12, borderRadius: 2 }} />
                <div className="skeleton" style={{ width: 18, height: 18, borderRadius: 4 }} />
                <div className="skeleton skeleton-line" style={{ width: `${[42, 30, 55][cardIdx]}%` }} />
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
                  <div className="skeleton skeleton-line" style={{ width: 34 }} />
                  <div className="skeleton skeleton-line" style={{ width: 34 }} />
                </div>
              </div>
              <div className="skeleton-file-body">
                {/* Hunk header */}
                <div className="skeleton" style={{ height: 22, borderRadius: 0, margin: 0, width: '100%', opacity: 0.6 }} />
                {Array.from({ length: rows }).map((_, i) => (
                  <div className="skeleton-diff-row" key={i}>
                    <div className="skeleton skeleton-ln" />
                    <div className="skeleton skeleton-ln" />
                    <div className="skeleton skeleton-indicator" />
                    <div className="skeleton skeleton-code" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="error-container">
          <div className="error-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
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

  // Totals for the stats bar
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
      {/* Breadcrumb */}
      <nav className="breadcrumb" id="breadcrumb-nav">
        <Link to="/" className="breadcrumb-home" aria-label="Home">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </Link>
        <span className="breadcrumb-sep">/</span>
        <span className="breadcrumb-item">{owner}</span>
        <span className="breadcrumb-sep">/</span>
        <span className="breadcrumb-item">{repository}</span>
        <span className="breadcrumb-sep">/</span>
        <span className="breadcrumb-active">commit</span>
      </nav>

      {/* Commit header (avatar + message + right-side meta) */}
      {commit && (
        <CommitHeader commit={commit} owner={owner} repository={repository} />
      )}

      {/* Diff stats summary row */}
      <div className="diff-stats-bar" id="diff-stats-bar">
        <div className="diff-stats-info">
          <span className="stats-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </span>
          <span className="stats-files">
            {stats.filesChanged} file{stats.filesChanged !== 1 ? 's' : ''} changed
          </span>
          <span className="stats-additions">+{stats.additions}</span>
          <span className="stats-deletions">-{stats.deletions}</span>
        </div>
      </div>

      {/* Diff viewer */}
      {diff && <DiffViewer files={diff} />}
    </div>
  );
}

export default CommitPage;
