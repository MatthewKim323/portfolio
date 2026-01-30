import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import './App.css';
import VideoBackground from './components/VideoBackground';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import About from './components/About';
import Loading from './components/Loading';
import Portfolio from './components/Portfolio';
import Contact from './components/Contact';
import GlassNav from './components/GlassNav';
import { useDarkMode } from './contexts/DarkModeContext';

function App() {
  const { isDarkMode } = useDarkMode();
  const [isLoading, setIsLoading] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [isScrollingEnabled, setIsScrollingEnabled] = useState(false);
  const [viewCount, setViewCount] = useState<number | null>(null);

  const heroRef = useRef(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    container: scrollRef,
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Subtle parallax for hero text
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.5], ["0%", "20%"]);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    window.addEventListener('beforeunload', () => window.scrollTo(0, 0));
    return () => {
      window.removeEventListener('beforeunload', () => window.scrollTo(0, 0));
    };
  }, []);

  // Sequenced animation: Loading -> Video fade in -> Content reveal
  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
      
      setTimeout(() => {
        setShowVideo(true);
        
        setTimeout(() => {
          setShowContent(true);
          
          setTimeout(() => {
            setIsScrollingEnabled(true);
          }, 1200);
        }, 800);
      }, 400);
    }, 2500);

    return () => clearTimeout(loadingTimer);
  }, []);

  useEffect(() => {
    if (isScrollingEnabled) {
      document.body.style.overflow = 'auto';
    } else {
      document.body.style.overflow = 'hidden';
    }
  }, [isScrollingEnabled]);

  // View counter - show cached value first, then fetch fresh
  useEffect(() => {
    const CACHE_KEY = 'portfolio_views_cache';

    // Show cached value immediately
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const cachedCount = parseInt(cached, 10);
      console.log(`Loading cached view count: ${cachedCount}`);
      setViewCount(cachedCount);
    } else {
      // Show 0 as fallback if no cache
      console.log('No cached view count, starting at 0');
      setViewCount(0);
    }

    // Fetch fresh data in background
    const fetchViewCount = async () => {
      console.log('Starting view counter fetch...');
      try {
        const response = await fetch('/api/views');
        console.log('View counter fetch response status:', response.status, response.ok);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('View counter API error:', response.status, errorText);
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('View counter API response:', data);
        
        if (data.views !== undefined && typeof data.views === 'number') {
          console.log(`Updating view count from ${viewCount} to ${data.views}`);
          setViewCount(data.views);
          localStorage.setItem(CACHE_KEY, data.views.toString());
          console.log('View count updated successfully');
        } else {
          console.warn('View counter response missing or invalid views property:', data);
        }
      } catch (error) {
        console.error('View counter fetch failed:', error);
        if (error instanceof Error) {
          console.error('Error details:', error.message, error.stack);
        }
        // Keep showing cached value or 0 if fetch fails
      }
    };

    fetchViewCount();
  }, []);

  return (
    <div
      style={{ 
        backgroundColor: isDarkMode ? '#0d1210' : '#f5f2ed',
        minHeight: '100vh'
      }}
    >
      <AnimatePresence>
        {isLoading && <Loading />}
      </AnimatePresence>

      {/* Glassmorphic Navigation */}
      <GlassNav isVisible={showContent} />

      <div className="scroll-container" ref={scrollRef}>
        {/* Hero Section - Full screen video */}
        <section
          id="home"
          ref={heroRef}
          className="w-screen h-screen relative"
        >
          {/* Video background with fade-in */}
          <VideoBackground 
            videoSrc="https://8dsyyhtinkjxejan.public.blob.vercel-storage.com/hero-video.mp4" 
            isVisible={showVideo}
          />

          {/* Hero content overlay */}
          <motion.div
            className="absolute inset-0 z-10 flex items-center justify-center"
            style={{ opacity: heroOpacity, y: heroY }}
          >
            <div className="text-center px-6">
              {/* Name with staggered reveal */}
              <motion.h1
                className="font-display text-6xl md:text-[10rem] font-semibold text-white tracking-tight leading-none"
                initial={{ opacity: 0, y: 50 }}
                animate={showContent ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] as const }}
              >
                Matthew
              </motion.h1>
              <motion.h1
                className="font-display text-6xl md:text-[10rem] font-semibold text-white tracking-tight leading-none -mt-2 md:-mt-6"
                initial={{ opacity: 0, y: 50 }}
                animate={showContent ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
              >
                Kim
              </motion.h1>
              
              {/* Tagline - Data Science focused */}
              <motion.p
                className="mt-8 text-lg md:text-xl text-white/80 font-light tracking-widest uppercase"
                initial={{ opacity: 0, y: 20 }}
                animate={showContent ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as const, delay: 0.4 }}
              >
                Data Science & Economics
              </motion.p>

              {/* View counter */}
              <motion.p
                className="mt-3 text-sm md:text-base text-white/60 font-light tracking-wide"
                initial={{ opacity: 0 }}
                animate={showContent ? { opacity: 1 } : {}}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as const, delay: 0.6 }}
              >
                {viewCount !== null ? (
                  <>
                    {viewCount.toLocaleString()} {viewCount === 1 ? 'view' : 'views'}
                  </>
                ) : (
                  'loading views...'
                )}
              </motion.p>

              {/* Scroll indicator */}
              <motion.div
                className="absolute bottom-12 left-1/2 -translate-x-1/2"
                initial={{ opacity: 0 }}
                animate={showContent ? { opacity: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <motion.div
                  className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center"
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <motion.div 
                    className="w-1.5 h-3 bg-white/60 rounded-full mt-2"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                </motion.div>
              </motion.div>
            </div>
          </motion.div>

          {/* Gradient overlay at bottom for smooth transition */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-48 z-20 pointer-events-none"
            style={{
              background: isDarkMode 
                ? 'linear-gradient(to top, #0d1210 0%, transparent 100%)'
                : 'linear-gradient(to top, #f5f2ed 0%, transparent 100%)'
            }}
          />
        </section>

        <About />
        <Portfolio />
        <Contact />
      </div>
    </div>
  );
}

export default App;
