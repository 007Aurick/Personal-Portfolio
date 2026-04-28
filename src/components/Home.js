import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroOceanBg from './HeroOceanBg';
import './Home.css';

const Home = () => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  
  const fullText = "Hi my name is Aurick. I am a first year Engineering 1 Student at McMaster University.";
  const subtitle = "Founder @Magnified Systems.";
  const subtitle2 = "Incoming SWE Intern @HermesAI.";
  

  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + fullText[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 150); // Adjust speed here (lower = faster)
      
      return () => clearTimeout(timeout);
    } else {
      setIsTyping(false);
    }
  }, [currentIndex, fullText]);

  return (
    <section className="home section">
      <HeroOceanBg />
      <div className="container">
        <div className="home-content">
          <div className="home-text fade-in-up">
            <h1 className="home-title">
              <span className="typewriter-text">
                {displayedText}
                {isTyping && <span className="cursor">|</span>}
              </span>
            </h1>
            <h2 className="home-subtitle">
              {subtitle}
            <h2 className="home-subtitle2">
              {subtitle2}
            </h2>
            </h2>
            <p className="home-description">
              Engineering has been my focus since middle school, driven by a strong interest in building technologies that improve people's lives. I'm especially interested in robotics and intelligent systems, and I'm always looking for opportunities to learn and grow. Looking ahead, I plan to pursue pathways in AI and automation. This year, my goal is to deepen my understanding of machine learning and begin working with ROS2.
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
          <div className="home-image fade-in">
            <div className="image-placeholder">
              <div className="profile-circle">
                <img
                  src="/aurick_anwar_photo.jpg"
                  alt="Aurick Anwar"
                  className="profile-image"
                  onError={(e) => {
                    console.log('Image failed to load:', e.target.src);
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
    <div className="stat-icon">💼</div>
    <h3>LinkedIn</h3>
    <p>Connect with me</p>
  </a>
  
  <a 
    href="/resume-AurickAnwar.pdf" 
    download="resume-AurickAnwar.pdf" 
    className="stat-button"
  >
    <div className="stat-icon">🗎</div>
    <h3>Resume</h3>
    <p>Download PDF</p>
  </a>
  
  <a 
    href="https://github.com/AurickAnwar" 
    target="_blank" 
    rel="noopener noreferrer" 
    className="stat-button"
  >
    <div className="stat-icon">🖥️</div>
    <h3>Github</h3>
    <p>Check out my projects!</p>
  </a>
</div>


      </div>
    </section>
  );
};

export default Home;