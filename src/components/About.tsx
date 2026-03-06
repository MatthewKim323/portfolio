import { motion, useInView, useMotionValue, useTransform, MotionValue } from 'framer-motion';
import { useRef, useEffect } from 'react';
import { useDarkMode } from '../contexts/DarkModeContext';

const allImages = [
  '/media/about/IMG_1373.JPG',
  '/media/about/IMG_2343.jpg',
  '/media/about/IMG_4227.JPG.JPEG',
  '/media/about/IMG_5060.JPEG',
  '/media/about/IMG_6390.JPG',
  '/media/about/IMG_9416.jpg',
  '/media/about/matt_fashion.jpg',
  '/media/about/matt_gf.jpg',
  '/media/about/matt_hike.jpg',
  '/media/about/matt_muscle.jpg',
  '/media/about/matt_retreat.jpg',
  '/media/about/matt_tn.jpg',
];

const col1Imgs = allImages.filter((_, i) => i % 3 === 0);
const col2Imgs = allImages.filter((_, i) => i % 3 === 1);
const col3Imgs = allImages.filter((_, i) => i % 3 === 2);

const looped = (arr: string[]) => [...arr, ...arr, ...arr];
const col1 = looped(col1Imgs);
const col2 = looped(col2Imgs);
const col3 = looped(col3Imgs);

const IMG_H = 220;
const GAP = 10;

const ImageColumn = ({
  images,
  y,
  startOffset = 0,
}: {
  images: string[];
  y: MotionValue<number>;
  startOffset?: number;
}) => (
  <motion.div
    className="flex-1 min-w-0 flex flex-col"
    style={{ y, marginTop: startOffset, gap: `${GAP}px` }}
  >
    {images.map((src, i) => (
      <div
        key={i}
        className="w-full overflow-hidden rounded-xl shrink-0"
        style={{ height: `${IMG_H}px` }}
      >
        <img
          src={src}
          alt=""
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            (e.currentTarget.parentElement as HTMLElement).style.display = 'none';
          }}
        />
      </div>
    ))}
  </motion.div>
);

const ScrollGallery = ({ sectionRef }: { sectionRef: React.RefObject<HTMLElement | null> }) => {
  const progress = useMotionValue(0);

  useEffect(() => {
    const container = document.querySelector('.scroll-container') as HTMLElement | null;
    if (!container) return;

    const update = () => {
      const section = sectionRef.current;
      if (!section) return;

      const containerRect = container.getBoundingClientRect();
      const sectionRect = section.getBoundingClientRect();
      const relTop = sectionRect.top - containerRect.top;
      const viewH = container.clientHeight;
      const secH = sectionRect.height;

      const p = (viewH - relTop) / (viewH + secH);
      progress.set(Math.min(1, Math.max(0, p)));
    };

    container.addEventListener('scroll', update, { passive: true });
    update();
    return () => container.removeEventListener('scroll', update);
  }, [progress, sectionRef]);

  const col1Y = useTransform(progress, [0, 1], [0, -700]);
  const col2Y = useTransform(progress, [0, 1], [-320, 380]);
  const col3Y = useTransform(progress, [0, 1], [0, -550]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Top fade */}
      <div
        className="absolute inset-x-0 top-0 z-10 pointer-events-none"
        style={{ height: '120px', background: 'linear-gradient(to bottom, var(--gallery-fade), transparent)' }}
      />
      {/* Bottom fade */}
      <div
        className="absolute inset-x-0 bottom-0 z-10 pointer-events-none"
        style={{ height: '120px', background: 'linear-gradient(to top, var(--gallery-fade), transparent)' }}
      />

      <div className="flex h-full items-start" style={{ gap: `${GAP}px`, padding: '0 2px' }}>
        <ImageColumn images={col1} y={col1Y} startOffset={-60} />
        <ImageColumn images={col2} y={col2Y} startOffset={0} />
        <ImageColumn images={col3} y={col3Y} startOffset={-130} />
      </div>
    </div>
  );
};

