
import React from "react";
import { motion } from "framer-motion";
import { Star, RefreshCw } from "lucide-react";

interface GameOverScreenProps {
  score: number;
  onRestart: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ score, onRestart }) => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };
  
  const getScoreMessage = (score: number): string => {
    if (score === 0) return "Better luck next time!";
    if (score < 10) return "Good start!";
    if (score < 20) return "Nice job!";
    if (score < 30) return "Great score!";
    if (score < 50) return "Incredible!";
    return "You're a balloon popping master!";
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
          className={`${color} balloon w-${8 + index * 3} h-${8 + index * 3} blur-sm opacity-70`}
          style={{
            top: `${10 + Math.random() * 80}%`,
            left: `${10 + Math.random() * 80}%`,
            animationDelay: `${index * 0.5}s`,
            animationDuration: `${3 + Math.random() * 2}s`
          }}
        />
      ))}
      
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="z-10 max-w-md w-full mx-auto px-6 py-12 glass rounded-2xl shadow-xl"
      >
        <motion.div variants={fadeInUp} className="text-center mb-2">
          <span className="title-chip">Game Over</span>
        </motion.div>
        
        <motion.h1 
          variants={fadeInUp}
          className="text-3xl font-bold text-center mb-8"
        >
          {getScoreMessage(score)}
        </motion.h1>
        
        <motion.div 
          variants={fadeInUp}
          className="flex justify-center items-center mb-8"
        >
          <div className="glass-dark px-8 py-6 rounded-xl flex items-center">
            <Star className="w-8 h-8 mr-3 text-game-special" />
            <span className="text-4xl font-bold">{score}</span>
          </div>
        </motion.div>
        
        <motion.div 
          variants={fadeInUp}
          className="flex justify-center"
        >
          <button
            onClick={onRestart}
            className="game-button"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Play Again
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default GameOverScreen;
