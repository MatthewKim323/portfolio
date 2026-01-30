import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { LuHouse } from "react-icons/lu";

interface GlassNavProps {
  isVisible: boolean;
}

const GlassNav = ({ isVisible }: GlassNavProps) => {
  const [activeSection, setActiveSection] = useState('home');

  const sections = [
    { id: 'home', label: 'home', isHome: true },
    { id: 'about', label: 'about' },
    { id: 'portfolio', label: 'portfolio' },
    { id: 'contact', label: 'contact' },
  ];

  // Track scroll position to highlight active section
  useEffect(() => {
    const scrollContainer = document.querySelector('.scroll-container');
    if (!scrollContainer) return;

    const handleScroll = () => {
      const scrollPosition = scrollContainer.scrollTop + 200;

      for (const section of [...sections].reverse()) {
        const element = document.getElementById(section.id);
        if (element && scrollPosition >= element.offsetTop) {
          setActiveSection(section.id);
          return;
        }
      }
      setActiveSection('home');
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    const scrollContainer = document.querySelector('.scroll-container');
    if (element && scrollContainer) {
      const offsetTop = id === 'home' ? 0 : element.offsetTop;
      scrollContainer.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  };

  return (
    <motion.nav
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50"
      initial={{ opacity: 0, y: -20 }}
      animate={{ 
        opacity: isVisible ? 1 : 0, 
        y: isVisible ? 0 : -20 
      }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Clean glass pill */}
      <div 
        className="flex items-center px-2 py-2 rounded-full"
        style={{
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.15)',
        }}
      >
        {sections.map((section, index) => (
          <div key={section.id} className="flex items-center">
            {section.isHome ? (
              <>
                <button
                  onClick={() => scrollToSection(section.id)}
                  className="px-3 py-2 rounded-full transition-all duration-300 hover:bg-white/10"
                  style={{
                    color: activeSection === section.id ? '#4ade80' : '#ffffff',
                  }}
                >
                  <LuHouse className="w-4 h-4" strokeWidth={1.5} style={{ color: '#ffffff' }} />
                </button>
                <div className="w-px h-4 mx-1 bg-white/20" />
              </>
            ) : (
              <>
                <button
                  onClick={() => scrollToSection(section.id)}
                  className="px-4 py-2 rounded-full text-sm transition-all duration-300 hover:bg-white/10"
                  style={{
                    color: activeSection === section.id ? '#4ade80' : '#ffffff',
                    fontFamily: 'Outfit, sans-serif',
                    fontWeight: 400,
                  }}
                >
                  {section.label}
                </button>
                {index < sections.length - 1 && (
                  <div className="w-px h-4 bg-white/15" />
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </motion.nav>
  );
};

export default GlassNav;
