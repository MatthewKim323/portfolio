import { motion } from 'framer-motion';
import WebglNoise from './WebglNoise';

const Loading = () => {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ backgroundColor: '#0d1210' }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Fuzzy orb loader - no text, just the orb */}
      <WebglNoise />
    </motion.div>
  );
};

export default Loading;
