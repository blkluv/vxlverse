import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "../../stores/gameStore";
import { Quest } from "../../types";
import {
  MessageSquare,
  User,
  ChevronRight,
  Trophy,
  Coins,
  Heart,
  XCircle,
  Gift,
  Package,
  Star,
  Clock,
} from "lucide-react";
import { useState, useEffect, useCallback, memo } from "react";
import { GAME_ITEMS } from "../../types";
import { Portal } from "../Portal";
import { useSound } from "../../hooks/useSound";

const TYPING_SPEED = 30;

// Memoized reward box component
const RewardBox = memo(
  ({
    icon,
    label,
    value,
    color,
    delay = 0,
  }: {
    icon: React.ReactNode;
    label: string;
    value: string;
    color: string;
    delay?: number;
  }) => (
    <motion.div
      initial={{ scale: 0.8, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, type: "spring" }}
      className={`bg-gradient-to-br from-${color}-500/10 to-${color}-700/10 rounded-xl p-4 border border-${color}-500/20`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-12 h-12 rounded-lg bg-${color}-500/20 flex items-center justify-center`}
        >
          {icon}
        </div>
        <div>
          <div className={`text-sm text-${color}-400/70`}>{label}</div>
          <div className={`text-xl font-bold text-${color}-300`}>{value}</div>
        </div>
      </div>
    </motion.div>
  )
);

RewardBox.displayName = "RewardBox";

// Memoized item reward component
const ItemReward = memo(
  ({
    item,
    index,
  }: {
    item: { id: string; amount: number };
    index: number;
  }) => {
    const details = GAME_ITEMS.find((i) => i.id === item.id);

    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 + index * 0.1, type: "spring" }}
        className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-4 border border-gray-700/50
               hover:from-gray-800 hover:to-gray-900 hover:border-gray-600/50 transition-all group"
      >
        <div className="flex items-center gap-3">
          <motion.div
            className="text-3xl"
            whileHover={{ scale: 1.2 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            {details?.emoji}
          </motion.div>
          <div>
            <div className="font-medium text-gray-200">{details?.name}</div>
            <div className="text-sm text-gray-400">×{item.amount}</div>
          </div>
        </div>
      </motion.div>
    );
  }
);

ItemReward.displayName = "ItemReward";

// Main DialogueModal component
export function DialogueModal({
  quest,
  dialogueId,
}: {
  quest: Quest;
  dialogueId: number;
}) {
  const dialogue = quest.dialogues[dialogueId];
  const playerStats = useGameStore((state) => state.playerStats);
  const setActiveDialogue = useGameStore((state) => state.setActiveDialogue);
  const completeQuest = useGameStore((state) => state.completeQuest);
  const hasItem = useGameStore((state) => state.hasItem);
  const setActiveQuest = useGameStore((state) => state.setActiveQuest);
  const [showRewards, setShowRewards] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const { playSound, stopSound } = useSound();

  // Optimized text typing effect
  useEffect(() => {
    let mounted = true;
    let currentIndex = 0;
    let timeoutId: NodeJS.Timeout;

    const typeNextCharacter = () => {
      if (!mounted) return;

      if (currentIndex < dialogue.text.length) {
        if (currentIndex % 3 === 0) {
          playSound("typing");
        }
        
        setDisplayedText(dialogue.text.slice(0, currentIndex + 1));
        currentIndex++;
        timeoutId = setTimeout(typeNextCharacter, TYPING_SPEED);
      } else {
        setIsTyping(false);
        stopSound("typing");
      }
    };

    setIsTyping(true);
    setDisplayedText("");
    timeoutId = setTimeout(typeNextCharacter, TYPING_SPEED);

    return () => {
      mounted = false;
      stopSound("typing");
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [dialogue.text, playSound, stopSound]);

  // Memoized handlers
  const handleChoice = useCallback(
    (choiceIndex: number) => {
      if (isTyping) {
        setIsTyping(false);
        setDisplayedText(dialogue.text);
        return;
      }

      playSound("select");
      const choice = dialogue.choices?.[choiceIndex];
      if (!choice) return;

      const isLastDialogue =
        choice.nextDialogue === undefined || choice.nextDialogue === null;

      if (isLastDialogue) {
        // Only show rewards for actual quests (not greetings)
        if (quest.id !== 'greeting') {
          const canComplete = checkQuestCompletion(quest);
          if (canComplete) {
            playSound("questComplete");
            setShowRewards(true);
          } else {
            setActiveQuest(null);
            setActiveDialogue(null);
          }
        } else {
          // For greetings, just close the dialog
          setActiveQuest(null);
          setActiveDialogue(null);
        }
      } else {
        setActiveDialogue(choice.nextDialogue!);
      }
    },
    [
      isTyping,
      dialogue.text,
      playSound,
      quest,
      setActiveQuest,
      setActiveDialogue,
    ]
  );

  const handleClaimRewards = useCallback(() => {
    playSound("questComplete");
    completeQuest(quest.id);
    setShowRewards(false);
  }, [quest.id, completeQuest, playSound]);

  // Quest completion check
  const checkQuestCompletion = useCallback(
    (quest: Quest) => {
      const { conditions } = quest.completion;

      if (
        conditions.items &&
        !conditions.items.every((item) => hasItem(item.id, item.amount))
      ) {
        return false;
      }

      // Check level requirement
      if (
        quest.requirements?.level &&
        playerStats.level < quest.requirements.level
      ) {
        return false;
      }

      // Check energy requirement
      if (
        quest.requirements?.energy &&
        Math.min(100, playerStats.energy) < quest.requirements.energy
      ) {
        return false;
      }

      // Check money requirement
      if (
        quest.requirements?.money &&
        playerStats.money < quest.requirements.money
      ) {
        return false;
      }

      return true;
    },
    [hasItem, playerStats]
  );

  // Get missing requirements
  const missingRequirements = useCallback(() => {
    const missing = [];

    if (
      quest.requirements?.level &&
      playerStats.level < quest.requirements.level
    ) {
      missing.push(`Level ${quest.requirements.level}`);
    }

    const currentEnergy = Math.min(100, playerStats.energy);
    if (
      quest.requirements?.energy &&
      currentEnergy < quest.requirements.energy
    ) {
      missing.push(`${quest.requirements.energy} Energy (you have ${Math.floor(currentEnergy)})`);
    }

    if (
      quest.requirements?.money &&
      playerStats.money < quest.requirements.money
    ) {
      missing.push(`${quest.requirements.money} Coins`);
    }

    if (quest.completion.conditions.items) {
      quest.completion.conditions.items.forEach((item) => {
        if (!hasItem(item.id, item.amount)) {
          const itemDetails = GAME_ITEMS.find((i) => i.id === item.id);
          missing.push(`${item.amount}x ${itemDetails?.name || item.id}`);
        }
      });
    }

    return missing;
  }, [quest, playerStats, hasItem]);

  return (
    <Portal>
      <div className="fixed inset-0 flex items-end justify-center p-8 pointer-events-none">
        {/* Quest Info Bar */}
        <div className="w-screen fixed top-4 left-0 flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="  bg-black/95 backdrop-blur-md rounded-2xl border border-amber-500/20 p-4 shadow-xl pointer-events-auto"
          >
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.6, delay: 0.2 }}
                  className="w-24 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center"
                >
                  <Star className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                  <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="text-lg font-bold text-amber-300"
                  >
                    {quest.title}
                  </motion.h2>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                    className="text-sm text-amber-500/70"
                  >
                    {quest.description}
                  </motion.div>
                </div>
              </div>
              <div className="h-12 w-px bg-gray-800" />
              <div className="flex items-center gap-4 text-sm">
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                  className="flex items-center gap-2"
                >
                  <Trophy className="w-5 h-5 text-amber-400" />
                  <span className="text-amber-300">+{quest.rewards.xp} XP</span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                  className="flex items-center gap-2"
                >
                  <Coins className="w-5 h-5 text-yellow-400" />
                  <span className="text-yellow-300">
                    +{quest.rewards.money}
                  </span>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Dialogue Box */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="w-full max-w-4xl pointer-events-auto"
        >
          {/* Speaker Portrait & Name */}
          <div className="flex items-end gap-4 mb-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ type: "spring", duration: 0.6 }}
              className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg border-4 border-gray-900 relative"
            >
              {dialogue.speaker === "Player" ? (
                <User className="w-10 h-10 text-white" />
              ) : (
                <MessageSquare className="w-10 h-10 text-white" />
              )}
              <motion.div
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="absolute -bottom-2 -right-2 w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center border-2 border-gray-900"
              >
                <Clock className="w-4 h-4 text-white" />
              </motion.div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-gradient-to-r from-blue-500/20 to-blue-700/20 backdrop-blur-sm px-6 py-3 rounded-t-2xl border border-blue-500/20 border-b-0"
            >
              <h3 className="text-xl font-bold text-blue-300">
                {dialogue.speaker}
              </h3>
            </motion.div>
            <button
              onClick={() => {
                setActiveQuest(null);
                setActiveDialogue(null);
              }}
              className="p-2 ml-auto rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 hover:text-blue-400 transition-colors"
            >
              Close
            </button>
          </div>

          {/* Main Dialogue Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative min-h-48 bg-gradient-to-b from-gray-900/95 to-gray-800/95 backdrop-blur-md rounded-2xl p-8 border border-blue-500/20 shadow-xl overflow-hidden"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-grid-white opacity-5" />

            {/* Content */}
            <div className="relative">
              {/* Dialogue Text */}
              <div className="mb-8">
                <p className="text-xl text-gray-100 leading-relaxed">
                  {displayedText}
                  {isTyping && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ repeat: Infinity, duration: 0.5 }}
                      className="inline-block ml-1 -mb-1 w-2 h-5 bg-blue-400"
                    />
                  )}
                </p>
              </div>

              {/* Missing Requirements Warning */}
              {!isTyping && missingRequirements().length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="mb-6 p-4 bg-gradient-to-r from-red-500/10 to-red-900/10 rounded-xl border border-red-500/20"
                >
                  <div className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-400 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-red-400 mb-2">
                        Requirements Not Met:
                      </h4>
                      <ul className="space-y-1">
                        {missingRequirements().map((req, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="text-sm text-red-300 flex items-center gap-2"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                            {req}
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Choices */}
              {!isTyping && dialogue.choices && (
                <div className="space-y-3">
                  {dialogue.choices.map((choice, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      whileHover={{
                        x: 10,
                        backgroundColor: "rgba(59, 130, 246, 0.2)",
                      }}
                      onClick={() => handleChoice(index)}
                      className="w-full p-4 rounded-xl text-left transition-all flex items-center justify-between group
                        bg-gradient-to-r from-blue-500/10 to-blue-900/10 hover:from-blue-500/20 hover:to-blue-900/20
                        border border-blue-500/20 hover:border-blue-500/40"
                    >
                      <span className="text-lg text-blue-100 font-medium">
                        {choice.text}
                      </span>
                      <ChevronRight className="w-6 h-6 text-blue-400 transform transition-transform group-hover:translate-x-1" />
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
            {/* Skip Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="absolute m-4 bottom-0 right-0 text-sm text-gray-400 flex items-center gap-2"
              >
                <span>Click anywhere to skip</span>
                <ChevronRight className="w-4 h-4" />
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Rewards Modal */}
      <AnimatePresence>
        {showRewards && (
          <div className="fixed inset-0 flex items-center justify-center p-6 z-50">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
              onClick={() => setShowRewards(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.6 }}
              className="relative bg-gradient-to-b from-gray-900/95 to-gray-800/95 rounded-2xl p-8 w-full max-w-lg border border-amber-500/20 shadow-2xl"
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-grid-white opacity-5 rounded-2xl" />

              {/* Content */}
              <div className="relative">
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", duration: 0.8 }}
                    className="w-24 h-24 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 mx-auto flex items-center justify-center mb-4"
                  >
                    <Gift className="w-12 h-12 text-white" />
                  </motion.div>
                  <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500"
                  >
                    Quest Complete!
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="text-gray-400 mt-2"
                  >
                    "{quest.title}" completed successfully
                  </motion.p>
                </div>

                {/* Rewards Grid */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <RewardBox
                    icon={<Trophy className="w-6 h-6 text-amber-400" />}
                    label="Experience"
                    value={`+${quest.rewards.xp} XP`}
                    color="amber"
                    delay={0.4}
                  />
                  <RewardBox
                    icon={<Coins className="w-6 h-6 text-yellow-400" />}
                    label="Money"
                    value={`+${quest.rewards.money}`}
                    color="yellow"
                    delay={0.5}
                  />
                  {quest.rewards.energy > 0 && (
                    <RewardBox
                      icon={<Heart className="w-6 h-6 text-red-400" />}
                      label="Energy"
                      value={`+${quest.rewards.energy}`}
                      color="red"
                      delay={0.6}
                    />
                  )}
                </div>

                {/* Items */}
                {quest.rewards.items && quest.rewards.items.length > 0 && (
                  <div className="mb-8">
                    <motion.h3
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.7 }}
                      className="text-sm font-medium text-gray-400 mb-4 flex items-center gap-2"
                    >
                      <Package className="w-4 h-4" />
                      Reward Items
                    </motion.h3>
                    <div className="grid grid-cols-2 gap-3">
                      {quest.rewards.items.map((item, index) => (
                        <ItemReward key={index} item={item} index={index} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Claim Button */}
                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.8 }}
                  onClick={handleClaimRewards}
                  className="w-full py-4 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl font-medium text-white
                           hover:from-amber-400 hover:to-amber-500 transition-all transform hover:scale-[1.02] active:scale-[0.98]
                           border border-amber-400/20 relative group overflow-hidden"
                >
                  <span className="relative z-10">Claim Rewards</span>
                  <motion.div
                    initial={{ x: "100%" }}
                    animate={{ x: "-100%" }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.5,
                      ease: "linear",
                    }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  />
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Portal>
  );
}
