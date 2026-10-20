import React, { useCallback, useState } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './components/site/HomePage';
import ResumePage from './components/site/ResumePage';
import AllProjectsPage from './components/site/AllProjectsPage';
import ProjectDetail from './components/projects/ProjectDetail';
import SignatureIntro, { shouldPlaySignatureIntro } from './components/site/SignatureIntro';
import './App.css';

function App() {
  const [showIntro, setShowIntro] = useState(shouldPlaySignatureIntro);
  const finishIntro = useCallback(() => setShowIntro(false), []);

  return (
    <Router>
      {showIntro && <SignatureIntro onDone={finishIntro} />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/resume" element={<ResumePage />} />
        <Route path="/projects" element={<AllProjectsPage />} />
        <Route path="/projects/:slug" element={<ProjectDetail />} />
        <Route path="/recruiters" element={<Navigate to="/" replace />} />
        <Route path="/contact" element={<Navigate to="/" replace />} />
        <Route path="/outside-engineering" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
