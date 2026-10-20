import { portfolioProjects } from './portfolioProjects';
import { workExperience } from './workExperience';

export const SITE_EMAIL = 'aurick.anwar@gmail.com';

export const SITE_SOCIAL = [
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/aurick-anwar',
    icon: '/Linkedin.png',
  },
  {
    label: 'GitHub',
    href: 'https://github.com/007Aurick',
    icon: '/Github.png',
  },
  {
    label: 'X',
    href: 'https://x.com/007Aurick',
    icon: '/twitter.png',
  },
];

export const SITE_ABOUT = {
  name: 'Aurick Anwar',
  school: 'Engineering Physics @ McMaster University',
  schoolHref: 'https://www.mcmaster.ca/',
  location: 'Hamilton, Ontario',
  blurb: 'I build ML, robotics and computer vision pipelines.',
  bullets: [
    'Building diffusion models at Magic Hour AI: upscalers, edits, and video pipelines on real GPUs.',
    'Building ROS 2 autonomy for Mars Rover and drone teams, from perception and localization to full sim stacks.',
    'Seeking summer 2027 internships',
  ],
  heroImage: '/hero.jpg',
};

const WORK_DATES = {
  'magic-hour-ai': 'Sep 2026 — Present',
  hermesai: 'May 2026 — Aug 2026',
  'mcmaster-mars-rover': 'Sep 2026 — Present',
  'McMaster Drone': 'Jun 2026 — Present',
};

export const SITE_WORK = workExperience.map((entry) => ({
  ...entry,
  datesCompact: WORK_DATES[entry.id] ?? entry.dates,
}));

export const MAIN_PROJECT_SLUGS = [
  'nl-robot',
  'autonomous-self-driving-carla',
  'breast-cancer-cell-detection',
  'telearm',
];

const PROJECT_META = {
  'nl-robot': {
    title: 'NL-Robot',
    line: 'Natural-language robot control in ROS 2 + Gazebo.',
    github: 'https://github.com/007Aurick/NL-ROBOT',
  },
  'autonomous-self-driving-carla': {
    title: 'Self-Driving in CARLA',
    line: 'Live perception and decision dashboard in sim.',
    github: 'https://github.com/AurickAnwar/Autonomous-Self-Driving-Vehicle',
  },
  'breast-cancer-cell-detection': {
    title: 'Breast Cancer Detection',
    line: 'YOLO + Grad-CAM medical imaging pipeline.',
    github: 'https://github.com/AurickAnwar/Cancer-Cell-Detection',
  },
  telearm: {
    title: 'TeleARM',
    line: 'Autonomous warehouse forklift in ROS 2.',
    github: 'https://github.com/007Aurick/TeleARM',
  },
};

function buildWriteup(project) {
  const overview = project.overview || [];
  const technical = project.technical || [];
  return [project.description, overview[0], overview[1], technical[0]].filter(Boolean);
}

export const SITE_PROJECTS = MAIN_PROJECT_SLUGS.map((slug) => {
  const project = portfolioProjects.find((p) => p.slug === slug);
  const meta = PROJECT_META[slug];
  if (!project || !meta) return null;
  const github = meta.github || project.projectUrl;
  return {
    slug: project.slug,
    title: meta.title,
    line: meta.line,
    image: project.image,
    imageObjectPosition: project.imageObjectPosition,
    writeup: buildWriteup(project),
    stack: project.technologies || [],
    youtubeId: project.youtubeVideoId || null,
    github,
  };
}).filter(Boolean);

export const RESUME_PDF = '/resume-AurickAnwar.pdf';
