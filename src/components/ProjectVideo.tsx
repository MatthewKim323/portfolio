import { useRef, useEffect, useState } from 'react';

interface ProjectVideoProps {
  videoSrc: string;
}

const ProjectVideo = ({ videoSrc }: ProjectVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasError, setHasError] = useState(false);

  // Only load video when in view
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (videoRef.current) {
          if (entry.isIntersecting) {
            videoRef.current.play().catch(() => {
              // Silently handle play errors
            });
          } else {
            videoRef.current.pause();
          }
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const handleError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const video = e.currentTarget;
    // Check if video actually failed to load
    if (video.error && video.error.code !== 0) {
      console.error(`Failed to load video: ${videoSrc}`, video.error);
      // Only show error for actual load failures, not format issues
      if (video.error.code === MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED) {
        console.warn(`Video format not supported: ${videoSrc}`);
      }
      setHasError(true);
    }
  };


  // Don't show error for projects without videos (empty video path)
  if (!videoSrc || videoSrc === '') {
    return null;
  }

  // Only show error if video actually fails after trying to load
  // Don't show error immediately - give it time to load
  if (hasError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black/20">
        <span className="text-xs text-gray-500">Video unavailable</span>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full h-full">
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
        onError={handleError}
        preload="auto"
        style={{ backgroundColor: '#000' }}
      >
        <source src={videoSrc} type={videoSrc.endsWith('.mov') ? 'video/quicktime' : 'video/mp4'} />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default ProjectVideo;
