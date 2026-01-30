import { motion } from 'framer-motion';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useDarkMode } from '../contexts/DarkModeContext';
import RibbonBadge from './RibbonBadge';
import ProjectVideo from './ProjectVideo';

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

interface ProjectGalleryProps {
  projects: Project[];
  mirrored?: boolean;
}

// Bento card with border glow and magnetism effect
const BentoCard = ({
  children,
  className = '',
  isDarkMode,
  externalHoverPosition = null,
  onHoverChange,
}: {
  children: React.ReactNode;
  className?: string;
  isDarkMode: boolean;
  externalHoverPosition?: { x: number; y: number } | null;
  onHoverChange?: (isHovered: boolean) => void;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [glowPosition, setGlowPosition] = useState({ x: 50, y: 50 });
  const [magnetPosition, setMagnetPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Handle external hover (from icon)
  useEffect(() => {
    if (externalHoverPosition && cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Convert percentage to pixels for magnetism
      const x = (externalHoverPosition.x / 100) * rect.width;
      const y = (externalHoverPosition.y / 100) * rect.height;

      setGlowPosition(externalHoverPosition);
      setMagnetPosition({
        x: (x - centerX) * 0.03,
        y: (y - centerY) * 0.03,
      });
    } else if (!externalHoverPosition && !isHovered) {
      setMagnetPosition({ x: 0, y: 0 });
    }
  }, [externalHoverPosition, isHovered]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Glow position (percentage)
    setGlowPosition({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });

    // Magnetism - subtle movement towards cursor
    setMagnetPosition({
      x: (x - centerX) * 0.03,
      y: (y - centerY) * 0.03,
    });
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    onHoverChange?.(true);
  }, [onHoverChange]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    onHoverChange?.(false);
    if (!externalHoverPosition) {
      setMagnetPosition({ x: 0, y: 0 });
    }
  }, [externalHoverPosition, onHoverChange]);

  return (
    <motion.div
      ref={cardRef}
      className={`relative rounded-2xl ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={{
        x: magnetPosition.x,
        y: magnetPosition.y,
        translateY: isHovered || externalHoverPosition ? -2 : 0,
      }}
      transition={{
        type: 'spring',
        stiffness: 150,
        damping: 15,
        mass: 0.1,
      }}
      style={{
        backgroundColor: isDarkMode ? '#0a0a0a' : '#fafafa',
        border: `1px solid ${isDarkMode ? '#222' : '#999'}`,
        boxShadow: isHovered || externalHoverPosition
          ? isDarkMode
            ? '0 12px 40px rgba(0, 0, 0, 0.7)'
            : '0 12px 40px rgba(0, 0, 0, 0.2)'
          : isDarkMode
            ? '0 4px 20px rgba(0, 0, 0, 0.4)'
            : '0 4px 20px rgba(0, 0, 0, 0.08)',
        transition: 'box-shadow 0.3s ease',
      }}
    >
      {/* Thick border glow effect - like Magic Bento */}
      <div
        className="absolute pointer-events-none rounded-2xl"
        style={{
          inset: 0,
          padding: '4px', // This creates the thick border
          opacity: isHovered || externalHoverPosition ? 1 : 0,
          transition: 'opacity 0.3s ease',
          background: `radial-gradient(
            600px circle at ${glowPosition.x}% ${glowPosition.y}%,
            ${isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.5)'} 0%,
            ${isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)'} 25%,
            transparent 50%
          )`,
          borderRadius: 'inherit',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
        }}
      />
      {/* Inner spotlight glow */}
      <div
        className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden"
        style={{
          opacity: isHovered || externalHoverPosition ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: `${glowPosition.x}%`,
            top: `${glowPosition.y}%`,
            transform: 'translate(-50%, -50%)',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: isDarkMode
              ? 'radial-gradient(circle, rgba(255,255,255,0.18) 0%, transparent 60%)'
              : 'radial-gradient(circle, rgba(0,0,0,0.1) 0%, transparent 60%)',
          }}
        />
      </div>
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

const ProjectGallery = ({ projects, mirrored = false }: ProjectGalleryProps) => {
  const { isDarkMode } = useDarkMode();
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const [lineHeight, setLineHeight] = useState(0);
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [hoverPosition, setHoverPosition] = useState<{ x: number; y: number } | null>(null);
  const iconRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const hoveredIconRef = useRef<string | null>(null);

  const updateHoverPosition = useCallback((projectId: string) => {
    const iconEl = iconRefs.current.get(projectId);
    const cardEl = cardRefs.current.get(projectId);
    if (iconEl && cardEl) {
      const iconRect = iconEl.getBoundingClientRect();
      const cardRect = cardEl.getBoundingClientRect();
      const iconCenterX = iconRect.left + iconRect.width / 2;
      const iconCenterY = iconRect.top + iconRect.height / 2;
      setHoverPosition({
        x: ((iconCenterX - cardRect.left) / cardRect.width) * 100,
        y: ((iconCenterY - cardRect.top) / cardRect.height) * 100,
      });
    }
  }, []);

  const handleIconHover = useCallback((projectId: string, isEntering: boolean) => {
    if (isEntering) {
      setHoveredIcon(projectId);
      hoveredIconRef.current = projectId;
      updateHoverPosition(projectId);
    } else {
      setHoveredIcon(null);
      hoveredIconRef.current = null;
      setHoverPosition(null);
    }
  }, [updateHoverPosition]);

  useEffect(() => {
    const updateHeight = () => {
      if (ref.current) {
        setHeight(ref.current.scrollHeight);
      }
    };
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, [projects]);

  // Track scroll progress using the custom scroll container
  useEffect(() => {
    const scrollContainer = document.querySelector('.scroll-container');
    if (!scrollContainer || !containerRef.current) return;

    const handleScroll = () => {
      if (!containerRef.current || !ref.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const scrollContainerRect = scrollContainer.getBoundingClientRect();
      const containerHeight = ref.current.scrollHeight;

      // The sticky icons stick at top-32 (128px) from the scroll container top
      const stickyPoint = scrollContainerRect.top + 128;

      // Progress starts when container top reaches the sticky point
      // and ends when container bottom passes the sticky point
      const distanceScrolled = stickyPoint - containerRect.top;
      const progress = Math.min(1, Math.max(0, distanceScrolled / containerHeight));

      setLineHeight(progress * containerHeight);

      // Update hover position during scroll if icon is hovered
      if (hoveredIconRef.current) {
        updateHoverPosition(hoveredIconRef.current);
      }
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call

    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, [height, updateHoverPosition]);

  return (
    <div className="w-full" ref={containerRef}>
      <div ref={ref} className="relative">
        {projects.map((project) => (
          <div
            key={project.id}
            className={`flex ${mirrored ? 'flex-row-reverse' : 'flex-row'} justify-start pt-4 md:pt-8 md:gap-8`}
          >
            {/* Logo placeholder on timeline */}
            <div
              className={`sticky flex flex-col z-40 items-center top-32 self-start shrink-0 ${
                mirrored ? 'items-end' : 'items-start'
              }`}
            >
              {/* Logo icon - rounded square style */}
              <motion.div
                ref={(el) => { if (el) iconRefs.current.set(project.id, el); }}
                className={`w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl overflow-hidden flex items-center justify-center cursor-pointer ${mirrored ? '-mr-1 md:mr-0' : '-ml-1 md:ml-0'}`}
                animate={{
                  scale: (hoveredIcon === project.id || hoveredCard === project.id) ? 1.35 : 1,
                  boxShadow: (hoveredIcon === project.id || hoveredCard === project.id)
                    ? isDarkMode
                      ? '0 8px 24px rgba(0,0,0,0.6)'
                      : '0 8px 24px rgba(0,0,0,0.15)'
                    : isDarkMode
                      ? '0 2px 8px rgba(0,0,0,0.4)'
                      : '0 2px 8px rgba(0,0,0,0.1)',
                }}
                style={{
                  background: '#0a0a0a',
                  border: `2px solid ${isDarkMode ? '#333' : '#444'}`,
                  willChange: 'transform',
                  transform: 'translateZ(0)',
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                onMouseEnter={() => handleIconHover(project.id, true)}
                onMouseLeave={() => handleIconHover(project.id, false)}
              >
                <img
                  src={(isDarkMode && project.iconDark) ? project.iconDark : (project.icon || project.video)}
                  alt={project.title}
                  className={project.icon ? "object-contain" : "w-full h-full object-cover"}
                  style={{
                    width: project.iconSize || '85%',
                    height: project.iconSize || '85%',
                    filter: project.noIconFilter ? 'none' : (project.keepIconColors ? `grayscale(1) brightness(${project.iconBrightness || 1.4})` : `grayscale(1) brightness(${project.iconBrightness !== undefined ? project.iconBrightness : 1})`),
                    mixBlendMode: project.id === 'flow' ? (isDarkMode ? 'screen' : 'multiply') : 'normal',
                  }}
                />
              </motion.div>
            </div>

            {/* Main bento card with gif */}
            <div
              ref={(el) => { if (el) cardRefs.current.set(project.id, el); }}
              className={`relative ${mirrored ? 'pr-3 md:pr-8' : 'pl-3 md:pl-8'} flex-1`}
            >
              <BentoCard
                isDarkMode={isDarkMode}
                externalHoverPosition={hoveredIcon === project.id ? hoverPosition : null}
                onHoverChange={(isHovered) => setHoveredCard(isHovered ? project.id : null)}
              >
                <div className="p-6 md:p-7">
                  {/* Outer frame with crosshatch corners */}
                  <div
                    className="relative p-1.5 md:p-2"
                    style={{
                      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
                    }}
                  >
                    {/* Edge lines with fade from corners to center */}
                    {/* Top edge - two halves fading to center */}
                    <div className="absolute top-0 left-0 w-1/2 h-[1px]" style={{ background: isDarkMode ? 'linear-gradient(to right, rgba(255,255,255,0.2), transparent)' : 'linear-gradient(to right, rgba(0,0,0,0.25), transparent)' }} />
                    <div className="absolute top-0 right-0 w-1/2 h-[1px]" style={{ background: isDarkMode ? 'linear-gradient(to left, rgba(255,255,255,0.2), transparent)' : 'linear-gradient(to left, rgba(0,0,0,0.25), transparent)' }} />
                    {/* Bottom edge */}
                    <div className="absolute bottom-0 left-0 w-1/2 h-[1px]" style={{ background: isDarkMode ? 'linear-gradient(to right, rgba(255,255,255,0.2), transparent)' : 'linear-gradient(to right, rgba(0,0,0,0.25), transparent)' }} />
                    <div className="absolute bottom-0 right-0 w-1/2 h-[1px]" style={{ background: isDarkMode ? 'linear-gradient(to left, rgba(255,255,255,0.2), transparent)' : 'linear-gradient(to left, rgba(0,0,0,0.25), transparent)' }} />
                    {/* Left edge - two halves fading to center */}
                    <div className="absolute top-0 left-0 w-[1px] h-1/2" style={{ background: isDarkMode ? 'linear-gradient(to bottom, rgba(255,255,255,0.2), transparent)' : 'linear-gradient(to bottom, rgba(0,0,0,0.25), transparent)' }} />
                    <div className="absolute bottom-0 left-0 w-[1px] h-1/2" style={{ background: isDarkMode ? 'linear-gradient(to top, rgba(255,255,255,0.2), transparent)' : 'linear-gradient(to top, rgba(0,0,0,0.25), transparent)' }} />
                    {/* Right edge */}
                    <div className="absolute top-0 right-0 w-[1px] h-1/2" style={{ background: isDarkMode ? 'linear-gradient(to bottom, rgba(255,255,255,0.2), transparent)' : 'linear-gradient(to bottom, rgba(0,0,0,0.25), transparent)' }} />
                    <div className="absolute bottom-0 right-0 w-[1px] h-1/2" style={{ background: isDarkMode ? 'linear-gradient(to top, rgba(255,255,255,0.2), transparent)' : 'linear-gradient(to top, rgba(0,0,0,0.25), transparent)' }} />

                    {/* Corner crosshatch extensions - fading outward */}
                    {/* Top left */}
                    <div className="absolute -top-3 md:-top-4 left-0 w-[1px] h-3 md:h-4" style={{ background: isDarkMode ? 'linear-gradient(to top, rgba(255,255,255,0.2), transparent)' : 'linear-gradient(to top, rgba(0,0,0,0.25), transparent)' }} />
                    <div className="absolute top-0 -left-3 md:-left-4 w-3 md:w-4 h-[1px]" style={{ background: isDarkMode ? 'linear-gradient(to left, rgba(255,255,255,0.2), transparent)' : 'linear-gradient(to left, rgba(0,0,0,0.25), transparent)' }} />
                    {/* Top right */}
                    <div className="absolute -top-3 md:-top-4 right-0 w-[1px] h-3 md:h-4" style={{ background: isDarkMode ? 'linear-gradient(to top, rgba(255,255,255,0.2), transparent)' : 'linear-gradient(to top, rgba(0,0,0,0.25), transparent)' }} />
                    <div className="absolute top-0 -right-3 md:-right-4 w-3 md:w-4 h-[1px]" style={{ background: isDarkMode ? 'linear-gradient(to right, rgba(255,255,255,0.2), transparent)' : 'linear-gradient(to right, rgba(0,0,0,0.25), transparent)' }} />
                    {/* Bottom left */}
                    <div className="absolute -bottom-3 md:-bottom-4 left-0 w-[1px] h-3 md:h-4" style={{ background: isDarkMode ? 'linear-gradient(to bottom, rgba(255,255,255,0.2), transparent)' : 'linear-gradient(to bottom, rgba(0,0,0,0.25), transparent)' }} />
                    <div className="absolute bottom-0 -left-3 md:-left-4 w-3 md:w-4 h-[1px]" style={{ background: isDarkMode ? 'linear-gradient(to left, rgba(255,255,255,0.2), transparent)' : 'linear-gradient(to left, rgba(0,0,0,0.25), transparent)' }} />
                    {/* Bottom right */}
                    <div className="absolute -bottom-3 md:-bottom-4 right-0 w-[1px] h-3 md:h-4" style={{ background: isDarkMode ? 'linear-gradient(to bottom, rgba(255,255,255,0.2), transparent)' : 'linear-gradient(to bottom, rgba(0,0,0,0.25), transparent)' }} />
                    <div className="absolute bottom-0 -right-3 md:-right-4 w-3 md:w-4 h-[1px]" style={{ background: isDarkMode ? 'linear-gradient(to right, rgba(255,255,255,0.2), transparent)' : 'linear-gradient(to right, rgba(0,0,0,0.25), transparent)' }} />

                    {/* Video container - recessed/sunken look */}
                    <div
                      className="aspect-video w-full overflow-hidden relative"
                      style={{
                        boxShadow: isDarkMode
                          ? 'inset 0 2px 10px rgba(0,0,0,0.8), inset 0 0 20px rgba(0,0,0,0.5)'
                          : 'inset 0 2px 10px rgba(0,0,0,0.2), inset 0 0 20px rgba(0,0,0,0.1)',
                      }}
                    >
                      <ProjectVideo videoSrc={project.video} />
                      {/* Inset shadow overlay */}
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          boxShadow: isDarkMode
                            ? 'inset 0 2px 15px rgba(0,0,0,0.7), inset 0 0 30px rgba(0,0,0,0.4)'
                            : 'inset 0 2px 15px rgba(0,0,0,0.15), inset 0 0 30px rgba(0,0,0,0.18)',
                        }}
                      />
                      {/* Ribbon badge */}
                      {project.ribbonType && <RibbonBadge type={project.ribbonType} />}
                    </div>
                  </div>

                  {/* Content below gif */}
                  <div className="pt-4 md:pt-5">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <h3
                          className="text-lg md:text-xl font-bold font-serif"
                          style={{ color: isDarkMode ? '#e5e5e5' : '#000000' }}
                        >
                          {project.title}
                        </h3>
                        <p
                          className="text-xs md:text-sm"
                          style={{ color: isDarkMode ? '#666' : '#888' }}
                        >
                          {project.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* Bullet points */}
                    <ul
                      className="space-y-2 mb-5 pl-4"
                      style={{ color: isDarkMode ? '#888' : '#555' }}
                    >
                      {project.description.slice(0, 4).map((point, idx) => (
                        <li
                          key={idx}
                          className="text-[11px] md:text-xs leading-relaxed relative pl-3"
                          style={{ listStyle: 'none' }}
                        >
                          <span
                            className="absolute left-0 top-[0.65em] w-1 h-1 rounded-full"
                            style={{ backgroundColor: isDarkMode ? '#555' : '#999' }}
                          />
                          <span className={/\S{25,}/.test(point) ? "break-all" : ""} dangerouslySetInnerHTML={{ __html: point }} />
                        </li>
                      ))}
                    </ul>

                    {/* Buttons - mobile header style */}
                    <div className={`flex items-center gap-2 ${project.liveLinkFirst ? 'flex-row-reverse justify-end' : ''}`}>
                      <a
                        href={project.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-full text-[10px] md:text-[11px] transition-transform hover:scale-105 active:scale-95"
                        style={{
                          backgroundColor: isDarkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.015)',
                          color: isDarkMode ? '#e5e5e5' : '#000000',
                          boxShadow: isDarkMode
                            ? '0px 4px 15px rgba(0, 0, 0, 0.3), inset 0px 1px 1px rgba(255, 255, 255, 0.05), inset 0px -1px 1px rgba(0, 0, 0, 0.2)'
                            : '0px 4px 15px rgba(0, 0, 0, 0.1), inset 0px 1px 1px rgba(255, 255, 255, 1), inset 0px -1px 1px rgba(0, 0, 0, 0.05)',
                          border: '1px solid rgba(0, 0, 0, 0.02)',
                        }}
                      >
                        {project.githubLabel || 'view code'}
                      </a>
                      {project.liveLink && (
                        <a
                          href={project.liveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-full text-[10px] md:text-[11px] transition-transform hover:scale-105 active:scale-95"
                          style={{
                            backgroundColor: isDarkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.015)',
                            color: isDarkMode ? '#e5e5e5' : '#000000',
                            boxShadow: isDarkMode
                              ? '0px 4px 15px rgba(0, 0, 0, 0.3), inset 0px 1px 1px rgba(255, 255, 255, 0.05), inset 0px -1px 1px rgba(0, 0, 0, 0.2)'
                              : '0px 4px 15px rgba(0, 0, 0, 0.1), inset 0px 1px 1px rgba(255, 255, 255, 1), inset 0px -1px 1px rgba(0, 0, 0, 0.05)',
                            border: '1px solid rgba(0, 0, 0, 0.02)',
                          }}
                        >
                          {project.liveLinkLabel || 'live demo'}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </BentoCard>
            </div>
          </div>
        ))}

        {/* Animated timeline line - hidden on mobile */}
        <div
          style={{ height: height + 120 + 'px', top: '-60px' }}
          className={`absolute ${mirrored ? 'right-[12px] md:right-[22px]' : 'left-[12px] md:left-[22px]'} w-[2px]`}
        >
          {/* Background line - fades in and out */}
          <div
            className="absolute inset-0 w-full"
            style={{
              background: isDarkMode
                ? 'linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.18) 10%, rgba(255,255,255,0.18) 92%, transparent 100%)'
                : 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.18) 10%, rgba(0,0,0,0.18) 92%, transparent 100%)',
            }}
          />
          {/* Progress line that fills as you scroll - fades in/out */}
          <div
            className="absolute left-0 w-full"
            style={{
              top: '60px',
              height: `${lineHeight}px`,
              opacity: Math.min(1, lineHeight / 400) * (1 - Math.max(0, (lineHeight - height * 0.8) / (height * 0.2))),
              transition: 'opacity 0.2s ease-out',
              background: isDarkMode
                ? 'linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.2) 25%, rgba(255,255,255,0.2) 85%, transparent 98%)'
                : 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.15) 25%, rgba(0,0,0,0.15) 85%, transparent 98%)',
              boxShadow: isDarkMode
                ? '0 0 8px rgba(255,255,255,0.1), 0 0 20px rgba(255,255,255,0.05)'
                : '0 0 8px rgba(0,0,0,0.18), 0 0 20px rgba(0,0,0,0.04)',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectGallery;
