/**
 * Portfolio projects — categories: Robotics | AI | Software | CAD | ROS2
 * github/demo optional per card
 */

export const CATEGORIES = ['All', 'Robotics', 'AI', 'Software', 'CAD', 'ROS2'];

export const ROS2_LEARNING_CARD = {
  id: 'ros2-learning',
  title: 'ROS2 & simulation stack',
  description:
    'Currently learning ROS2, SLAM, and robotic simulations with Gazebo — wiring perception ideas into real robot architectures.',
  image: '/SelfDriving.png',
  technologies: ['ROS2', 'SLAM', 'Gazebo', 'Python'],
  categories: ['ROS2', 'Robotics'],
  githubUrl: null,
  demoUrl: null,
  featured: true,
};

export const magnifiedFeatured = {
  title: 'Magnified Systems',
  status: 'Building in public',
  description:
    'Helmet-mounted impact sensing + ML — turning messy IMU traces into something usable when it actually matters.',
  bullets: [
    'ESP32 + IMU bring-up and field-ish prototyping',
    'Severity modeling (because “hard hit” isn’t a number)',
    'Tiny hardware loops, lots of logging, zero vibes-driven metrics',
  ],
  technologies: ['ESP32', 'IMU', 'PyTorch', 'Embedded'],
  categories: ['Robotics', 'AI'],
  primaryLabel: 'Follow build log',
  primaryUrl: 'https://www.instagram.com/magnifiedsystems/',
  secondaryLabel: 'Related ML repo',
  secondaryUrl: 'https://github.com/AurickAnwar/Impact-Analysis-ML',
};

export const projects = [
  {
    id: 'autonomous-carla',
    title: 'Autonomous driving in CARLA',
    description:
      'Simulated perception + decision loops — cameras, detections, and trying not to lawn-dart into NPC traffic.',
    image: '/SelfDriving.png',
    technologies: ['CARLA', 'YOLO', 'PyTorch', 'OpenCV'],
    categories: ['AI', 'Software'],
    githubUrl: 'https://github.com/AurickAnwar/Autonomous-Self-Driving-Vehicle',
    demoUrl: null,
  },
  {
    id: 'hand-gesture',
    title: 'Hand gesture computer control',
    description: 'Touchless control by mapping landmarks to shortcuts — satisfying when it works, humbling when it doesn’t.',
    image: '/HandGestureControl.jpg',
    technologies: ['MediaPipe', 'OpenCV', 'PyAutoGUI'],
    categories: ['AI', 'Software'],
    githubUrl: 'https://github.com/AurickAnwar/Real-Time-Hand-Gesture-Controller',
    demoUrl: null,
  },
  {
    id: 'impact-ml',
    title: 'Impact severity ML model',
    description: 'IMU streams → severity estimates — building intuition for real-world crash dynamics.',
    image: '/CrashSeverity.jpg',
    technologies: ['PyTorch', 'Python', 'Signal'],
    categories: ['AI', 'Software'],
    githubUrl: 'https://github.com/AurickAnwar/Impact-Analysis-ML',
    demoUrl: null,
  },
];
