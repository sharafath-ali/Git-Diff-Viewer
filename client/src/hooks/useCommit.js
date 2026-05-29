import { useState, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5001';

/**
 * Custom hook to fetch commit metadata and diff data.
 * @param {string} owner - Repository owner
 * @param {string} repository - Repository name
 * @param {string} commitSHA - Full 40-char commit SHA
 */
export function useCommit(owner, repository, commitSHA) {
  const [commit, setCommit] = useState(null);
  const [diff, setDiff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!owner || !repository || !commitSHA) return;

    const controller = new AbortController();
    setLoading(true);
    setError(null);

    async function fetchData() {
      try {
        const basePath = `/repositories/${owner}/${repository}/commits/${commitSHA}`;

        const [commitRes, diffRes] = await Promise.all([
          fetch(`${API_BASE}${basePath}`, { signal: controller.signal }),
          fetch(`${API_BASE}${basePath}/diff`, { signal: controller.signal }),
        ]);

        if (!commitRes.ok) {
          const err = await commitRes.json().catch(() => ({}));
          throw new Error(err.error || `Failed to fetch commit (${commitRes.status})`);
        }

        if (!diffRes.ok) {
          const err = await diffRes.json().catch(() => ({}));
          throw new Error(err.error || `Failed to fetch diff (${diffRes.status})`);
        }

        const commitData = await commitRes.json();
        const diffData = await diffRes.json();

        setCommit(commitData);
        setDiff(diffData);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();

    return () => controller.abort();
  }, [owner, repository, commitSHA]);

  return { commit, diff, loading, error };
}
