import { useState } from 'react';
import DiffHunk from './DiffHunk';
import FileBadge from './FileBadge';

function DiffViewer({ files }) {
  return (
    <div className="diff-viewer" id="diff-viewer">
      {files.map((file, index) => (
        <FileCard key={index} file={file} index={index} />
      ))}
    </div>
  );
}

function FileCard({ file, index }) {
  const [expanded, setExpanded] = useState(true);

  const fileName = file.headFile?.path || file.baseFile?.path || 'Unknown file';
  const dirParts = fileName.split('/');
  const baseName = dirParts.pop();
  const dirPath = dirParts.join('/');

  return (
    <div className={`file-card ${expanded ? 'file-card-expanded' : ''}`} id={`file-${index}`}>
      <div
        className="file-card-header"
        onClick={() => setExpanded(!expanded)}
        id={`file-header-${index}`}
      >
        <div className="file-header-left">
          <span className={`expand-icon ${expanded ? 'expanded' : ''}`}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </span>
          <FileBadge changeKind={file.changeKind} />
          <span className="file-path">
            {dirPath && <span className="file-dir">{dirPath}/</span>}
            <span className="file-name">{baseName}</span>
          </span>
        </div>
        <div className="file-header-right">
          {file.additions > 0 && (
            <span className="file-stat file-stat-add">+{file.additions}</span>
          )}
          {file.deletions > 0 && (
            <span className="file-stat file-stat-del">-{file.deletions}</span>
          )}
        </div>
      </div>

      {expanded && (
        <div className="file-card-body">
          {file.hunks && file.hunks.length > 0 ? (
            file.hunks.map((hunk, hunkIdx) => (
              <DiffHunk key={hunkIdx} hunk={hunk} index={`${index}-${hunkIdx}`} />
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
