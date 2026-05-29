function FileBadge({ changeKind }) {
  const badgeClass = `file-badge badge-${changeKind.toLowerCase()}`;
  
  const labels = {
    ADDED: 'A',
    DELETED: 'D',
    MODIFIED: 'M',
    RENAMED: 'R',
    COPIED: 'C',
  };

  const fullLabels = {
    ADDED: 'Added',
    DELETED: 'Deleted',
    MODIFIED: 'Modified',
    RENAMED: 'Renamed',
    COPIED: 'Copied',
  };

  return (
    <span className={badgeClass} title={fullLabels[changeKind] || changeKind}>
      {labels[changeKind] || changeKind.charAt(0)}
    </span>
  );
}

export default FileBadge;
