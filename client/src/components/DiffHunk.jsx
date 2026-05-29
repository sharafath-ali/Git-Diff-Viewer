function DiffHunk({ hunk, index }) {
  return (
    <div className="diff-hunk" id={`hunk-${index}`}>
      <div className="hunk-header">
        <code>{hunk.header}</code>
      </div>
      <table className="diff-table">
        <tbody>
          {hunk.lines.map((line, lineIdx) => {
            const lineType = getLineType(line.content);
            return (
              <tr
                key={lineIdx}
                className={`diff-line diff-line-${lineType}`}
                id={`line-${index}-${lineIdx}`}
              >
                <td className="line-number line-number-base">
                  {line.baseLineNumber || ''}
                </td>
                <td className="line-number line-number-head">
                  {line.headLineNumber || ''}
                </td>
                <td className="line-indicator">
                  {lineType === 'addition' ? '+' : lineType === 'deletion' ? '-' : ' '}
                </td>
                <td className="line-content">
                  <code>{line.content.substring(1)}</code>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function getLineType(content) {
  if (!content) return 'context';
  if (content.startsWith('+')) return 'addition';
  if (content.startsWith('-')) return 'deletion';
  if (content.startsWith('\\')) return 'info';
  return 'context';
}

export default DiffHunk;
