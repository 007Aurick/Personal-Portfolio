import React from 'react';
import { Link } from 'react-router-dom';
import HeroPremiumBg from './HeroPremiumBg';
import HomeSpotify from './HomeSpotify';
import './Home.css';

const Home = () => {
  return (
    <section className="home section">
      <HeroPremiumBg />
      <div className="container">
        <div className="home-content">
          <div className="home-text fade-in-up">
            <h1 className="home-title">AURICK ANWAR</h1>
            <h3 className="home-subtitle">Mechatronics Engineering @McMaster University</h3>
            <div className="home-role-lines">
              <p>Founding Engineer @Magnified Systems</p>
              <p>
                SWE Intern @{''}
                <a
                  href="https://hermesai.ca/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="home-role-link"
                >
                  HermesAI
                </a>
              </p>
            </div>
            <p className="home-description">
              Passionate about building AI, Robotics and Automation based solutions.
            </p>
            <div className="home-buttons">
              <Link to="/projects" className="btn">
                View My Work
              </Link>
              <Link to="/contact" className="btn btn-outline">
                Get In Touch
              </Link>
            </div>
          </div>
          <div className="home-image fade-in-up">
            <div className="image-placeholder floating">
              <div className="profile-glow" />
              <div className="profile-circle">
                <img
                  src="/aurick_anwar_photo.jpg"
                  alt="Aurick Anwar"
                  className="profile-image"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="home-stats fade-in-up">
          <a
            href="https://linkedin.com/in/aurick-anwar"
            target="_blank"
            rel="noopener noreferrer"
            className="stat-button"
          >
            <div className="stat-icon">LinkedIn</div>
            <p>Connect</p>
          </a>

          <a
            href="/resume-AurickAnwar.pdf"
            download="resume-AurickAnwar.pdf"
            className="stat-button"
          >
            <div className="stat-icon">Resume</div>
            <p>Download PDF</p>
          </a>

          <a
            href="https://github.com/AurickAnwar"
            target="_blank"
            rel="noopener noreferrer"
            className="stat-button"
          >
            <div className="stat-icon">GitHub</div>
            <p>View Projects</p>
          </a>
        </div>

        <HomeSpotify />

      </div>
    </section>
  );
};

export default Home;