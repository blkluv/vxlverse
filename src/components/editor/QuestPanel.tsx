import { useState } from 'react';
import { Quest, GAME_ITEMS } from '../../types';
import { MessageCircle, ChevronDown, ChevronRight, Plus, Trash2, Clock, MessageSquare, Gift, ArrowRight, Sun, Moon, Sunset, Sunrise, Coins, Heart, Trophy, Sword, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ItemSelector } from './ItemSelector';
import { DialogueEditor } from './DialogueEditor';

interface QuestPanelProps {
  object: {
    quests?: Quest[];
  };
  onChange: (updates: Partial<typeof object>) => void;
}

const TIME_OF_DAY_CONFIG = [
  { id: 'morning', icon: Sunrise, label: 'Morning', color: 'amber' },
  { id: 'noon', icon: Sun, label: 'Noon', color: 'yellow' },
  { id: 'evening', icon: Sunset, label: 'Evening', color: 'orange' },
  { id: 'night', icon: Moon, label: 'Night', color: 'blue' }
] as const;

export function QuestPanel({ object, onChange }: QuestPanelProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [editingQuest, setEditingQuest] = useState<Quest | null>(null);
  const [showItemSelector, setShowItemSelector] = useState<{
    type: 'requirement' | 'reward';
    questId: string;
  } | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };

  const addNewQuest = () => {
    const newQuest: Quest = {
      id: `quest-${Date.now()}`,
      title: 'New Quest',
      description: 'Quest description',
      dialogues: [
        {
          id: 0,
          speaker: 'NPC',
          text: 'Hello adventurer!',
          choices: [
            {
              text: 'Continue',
              nextDialogue: 1
            }
          ]
        }
      ],
      requirements: {
        level: 1,
        energy: 10,
        money: 0,
        timeOfDay: ['morning', 'noon'],
        items: []
      },
      rewards: {
        xp: 100,
        money: 50,
        energy: 20,
        items: []
      },
      completion: {
        conditions: {
          items: [],
          location: undefined,
          npcTalk: [],
          objectInteract: [],
          enemyDefeat: []
        },
        actions: [
          {
            type: 'complete',
            params: { message: 'Quest completed!' }
          }
        ]
      },
      completed: false
    };

    onChange({
      quests: [...(object.quests || []), newQuest]
    });
    setEditingQuest(newQuest);
  };

  const updateQuest = (questId: string, updates: Partial<Quest>) => {
    onChange({
      quests: object.quests?.map(q =>
        q.id === questId ? { ...q, ...updates } : q
      )
    });
  };

  const handleItemSelect = (item: typeof GAME_ITEMS[0]) => {
    if (!showItemSelector) return;

    const { type, questId } = showItemSelector;
    const quest = object.quests?.find(q => q.id === questId);
    if (!quest) return;

    if (type === 'requirement') {
      const items = [...(quest.requirements.items || [])];
      items.push({ id: item.id, amount: 1 });
      updateQuest(questId, {
        requirements: {
          ...quest.requirements,
          items
        }
      });
    } else {
      const items = [...(quest.rewards.items || [])];
      items.push({ id: item.id, amount: 1 });
      updateQuest(questId, {
        rewards: {
          ...quest.rewards,
          items
        }
      });
    }

    setShowItemSelector(null);
  };

  const getItemDetails = (itemId: string) => {
    return GAME_ITEMS.find(item => item.id === itemId);
  };

  return (
    <div className="space-y-4">
      <button
        onClick={() => toggleSection('quests')}
        className="w-full flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-slate-700/50"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-500/10">
            <MessageCircle className="w-4 h-4 text-indigo-400" />
          </div>
          <span className="font-medium text-slate-100">Quests & Dialogues</span>
        </div>
        {expandedSections.has('quests') ? (
          <ChevronDown className="w-4 h-4 text-slate-400" />
        ) : (
          <ChevronRight className="w-4 h-4 text-slate-400" />
        )}
      </button>

      {expandedSections.has('quests') && (
        <div className="space-y-4">
          {/* Quest List */}
          <div className="space-y-2">
            {(object.quests || []).map((quest) => (
              <motion.div
                key={quest.id}
                layout
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-lg border transition-all overflow-hidden ${
                  editingQuest?.id === quest.id
                    ? 'bg-slate-800/50 border-indigo-500/30'
                    : 'bg-slate-800/30 border-slate-700/30'
                }`}
              >
                {/* Quest Header */}
                <div 
                  className="p-3 cursor-pointer hover:bg-slate-700/30 transition-colors"
                  onClick={() => setEditingQuest(editingQuest?.id === quest.id ? null : quest)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-indigo-400" />
                      <input
                        type="text"
                        value={quest.title}
                        onChange={(e) => updateQuest(quest.id, { title: e.target.value })}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-transparent text-sm font-medium text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500/30 rounded px-1"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">
                        {quest.dialogues.length} dialogues
                      </span>
                      {editingQuest?.id === quest.id ? (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Quest Details */}
                <AnimatePresence>
                  {editingQuest?.id === quest.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-slate-700/50"
                    >
                      <div className="p-4 space-y-6">
                        {/* Description */}
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-slate-400">Description</label>
                          <textarea
                            value={quest.description}
                            onChange={(e) => updateQuest(quest.id, { description: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-sm resize-none focus:outline-none focus:ring-1 focus:ring-indigo-500/30"
                            rows={3}
                          />
                        </div>

                        {/* Dialogues */}
                        <div className="space-y-2">
                          <h3 className="text-sm font-medium text-slate-200 flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 text-indigo-400" />
                            Dialogues
                          </h3>
                          <DialogueEditor
                            quest={quest}
                            onChange={(updates) => updateQuest(quest.id, updates)}
                          />
                        </div>

                        {/* Requirements Section */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-slate-400" />
                            <h3 className="text-sm font-medium text-slate-200">Requirements</h3>
                          </div>

                          {/* Level & Stats Requirements */}
                          <div className="grid grid-cols-3 gap-3">
                            <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/30">
                              <div className="flex items-center gap-2 mb-2">
                                <Trophy className="w-4 h-4 text-yellow-400" />
                                <label className="text-xs text-slate-300">Level</label>
                              </div>
                              <input
                                type="number"
                                min="1"
                                value={quest.requirements.level || 1}
                                onChange={(e) => updateQuest(quest.id, {
                                  requirements: {
                                    ...quest.requirements,
                                    level: parseInt(e.target.value) || 1
                                  }
                                })}
                                className="w-full px-2 py-1 bg-slate-900/50 border border-slate-600/50 rounded text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500/30"
                              />
                            </div>

                            <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/30">
                              <div className="flex items-center gap-2 mb-2">
                                <Heart className="w-4 h-4 text-red-400" />
                                <label className="text-xs text-slate-300">Energy</label>
                              </div>
                              <input
                                type="number"
                                min="0"
                                value={quest.requirements.energy || 0}
                                onChange={(e) => updateQuest(quest.id, {
                                  requirements: {
                                    ...quest.requirements,
                                    energy: parseInt(e.target.value) || 0
                                  }
                                })}
                                className="w-full px-2 py-1 bg-slate-900/50 border border-slate-600/50 rounded text-sm focus:outline-none focus:ring-1 focus:ring-red-500/30"
                              />
                            </div>

                            <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/30">
                              <div className="flex items-center gap-2 mb-2">
                                <Coins className="w-4 h-4 text-amber-400" />
                                <label className="text-xs text-slate-300">Money</label>
                              </div>
                              <input
                                type="number"
                                min="0"
                                value={quest.requirements.money || 0}
                                onChange={(e) => updateQuest(quest.id, {
                                  requirements: {
                                    ...quest.requirements,
                                    money: parseInt(e.target.value) || 0
                                  }
                                })}
                                className="w-full px-2 py-1 bg-slate-900/50 border border-slate-600/50 rounded text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/30"
                              />
                            </div>
                          </div>

                          {/* Time of Day Requirements */}
                          <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/30">
                            <label className="text-xs text-slate-300 mb-3 block">Available Times</label>
                            <div className="grid grid-cols-2 gap-2">
                              {TIME_OF_DAY_CONFIG.map(({ id, icon: Icon, label }) => {
                                const isSelected = quest.requirements.timeOfDay?.includes(id as any);
                                return (
                                  <button
                                    key={id}
                                    onClick={() => {
                                      const times = new Set(quest.requirements.timeOfDay || []);
                                      if (isSelected) {
                                        times.delete(id as any);
                                      } else {
                                        times.add(id as any);
                                      }
                                      updateQuest(quest.id, {
                                        requirements: {
                                          ...quest.requirements,
                                          timeOfDay: Array.from(times)
                                        }
                                      });
                                    }}
                                    className={`flex items-center gap-2 p-3 rounded-lg border transition-all ${
                                      isSelected
                                        ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-100'
                                        : 'bg-slate-900/30 border-slate-700/30 text-slate-400 hover:bg-slate-900/50'
                                    }`}
                                  >
                                    <Icon className={`w-4 h-4 ${isSelected ? 'text-indigo-400' : ''}`} />
                                    <span className="text-xs font-medium">{label}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Required Items */}
                          <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/30">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <Package className="w-4 h-4 text-slate-400" />
                                <label className="text-xs text-slate-300">Required Items</label>
                              </div>
                              <button
                                onClick={() => setShowItemSelector({ type: 'requirement', questId: quest.id })}
                                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                Add Item
                              </button>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              {(quest.requirements.items || []).map((item, index) => {
                                const itemDetails = getItemDetails(item.id);
                                return (
                                  <div
                                    key={index}
                                    className="flex items-center gap-2 p-2 bg-slate-900/30 rounded-lg border border-slate-700/30"
                                  >
                                    <div className="text-2xl">{itemDetails?.emoji}</div>
                                    <div className="flex-1 min-w-0">
                                      <div className="text-xs font-medium text-slate-200 truncate">
                                        {itemDetails?.name || item.id}
                                      </div>
                                      <input
                                        type="number"
                                        min="1"
                                        value={item.amount}
                                        onChange={(e) => {
                                          const items = [...(quest.requirements.items || [])];
                                          items[index] = { ...item, amount: parseInt(e.target.value) || 1 };
                                          updateQuest(quest.id, {
                                            requirements: {
                                              ...quest.requirements,
                                              items
                                            }
                                          });
                                        }}
                                        className="w-16 px-1 py-0.5 bg-slate-800/50 border border-slate-600/50 rounded text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500/30"
                                      />
                                    </div>
                                    <button
                                      onClick={() => {
                                        const items = [...(quest.requirements.items || [])];
                                        items.splice(index, 1);
                                        updateQuest(quest.id, {
                                          requirements: {
                                            ...quest.requirements,
                                            items
                                          }
                                        });
                                      }}
                                      className="p-1 text-slate-400 hover:text-red-400 rounded"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        {/* Rewards Section */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <Gift className="w-4 h-4 text-slate-400" />
                            <h3 className="text-sm font-medium text-slate-200">Rewards</h3>
                          </div>

                          <div className="grid grid-cols-3 gap-3">
                            <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/30">
                              <div className="flex items-center gap-2 mb-2">
                                <Trophy className="w-4 h-4 text-yellow-400" />
                                <label className="text-xs text-slate-300">XP</label>
                              </div>
                              <input
                                type="number"
                                min="0"
                                value={quest.rewards.xp || 0}
                                onChange={(e) => updateQuest(quest.id, {
                                  rewards: {
                                    ...quest.rewards,
                                    xp: parseInt(e.target.value) || 0
                                  }
                                })}
                                className="w-full px-2 py-1 bg-slate-900/50 border border-slate-600/50 rounded text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500/30"
                              />
                            </div>

                            <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/30">
                              <div className="flex items-center gap-2 mb-2">
                                <Coins className="w-4 h-4 text-amber-400" />
                                <label className="text-xs text-slate-300">Money</label>
                              </div>
                              <input
                                type="number"
                                min="0"
                                value={quest.rewards.money || 0}
                                onChange={(e) => updateQuest(quest.id, {
                                  rewards: {
                                    ...quest.rewards,
                                    money: parseInt(e.target.value) || 0
                                  }
                                })}
                                className="w-full px-2 py-1 bg-slate-900/50 border border-slate-600/50 rounded text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/30"
                              />
                            </div>

                            <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/30">
                              <div className="flex items-center gap-2 mb-2">
                                <Heart className="w-4 h-4 text-red-400" />
                                <label className="text-xs text-slate-300">Energy</label>
                              </div>
                              <input
                                type="number"
                                min="0"
                                value={quest.rewards.energy || 0}
                                onChange={(e) => updateQuest(quest.id, {
                                  rewards: {
                                    ...quest.rewards,
                                    energy: parseInt(e.target.value) || 0
                                  }
                                })}
                                className="w-full px-2 py-1 bg-slate-900/50 border border-slate-600/50 rounded text-sm focus:outline-none focus:ring-1 focus:ring-red-500/30"
                              />
                            </div>
                          </div>

                          {/* Reward Items */}
                          <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/30">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <Package className="w-4 h-4 text-slate-400" />
                                <label className="text-xs text-slate-300">Reward Items</label>
                              </div>
                              <button
                                onClick={() => setShowItemSelector({ type: 'reward', questId: quest.id })}
                                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                Add Item
                              </button>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              {(quest.rewards.items || []).map((item, index) => {
                                const itemDetails = getItemDetails(item.id);
                                return (
                                  <div
                                    key={index}
                                    className="flex items-center gap-2 p-2 bg-slate-900/30 rounded-lg border border-slate-700/30"
                                  >
                                    <div className="text-2xl">{itemDetails?.emoji}</div>
                                    <div className="flex-1 min-w-0">
                                      <div className="text-xs font-medium text-slate-200 truncate">
                                        {itemDetails?.name || item.id}
                                      </div>
                                      <input
                                        type="number"
                                        min="1"
                                        value={item.amount}
                                        onChange={(e) => {
                                          const items = [...(quest.rewards.items || [])];
                                          items[index] = { ...item, amount: parseInt(e.target.value) || 1 };
                                          updateQuest(quest.id, {
                                            rewards: {
                                              ...quest.rewards,
                                              items
                                            }
                                          });
                                        }}
                                        className="w-16 px-1 py-0.5 bg-slate-800/50 border border-slate-600/50 rounded text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500/30"
                                      />
                                    </div>
                                    <button
                                      onClick={() => {
                                        const items = [...(quest.rewards.items || [])];
                                        items.splice(index, 1);
                                        updateQuest(quest.id, {
                                          rewards: {
                                            ...quest.rewards,
                                            items
                                          }
                                        });
                                      }}
                                      className="p-1 text-slate-400 hover:text-red-400 rounded"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          <button
            onClick={addNewQuest}
            className="w-full p-2 flex items-center justify-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add New Quest
          </button>
        </div>
      )}

      {/* Item Selector Modal */}
      {showItemSelector && (
        <ItemSelector
          onSelect={handleItemSelect}
          onClose={() => setShowItemSelector(null)}
        />
      )}
    </div>
  );
}