import React from 'react';
import './Projects.css';

const Projects = () => {
  const featuredProject = {
    title: 'Magnified Systems',
    status: 'Currently Building',
    description:
      'Developing a real-time impact severity detection system using IMU sensor data and machine learning.',
    bullets: [
      'Working with ESP32 and IMU sensors for real-time motion data',
      'Building a machine learning model to predict impact severity (1–100 scale)',
      'Designing a helmet-mounted prototype for real-world testing'
    ],
    technologies: ['ESP32', 'IMU Sensors', 'Machine Learning', 'Embedded Prototyping'],
    primaryCtaLabel: 'Follow Progress',
    primaryCtaUrl: 'https://www.instagram.com/magnifiedsystems/',
    secondaryCtaLabel: 'View Related ML Work',
    secondaryCtaUrl: 'https://github.com/AurickAnwar/Impact-Analysis-ML'
  };

  const projects = [
    {
      id: 1,
      title: 'Basketball Shot Predictor',
      description: 'Tracks ball trajectory in video and predicts make probability using computer vision and a PyTorch model.',
      image: '/ShotPredictor.png',
      technologies: ['YOLOv11', 'OpenCV', 'PyTorch'],
      projectUrl: 'https://github.com/AurickAnwar/Basketball-Shot-Predictor'
    },
    {
      id: 2,
      title: 'Hand Gesture Computer Control',
      description: 'Enables touchless cursor and system controls by mapping hand landmarks to real-time gesture commands.',
      image: '/HandGestureControl.jpg',
      technologies: ['MediaPipe', 'OpenCV', 'PyAutoGUI'],
      projectUrl: 'https://github.com/AurickAnwar/Real-Time-Hand-Gesture-Controller'
    },
    {
      id: 3,
      title: 'Impact Severity ML Model',
      description: 'Predicts crash impact severity from IMU streams to support injury-risk assessment workflows.',
      image: '/CrashSeverity.jpg',
      technologies: ['PyTorch', 'Python', 'IMU Data'],
      projectUrl: 'https://github.com/AurickAnwar/Impact-Analysis-ML'
    },
    {
      id: 4,
      title: 'Car and Pedestrian Detection',
      description: 'Detects and counts pedestrians and cars in real time with optimized OpenCV pipelines for video analysis.',
      image: '/Car Detection.png',
      technologies: ['Python', 'OpenCV', 'NumPy'],
      projectUrl: 'https://github.com/AurickAnwar/Python-Projects-w-OpenCV/blob/main/Pedestrian%20and%20Car%20Detection%20System.py'
    },
    {
      id: 5,
      title: 'Google Home Replica',
      description: 'Built a replica of the Google Home using Speech-to-Text APIs.',
      image: '/STT.png',
      technologies: ['OpenCV', 'Google Cloud', 'Speech-to-Text'],
      projectUrl: '/https://github.com/AurickAnwar/Google-Home-Replica'
    },
    {
      id:6,
      title: 'Push Button LED PCB',
      description: 'Designed and prototyped a push-button LED PCB workflow from schematic to board layout in KiCad.',
      image: '/LEDPCB.png',
      technologies: ['KiCad', 'PCB Design', 'Hardware Prototyping'],
      projectUrl: '/ledlight.kicad_pcb'
    },
    {
      id:7,
      title: 'Scissor Bot',
      description: 'Built a 3D-modelled scissor-extension gripper to retrieve items, controlled by two push buttons.',
      image: '/ScissorsBot.jpg',
      technologies: ['3D Printing', 'Arduino', 'Servo Motors', 'Push Buttons'],
      projectUrl: 'https://www.youtube.com/watch?v=-lGsktbrvjc'
    },
    {
      id:8,
      title: 'Arduino Smart Home System',
      description: 'Detects and counts road actors in real time with optimized OpenCV pipelines for video analysis.',
      image: '/SmartHome.jpg',
      technologies: ['Fusion 360', 'Arduino', 'Ultrasonic Sensor', 'Buzzer','LEDs'],
      projectUrl: 'https://www.youtube.com/watch?v=fv0qXOx49z8System.py'
    }
    
  ];

  return (
    <section className="projects section">
      <div className="container">
        <div className="section-header fade-in-up">
          <h1 className="section-title">Projects</h1>
          <p className="section-subtitle projects-intro">
            Here are some of my recent projects that showcase my skills and experience.
          </p>
        </div>

        <div className="featured-project fade-in-up">
          <div className="featured-content">
            <p className="featured-label">Featured Project</p>
            <h2>{featuredProject.title}</h2>
            <p className="featured-status">{featuredProject.status}</p>
            <p>{featuredProject.description}</p>
            <ul className="featured-list">
              {featuredProject.bullets.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <div className="project-technologies">
              {featuredProject.technologies.map((tech) => (
                <span key={tech} className="tech-tag">{tech}</span>
              ))}
            </div>
            <div className="featured-actions">
              <a href={featuredProject.primaryCtaUrl} target="_blank" rel="noopener noreferrer" className="btn">
                {featuredProject.primaryCtaLabel}
              </a>
              <a href={featuredProject.secondaryCtaUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                {featuredProject.secondaryCtaLabel}
              </a>
            </div>
          </div>
        </div>

        <div className="projects-divider" />

        <div className="projects-grid">
          {projects.map((project, index) => (
            <a
              key={project.id}
              href={project.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="project-card fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="project-image">
                <img src={project.image} alt={project.title} />
                <div className="project-image-overlay" />
              </div>

              <div className="project-content">
                <h3 className="project-title">{project.title}</h3>
                <p className="project-description">{project.description}</p>

                <div className="project-technologies">
                  {project.technologies.map((tech, idx) => (
                    <span key={idx} className="tech-tag">{tech}</span>
                  ))}
                </div>
                <span className="project-link">
                  View Project
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
