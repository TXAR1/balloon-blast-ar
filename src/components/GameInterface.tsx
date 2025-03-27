
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Timer, X, Star } from "lucide-react";

interface GameInterfaceProps {
  onGameOver: (score: number) => void;
}

interface Balloon {
  id: number;
  x: number;
  y: number;
  size: number;
  type: "normal" | "special";
  color: string;
  value: number;
}

const GameInterface: React.FC<GameInterfaceProps> = ({ onGameOver }) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [dartPosition, setDartPosition] = useState<{ x: number; y: number } | null>(null);
  const [isThrowingDart, setIsThrowingDart] = useState(false);
  const [popEffects, setPopEffects] = useState<{ id: number; x: number; y: number; value: number }[]>([]);
  
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const maxBalloons = 5;
  const popSound = useRef<HTMLAudioElement | null>(null);
  
  // Initialize game
  useEffect(() => {
    // Create pop sound effect
    popSound.current = new Audio();
    popSound.current.src = "https://assets.mixkit.co/active_storage/sfx/3005/3005-preview.mp3"; // Placeholder sound URL, should be replaced
    
    // Start timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onGameOver(score);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    // Spawn balloons
    const spawnInterval = setInterval(spawnBalloon, 1200);
    
    return () => {
      clearInterval(timer);
      clearInterval(spawnInterval);
    };
  }, [score, onGameOver]);
  
  // Generate random balloon
  const spawnBalloon = () => {
    if (balloons.length >= maxBalloons) return;
    
    const gameArea = gameAreaRef.current;
    if (!gameArea) return;
    
    const width = gameArea.clientWidth;
    const height = gameArea.clientHeight;
    
    const balloonColors = [
      "bg-game-balloon1",
      "bg-game-balloon2", 
      "bg-game-balloon3",
      "bg-game-balloon4"
    ];
    
    const isSpecial = Math.random() < 0.2; // 20% chance for special balloon
    
    const newBalloon: Balloon = {
      id: Date.now(),
      x: Math.random() * (width - 100),
      y: Math.random() * (height - 200) + height * 0.25, // Avoid spawning too high or too low
      size: Math.floor(Math.random() * 20) + 40, // 40-60px
      type: isSpecial ? "special" : "normal",
      color: isSpecial ? "bg-game-special" : balloonColors[Math.floor(Math.random() * balloonColors.length)],
      value: isSpecial ? 10 : 1
    };
    
    setBalloons((prev) => [...prev, newBalloon]);
  };
  
  // Handle screen tap/click
  const handleTap = (e: React.MouseEvent) => {
    if (isThrowingDart) return;
    
    const gameArea = gameAreaRef.current;
    if (!gameArea) return;
    
    const rect = gameArea.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    throwDart(x, y);
  };
  
  // Throw dart animation
  const throwDart = (x: number, y: number) => {
    setDartPosition({ x, y });
    setIsThrowingDart(true);
    
    // Check hit after animation time
    setTimeout(() => {
      checkHit(x, y);
      setIsThrowingDart(false);
      setDartPosition(null);
    }, 300);
  };
  
  // Check if dart hit a balloon
  const checkHit = (x: number, y: number) => {
    setBalloons((prev) => {
      const newBalloons = [...prev];
      
      // Find first balloon that was hit
      const hitIndex = newBalloons.findIndex((balloon) => {
        const dx = x - balloon.x - balloon.size / 2;
        const dy = y - balloon.y - balloon.size / 2;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < balloon.size / 2;
      });
      
      if (hitIndex !== -1) {
        const hitBalloon = newBalloons[hitIndex];
        
        // Add pop effect
        setPopEffects((prev) => [
          ...prev, 
          { 
            id: Date.now(), 
            x: hitBalloon.x, 
            y: hitBalloon.y, 
            value: hitBalloon.value 
          }
        ]);
        
        // Play sound
        if (popSound.current) {
          popSound.current.currentTime = 0;
          popSound.current.play().catch(e => console.log("Audio play failed:", e));
        }
        
        // Update score
        setScore((prev) => prev + hitBalloon.value);
        
        // Remove balloon
        newBalloons.splice(hitIndex, 1);
      }
      
      return newBalloons;
    });
  };
  
  // Clean up pop effects after animation
  useEffect(() => {
    if (popEffects.length > 0) {
      const timer = setTimeout(() => {
        setPopEffects([]);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [popEffects]);
  
  return (
    <div 
      ref={gameAreaRef}
      className="relative h-screen w-screen overflow-hidden bg-transparent"
      onClick={handleTap}
    >
      {/* Game UI */}
      <div className="absolute top-0 left-0 w-full p-4 z-10">
        <div className="flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass px-4 py-2 rounded-full flex items-center"
          >
            <Star className="w-5 h-5 mr-2 text-game-special" />
            <span className="font-bold">{score}</span>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass px-4 py-2 rounded-full flex items-center"
          >
            <Timer className="w-5 h-5 mr-2 text-primary" />
            <span className="font-bold">{timeLeft}s</span>
          </motion.div>
        </div>
      </div>
      
      {/* Help instruction at the bottom */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 glass px-4 py-2 rounded-full text-sm"
      >
        Tap anywhere to throw a dart
      </motion.div>
      
      {/* Balloons */}
      <AnimatePresence>
        {balloons.map((balloon) => (
          <motion.div
            key={balloon.id}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`absolute ${balloon.color} rounded-full shadow-md`}
            style={{
              left: balloon.x,
              top: balloon.y,
              width: balloon.size,
              height: balloon.size * 1.2,
              borderRadius: "50%",
            }}
          >
            {balloon.type === "special" && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-bold">
                +10
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
      
      {/* Dart */}
      {dartPosition && (
        <motion.div
          initial={{ opacity: 1, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="absolute w-6 h-10 bg-gray-800 rotate-45 transform origin-bottom"
          style={{
            left: dartPosition.x - 3,
            top: dartPosition.y - 5,
          }}
        />
      )}
      
      {/* Pop effects */}
      <AnimatePresence>
        {popEffects.map((effect) => (
          <React.Fragment key={effect.id}>
            <motion.div
              initial={{ scale: 1, opacity: 1 }}
              animate={{ scale: 2, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute bg-white rounded-full z-20"
              style={{
                left: effect.x,
                top: effect.y,
                width: 80,
                height: 80,
              }}
            />
            <motion.div 
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: [0, 1, 0], y: -30 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute z-20 font-bold text-lg"
              style={{
                left: effect.x + 20,
                top: effect.y - 10,
                color: effect.value > 1 ? "#FF9F1C" : "#ffffff",
              }}
            >
              +{effect.value}
            </motion.div>
          </React.Fragment>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default GameInterface;
