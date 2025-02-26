import { Quest, GAME_ITEMS } from "../../types";
import {
  Trophy,
  Heart,
  Coins,
  Package,
  Plus,
  Trash2,
  Gift,
} from "lucide-react";

interface QuestRewardsProps {
  quest: Quest;
  onChange: (updates: Partial<Quest>) => void;
  onAddItem: () => void;
}

export function QuestRewards({
  quest,
  onChange,
  onAddItem,
}: QuestRewardsProps) {
  const updateRewards = (updates: Partial<typeof quest.rewards>) => {
    onChange({
      rewards: {
        ...quest.rewards,
        ...updates,
      },
    });
  };

  const getItemDetails = (itemId: string) => {
    return GAME_ITEMS.find((item) => item.id === itemId);
  };

  return (
    <div className="space-y-4">
      {/* Basic Rewards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1">
          <label className="text-xs text-slate-400 flex items-center gap-1">
            <Trophy className="w-3 h-3" /> XP Reward
          </label>
          <input
            type="number"
            min="0"
            value={quest.rewards.xp}
            onChange={(e) =>
              updateRewards({
                xp: parseInt(e.target.value) || 0,
              })
            }
            className="w-full bg-slate-800 border border-slate-700  px-2 py-1 text-sm text-slate-200 focus:ring-1 focus:ring-indigo-500/30 focus:outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs text-slate-400 flex items-center gap-1">
            <Coins className="w-3 h-3" /> Money Reward
          </label>
          <input
            type="number"
            min="0"
            value={quest.rewards.money}
            onChange={(e) =>
              updateRewards({
                money: parseInt(e.target.value) || 0,
              })
            }
            className="w-full bg-slate-800 border border-slate-700  px-2 py-1 text-sm text-slate-200 focus:ring-1 focus:ring-indigo-500/30 focus:outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs text-slate-400 flex items-center gap-1">
            <Heart className="w-3 h-3" /> Energy Reward
          </label>
          <input
            type="number"
            min="0"
            value={quest.rewards.energy}
            onChange={(e) =>
              updateRewards({
                energy: parseInt(e.target.value) || 0,
              })
            }
            className="w-full bg-slate-800 border border-slate-700  px-2 py-1 text-sm text-slate-200 focus:ring-1 focus:ring-indigo-500/30 focus:outline-none"
          />
        </div>
      </div>

      {/* Reward Items */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs text-slate-400 flex items-center gap-1">
            <Package className="w-3 h-3" /> Item Rewards
          </label>
          <button
            onClick={onAddItem}
            className="text-xs px-2 py-1 bg-slate-800 hover:bg-slate-700  text-slate-300 flex items-center gap-1 transition-colors"
          >
            <Plus className="w-3 h-3" /> Add Item
          </button>
        </div>

        <div className="space-y-1 max-h-32 overflow-y-auto custom-scrollbar pr-1">
          {quest.rewards.items.length === 0 ? (
            <div className="text-xs text-slate-500 italic p-2 text-center bg-slate-800/50 ">
              No reward items
            </div>
          ) : (
            quest.rewards.items.map((item, index) => {
              const itemDetails = getItemDetails(item.id);
              return (
                <div
                  key={`${item.id}-${index}`}
                  className="flex items-center justify-between p-2 bg-slate-800/50  hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 flex items-center justify-center bg-slate-700 ">
                      <span>{itemDetails?.emoji}</span>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-slate-200">
                        {itemDetails?.name || "Unknown Item"}
                      </div>
                      <div className="text-xs text-slate-400">
                        {itemDetails?.type}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      value={item.amount}
                      onChange={(e) => {
                        const newItems = [...quest.rewards.items];
                        newItems[index] = {
                          ...newItems[index],
                          amount: parseInt(e.target.value) || 1,
                        };
                        updateRewards({ items: newItems });
                      }}
                      className="w-12 bg-slate-700 border border-slate-600  px-1 py-0.5 text-xs text-slate-200 focus:ring-1 focus:ring-indigo-500/30 focus:outline-none"
                    />
                    <button
                      onClick={() => {
                        const newItems = quest.rewards.items.filter(
                          (_, i) => i !== index
                        );
                        updateRewards({ items: newItems });
                      }}
                      className="p-1 text-slate-400 hover:text-red-400 hover:bg-red-400/10  transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
