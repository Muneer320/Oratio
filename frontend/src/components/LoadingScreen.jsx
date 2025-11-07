import React from 'react';
import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';

function LoadingScreen() {
  return (
    <motion.div
      className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center z-50"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="inline-block mb-6"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl flex items-center justify-center">
            <Brain className="w-12 h-12 text-white" />
          </div>
        </motion.div>
        <motion.h2
          className="text-4xl font-black text-white mb-4"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          ORATIO
        </motion.h2>
        <div className="flex gap-2 justify-center">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-purple-400 rounded-full"
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.15
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default LoadingScreen;
