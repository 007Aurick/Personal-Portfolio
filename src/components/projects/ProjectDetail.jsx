import React, { useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { getProjectBySlug } from '../../data/portfolioProjects';
import YouTubeLoop from './YouTubeLoop';
import './ProjectDetail.css';

function toBullets(value) {
  if (!value) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
}

function DetailSection({ label, children }) {
  return (
    <section className="project-detail__section">
      <h2 className="project-detail__section-label">{label}</h2>
      <div className="project-detail__section-body">{children}</div>
    </section>
  );
}

function BulletList({ items }) {
  const bullets = toBullets(items);
  if (!bullets.length) {
    return null;
  }
  return (
    <ul className="project-detail__bullets">
      {bullets.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

const ProjectDetail = () => {
  const { slug } = useParams();
  const project = getProjectBySlug(slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!project) {
    return <Navigate to="/projects" replace />;
  }

  const showCta = !project.hideCta && project.projectUrl;
  const ctaLabel =
    project.ctaLabel ??
    (project.downloadFilename ? 'Download File' : 'View Project');
  const ctaProps = project.downloadFilename
    ? { download: project.downloadFilename }
    : { target: '_blank', rel: 'noopener noreferrer' };

  return (
    <section className="project-detail section">
      <div className="container project-detail__container">
        <Link to="/projects" className="project-detail__back fade-in-up">
          ← Back to Projects
        </Link>

        <div className="project-detail__hero fade-in-up">
          {project.youtubeVideoId ? (
            <YouTubeLoop
              videoId={project.youtubeVideoId}
              title={`${project.title} demo`}
              className="project-detail__video"
              poster={project.image}
              showControls
              eager
            />
          ) : (
            <img src={project.image} alt={project.title} className="project-detail__poster" />
          )}
        </div>

        <div className="project-detail__layout fade-in-up">
          <aside className="project-detail__sidebar">
            <p className="project-detail__category">{project.category}</p>
            <h1 className="project-detail__title">{project.title}</h1>
            <p className="project-detail__meta">
              {project.year} · {project.projectType}
            </p>

            <div className="project-detail__tech-block">
              <h3 className="project-detail__tech-label">Tech Stack</h3>
              <ul className="project-detail__tech-list">
                {project.technologies.map((tech) => (
                  <li key={tech}>{tech}</li>
                ))}
              </ul>
            </div>

            {showCta && (
              <div className="project-detail__sidebar-actions">
                <a href={project.projectUrl} className="btn" {...ctaProps}>
                  {ctaLabel}
                </a>
              </div>
            )}
          </aside>

          <div className="project-detail__main">
            <DetailSection label="Description">
              <BulletList items={project.description} />
            </DetailSection>

            <DetailSection label="Overview">
              <BulletList items={project.overview} />
            </DetailSection>

            <DetailSection label="Challenge">
              <BulletList items={project.challenge} />
            </DetailSection>

            <DetailSection label="Solution">
              <BulletList items={project.solution} />
            </DetailSection>

            <DetailSection label="Technical Implementation">
              <BulletList items={project.technical} />
            </DetailSection>

            <DetailSection label="Outcomes & Impact">
              <BulletList items={project.outcomes} />
            </DetailSection>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectDetail;
