
import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import WelcomeScreen from "@/components/WelcomeScreen";
import GameInterface from "@/components/GameInterface";
import GameOverScreen from "@/components/GameOverScreen";
import ARScene from "@/components/ARScene";

const Index = () => {
  const [gameState, setGameState] = useState<"welcome" | "playing" | "gameOver">("welcome");
  const [score, setScore] = useState(0);
  
  const startGame = () => {
    setGameState("playing");
  };
  
  const endGame = (finalScore: number) => {
    setScore(finalScore);
    setGameState("gameOver");
  };
  
  const restartGame = () => {
    setGameState("welcome");
  };
  
  return (
    <AnimatePresence mode="wait">
      {gameState === "welcome" && (
        <WelcomeScreen onStart={startGame} />
      )}
      
      {gameState === "playing" && (
        <ARScene>
          <GameInterface onGameOver={endGame} />
        </ARScene>
      )}
      
      {gameState === "gameOver" && (
        <GameOverScreen score={score} onRestart={restartGame} />
      )}
    </AnimatePresence>
  );
};

export default Index;
