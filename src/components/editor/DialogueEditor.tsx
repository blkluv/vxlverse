import { useState } from 'react';
import { Dialogue, DialogueChoice, Quest } from '../../types';
import { Plus, Trash2, MessageSquare, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DialogueEditorProps {
  quest: Quest;
  onChange: (updates: Partial<Quest>) => void;
}

export function DialogueEditor({ quest, onChange }: DialogueEditorProps) {
  const [expandedDialogue, setExpandedDialogue] = useState<number | null>(null);

  const addDialogue = () => {
    const newDialogue: Dialogue = {
      id: quest.dialogues.length,
      speaker: 'NPC',
      text: 'New dialogue text',
      choices: [
        {
          text: 'Continue',
          nextDialogue: quest.dialogues.length + 1
        }
      ]
    };

    onChange({
      dialogues: [...quest.dialogues, newDialogue]
    });
  };

  const updateDialogue = (index: number, updates: Partial<Dialogue>) => {
    const newDialogues = [...quest.dialogues];
    newDialogues[index] = { ...newDialogues[index], ...updates };
    onChange({ dialogues: newDialogues });
  };

  const removeDialogue = (index: number) => {
    const newDialogues = quest.dialogues.filter((_, i) => i !== index);
    onChange({ dialogues: newDialogues });
  };

  const addChoice = (dialogueIndex: number) => {
    const dialogue = quest.dialogues[dialogueIndex];
    const newChoice: DialogueChoice = {
      text: 'New choice',
      nextDialogue: dialogueIndex + 1
    };

    updateDialogue(dialogueIndex, {
      choices: [...(dialogue.choices || []), newChoice]
    });
  };

  const updateChoice = (dialogueIndex: number, choiceIndex: number, updates: Partial<DialogueChoice>) => {
    const dialogue = quest.dialogues[dialogueIndex];
    const newChoices = [...(dialogue.choices || [])];
    newChoices[choiceIndex] = { ...newChoices[choiceIndex], ...updates };
    
    updateDialogue(dialogueIndex, { choices: newChoices });
  };

  const removeChoice = (dialogueIndex: number, choiceIndex: number) => {
    const dialogue = quest.dialogues[dialogueIndex];
    const newChoices = (dialogue.choices || []).filter((_, i) => i !== choiceIndex);
    
    updateDialogue(dialogueIndex, { choices: newChoices });
  };

  return (
    <div className="space-y-4">
      {quest.dialogues.map((dialogue, index) => (
        <motion.div
          key={dialogue.id}
          layout
          className="bg-slate-800/30 rounded-lg border border-slate-700/30 overflow-hidden"
        >
          <div
            className="p-3 cursor-pointer hover:bg-slate-700/30 transition-colors"
            onClick={() => setExpandedDialogue(expandedDialogue === index ? null : index)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-400" />
                <span className="text-sm font-medium text-slate-200">
                  {dialogue.speaker} - Dialogue {index + 1}
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeDialogue(index);
                }}
                className="p-1 text-slate-400 hover:text-red-400 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <AnimatePresence>
            {expandedDialogue === index && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                className="overflow-hidden border-t border-slate-700/30"
              >
                <div className="p-3 space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-400">Speaker</label>
                    <input
                      type="text"
                      value={dialogue.speaker}
                      onChange={(e) => updateDialogue(index, { speaker: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-400">Dialogue Text</label>
                    <textarea
                      value={dialogue.text}
                      onChange={(e) => updateDialogue(index, { text: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-sm resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-slate-400">Choices</label>
                      <button
                        onClick={() => addChoice(index)}
                        className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add Choice
                      </button>
                    </div>

                    <div className="space-y-2">
                      {(dialogue.choices || []).map((choice, choiceIndex) => (
                        <div
                          key={choiceIndex}
                          className="flex items-start gap-2 p-2 bg-slate-800/30 rounded-lg border border-slate-700/30"
                        >
                          <div className="flex-1 space-y-2">
                            <input
                              type="text"
                              value={choice.text}
                              onChange={(e) => updateChoice(index, choiceIndex, { text: e.target.value })}
                              className="w-full px-2 py-1 bg-slate-800/50 border border-slate-600/50 rounded text-sm"
                              placeholder="Choice text"
                            />
                            <div className="flex items-center gap-2">
                              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                              <input
                                type="number"
                                value={choice.nextDialogue}
                                onChange={(e) => updateChoice(index, choiceIndex, { nextDialogue: parseInt(e.target.value) })}
                                className="w-20 px-2 ml-auto py-1 bg-slate-800/50 border border-slate-600/50 rounded text-sm"
                                placeholder="Next"
                              />
                            </div>
                          </div>
                          <button
                            onClick={() => removeChoice(index, choiceIndex)}
                            className="p-1 text-slate-400 hover:text-red-400 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}

      <button
        onClick={addDialogue}
        className="w-full p-2 flex items-center justify-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-lg transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add Dialogue
      </button>
    </div>
  );
}