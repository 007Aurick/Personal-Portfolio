import React from 'react';
import HeroPremiumBg from './HeroPremiumBg';
import BatmanHeroPortrait from './home/BatmanHeroPortrait';
import SpotifySection from './spotify/SpotifySection';
import './Home.css';

const SOCIAL_LINKS = [
  {
    href: 'https://linkedin.com/in/aurick-anwar',
    label: 'LinkedIn',
    caption: 'linkedin',
    icon: '/Linkedin.png',
  },
  {
    href: '/resume-AurickAnwar.pdf',
    label: 'Resume',
    caption: 'resume',
    icon: '/Resume.png',
  },
  {
    href: 'https://github.com/007Aurick',
    label: 'GitHub',
    caption: 'github',
    icon: '/Github.png',
  },
];

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
              <p>
                Founding Engineer @{''}
                <a
                  href="https://www.magnifiedsystems.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="home-role-link"
                >
                  Magnified Systems
                </a>
              </p>
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
          </div>
          <div className="home-image fade-in-up">
            <BatmanHeroPortrait />
          </div>
          <div className="home-stats fade-in-up">
            {SOCIAL_LINKS.map(({ href, label, caption, icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="home-social-link"
                aria-label={label}
              >
                <img src={icon} alt="" className="home-social-icon" width={32} height={32} />
                <span className="home-social-caption">{caption}</span>
              </a>
            ))}
          </div>
        </div>

        <SpotifySection />
      </div>
    </section>
  );
};

export default Home;