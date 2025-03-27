
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const balloonColors = [
    "bg-game-balloon1",
    "bg-game-balloon2",
    "bg-game-balloon3",
    "bg-game-balloon4"
  ];

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-secondary/50 overflow-hidden">
      {/* Decorative balloons */}
      {balloonColors.map((color, index) => (
        <div
          key={index}
          className={`${color} balloon w-${12 + index * 4} h-${12 + index * 4} blur-sm opacity-70`}
          style={{
            top: `${10 + Math.random() * 80}%`,
            left: `${10 + Math.random() * 80}%`,
            animationDelay: `${index * 0.5}s`,
            animationDuration: `${3 + Math.random() * 2}s`
          }}
        />
      ))}
      
      <motion.div
        className="z-10 max-w-md w-full mx-auto px-6 py-12 glass rounded-2xl shadow-xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="text-center mb-2">
          <span className="title-chip">AR Experience</span>
        </motion.div>
        
        <motion.h1 
          variants={itemVariants}
          className="text-4xl md:text-5xl font-bold text-center mb-6 tracking-tight"
        >
          Balloon Burst AR
        </motion.h1>
        
        <motion.p 
          variants={itemVariants}
          className="text-base text-foreground/80 text-center mb-8"
        >
          Pop as many balloons as possible in 30 seconds. Tap to throw darts and burst balloons in augmented reality.
        </motion.p>
        
        <motion.div variants={itemVariants} className="flex justify-center">
          <button
            onClick={onStart}
            className="game-button"
            disabled={!isReady}
          >
            Start Game
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default WelcomeScreen;
