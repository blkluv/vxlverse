import { Quest } from "../../../types";
import { ItemCard, QuestItem as QuestItemType } from "./ItemCard";

interface ItemsListProps {
  items: QuestItemType[];
  activeTab: "requirements" | "rewards";
  editingQuestId: string | null;
  updateQuest: (questId: string, updates: Partial<Quest>) => void;
  quests: Quest[];
}

export function ItemsList({
  items = [],
  activeTab,
  editingQuestId,
  updateQuest,
  quests,
}: ItemsListProps) {
  if (!items.length) {
    return <div className="text-xs text-slate-400 italic">No items added</div>;
  }

  return (
    <div className="space-y-1.5 mt-1.5 max-h-40 overflow-y-auto custom-scrollbar">
      {items.map((item) => (
        <ItemCard
          key={item.id}
          item={item}
          onIncrement={() => {
            const quest = quests.find((q) => q.id === editingQuestId);
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
            const quest = quests.find((q) => q.id === editingQuestId);
            if (!quest) return;

            if (activeTab === "requirements") {
              const updatedItems =
                quest.requirements.items?.filter((i) => i.id !== item.id) || [];
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
}
