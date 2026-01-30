import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface VideoBackgroundProps {
  videoSrc?: string;
  youtubeId?: string;
  isVisible?: boolean;
}

const VideoBackground = ({ 
  videoSrc,
  youtubeId,
  isVisible = true
}: VideoBackgroundProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isInView, setIsInView] = useState(true);
  const [videoError, setVideoError] = useState(false);

  // Pause when off-screen for performance
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
        if (videoRef.current) {
          if (entry.isIntersecting) {
            videoRef.current.play().catch(() => {});
          } else {
            videoRef.current.pause();
          }
        }
      },
      { threshold: 0 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const handleVideoError = () => {
    console.log('Video failed to load, falling back to YouTube');
    setVideoError(true);
  };

  const shouldUseYoutube = (!videoSrc || videoError) && youtubeId;

  return (
    <motion.div 
      ref={containerRef} 
      className="absolute inset-0 w-full h-full overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Dark base */}
      <div className="absolute inset-0 bg-black" />
      
      {isInView && (
        <>
          {videoSrc && !videoError ? (
            <video
              ref={videoRef}
              className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto object-cover"
              style={{ transform: 'translate(-50%, -50%)' }}
              autoPlay
              muted
              loop
              playsInline
              onError={handleVideoError}
              src={videoSrc}
            />
          ) : shouldUseYoutube ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <iframe
                className="w-[300vw] h-[300vh] md:w-[200vw] md:h-[200vh] min-w-full min-h-full pointer-events-none"
                style={{
                  border: 'none',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
                src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&iv_load_policy=3&disablekb=1&vq=hd1080`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                title="Background Video"
              />
            </div>
          ) : null}
          
          {/* Dimming overlay - stronger for text readability */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.35) 40%, rgba(0,0,0,0.35) 60%, rgba(0,0,0,0.6) 100%)',
            }}
          />
          
          {/* Color grade */}
          <div 
            className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-20"
            style={{
              background: 'linear-gradient(135deg, #2d4a3e 0%, transparent 50%, #3d2a1f 100%)',
            }}
          />
          
          {/* Vignette */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{ boxShadow: 'inset 0 0 250px 100px rgba(0,0,0,0.6)' }}
          />
        </>
      )}
    </motion.div>
  );
};

export default VideoBackground;
