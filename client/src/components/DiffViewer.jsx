import { useState } from 'react';
import DiffHunk from './DiffHunk';
import FileBadge from './FileBadge';

function DiffViewer({ files }) {
  return (
    <div className="diff-viewer" id="diff-viewer">
      <h2 className="diff-section-label">Code</h2>
      {files.map((file, index) => (
        <FileCard key={index} file={file} index={index} />
      ))}
    </div>
  );
}

function FileCard({ file, index }) {
  const [expanded, setExpanded] = useState(true);

  const fileName = file.headFile?.path || file.baseFile?.path || 'Unknown file';

  // Split into directory and filename
  const parts = fileName.split('/');
  const baseName = parts.pop();
  const dirPath = parts.length > 0 ? parts.join('/') + '/' : '';

  return (
    <div
      className={`file-card ${expanded ? 'file-card-expanded' : ''}`}
      id={`file-${index}`}
    >
      {/* Clickable header: chevron + file path + stats */}
      <div
        className="file-card-header"
        onClick={() => setExpanded(!expanded)}
        id={`file-header-${index}`}
        role="button"
        aria-expanded={expanded}
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setExpanded(!expanded)}
      >
        {/* Left: chevron + badge + path */}
        <span className={`expand-icon ${expanded ? 'expanded' : ''}`}>
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </span>

        <FileBadge changeKind={file.changeKind} />

        <span className="file-path">
          {dirPath && <span className="file-dir">{dirPath}</span>}
          <span className="file-name">{baseName}</span>
        </span>

        {/* Right: +/- counts */}
        <div className="file-header-right">
          {file.additions > 0 && (
            <span className="file-stat file-stat-add">+{file.additions}</span>
          )}
          {file.deletions > 0 && (
            <span className="file-stat file-stat-del">-{file.deletions}</span>
          )}
        </div>
      </div>

      {/* Expandable diff hunks */}
      {expanded && (
        <div className="file-card-body">
          {file.hunks && file.hunks.length > 0 ? (
            file.hunks.map((hunk, hunkIdx) => (
              <DiffHunk
                key={hunkIdx}
                hunk={hunk}
                index={`${index}-${hunkIdx}`}
              />
            ))
          ) : (
            <div className="no-diff-content">
              <p>Binary file or no diff available</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default DiffViewer;
