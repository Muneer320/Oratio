import React from 'react';
import { motion } from 'framer-motion';

const pageVariants = {
  initial: {
    opacity: 0,
    scale: 0.95,
    y: 20
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.6, 0.01, 0.05, 0.95]
    }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -20,
    transition: {
      duration: 0.3,
      ease: [0.6, 0.01, 0.05, 0.95]
    }
  }
};

function PageTransition({ children }) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      {children}
    </motion.div>
  );
}

export default PageTransition;
