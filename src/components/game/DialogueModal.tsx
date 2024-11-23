import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../stores/gameStore';
import { Quest } from '../../types';
import { MessageSquare, User, ChevronRight, X } from 'lucide-react';

interface DialogueModalProps {
  quest: Quest & { thumbnail?: string };
  dialogueId: number;
}

export function DialogueModal({ quest, dialogueId }: DialogueModalProps) {
  const dialogue = quest.dialogues[dialogueId];
  const playerStats = useGameStore((state) => state.playerStats);
  const setActiveDialogue = useGameStore((state) => state.setActiveDialogue);
  const setActiveQuest = useGameStore((state) => state.setActiveQuest);
  const completeQuest = useGameStore((state) => state.completeQuest);

  const handleChoice = (choiceIndex: number) => {
    const choice = dialogue.choices?.[choiceIndex];
    if (!choice) return;

    // Check requirements
    if (choice.requirements) {
      if (
        (choice.requirements.level && playerStats.level < choice.requirements.level) ||
        (choice.requirements.energy && playerStats.energy < choice.requirements.energy) ||
        (choice.requirements.money && playerStats.money < choice.requirements.money)
      ) {
        return;
      }
    }

    // Handle next dialogue or complete quest
    if (choice.nextDialogue !== undefined) {
      setActiveDialogue(choice.nextDialogue);
    } else {
      completeQuest(quest.id);
    }
  };

  const handleClose = () => {
    setActiveQuest(null);
    setActiveDialogue(null);
  };

  return (
    <div className="fixed inset-0 flex items-end justify-center p-8 pointer-events-none">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="w-full max-w-4xl pointer-events-auto relative"
      >
        {/* Speaker Portrait & Name */}
        <div className="flex items-end gap-4 mb-3">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-700/10 flex items-center justify-center shadow-lg border-4 border-gray-900 overflow-hidden relative group"
          >
            {dialogue.speaker === 'Player' ? (
              <User className="w-12 h-12 text-white" />
            ) : quest.thumbnail ? (
              <>
                <img 
                  src={quest.thumbnail} 
                  alt={dialogue.speaker}
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </>
            ) : (
              <MessageSquare className="w-12 h-12 text-white" />
            )}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-black/90 backdrop-blur-sm px-4 py-2 rounded-t-xl border-t border-x border-gray-800/50 flex items-center justify-between gap-4"
          >
            <h3 className="text-lg font-bold text-blue-400">{dialogue.speaker}</h3>
            <button
              onClick={handleClose}
              className="p-1.5 rounded-lg hover:bg-gray-800/50 transition-colors group"
            >
              <X className="w-4 h-4 text-gray-500 group-hover:text-gray-300" />
            </button>
          </motion.div>
        </div>

        {/* Dialogue Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-800/50 shadow-xl"
        >
          {/* Dialogue Text */}
          <div className="mb-6">
            <p className="text-lg text-gray-100 leading-relaxed">{dialogue.text}</p>
          </div>

          {/* Choices */}
          {dialogue.choices && (
            <div className="space-y-2">
              {dialogue.choices.map((choice, index) => {
                const isDisabled = choice.requirements && (
                  (choice.requirements.level && playerStats.level < choice.requirements.level) ||
                  (choice.requirements.energy && playerStats.energy < choice.requirements.energy) ||
                  (choice.requirements.money && playerStats.money < choice.requirements.money)
                );

                return (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ 
                      opacity: 1, 
                      x: 0,
                      transition: { delay: index * 0.1 } 
                    }}
                    whileHover={!isDisabled ? { x: 10 } : {}}
                    onClick={() => handleChoice(index)}
                    disabled={isDisabled}
                    className={`w-full p-4 rounded-xl text-left transition-all flex items-center justify-between group ${
                      isDisabled
                        ? 'bg-gray-800/30 text-gray-500 cursor-not-allowed'
                        : 'bg-gray-800/50 hover:bg-blue-900/50 text-gray-100 hover:border-blue-500/30'
                    } border border-transparent`}
                  >
                    <div className="flex items-center gap-3">
                      <span>{choice.text}</span>
                      {choice.requirements && (
                        <div className="text-sm space-x-3">
                          {choice.requirements.level && (
                            <span className={playerStats.level >= choice.requirements.level ? 'text-green-400' : 'text-red-400'}>
                              Level {choice.requirements.level}
                            </span>
                          )}
                          {choice.requirements.energy && (
                            <span className={playerStats.energy >= choice.requirements.energy ? 'text-green-400' : 'text-red-400'}>
                              Energy {choice.requirements.energy}
                            </span>
                          )}
                          {choice.requirements.money && (
                            <span className={playerStats.money >= choice.requirements.money ? 'text-green-400' : 'text-red-400'}>
                              ${choice.requirements.money}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    {!isDisabled && (
                      <ChevronRight className="w-5 h-5 text-blue-400 transform transition-transform group-hover:translate-x-1" />
                    )}
                  </motion.button>
                );
              })}
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}