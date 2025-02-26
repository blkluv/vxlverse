import { motion, AnimatePresence } from "framer-motion";
import { Portal } from "../Portal";
import { useGameStore } from "../../stores/gameStore";
import { useSound } from "../../hooks/useSound";
import { useEffect, useState } from "react";
import { Dialogue, DialogueChoice, Quest, QuestAction } from "../../types";
import { ChevronRight, MessageSquare, User } from "lucide-react";

interface DialogueModalProps {
  quest: Quest;
  dialogueId: number;
}

export function DialogueModal({ quest, dialogueId }: DialogueModalProps) {
  const { playSound } = useSound();
  const setActiveDialogue = useGameStore((state) => state.setActiveDialogue);
  const completeQuest = useGameStore((state) => state.completeQuest);
  const failQuest = useGameStore((state) => state.failQuest);
  const addToInventory = useGameStore((state) => state.addToInventory);
  const removeFromInventory = useGameStore(
    (state) => state.removeFromInventory
  );
  const playerStats = useGameStore((state) => state.playerStats);
  const hasItem = useGameStore((state) => state.hasItem);

  const [typedText, setTypedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [currentDialogue, setCurrentDialogue] = useState<Dialogue | null>(null);

  // Find the current dialogue from the quest's dialogues
  useEffect(() => {
    const dialogue = quest.dialogues.find((d) => d.id === dialogueId);
    if (dialogue) {
      setCurrentDialogue(dialogue);
      setTypedText("");
      setIsTyping(true);
      playSound("dialogueStart");
    }
  }, [dialogueId, quest.dialogues, playSound]);

  // Text typing animation effect
  useEffect(() => {
    if (!currentDialogue || !isTyping) return;

    let index = 0;
    const text = currentDialogue.text;
    const typingInterval = setInterval(() => {
      if (index < text.length) {
        setTypedText((prev) => prev + text.charAt(index));
        index++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
      }
    }, 30); // Adjust typing speed here

    return () => clearInterval(typingInterval);
  }, [currentDialogue, isTyping]);

  // Skip typing animation when clicking on the dialogue text
  const handleTextClick = () => {
    if (isTyping && currentDialogue) {
      setTypedText(currentDialogue.text);
      setIsTyping(false);
    }
  };

  // Handle dialogue choice selection
  const handleChoiceSelect = (choice: DialogueChoice) => {
    playSound("dialogueChoice");

    // Check if the choice has requirements
    if (choice.requirements) {
      // Check level requirement
      if (
        choice.requirements.level &&
        playerStats.level < choice.requirements.level
      ) {
        playSound("error");
        return;
      }

      // Check energy requirement
      if (
        choice.requirements.energy &&
        playerStats.energy < choice.requirements.energy
      ) {
        playSound("error");
        return;
      }

      // Check money requirement
      if (
        choice.requirements.money &&
        playerStats.money < choice.requirements.money
      ) {
        playSound("error");
        return;
      }

      // Check item requirements
      if (choice.requirements.items && choice.requirements.items.length > 0) {
        const hasAllItems = choice.requirements.items.every((item) =>
          hasItem(item.id, item.amount)
        );

        if (!hasAllItems) {
          playSound("error");
          return;
        }
      }
    }

    // Handle action if present
    if (choice.action) {
      handleQuestAction(choice.action);
    }

    // Move to the next dialogue if specified
    if (choice.nextDialogue !== undefined) {
      setActiveDialogue(choice.nextDialogue);
    } else {
      // Close the dialogue if no next dialogue is specified
      setActiveDialogue(null);
    }
  };

  // Handle quest actions
  const handleQuestAction = (action: QuestAction) => {
    switch (action.type) {
      case "complete":
        completeQuest(quest.id);
        break;
      case "fail":
        failQuest(quest.id);
        break;
      case "give_item":
        if (action.params.itemId && action.params.amount) {
          addToInventory(action.params.itemId, action.params.amount);
          playSound("itemGet");
        }
        break;
      case "remove_item":
        if (action.params.itemId && action.params.amount) {
          removeFromInventory(action.params.itemId, action.params.amount);
        }
        break;
      // Other action types can be handled here
    }
  };

  // Close the dialogue
  const handleClose = () => {
    setActiveDialogue(null);
    playSound("dialogueEnd");
  };

  if (!currentDialogue) return null;

  return (
    <Portal>
      <div className="fixed inset-0 flex items-end justify-center pointer-events-none z-10 px-4 pb-4 md:pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="w-full max-w-2xl bg-black/90 backdrop-blur-md border border-blue-500/30 -t-md shadow-xl pointer-events-auto"
        >
          {/* Speaker and dialogue text */}
          <div className="p-4 cursor-pointer" onClick={handleTextClick}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-blue-600 -full flex items-center justify-center">
                {currentDialogue.speaker === "Player" ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <MessageSquare className="w-4 h-4 text-white" />
                )}
              </div>
              <h3 className="text-lg font-bold text-blue-300">
                {currentDialogue.speaker}
              </h3>
            </div>

            <div className="text-white text-base leading-relaxed min-h-[80px]">
              {typedText}
              {isTyping && <span className="animate-pulse">|</span>}
            </div>
          </div>

          {/* Dialogue choices */}
          {!isTyping &&
            currentDialogue.choices &&
            currentDialogue.choices.length > 0 && (
              <div className="border-t border-blue-500/30 p-3">
                <AnimatePresence>
                  {currentDialogue.choices.map((choice, index) => {
                    // Check if the choice has requirements that aren't met
                    let isDisabled = false;
                    let requirementText = "";

                    if (choice.requirements) {
                      if (
                        choice.requirements.level &&
                        playerStats.level < choice.requirements.level
                      ) {
                        isDisabled = true;
                        requirementText = `Requires Level ${choice.requirements.level}`;
                      } else if (
                        choice.requirements.energy &&
                        playerStats.energy < choice.requirements.energy
                      ) {
                        isDisabled = true;
                        requirementText = `Requires ${choice.requirements.energy} Energy`;
                      } else if (
                        choice.requirements.money &&
                        playerStats.money < choice.requirements.money
                      ) {
                        isDisabled = true;
                        requirementText = `Requires ${choice.requirements.money} Gold`;
                      } else if (
                        choice.requirements.items &&
                        choice.requirements.items.length > 0
                      ) {
                        const missingItems = choice.requirements.items.filter(
                          (item) => !hasItem(item.id, item.amount)
                        );

                        if (missingItems.length > 0) {
                          isDisabled = true;
                          requirementText = `Missing required items`;
                        }
                      }
                    }

                    return (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className={`flex items-center w-full text-left p-2 mb-1  hover:bg-blue-900/40 transition-colors ${
                          isDisabled
                            ? "opacity-50 cursor-not-allowed"
                            : "cursor-pointer"
                        }`}
                        onClick={() =>
                          !isDisabled && handleChoiceSelect(choice)
                        }
                        disabled={isDisabled}
                      >
                        <ChevronRight className="w-4 h-4 text-blue-400 mr-2 flex-shrink-0" />
                        <div className="flex-1">
                          <span className="text-white">{choice.text}</span>
                          {isDisabled && requirementText && (
                            <span className="block text-xs text-red-400 mt-1">
                              {requirementText}
                            </span>
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}

          {/* Continue button for dialogues without choices */}
          {!isTyping &&
            (!currentDialogue.choices ||
              currentDialogue.choices.length === 0) && (
              <div className="border-t border-blue-500/30 p-3">
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-center w-full p-2  bg-blue-900/40 hover:bg-blue-800/60 transition-colors cursor-pointer"
                  onClick={handleClose}
                >
                  <span className="text-white">Continue</span>
                </motion.button>
              </div>
            )}
        </motion.div>
      </div>
    </Portal>
  );
}
