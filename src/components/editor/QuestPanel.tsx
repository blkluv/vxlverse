import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Scroll,
  Edit3,
  Trash2,
  X,
  BookOpen,
  Plus,
  Type,
  AlignLeft,
} from "lucide-react";
import { Quest, GAME_ITEMS } from "../../types";
import { RequirementsPanel } from "./properties/requirments";
import { Textarea } from "../UI/textarea";
import { Input } from "../UI/input";

interface QuestPanelProps {
  object: {
    quests?: Quest[];
  };
  onChange: (updates: Partial<{ quests?: Quest[] }>) => void;
}

interface QuestItem {
  id: string;
  name: string;
  amount: number;
  quantity?: number;
}

type QuestTab = "story" | "requirements" | "rewards";

export function QuestPanel({ object, onChange }: QuestPanelProps) {
  const [editingQuest, setEditingQuest] = useState<Quest | null>(null);
  const [activeTab, setActiveTab] = useState<QuestTab>("story");
  const [showItemSelector, setShowItemSelector] = useState<{
    type: "requirement" | "reward";
    questId: string;
  } | null>(null);

  // Create a new quest with default values
  const addNewQuest = useCallback(() => {
    const newQuest: Quest = {
      id: `quest-${Date.now()}`,
      title: "New Quest",
      description: "Quest description goes here...",
      status: "active",
      requirements: {
        level: 1,
        energy: 0,
        money: 0,
        time: { start: "", end: "" },
        items: [],
      },
      rewards: {
        xp: 100,
        energy: 0,
        money: 50,
        items: [],
      },
      completion: { actions: [] },
      completionText: "Congratulations on completing this quest!",
      tracking: { type: "manual", quantity: 1 },
      objectives: [],
      dialogues: [],
      backstory: "",
      completed: false,
    };

    onChange({ quests: [...(object.quests || []), newQuest] });
    setEditingQuest(newQuest);
    setActiveTab("story");
  }, [object.quests, onChange]);

  // Remove quest
  const removeQuest = useCallback(
    (questId: string) => {
      onChange({
        quests: object.quests?.filter((q) => q.id !== questId) || [],
      });
      if (editingQuest?.id === questId) setEditingQuest(null);
    },
    [editingQuest?.id, object.quests, onChange]
  );

  // Update quest
  const updateQuest = useCallback(
    (questId: string, updates: Partial<Quest>) => {
      onChange({
        quests:
          object.quests?.map((q) =>
            q.id === questId ? { ...q, ...updates } : q
          ) || [],
      });
      if (editingQuest?.id === questId) {
        setEditingQuest((prev) => (prev ? { ...prev, ...updates } : null));
      }
    },
    [editingQuest?.id, object.quests, onChange]
  );

  // Handle item selection (for requirements or rewards)
  const handleItemSelect = useCallback(
    (item: (typeof GAME_ITEMS)[0]) => {
      if (!showItemSelector || !item) return;

      const { type, questId } = showItemSelector;
      const quest = object.quests?.find((q) => q.id === questId);
      if (!quest) return;

      const listKey = type === "requirement" ? "requirements" : "rewards";
      const currentItems = quest[listKey].items || [];
      const existingItem = currentItems.find(
        (i: QuestItem) => i.id === item.id
      );

      const newItems = existingItem
        ? currentItems.map((i: QuestItem) =>
            i.id === item.id ? { ...i, amount: (i.amount || 1) + 1 } : i
          )
        : [...currentItems, { id: item.id, amount: 1, name: item.name }];

      updateQuest(questId, {
        [listKey]: { ...quest[listKey], items: newItems },
      } as Partial<Quest>);
      setShowItemSelector(null);
    },
    [object.quests, showItemSelector, updateQuest]
  );

  // Toggle quest editor view
  const toggleQuestEditor = useCallback((quest: Quest) => {
    setEditingQuest((prev) => (prev?.id === quest.id ? null : quest));
    setActiveTab("story");
  }, []);

  // Sub-component: SectionHeader
  const SectionHeader = ({
    icon,
    title,
  }: {
    icon: React.ReactNode;
    title: string;
  }) => (
    <div className="flex items-center gap-2 mb-2">
      <div className="w-5 h-5 flex items-center justify-center  bg-gradient-to-br from-blue-500/30 to-indigo-500/20 border border-blue-500/40 shadow-sm">
        <div className="text-blue-300">{icon}</div>
      </div>
      <span className="text-xs font-semibold text-slate-100 tracking-wide">
        {title}
      </span>
    </div>
  );

  // Sub-component: TabButton
  const TabButton = ({
    icon,
    label,
    isActive,
    onClick,
  }: {
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-xs font-medium transition-all duration-200 relative ${
        isActive
          ? "text-blue-50 bg-gradient-to-r from-blue-600/20 to-blue-500/10 shadow-sm"
          : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/40"
      }`}
    >
      <div className="flex items-center gap-1.5">
        <div
          className={`transition-colors duration-200 ${
            isActive ? "text-blue-300" : ""
          }`}
        >
          {icon}
        </div>
        {label}
      </div>
      {isActive && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-400 -t-full" />
      )}
    </button>
  );

  // Sub-component: ItemCard
  const ItemCard = ({
    item,
    onIncrement,
    onRemove,
  }: {
    item: QuestItem;
    onIncrement: () => void;
    onRemove: () => void;
  }) => {
    const gameItem = GAME_ITEMS.find((gi) => gi.id === item.id);
    if (!gameItem) return null;
    return (
      <div className="flex items-center justify-between p-2 bg-gradient-to-r from-slate-800/90 via-slate-800/70 to-slate-800/90 border border-slate-700/70  shadow-md hover:shadow-lg hover:border-slate-600/80 hover:from-slate-800/95 hover:to-slate-800/95 transition-all duration-200">
        <div className="flex items-center gap-2.5">
          <div className="text-xl flex items-center justify-center w-9 h-9 bg-gradient-to-br from-slate-700/60 to-slate-800/60  border border-slate-600/40 shadow-inner">
            {gameItem.emoji}
          </div>
          <div className="min-w-0">
            <div className="text-xs font-medium text-slate-100 truncate group-hover:text-white">
              {gameItem.name}
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <span className="flex items-center">
                <span className="text-amber-400 mr-0.5">×</span>
                <span>{item.amount || item.quantity || 1}</span>
              </span>
              <span className="text-slate-500 text-[10px] px-1.5 py-0.5 -full bg-slate-800/80 border border-slate-700/50">
                {gameItem.type}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onIncrement();
            }}
            className="p-1.5 text-slate-400 hover:text-blue-300 hover:bg-blue-500/10 transition-all "
            title="Increase quantity"
            aria-label="Increase quantity"
          >
            <Plus className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="p-1.5 text-slate-400 hover:bg-red-500/20 hover:text-red-300 transition-all "
            title="Remove item"
            aria-label="Remove item"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  };

  // Render list of items (used for both requirements and rewards)
  const renderItemsList = useCallback(
    (items: QuestItem[] = []) => {
      if (!items.length)
        return (
          <div className="text-xs text-slate-400 italic">No items added</div>
        );
      return (
        <div className="space-y-1.5 mt-1.5 max-h-40 overflow-y-auto custom-scrollbar">
          {items.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onIncrement={() => {
                const quest = object.quests?.find(
                  (q) => q.id === editingQuest?.id
                );
                if (!quest) return;
                if (activeTab === "requirements") {
                  const updatedItems = quest.requirements.items?.map((i) =>
                    i.id === item.id ? { ...i, amount: (i.amount || 1) + 1 } : i
                  );
                  updateQuest(quest.id, {
                    requirements: {
                      ...quest.requirements,
                      items: updatedItems,
                    },
                  });
                } else if (activeTab === "rewards") {
                  const updatedItems = quest.rewards.items?.map((i) =>
                    i.id === item.id ? { ...i, amount: (i.amount || 1) + 1 } : i
                  );
                  updateQuest(quest.id, {
                    rewards: { ...quest.rewards, items: updatedItems },
                  });
                }
              }}
              onRemove={() => {
                const quest = object.quests?.find(
                  (q) => q.id === editingQuest?.id
                );
                if (!quest) return;
                if (activeTab === "requirements") {
                  const updatedItems =
                    quest.requirements.items?.filter((i) => i.id !== item.id) ||
                    [];
                  updateQuest(quest.id, {
                    requirements: {
                      ...quest.requirements,
                      items: updatedItems,
                    },
                  });
                } else if (activeTab === "rewards") {
                  const updatedItems =
                    quest.rewards.items?.filter((i) => i.id !== item.id) || [];
                  updateQuest(quest.id, {
                    rewards: { ...quest.rewards, items: updatedItems },
                  });
                }
              }}
            />
          ))}
        </div>
      );
    },
    [activeTab, editingQuest?.id, object.quests, updateQuest]
  );

  return (
    <div className="space-y-2">
      {/* Quest List */}
      <>
        <motion.div
          className="space-y-2 overflow-hidden custom-scrollbar"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {object.quests?.map((quest) => (
            <motion.div
              key={quest.id}
              className={`mb-1 border  overflow-hidden shadow-md transition-all duration-200 ${
                editingQuest?.id === quest.id
                  ? "bg-gradient-to-br from-slate-800/95 via-slate-850/95 to-slate-900/98 border-blue-500/30 shadow-lg ring-1 ring-blue-500/10"
                  : "bg-gradient-to-r from-slate-800/70 to-slate-800/80 hover:from-slate-800/80 hover:to-slate-800/90 border-slate-700/50 hover:border-slate-600/70"
              }`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div
                className="p-2.5 flex items-center justify-between cursor-pointer"
                onClick={() => toggleQuestEditor(quest)}
                role="button"
                tabIndex={0}
                aria-expanded={editingQuest?.id === quest.id}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    toggleQuestEditor(quest);
                    e.preventDefault();
                  }
                }}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`p-1.5  flex items-center justify-center ${
                      editingQuest?.id === quest.id
                        ? "bg-gradient-to-br from-blue-500/30 to-indigo-500/20 text-blue-300 shadow-sm"
                        : "bg-slate-700/80 text-slate-300"
                    }`}
                  >
                    <Scroll className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3
                      className={`text-sm font-medium ${
                        editingQuest?.id === quest.id
                          ? "text-blue-50"
                          : "text-slate-100"
                      }`}
                    >
                      {quest.title || "Untitled Quest"}
                    </h3>
                    {quest.status && (
                      <div className="text-[11px] flex items-center gap-1.5 mt-0.5">
                        <span
                          className={`inline-block w-2 h-2 -full ${
                            quest.status === "active"
                              ? "bg-green-400 shadow-sm shadow-green-400/30"
                              : quest.status === "completed"
                              ? "bg-blue-400 shadow-sm shadow-blue-400/30"
                              : "bg-amber-400 shadow-sm shadow-amber-400/30"
                          }`}
                        />
                        <span className="text-slate-400 capitalize">
                          {quest.status}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleQuestEditor(quest);
                    }}
                    className={`p-1.5  transition-all duration-200 ${
                      editingQuest?.id === quest.id
                        ? "text-blue-300 hover:bg-blue-500/20 hover:text-blue-200"
                        : "text-slate-400 hover:bg-slate-700/80 hover:text-slate-200"
                    }`}
                    title={editingQuest?.id === quest.id ? "Close" : "Edit"}
                    aria-label={
                      editingQuest?.id === quest.id
                        ? "Close quest editor"
                        : "Edit quest"
                    }
                  >
                    {editingQuest?.id === quest.id ? (
                      <X className="w-3.5 h-3.5" />
                    ) : (
                      <Edit3 className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeQuest(quest.id);
                    }}
                    className="p-1.5  text-slate-400 hover:bg-red-500/20 hover:text-red-300 transition-all duration-200"
                    title="Delete quest"
                    aria-label="Delete quest"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Quest Details */}
              <>
                {editingQuest?.id === quest.id && (
                  <div>
                    {/* Tab Content */}
                    <div className="p-3 bg-gradient-to-b from-slate-900/90 to-slate-900/95 backdrop-blur-sm">
                      <div className="space-y-3">
                        <div>
                          <label
                            htmlFor="quest-title"
                            className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5"
                          >
                            <Type className="w-3 h-3 text-cyan-400" /> Title
                          </label>
                          <Input
                            id="quest-title"
                            type="text"
                            value={quest.title}
                            onChange={(e) =>
                              updateQuest(quest.id, { title: e.target.value })
                            }
                            className="w-full px-3 py-1.5 bg-slate-800/30 border border-slate-700/80  text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/40 transition-colors"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="quest-description"
                            className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5"
                          >
                            <AlignLeft className="w-3 h-3 text-teal-400" />{" "}
                            Description
                          </label>
                          <Textarea
                            id="quest-description"
                            value={quest.description}
                            onChange={(e) =>
                              updateQuest(quest.id, {
                                description: e.target.value,
                              })
                            }
                            className="w-full px-3 py-1.5 bg-slate-800/90 border border-slate-700/80  text-xs text-slate-100 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/40 transition-colors"
                            rows={2}
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="quest-backstory"
                            className=" text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5"
                          >
                            <BookOpen className="w-3 h-3 text-purple-400" />{" "}
                            Backstory
                          </label>
                          <Textarea
                            id="quest-backstory"
                            value={quest.backstory}
                            onChange={(e) =>
                              updateQuest(quest.id, {
                                backstory: e.target.value,
                              })
                            }
                            className="w-full px-3 py-1.5 bg-slate-800/90 border border-slate-700/80  text-xs text-slate-100 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/40 transition-colors"
                            rows={3}
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <RequirementsPanel />
                      </div>
                    </div>
                  </div>
                )}
              </>
            </motion.div>
          ))}
          <button
            onClick={addNewQuest}
            className="w-full p-2.5 flex items-center justify-center gap-2 text-xs font-medium text-slate-100 bg-gradient-to-r from-blue-500/15 to-blue-500/10 hover:from-blue-500/20 hover:to-blue-500/15 border border-blue-500/30 hover:border-blue-500/40  transition-all duration-200 shadow-sm"
          >
            <Plus className="w-4 h-4 text-blue-400" />
            Add New Quest
          </button>
        </motion.div>
      </>
    </div>
  );
}
