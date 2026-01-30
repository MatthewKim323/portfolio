import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { FaEnvelope, FaLinkedin, FaGithub } from 'react-icons/fa';
import { useDarkMode } from '../contexts/DarkModeContext';

const Contact = () => {
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

  const socialLinks = [
    { icon: FaEnvelope, href: 'mailto:matthewykim23@gmail.com', label: 'Email' },
    { icon: FaGithub, href: 'https://github.com/MatthewKim323', label: 'GitHub' },
    { icon: FaLinkedin, href: 'https://www.linkedin.com/in/matthew-y-kim', label: 'LinkedIn' },
  ];

  return (
    <section 
      id="contact" 
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
            Contact
          </motion.span>
          
          {/* Main heading */}
          <motion.h2 
            variants={itemVariants}
            className="font-display text-4xl md:text-6xl lg:text-7xl font-semibold leading-tight mb-12"
            style={{ color: isDarkMode ? 'var(--color-text-dark, #e8e4dc)' : 'var(--color-text-light, #1a1f1c)' }}
          >
            let's get in touch!
          </motion.h2>

          <motion.p 
            variants={itemVariants}
            className="text-lg md:text-xl leading-relaxed mb-12 max-w-2xl"
            style={{ color: isDarkMode ? 'var(--color-muted-dark, #6b7c6e)' : 'var(--color-muted-light, #7a8278)' }}
          >
            have a project in mind, want to collaborate, or just say hello? 
            i'd love to hear from you.
          </motion.p>

          {/* Social links */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap gap-6"
          >
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <motion.a
                key={label}
                href={href}
                target={href.startsWith('mailto') ? undefined : '_blank'}
                rel={href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                className="group flex items-center gap-3 px-6 py-4 rounded-xl border transition-all duration-300"
                style={{ 
                  borderColor: isDarkMode ? 'rgba(139, 154, 109, 0.3)' : 'rgba(122, 130, 120, 0.3)',
                  color: isDarkMode ? 'var(--color-text-dark, #e8e4dc)' : 'var(--color-text-light, #1a1f1c)'
                }}
                whileHover={{ 
                  borderColor: isDarkMode ? 'var(--color-accent, #8b9a6d)' : 'var(--color-accent, #8b9a6d)',
                  scale: 1.02
                }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon 
                  size={20} 
                  style={{ color: isDarkMode ? 'var(--color-accent, #8b9a6d)' : 'var(--color-accent, #8b9a6d)' }}
                />
                <span className="text-sm font-medium tracking-wide">{label}</span>
              </motion.a>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
