import { useState, useCallback } from "react";
import { Plus } from "lucide-react";
import { Quest } from "../../../types";
import { QuestItem } from "./QuestItem";
import { QuestEditor } from "./QuestEditor";

interface QuestPanelProps {
  object: {
    quests?: Quest[];
  };
  onChange: (updates: Partial<{ quests?: Quest[] }>) => void;
}

type QuestTab = "story" | "requirements" | "rewards";

export function QuestPanel({ object, onChange }: QuestPanelProps) {
  const [editingQuest, setEditingQuest] = useState<Quest | null>(null);
  const [activeTab, setActiveTab] = useState<QuestTab>("story");

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
        quests: object.quests?.map((q) => (q.id === questId ? { ...q, ...updates } : q)) || [],
      });
      if (editingQuest?.id === questId) {
        setEditingQuest((prev) => (prev ? { ...prev, ...updates } : null));
      }
    },
    [editingQuest?.id, object.quests, onChange]
  );

  // Toggle quest editor view
  const toggleQuestEditor = useCallback((quest: Quest) => {
    setEditingQuest((prev) => (prev?.id === quest.id ? null : quest));
    setActiveTab("story");
  }, []);

  return (
    <div className="space-y-2">
      {/* Quest List */}
      <div className="space-y-2 overflow-hidden custom-scrollbar">
        {object.quests?.map((quest) => (
          <QuestItem
            key={quest.id}
            quest={quest}
            isEditing={editingQuest?.id === quest.id}
            onToggleEdit={() => toggleQuestEditor(quest)}
            onRemove={() => removeQuest(quest.id)}
          >
            {editingQuest?.id === quest.id && (
              <QuestEditor quest={quest} updateQuest={updateQuest} />
            )}
          </QuestItem>
        ))}

        <button
          onClick={addNewQuest}
          className="w-full p-2.5 flex items-center justify-center gap-2 text-xs font-medium text-slate-100 bg-gradient-to-r from-blue-500/15 to-blue-500/10 hover:from-blue-500/20 hover:to-blue-500/15 border border-blue-500/30 hover:border-blue-500/40 transition-all duration-200 shadow-sm"
        >
          <Plus className="w-4 h-4 text-blue-400" />
          Add New Quest
        </button>
      </div>
    </div>
  );
}
