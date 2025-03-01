import { useState } from "react";
import { Quest, Item } from "../../../types";
import { ItemSelector } from "../../editor/ItemSelector";
import { QuestStory } from "./QuestStory";
import { QuestRequirements } from "./QuestRequirements";
import { QuestRewards } from "./QuestRewards";

interface QuestEditorProps {
  quest: Quest;
  updateQuest: (questId: string, updates: Partial<Quest>) => void;
}

export function QuestEditor({ quest, updateQuest }: QuestEditorProps) {
  const [showItemSelector, setShowItemSelector] = useState<{
    type: "requirement" | "reward";
    open: boolean;
  }>({ type: "requirement", open: false });

  const handleAddItem = (items: Item[]) => {
    if (items.length === 0) return;
    const item = items[0]; // We only use the first item since we're adding one at a time

    if (showItemSelector.type === "requirement") {
      const currentItems = quest.requirements.items || [];
      const existingItem = currentItems.find((i) => i.id === item.id);

      const newItems = existingItem
        ? currentItems.map((i) =>
            i.id === item.id ? { ...i, amount: (i.amount || 1) + 1 } : i
          )
        : [...currentItems, { id: item.id, amount: 1, name: item.name }];

      updateQuest(quest.id, {
        requirements: {
          ...quest.requirements,
          items: newItems,
        },
      });
    } else {
      const currentItems = quest.rewards.items || [];
      const existingItem = currentItems.find((i) => i.id === item.id);

      const newItems = existingItem
        ? currentItems.map((i) =>
            i.id === item.id ? { ...i, amount: (i.amount || 1) + 1 } : i
          )
        : [...currentItems, { id: item.id, amount: 1, name: item.name }];

      updateQuest(quest.id, {
        rewards: {
          ...quest.rewards,
          items: newItems,
        },
      });
    }
  };

  const handleRemoveItem = (itemId: string, type: "requirement" | "reward") => {
    if (type === "requirement") {
      const updatedItems =
        quest.requirements.items?.filter((i) => i.id !== itemId) || [];
      updateQuest(quest.id, {
        requirements: {
          ...quest.requirements,
          items: updatedItems,
        },
      });
    } else {
      const updatedItems =
        quest.rewards.items?.filter((i) => i.id !== itemId) || [];
      updateQuest(quest.id, {
        rewards: {
          ...quest.rewards,
          items: updatedItems,
        },
      });
    }
  };

  const handleIncrementItem = (
    itemId: string,
    type: "requirement" | "reward"
  ) => {
    if (type === "requirement") {
      const updatedItems = quest.requirements.items?.map((i) =>
        i.id === itemId ? { ...i, amount: (i.amount || 1) + 1 } : i
      );
      updateQuest(quest.id, {
        requirements: {
          ...quest.requirements,
          items: updatedItems,
        },
      });
    } else {
      const updatedItems = quest.rewards.items?.map((i) =>
        i.id === itemId ? { ...i, amount: (i.amount || 1) + 1 } : i
      );
      updateQuest(quest.id, {
        rewards: {
          ...quest.rewards,
          items: updatedItems,
        },
      });
    }
  };

  return (
    <>
      <div className="space-y-4">
        {/* Story Section */}
        <QuestStory quest={quest} updateQuest={updateQuest} />

        {/* Requirements Section */}
        <QuestRequirements
          quest={quest}
          updateQuest={updateQuest}
          onAddItem={() =>
            setShowItemSelector({ type: "requirement", open: true })
          }
          onIncrementItem={(itemId) =>
            handleIncrementItem(itemId, "requirement")
          }
          onRemoveItem={(itemId) => handleRemoveItem(itemId, "requirement")}
        />

        {/* Rewards Section */}
        <QuestRewards
          quest={quest}
          updateQuest={updateQuest}
          onAddItem={() => setShowItemSelector({ type: "reward", open: true })}
          onIncrementItem={(itemId) => handleIncrementItem(itemId, "reward")}
          onRemoveItem={(itemId) => handleRemoveItem(itemId, "reward")}
        />

        {/* Item Selector Modal */}
        {showItemSelector.open && (
          <ItemSelector
            onSelect={handleAddItem}
            onClose={() =>
              setShowItemSelector({ ...showItemSelector, open: false })
            }
            maxSelections={1}
            title={`Select ${
              showItemSelector.type === "requirement" ? "Required" : "Reward"
            } Item to Add`}
          />
        )}
      </div>
    </>
  );
}
