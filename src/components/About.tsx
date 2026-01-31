import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { useDarkMode } from '../contexts/DarkModeContext';

const About = () => {
  const { isDarkMode } = useDarkMode();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px -20% 0px" });
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const [hoveredPhoto, setHoveredPhoto] = useState<number | null>(null);

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
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const } 
    },
  };

  // Your photos with positions/rotations for table spread effect - moved up and added 2 new ones below
  const photos = [
    { src: '/media/about/matt_fashion.jpg', rotation: -12, x: -120, y: 165 },
    { src: '/media/about/matt_muscle.jpg', rotation: 15, x: 135, y: 145 },
    { src: '/media/about/matt_hike.jpg', rotation: -8, x: -140, y: 365 },
    { src: '/media/about/matt_gf.jpg', rotation: 10, x: 155, y: 345 },
    { src: '/media/about/matt_tn.jpg', rotation: -10, x: -100, y: 565 },
    { src: '/media/about/matt_retreat.jpg', rotation: 12, x: 145, y: 545 },
  ];

  return (
    <section 
      id="about" 
      ref={ref} 
      className="relative min-h-screen w-screen flex items-center py-24 md:py-32"
    >
      {/* Background */}
      <motion.div
        className="absolute inset-0 -z-10"
        animate={{ 
          backgroundColor: isDarkMode ? 'var(--color-bg-dark, #0d1210)' : 'var(--color-bg-light, #f5f2ed)' 
        }}
        transition={{ duration: 0.5 }}
      />

      <div className="w-full max-w-6xl mx-auto px-8 md:pl-4 md:pr-12">
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-[48%_52%] gap-12 md:gap-12 items-center"
        >
          {/* Left side - Text Content */}
          <motion.div
            variants={containerVariants}
            className="order-2 md:order-1 md:-ml-8"
            style={{ maxWidth: '100%' }}
          >
            {/* Section label */}
            <motion.span 
              variants={itemVariants}
              className="inline-block text-sm tracking-[0.3em] uppercase mb-6"
              style={{ color: isDarkMode ? '#4ade80' : '#22c55e' }}
            >
              About
            </motion.span>
            
            {/* Main heading */}
            <motion.h2 
              variants={itemVariants}
              className="font-display text-4xl md:text-6xl lg:text-7xl font-semibold leading-tight mb-10"
              style={{ color: isDarkMode ? 'var(--color-text-dark, #e8e4dc)' : 'var(--color-text-light, #1a1f1c)' }}
            >
              building things<br />
              <span style={{ color: '#4ade80' }}>
                for what i love.
              </span>
            </motion.h2>

            {/* Bio paragraphs */}
            <motion.div variants={itemVariants} className="space-y-6">
              <p 
                className="text-sm md:text-base lg:text-lg leading-relaxed"
                style={{ color: isDarkMode ? 'var(--color-muted-dark, #9ca3af)' : 'var(--color-muted-light, #6b7280)' }}
                dangerouslySetInnerHTML={{
                  __html: `Hey, I'm <span style="color: ${isDarkMode ? '#fff' : '#1a1f1c'}; font-weight: 500">Matt</span>!`
                }}
              />
              <p 
                className="text-sm md:text-base lg:text-lg leading-relaxed"
                style={{ color: isDarkMode ? 'var(--color-muted-dark, #9ca3af)' : 'var(--color-muted-light, #6b7280)' }}
                dangerouslySetInnerHTML={{
                  __html: `A <strong style="color: ${isDarkMode ? '#d4d4d4' : '#1a1f1c'}">Data Science & Economics</strong> double major at <strong style="color: ${isDarkMode ? '#d4d4d4' : '#1a1f1c'}">UCSB</strong> who loves finding patterns in chaos and turning data into things I can actually use.`
                }}
              />
              <p 
                className="text-sm md:text-base lg:text-lg leading-relaxed"
                style={{ color: isDarkMode ? 'var(--color-muted-dark, #9ca3af)' : 'var(--color-muted-light, #6b7280)' }}
                dangerouslySetInnerHTML={{
                  __html: `Most of what I build starts from my own life. I'm constantly using data to make better decisions, whether that's optimizing training for hypertrophy, figuring out the most nutrient-dense meals, or building tools that save time and remove guesswork. I like messy, real-world data, especially when the goal isn't just analysis, but <strong style="color: ${isDarkMode ? '#d4d4d4' : '#1a1f1c'}">action</strong>.`
                }}
              />
              <p 
                className="text-sm md:text-base lg:text-lg leading-relaxed"
                style={{ color: isDarkMode ? 'var(--color-muted-dark, #9ca3af)' : 'var(--color-muted-light, #6b7280)' }}
                dangerouslySetInnerHTML={{
                  __html: `Recently, I've been particularly invested in using <strong style="color: ${isDarkMode ? '#d4d4d4' : '#1a1f1c'}">simulation data</strong> to model complex systems and <strong style="color: ${isDarkMode ? '#d4d4d4' : '#1a1f1c'}">train</strong> models in controlled environments, where strategies can be tested, iterated on, and stress-tested before being applied in the real world. A lot of my work sits at the intersection of data analysis and applied machine learning, and I'm interested in how models can be trained to make smarter decisions under uncertainty. I enjoy building <strong style="color: ${isDarkMode ? '#d4d4d4' : '#1a1f1c'}">end-to-end systems</strong>, from collecting or generating data to modeling it and turning the results into something <strong style="color: ${isDarkMode ? '#d4d4d4' : '#1a1f1c'}">interactive and useful</strong>.`
                }}
              />
              <p 
                className="text-sm md:text-base lg:text-lg leading-relaxed"
                style={{ color: isDarkMode ? 'var(--color-muted-dark, #9ca3af)' : 'var(--color-muted-light, #6b7280)' }}
              >
                Outside of code and data, you'll find me hiking, hitting lifts, putting on tough fits, or exploring new sights with friends and family.
              </p>
            </motion.div>

            {/* Decorative line */}
            <motion.div 
              variants={itemVariants}
              className="mt-8 h-px w-16"
              style={{ backgroundColor: '#4ade80' }}
            />
          </motion.div>

          {/* Right side - Photo Table Spread */}
          <motion.div 
            variants={itemVariants}
            className="relative order-1 md:order-2"
            style={{ minHeight: '900px', width: '100%' }}
          >
            <div className="relative w-full h-full flex items-start justify-center" style={{ paddingTop: '40px' }}>
              {photos.map((photo, index) => (
                <motion.div
                  key={index}
                  className="absolute cursor-pointer"
                  initial={{ 
                    x: photo.x,
                    y: photo.y,
                    rotate: photo.rotation,
                    scale: 0.9,
                  }}
                  animate={{
                    x: selectedPhoto === index ? 0 : photo.x,
                    y: selectedPhoto === index ? 0 : (hoveredPhoto === index ? photo.y - 15 : photo.y),
                    rotate: selectedPhoto === index ? 0 : (hoveredPhoto === index ? photo.rotation * 0.7 : photo.rotation),
                    scale: selectedPhoto === index ? 1.2 : (hoveredPhoto === index ? 1.08 : selectedPhoto !== null ? 0.75 : 0.9),
                    zIndex: selectedPhoto === index ? 50 : (hoveredPhoto === index ? 50 : 10 - index),
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 25,
                  }}
                  onHoverStart={() => setHoveredPhoto(index)}
                  onHoverEnd={() => setHoveredPhoto(null)}
                  onClick={() => setSelectedPhoto(selectedPhoto === index ? null : index)}
                >
                  <motion.div
                    className="relative"
                    style={{
                      width: '280px',
                      height: '350px',
                    }}
                    whileHover={{
                      filter: 'brightness(1.05)',
                    }}
                >
                    <img
                      src={photo.src}
                      alt={`Matt ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                      style={{
                        boxShadow: selectedPhoto === index 
                          ? '0 40px 80px -12px rgba(0, 0, 0, 0.6), 0 0 0 3px rgba(74, 222, 128, 0.4)'
                          : '0 15px 35px -5px rgba(0, 0, 0, 0.4)',
                        border: '4px solid rgba(255, 255, 255, 0.95)',
                      }}
                    />
                    {/* Photo paper texture effect */}
                    <div 
                      className="absolute inset-0 rounded-lg pointer-events-none"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.05) 100%)',
                        mixBlendMode: 'overlay',
                      }}
                    />
                  </motion.div>
                </motion.div>
              ))}
            </div>
        </motion.div>
      </motion.div>
    </div>
    </section>
  );
};

export default About;