const About = () => {
  const { isDarkMode } = useDarkMode();
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef(null);
  const inView = useInView(textRef, { once: true, margin: '-20% 0px -20% 0px' });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const } },
  };

  const galleryFade = isDarkMode ? '#0d1210' : '#f5f2ed';

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative w-screen py-24 md:py-32"
      style={{ '--gallery-fade': galleryFade } as React.CSSProperties}
    >
      <motion.div
        className="absolute inset-0 -z-10"
        animate={{ backgroundColor: isDarkMode ? 'var(--color-bg-dark, #0d1210)' : 'var(--color-bg-light, #f5f2ed)' }}
        transition={{ duration: 0.5 }}
      />

      <div className="w-full max-w-6xl mx-auto px-8 md:pl-4 md:pr-0">
        <div className="grid grid-cols-1 md:grid-cols-[50%_50%] items-start">

          {/* Left — Text */}
          <motion.div
            ref={textRef}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={containerVariants}
            className="md:-ml-8 md:pr-12"
          >
            <motion.span
              variants={itemVariants}
              className="inline-block text-sm tracking-[0.3em] uppercase mb-6"
              style={{ color: isDarkMode ? '#4ade80' : '#22c55e' }}
            >
              About
            </motion.span>

            <motion.h2
              variants={itemVariants}
              className="font-display text-4xl md:text-6xl lg:text-7xl font-semibold leading-tight mb-10"
              style={{ color: isDarkMode ? 'var(--color-text-dark, #e8e4dc)' : 'var(--color-text-light, #1a1f1c)' }}
            >
              building things<br />
              <span style={{ color: '#4ade80' }}>for what i love.</span>
            </motion.h2>

            <motion.div variants={itemVariants} className="space-y-6">
              <p
                className="text-sm md:text-base lg:text-lg leading-relaxed"
                style={{ color: isDarkMode ? 'var(--color-muted-dark, #9ca3af)' : 'var(--color-muted-light, #6b7280)' }}
                dangerouslySetInnerHTML={{ __html: `hey, i'm <span style="color: ${isDarkMode ? '#fff' : '#1a1f1c'}; font-weight: 500">matt</span>!` }}
              />
              <p
                className="text-sm md:text-base lg:text-lg leading-relaxed"
                style={{ color: isDarkMode ? 'var(--color-muted-dark, #9ca3af)' : 'var(--color-muted-light, #6b7280)' }}
                dangerouslySetInnerHTML={{ __html: `a <strong style="color: ${isDarkMode ? '#d4d4d4' : '#1a1f1c'}">data science & economics</strong> double major at <strong style="color: ${isDarkMode ? '#d4d4d4' : '#1a1f1c'}">UCSB</strong> who loves finding patterns in chaos and turning data into things i can actually use.` }}
              />
              <p
                className="text-sm md:text-base lg:text-lg leading-relaxed"
                style={{ color: isDarkMode ? 'var(--color-muted-dark, #9ca3af)' : 'var(--color-muted-light, #6b7280)' }}
                dangerouslySetInnerHTML={{ __html: `most of what i build starts from my own life. i'm constantly using data to make better decisions, whether that's optimizing training for hypertrophy, figuring out the most nutrient dense meals, or building tools that save time and remove guesswork. i like messy, real-world data, especially when the goal isn't just analysis, but <strong style="color: ${isDarkMode ? '#d4d4d4' : '#1a1f1c'}">action</strong>.` }}
              />
              <p
                className="text-sm md:text-base lg:text-lg leading-relaxed"
                style={{ color: isDarkMode ? 'var(--color-muted-dark, #9ca3af)' : 'var(--color-muted-light, #6b7280)' }}
                dangerouslySetInnerHTML={{ __html: `recently i've been particularly interested in building <strong style="color: ${isDarkMode ? '#d4d4d4' : '#1a1f1c'}">agentic systems</strong> and <strong style="color: ${isDarkMode ? '#d4d4d4' : '#1a1f1c'}">autonomous pipelines</strong> that can take real-world tasks and run them end-to-end. instead of tools that simply analyze data, i like building systems that can <strong style="color: ${isDarkMode ? '#d4d4d4' : '#1a1f1c'}">observe</strong>, <strong style="color: ${isDarkMode ? '#d4d4d4' : '#1a1f1c'}">decide</strong>, and <strong style="color: ${isDarkMode ? '#d4d4d4' : '#1a1f1c'}">act</strong>, turning workflows that normally take hours of manual effort into automated processes that run in the background. a lot of my work sits at the intersection of data analysis, applied machine learning, and <strong style="color: ${isDarkMode ? '#d4d4d4' : '#1a1f1c'}">agent orchestration</strong>, where the goal is to design systems that make smarter decisions and meaningfully <strong style="color: ${isDarkMode ? '#d4d4d4' : '#1a1f1c'}">improve everyday life</strong>.` }}
              />
              <p
                className="text-sm md:text-base lg:text-lg leading-relaxed"
                style={{ color: isDarkMode ? 'var(--color-muted-dark, #9ca3af)' : 'var(--color-muted-light, #6b7280)' }}
              >
                outside of code and data, you'll find me hiking, hitting lifts, putting on tough fits, or exploring new sights with friends and family.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="mt-8 h-px w-16" style={{ backgroundColor: '#4ade80' }} />
          </motion.div>

          {/* Right — Scroll Gallery, fades in with the section */}
          <motion.div
            className="hidden md:block"
            style={{ height: '900px' }}
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          >
            <ScrollGallery sectionRef={sectionRef} />
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default About;
