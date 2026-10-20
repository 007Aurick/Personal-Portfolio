import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SiteLayout from './SiteLayout';
import { portfolioProjects } from '../../data/portfolioProjects';
import './AllProjectsPage.css';

const CARD_LINES = {
  'nl-robot': 'Natural-language robot control in ROS 2 + Gazebo.',
  'autonomous-self-driving-carla': 'Live perception and decision dashboard in CARLA.',
  'stockfish-irl': 'Tracks a real chessboard and flags blunders.',
  'breast-cancer-cell-detection': 'YOLO + Grad-CAM tumor detection on mammograms.',
  telearm: 'Autonomous warehouse forklift in ROS 2.',
  'robot-basketball-shooter': 'Unitree G1 free throws in MuJoCo.',
  'vent-buddy': 'Voice assistant that writes a next-step report.',
  'hand-gesture-computer-control': 'Touchless cursor control from hand landmarks.',
};

function githubUrl(project) {
  const url = project.projectUrl || project.secondaryUrl;
  if (url && String(url).includes('github.com')) return url;
  if (project.secondaryUrl && String(project.secondaryUrl).includes('github.com')) {
    return project.secondaryUrl;
  }
  return null;
}

export default function AllProjectsPage() {
  useEffect(() => {
    document.title = 'Projects — Aurick Anwar';
  }, []);

  return (
    <SiteLayout>
      <section className="all-projects" aria-labelledby="all-projects-heading">
        <header className="all-projects-header">
          <Link to="/" className="all-projects-back">
            ← Back
          </Link>
          <h1 id="all-projects-heading" className="all-projects-title">
            All Projects
          </h1>
        </header>

        <div className="all-projects-grid">
          {portfolioProjects.map((project) => {
            const gh = githubUrl(project);
            return (
              <article key={project.slug} className="all-projects-card">
                <Link
                  to={`/projects/${project.slug}`}
                  className="all-projects-media"
                >
                  <img
                    src={project.image}
                    alt=""
                    loading="lazy"
                    style={
                      project.imageObjectPosition
                        ? { objectPosition: project.imageObjectPosition }
                        : undefined
                    }
                  />
                </Link>
                <div className="all-projects-body">
                  <div className="all-projects-meta">
                    <span className="all-projects-category">{project.category}</span>
                    {project.year && (
                      <span className="all-projects-year">{project.year}</span>
                    )}
                  </div>
                  <Link
                    to={`/projects/${project.slug}`}
                    className="all-projects-name"
                  >
                    {project.title}
                  </Link>
                  <p className="all-projects-desc">
                    {CARD_LINES[project.slug] ?? project.title}
                  </p>
                  <div className="all-projects-actions">
                    <Link
                      to={`/projects/${project.slug}`}
                      className="all-projects-link"
                    >
                      Write-up →
                    </Link>
                    {gh && (
                      <a
                        className="all-projects-gh"
                        href={gh}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${project.title} on GitHub`}
                      >
                        <img src="/Github.png" alt="" />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </SiteLayout>
  );
}
