import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e) => {
      if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A' || e.target.classList.contains('hover-cursor')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <>
      <motion.div
        className="custom-cursor"
        animate={{
          x: mousePosition.x - 16,
          y: mousePosition.y - 16,
          scale: isHovering ? 1.5 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 28,
          mass: 0.5
        }}
        style={{
          position: 'fixed',
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          border: '2px solid rgba(139, 92, 246, 0.8)',
          pointerEvents: 'none',
          zIndex: 9999,
          mixBlendMode: 'difference'
        }}
      />
      <motion.div
        className="custom-cursor-dot"
        animate={{
          x: mousePosition.x - 4,
          y: mousePosition.y - 4,
          scale: isHovering ? 0 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 600,
          damping: 30
        }}
        style={{
          position: 'fixed',
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: 'rgba(139, 92, 246, 1)',
          pointerEvents: 'none',
          zIndex: 9999
        }}
      />
    </>
  );
}

export default CustomCursor;
