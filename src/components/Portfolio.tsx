import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useDarkMode } from '../contexts/DarkModeContext';
import ProjectGallery from './ProjectGallery';

interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string[];
  techStack: string[];
  githubLink: string;
  liveLink?: string;
  video: string;
  icon?: string;
  iconDark?: string;
  iconBg?: string;
  iconBgLight?: string;
  iconBgDark?: string;
  iconSize?: string;
  invertIconInDarkMode?: boolean;
  invertIconInLightMode?: boolean;
  keepIconColors?: boolean;
  iconBrightness?: number;
  noIconFilter?: boolean;
  ribbonType?: 'winner' | 'project' | 'devtool' | 'homelab' | 'contract' | 'in progress';
  githubLabel?: string;
  liveLinkLabel?: string;
  liveLinkFirst?: boolean;
}

const projects: Project[] = [
  {
    id: 'solving-tft',
    title: 'solving tft.',
    subtitle: 'automated RL tft bot',
    description: [
      'in progress...',
    ],
    techStack: ['Python', 'RL', 'OpenCV'],
    githubLink: 'https://github.com/MatthewKim323/tft',
    video: '/media/projects/video/solving-tft.mp4',
    icon: '/media/project_icons/tft_icon.png',
    ribbonType: 'in progress',
    githubLabel: 'view code',
  },
  {
    id: 'ucsb-rec',
    title: 'ucsb rec cen tracker.',
    subtitle: 'improving ucsb rec cen live tracking',
    description: [
      'in progress...',
    ],
    techStack: ['React', 'TypeScript', 'Node.js'],
    githubLink: 'https://github.com/MatthewKim323',
    video: '/media/projects/video/ucsb-rec.mp4',
    icon: '/media/project_icons/ucsb_icon.png',
    ribbonType: 'in progress',
    githubLabel: 'view code',
  },
  {
    id: 'flow',
    title: 'flow.',
    subtitle: "2x sbhacks winner",
    description: [
      'architected asynchronous, <strong>multi-api generation pipeline</strong> (stt → orchestration → image gen → 3d conversion → rendering → vision-based q&a) with <strong>real-time websocket</strong> state streaming for ~5-minute world builds',
      'implemented first-person navigation with <strong>60 fps gaussian splat rendering</strong>, sphere-based raycast collision detection, smooth wall sliding, and wasd controls in three.js + sparkjs',
      'built <strong>vision-conditioned voice q&a system</strong> where screenshots of the user\'s current view are analyzed via <strong>multimodal llms</strong> to generate <strong>context-aware</strong> spoken explanations',
      'designed <strong>scene-library cache hierarchy</strong> (local → mongodb → generation) with rate-limiting and admin bypass, preventing <strong>redundant API calls</strong> and controlling compute abuse',
    ],
    techStack: ['React', 'TypeScript', 'Node.js', 'Three.js', 'WebSockets', 'MongoDB'],
    githubLink: 'https://devpost.com/software/flow-8pgm1k',
    liveLink: 'https://flow.stephenhung.me',
    video: 'https://8dsyyhtinkjxejan.public.blob.vercel-storage.com/flow.mp4',
            icon: '/media/project_icons/sbhacks_logo.png',
    iconSize: '85%',
    keepIconColors: false,
    iconBrightness: 0.8,
    ribbonType: 'winner',
    githubLabel: 'devpost',
    liveLinkLabel: 'live demo',
  },
  {
    id: 'him',
    title: 'him.',
    subtitle: 'ai slop, first project',
    description: [
      'ai-driven fitness and nutrition platform combining <strong>computer vision–based mechanical tension analysis</strong> (mediapipe + opencv) with rep detection, force–velocity modeling, and <strong>0–100% tension scoring</strong> across 22+ exercises to optimize <strong>hypertrophy and form feedback</strong>',
      '<strong>personalized food recommendation engine</strong> built on <strong>neural collaborative filtering</strong> (tensorflow/keras), leveraging a <strong>411+ food usda catalog with 70+ nutrient dimensions</strong> to generate goal-aware (calories/protein/diet) meal suggestions with explainable confidence scoring',
    ],
    techStack: ['Python', 'TensorFlow', 'Keras', 'MediaPipe', 'OpenCV', 'React'],
    githubLink: 'https://github.com/MatthewKim323/HimAI-v2',
    video: '/media/projects/video/him.mp4',
    icon: '/media/project_icons/him_icon.png',
    ribbonType: 'project',
    githubLabel: 'view code',
  },
];

const Portfolio = () => {
  const { isDarkMode } = useDarkMode();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px -20% 0px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.1
      } 
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } 
    },
  };

  return (
    <section
      id="portfolio"
      ref={ref}
      className="relative w-screen py-24 md:py-32"
    >
      {/* Background */}
      <motion.div
        className="absolute inset-0 -z-10"
        animate={{ 
          backgroundColor: isDarkMode ? 'var(--color-bg-dark, #0d1210)' : 'var(--color-bg-light, #f5f2ed)' 
        }}
        transition={{ duration: 0.5 }}
      />

      <div className="w-full max-w-5xl mx-auto px-8 md:px-12">
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          {/* Section label */}
          <motion.span 
            variants={itemVariants}
            className="inline-block text-sm tracking-[0.3em] uppercase mb-8"
            style={{ color: isDarkMode ? 'var(--color-accent, #8b9a6d)' : 'var(--color-muted-light, #7a8278)' }}
          >
            Portfolio
          </motion.span>
          
          {/* Main heading */}
          <motion.h2 
            variants={itemVariants}
            className="font-display text-4xl md:text-6xl lg:text-7xl font-semibold leading-tight mb-2"
            style={{ color: isDarkMode ? 'var(--color-text-dark, #e8e4dc)' : 'var(--color-text-light, #1a1f1c)' }}
          >
            things i made :)
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-sm md:text-base mb-16"
            style={{ color: isDarkMode ? 'var(--color-muted-dark, #6b7c6e)' : 'var(--color-muted-light, #7a8278)' }}
          >
            or making..
          </motion.p>

          {/* Projects gallery */}
          <ProjectGallery projects={projects} />

          {/* Decorative line */}
          <motion.div
            variants={itemVariants}
            className="mt-16 h-px w-24"
            style={{ backgroundColor: isDarkMode ? 'var(--color-accent, #8b9a6d)' : 'var(--color-accent, #8b9a6d)' }}
          />
        </motion.div>
          </div>
    </section>
  );
};

export default Portfolio;
