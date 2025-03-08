import { motion, AnimatePresence } from "framer-motion";
import { GAME_ITEMS } from "../../types";
import { useEffect, useMemo } from "react";
import { useSound } from "../../hooks/useSound";
import { useEnemyStore } from "../../stores/enemyStore";
import { Sparkles } from "lucide-react";
import { useGameStore } from "../../stores/gameStore";

export function Rewards() {
  const { rewards, clearRewards } = useEnemyStore((state) => ({
    rewards: state.rewards,
    clearRewards: state.clearRewards,
  }));
  const { playSound } = useSound();
  const showLevelUp = useGameStore((state) => state.showLevelUp);

  useEffect(() => {
    if (rewards) {
      playSound("loot");

      // Auto-clear rewards after animations complete
      const timer = setTimeout(() => {
        setTimeout(clearRewards, 600);
      }, 2800); // Longer display time for better visibility

      return () => clearTimeout(timer);
    }
  }, [playSound, rewards, clearRewards]);

  // Find item details or use fallback
  const item =
    GAME_ITEMS.find((i) => i.id === rewards?.itemId) || GAME_ITEMS[0];

  // Generate random sparkle positions for enhanced effect
  const sparklePositions = useMemo(() => {
    return Array.from({ length: 8 }, () => ({
      x: Math.random() * 160 - 80,
      y: Math.random() * 160 - 80,
      scale: 0.3 + Math.random() * 0.4,
      delay: Math.random() * 0.5,
    }));
  }, [rewards]);

  // Container variants to stagger child animations
  const containerVariants = {
    initial: {},
    animate: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
    exit: { transition: { staggerChildren: 0.08, staggerDirection: -1 } },
  };

  // Animation variants for each notification element - coming from bottom to top
  const notificationVariants = {
    initial: { opacity: 0, y: 80, scale: 0.8 },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 15,
        mass: 0.8,
      },
    },
    exit: {
      opacity: 0,
      y: -60,
      scale: 0.9,
      transition: { duration: 0.4, ease: "easeInOut" },
    },
  };
  if (!rewards || showLevelUp) return null;

  return (
    <div className="z-50 pointer-events-none h-1/2 fixed inset-0 flex justify-center items-center">
      <AnimatePresence>
        {rewards && (
          <motion.div
            variants={containerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative flex flex-col gap-3 items-center"
            style={{
              textShadow: "0 2px 4px rgba(0,0,0,0.5)",
              fontFamily: "monospace",
            }}
          >
            {/* Floating sparkles effect */}
            {sparklePositions.map((pos, i) => (
              <motion.div
                key={`sparkle-${i}`}
                className="absolute"
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 0.7, 0],
                  scale: [0, pos.scale, 0],
                  x: [0, pos.x],
                  y: [20, pos.y - 40], // Start slightly below for upward movement
                }}
                transition={{
                  duration: 2,
                  delay: pos.delay,
                  ease: "easeOut",
                  times: [0, 0.4, 1],
                  repeat: Infinity,
                  repeatDelay: 0.8 + Math.random() * 1.2,
                }}
              >
                <Sparkles className="text-yellow-300 w-4 h-4 opacity-70" />
              </motion.div>
            ))}

            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-radial from-amber-500/20 to-transparent rounded-full blur-xl"
              animate={{
                scale: [0.8, 1.2, 0.8],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            {/* XP Notification */}
            <motion.div
              variants={notificationVariants}
              className="px-4 py-2 bg-gradient-to-r from-yellow-900/95 to-yellow-800/95 border-2 border-yellow-400 rounded-lg text-yellow-200 font-pixel text-sm shadow-xl flex items-center whitespace-nowrap relative overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-yellow-300/5"
                animate={{ x: ["-100%", "100%"] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatDelay: 0.5,
                }}
              />
              <motion.span
                className="mr-2 text-lg text-yellow-300"
                animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                ⭐
              </motion.span>
              <span className="font-bold tracking-wide">
                +{rewards?.xp || 100} XP
              </span>
            </motion.div>

            {/* Item Notification */}
            <motion.div
              variants={notificationVariants}
              className="px-4 py-2 bg-gradient-to-r from-amber-900/95 to-amber-800/95 border-2 border-amber-400 rounded-lg text-amber-200 font-pixel text-sm shadow-xl flex items-center whitespace-nowrap relative overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-amber-400/10 to-amber-300/5"
                animate={{ x: ["-100%", "100%"] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatDelay: 0.5,
                  delay: 0.2,
                }}
              />
              <motion.span
                className="mr-2 text-lg"
                animate={{ scale: [1, 1.15, 1] }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {item?.emoji}
              </motion.span>
              <span className="font-bold tracking-wide">
                +{rewards?.amount || 3} {item?.name}
              </span>
            </motion.div>

            {/* Money Notification */}
            <motion.div
              variants={notificationVariants}
              className="px-4 py-2 bg-gradient-to-r from-emerald-900/95 to-emerald-800/95 border-2 border-emerald-400 rounded-lg text-emerald-200 font-pixel text-sm shadow-xl flex items-center whitespace-nowrap relative overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 to-emerald-300/5"
                animate={{ x: ["-100%", "100%"] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatDelay: 0.5,
                  delay: 0.4,
                }}
              />
              <motion.span
                className="mr-2 text-lg text-emerald-300"
                animate={{ y: [0, -3, 0], scale: [1, 1.1, 1] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                💰
              </motion.span>
              <span className="font-bold tracking-wide">
                +{rewards?.amount || 25} Gold
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
