import React, { useCallback, useState } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import HomePage from './components/site/HomePage';
import ResumePage from './components/site/ResumePage';
import AllProjectsPage from './components/site/AllProjectsPage';
import ProjectDetail from './components/projects/ProjectDetail';
import RecruitersPage from './components/recruiters/RecruitersPage';
import SignatureIntro, { shouldPlaySignatureIntro } from './components/site/SignatureIntro';
import './App.css';

function AppRoutes() {
  const { pathname } = useLocation();
  const isRecruiters = pathname === '/recruiters';
  const [showIntro, setShowIntro] = useState(() => !isRecruiters && shouldPlaySignatureIntro());
  const finishIntro = useCallback(() => setShowIntro(false), []);

  return (
    <>
      {showIntro && !isRecruiters && <SignatureIntro onDone={finishIntro} />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/resume" element={<ResumePage />} />
        <Route path="/projects" element={<AllProjectsPage />} />
        <Route path="/projects/:slug" element={<ProjectDetail />} />
        <Route path="/recruiters" element={<RecruitersPage />} />
        <Route path="/contact" element={<Navigate to="/" replace />} />
        <Route path="/outside-engineering" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
