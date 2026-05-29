const express = require('express');
const router = express.Router();
const { getCommit, getCommitDiff } = require('../services/github');

/**
 * GET /repositories/:owner/:repository/commits/:oid
 * Returns commit metadata matching the API spec.
 */
router.get('/:owner/:repository/commits/:oid', async (req, res, next) => {
  try {
    const { owner, repository, oid } = req.params;

    // Validate all params are present and non-empty
    if (!owner?.trim() || !repository?.trim() || !oid?.trim()) {
      return res.status(400).json({
        error: 'Missing required parameters: owner, repository, and commit SHA are all required.',
      });
    }

    // Validate SHA format
    if (!/^[0-9a-f]{40}$/i.test(oid.trim())) {
      return res.status(400).json({
        error: 'Invalid commit SHA. Must be a 40-character hexadecimal string.',
      });
    }

    const commit = await getCommit(owner.trim(), repository.trim(), oid.trim());
    res.json(commit);
  } catch (error) {
    if (error.response) {
      const status = error.response.status;
      if (status === 404) {
        return res.status(404).json({ error: 'Commit not found' });
      }
      if (status === 403) {
        return res.status(403).json({
          error: 'GitHub API rate limit exceeded. Please add a GITHUB_TOKEN to server/.env',
        });
      }
    }
    next(error);
  }
});

/**
 * GET /repositories/:owner/:repository/commits/:oid/diff
 * Returns the parsed diff of a commit.
 */
router.get('/:owner/:repository/commits/:oid/diff', async (req, res, next) => {
  try {
    const { owner, repository, oid } = req.params;

    // Validate all params are present and non-empty
    if (!owner?.trim() || !repository?.trim() || !oid?.trim()) {
      return res.status(400).json({
        error: 'Missing required parameters: owner, repository, and commit SHA are all required.',
      });
    }

    // Validate SHA format
    if (!/^[0-9a-f]{40}$/i.test(oid.trim())) {
      return res.status(400).json({
        error: 'Invalid commit SHA. Must be a 40-character hexadecimal string.',
      });
    }

    const diff = await getCommitDiff(owner.trim(), repository.trim(), oid.trim());
    res.json(diff);
  } catch (error) {
    if (error.response) {
      const status = error.response.status;
      if (status === 404) {
        return res.status(404).json({ error: 'Commit not found' });
      }
      if (status === 403) {
        return res.status(403).json({
          error: 'GitHub API rate limit exceeded. Please add a GITHUB_TOKEN to server/.env',
        });
      }
    }
    next(error);
  }
});

module.exports = router;
