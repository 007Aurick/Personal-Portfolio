import React from 'react';
import './Projects.css';

const Projects = () => {
  const projects = [
    // Python Projects (5)
    {
      id: 1,
      title: "Basketball Shot Predictor",
      description: "Built a Basketball shot predictor that analyzes a video frame by frame and uses object detection to calculate the speed of the ball and distance of ball to the hoop. I used a Pytorch BCE loss model that gives the probability of the shot going in and also I display the accuracy of each test run.",
      image: "/ShotPredictor.png",
      technologies: ['YOLOv11', 'OpenCV', 'PyTorch'],
      githubUrl: "https://github.com/AurickAnwar/Basketball-Shot-Predictor",
      demoUrl: "https://www.youtube.com/watch?v=B-A5uHzQIgI"
      
      
    },
    {
      id: 2,
      title: "AI Computer Control System with Hand Gesture Tracking",
      description: "Built a real-time computer vision system that uses hand gesture recognition to control a computer. Leveraging MediaPipe and OpenCV, the system tracks hand landmarks to enable touchless interaction, including volume control, cursor movement, and gesture-based commands.",
      image: "/HandGestureControl.jpg",
      technologies: ['MediaPipe', 'OpenCV', 'PyAutoGUI'],
      githubUrl: "https://github.com/AurickAnwar/Real-Time-Hand-Gesture-Controller",
      demoUrl: "https://www.youtube.com/watch?v=87QTKgbuSko&"
      
      
     
      
      
    },

    // ⭐ Updated project (Assembly file instead of GitHub)
    {
      id: 3,
      title: "Car and Pedestrian Detection",
      description: "Designed an AI detection car system using OpenCv on python and made an algorithm to display a counter for when each car/pedestrian passes by.",
      image: "/Car Detection.png",
      technologies: ["Python", "OpenCV", "NumPy"],
      githubUrl: "https://github.com/AurickAnwar/Python-Projects-w-OpenCV/blob/main/Pedestrian%20and%20Car%20Detection%20System.py",
      reportUrl: "https://docs.google.com/document/d/1CIpkooX8EVqJkrTwUZ0tDHImPGGr1oqaoGuMrc3TTdc/edit?tab=t.0"
     
      
      
      
    },

    // CAD Projects (3)
    {
      id: 4,
      title: "Google Home",
      description: "Programmed a google home replica on OpenCv python and speech recognition. It was able to run and we could say anything to the system and they would return a response.",
      image: "/STT.png",
      technologies: ["Python", "TextToSpeech", "OpenCV", "SpeechToText"],
      githubUrl: "https://github.com/AurickAnwar/Google-Home-Replica"
      
    },
    {
      id: 5,
      title: "Impact Severity Machine Learning Model",
      description: "Built a machine learning model using PyTorch to predict the severity of an impact based on the accelerometer data. The model was able to predict the severity of an impact with an accuracy of 96.4%. This model I plan on implementing in my startup for Magnified Systems.",
      image: "/CrashSeverity.jpg",
      technologies: ["Python", "PyTorch", "Machine Learning", "IMU Sensor Data"],
      githubUrl: "https://github.com/AurickAnwar/Impact-Analysis-ML"
      
      
      
    },
    {
      id: 6,
      title: "Facial Recognition",
      description: "Built a facial recognition system using OpenCv on python and Haar Cascades. It was able to detect faces in real-time and display the bounding box of the face. Also was able to recognize the number of faces present and the FPS of the camera.",
      image: "/FacialRecognition.jpg",
      technologies: ["Python", "OpenCV", "Haar Cascades"],
      githubUrl: "https://github.com/AurickAnwar/Facial-Recognition-with-OpenCV"
      
      
    },

    // Arduino Projects (3)
    {
      id: 7,
      title: "Push Button LED PCB",
      description: "Designed a push button LED PCB using KiCad",
      image: "/LEDPCB.png",
      technologies: ["KiCad", "PCB", "LEDs", "Push Button"],
      pcbUrl: "/ledlight.kicad_pcb",
      schematicUrl: "/ledlight.kicad_sch"
      
    },
      
    {
      id: 8,
      title: "Scissor Bot",
      description: "Built an extension grabber mechanism that can retrieve items from the floor. Two push buttons are used to control the gripper's open and close state. We 3D modelled and built a scissor mechanism to extend the gripper's reach.",
      image: "/ScissorsBot.jpg",
      technologies: ["Arduino", "Autodesk Inventor", "3D Printing"],
      demoUrl: "https://www.youtube.com/watch?v=-lGsktbrvjc"
      
    },
    {
      id: 9,
      title: "Robotic Arm Gripper (CAD)",
      description: "Used a base plate end effector and added a gripper to the end of the arm to pick up and drop off objects.",
      image: "/RoboticGrip.png",
      technologies: ["Autodesk Inventor", "Assembly", "Constraints"],
      assemblyUrl: "/Robotic-Gripper.iam"
      
      
    }
  ];

  return (
    <section className="projects section">
      <div className="container">
        <div className="section-header fade-in-up">
          <h1 className="section-title">My Projects</h1>
          <p className="section-subtitle">
            Here are some of my recent projects that showcase my skills and experience
          </p>
        </div>

        <div className="projects-grid">
          {projects.map((project, index) => (
            <div key={project.id} className="project-card fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="project-image">
                <img 
                  src={project.image} 
                  alt={project.title}
                />
                
                <div className="project-overlay">
                  <div className="project-links">
                    {project.stlUrl && (
                      <a href={project.stlUrl} className="project-link" target="_blank" rel="noopener noreferrer">
                        <i className="icon">🧩</i> STL File
                      </a>
                    )}
                    {project.assemblyUrl && (
                      <a href={project.assemblyUrl} className="project-link" target="_blank" rel="noopener noreferrer">
                        <i className="icon">🧩</i> Assembly File
                      </a>
                    )}
                    {project.demoUrl && (
                      <a href={project.demoUrl} className="project-link" target="_blank" rel="noopener noreferrer">
                        <i className="icon">🎥</i> Demo
                      </a>
                    )}
                    {project.githubUrl && (
                      <a href={project.githubUrl} className="project-link" target="_blank" rel="noopener noreferrer">
                        <i className="icon">📁</i> GitHub
                      </a>
                    )}

                    {project.reportUrl && (
                      <a href={project.reportUrl} className="project-link" target="_blank" rel="noopener noreferrer">
                        <i className="icon">📄</i> Report
                      </a>
                    )}
                    {project.pcbUrl && (
                      <a href={project.pcbUrl} className="project-link" target="_blank" rel="noopener noreferrer">
                        <i className="icon">🗲</i> PCB
                      </a>
                    )}
                    {project.schematicUrl && (
                      <a href={project.schematicUrl} className="project-link" target="_blank" rel="noopener noreferrer">
                        <i className="icon">🗲</i> Schematic
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="project-content">
                <h3 className="project-title">{project.title}</h3>
                <p className="project-description">{project.description}</p>

                <div className="project-technologies">
                  {project.technologies.map((tech, idx) => (
                    <span key={idx} className="tech-tag">{tech}</span>
                  ))}
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
