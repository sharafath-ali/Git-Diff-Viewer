import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CommitPage from './pages/CommitPage';
import NavigateForm from './components/NavigateForm';

function LandingPage() {
  return (
    <div className="landing">
      {/* Animated background blobs */}
      <div className="landing-bg">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
      </div>

      <div className="landing-content">
        {/* Logo / Icon */}
        <div className="landing-logo" aria-hidden="true">
          <div className="landing-logo-ring">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <line x1="1.05" y1="12" x2="7" y2="12" />
              <line x1="17.01" y1="12" x2="22.96" y2="12" />
            </svg>
          </div>
        </div>

        {/* Headline */}
        <h1 className="landing-headline">
          <span className="headline-gradient">Git Diff</span> Viewer
        </h1>
        <p className="landing-tagline">
          Explore code changes for any commit in any open-source GitHub repository — instantly.
        </p>

        {/* Feature pills */}
        <div className="landing-pills" role="list" aria-label="Features">
          {['Live GitHub data', 'Unified diff view', 'Collapse / expand files', 'Copy commit SHA'].map((f) => (
            <span key={f} className="landing-pill" role="listitem">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {f}
            </span>
          ))}
        </div>

        {/* Navigation form card */}
        <div className="landing-card">
          <div className="landing-card-header">
            <div className="landing-card-dot landing-card-dot-red" />
            <div className="landing-card-dot landing-card-dot-yellow" />
            <div className="landing-card-dot landing-card-dot-green" />
            <span className="landing-card-title">Navigate to a Commit</span>
          </div>
          <NavigateForm />
        </div>

        {/* Footer note */}
        <p className="landing-footer-note">
          Powered by the{' '}
          <a href="https://docs.github.com/en/rest" target="_blank" rel="noopener noreferrer">
            GitHub REST API
          </a>
          . A GitHub token in{' '}
          <code>server/.env</code> increases rate limits from 60 to 5 000 req/hr.
        </p>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/repositories/:owner/:repository/commit/:commitSHA"
          element={<CommitPage />}
        />
        <Route path="/" element={<LandingPage />} />
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
