import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import CommitPage from './pages/CommitPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/repositories/:owner/:repository/commit/:commitSHA"
          element={<CommitPage />}
        />
        <Route
          path="/"
          element={
            <div className="landing">
              <div className="landing-content">
                <div className="landing-icon">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="4" />
                    <line x1="1.05" y1="12" x2="7" y2="12" />
                    <line x1="17.01" y1="12" x2="22.96" y2="12" />
                  </svg>
                </div>
                <h1>Git Diff Viewer</h1>
                <p className="landing-description">
                  View code differences for any commit from any open-source GitHub repository.
                </p>
                <div className="landing-usage">
                  <h3>Usage</h3>
                  <p>Navigate to:</p>
                  <code>
                    /repositories/:owner/:repository/commit/:commitSHA
                  </code>
                  <p className="landing-example">Example:</p>
                  <a href="/repositories/golemfactory/clay/commit/a1bf367b3af680b1182cc52bb77ba095764a11f9">
                    /repositories/golemfactory/clay/commit/a1bf...11f9
                  </a>
                </div>
              </div>
            </div>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
