import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EXAMPLES = [
  {
    label: 'golemfactory/clay',
    owner: 'golemfactory',
    repo: 'clay',
    sha: 'a1bf367b3af680b1182cc52bb77ba095764a11f9',
  },
  {
    label: 'sharafath-ali/NexBuy',
    owner: 'sharafath-ali',
    repo: 'NexBuy',
    sha: '9fa18e8988c932e01632bfc9bde6f6dc5ec2e34e',
  },
  {
    label: 'sharafath-ali/Chatterverse',
    owner: 'sharafath-ali',
    repo: 'Chatterverse',
    sha: '89a7dc8c06130acf154ad7b922a37b508511c5c8',
  },
];

export function NavigateForm() {
  const navigate = useNavigate();
  const [owner, setOwner] = useState('');
  const [repo, setRepo] = useState('');
  const [sha, setSha] = useState('');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  function validate() {
    const errs = {};
    if (!owner.trim()) errs.owner = 'Owner is required';
    else if (!/^[a-zA-Z0-9_.-]+$/.test(owner.trim()))
      errs.owner = 'Invalid GitHub username';

    if (!repo.trim()) errs.repo = 'Repository is required';
    else if (!/^[a-zA-Z0-9_.-]+$/.test(repo.trim()))
      errs.repo = 'Invalid repository name';

    if (!sha.trim()) errs.sha = 'Commit SHA is required';
    else if (!/^[0-9a-f]{40}$/i.test(sha.trim()))
      errs.sha = 'Must be a full 40-character hex SHA';

    return errs;
  }

  function handleBlur(field) {
    setTouched((t) => ({ ...t, [field]: true }));
    const errs = validate();
    setErrors(errs);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const allTouched = { owner: true, repo: true, sha: true };
    setTouched(allTouched);
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      navigate(
        `/repositories/${owner.trim()}/${repo.trim()}/commit/${sha.trim()}`
      );
    }
  }

  function loadExample(ex) {
    setOwner(ex.owner);
    setRepo(ex.repo);
    setSha(ex.sha);
    setErrors({});
    setTouched({});
  }

  return (
    <div className="nav-form-wrapper" id="navigate-form">
      <form className="nav-form" onSubmit={handleSubmit} noValidate>
        {/* Row 1: Owner + Repo */}
        <div className="nav-form-row">
          <div className={`nav-form-field ${touched.owner && errors.owner ? 'has-error' : ''}`}>
            <label htmlFor="input-owner" className="nav-form-label">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              Owner
            </label>
            <input
              id="input-owner"
              className="nav-form-input"
              type="text"
              placeholder="e.g. golemfactory"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              onBlur={() => handleBlur('owner')}
              autoComplete="off"
              spellCheck={false}
            />
            {touched.owner && errors.owner && (
              <span className="nav-form-error">{errors.owner}</span>
            )}
          </div>

          <div className={`nav-form-field ${touched.repo && errors.repo ? 'has-error' : ''}`}>
            <label htmlFor="input-repo" className="nav-form-label">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3h18v18H3zM3 9h18M9 21V9"/>
              </svg>
              Repository
            </label>
            <input
              id="input-repo"
              className="nav-form-input"
              type="text"
              placeholder="e.g. clay"
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
              onBlur={() => handleBlur('repo')}
              autoComplete="off"
              spellCheck={false}
            />
            {touched.repo && errors.repo && (
              <span className="nav-form-error">{errors.repo}</span>
            )}
          </div>
        </div>

        {/* Row 2: Full SHA */}
        <div className={`nav-form-field ${touched.sha && errors.sha ? 'has-error' : ''}`}>
          <label htmlFor="input-sha" className="nav-form-label">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"/>
              <line x1="1.05" y1="12" x2="7" y2="12"/>
              <line x1="17.01" y1="12" x2="22.96" y2="12"/>
            </svg>
            Commit SHA
            <span className="nav-label-hint">(full 40 characters)</span>
          </label>
          <input
            id="input-sha"
            className="nav-form-input nav-form-input-mono"
            type="text"
            placeholder="e.g. a1bf367b3af680b1182cc52bb77ba095764a11f9"
            value={sha}
            onChange={(e) => setSha(e.target.value)}
            onBlur={() => handleBlur('sha')}
            autoComplete="off"
            spellCheck={false}
            maxLength={40}
          />
          {touched.sha && errors.sha && (
            <span className="nav-form-error">{errors.sha}</span>
          )}
        </div>

        {/* Submit */}
        <button className="nav-form-submit" type="submit" id="btn-view-diff">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6"/>
            <polyline points="8 6 2 12 8 18"/>
          </svg>
          View Diff
        </button>
      </form>

      {/* Example commits */}
      <div className="nav-examples">
        <span className="nav-examples-label">Try an example:</span>
        <div className="nav-examples-list">
          {EXAMPLES.map((ex) => (
            <button
              key={ex.sha}
              className="nav-example-btn"
              type="button"
              onClick={() => loadExample(ex)}
              title={`${ex.owner}/${ex.repo}@${ex.sha.slice(0, 7)}`}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
              </svg>
              {ex.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NavigateForm;
