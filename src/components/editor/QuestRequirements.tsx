import { Quest, GAME_ITEMS } from "../../types";
import {
  Trophy,
  Heart,
  Coins,
  Clock,
  Package,
  Plus,
  Trash2,
  Sun,
  Moon,
  Sunset,
  Sunrise,
} from "lucide-react";

interface QuestRequirementsProps {
  quest: Quest;
  onChange: (updates: Partial<Quest>) => void;
  onAddItem: () => void;
}

const TIME_OF_DAY_CONFIG = [
  { id: "morning", icon: Sunrise, label: "Morning", color: "amber" },
  { id: "noon", icon: Sun, label: "Noon", color: "yellow" },
  { id: "evening", icon: Sunset, label: "Evening", color: "orange" },
  { id: "night", icon: Moon, label: "Night", color: "blue" },
] as const;

export function QuestRequirements({
  quest,
  onChange,
  onAddItem,
}: QuestRequirementsProps) {
  const updateRequirements = (updates: Partial<typeof quest.requirements>) => {
    onChange({
      requirements: {
        ...quest.requirements,
        ...updates,
      },
    });
  };

  const getItemDetails = (itemId: string) => {
    return GAME_ITEMS.find((item) => item.id === itemId);
  };

  return (
    <div className="space-y-4">
      {/* Basic Requirements Section */}
      <div className="p-3 bg-slate-800/30  border border-slate-700/30">
        <div className="flex items-center gap-2 mb-3">
          <Trophy className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-medium text-slate-200">
            Basic Requirements
          </h3>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs text-slate-400 flex items-center gap-1.5">
              <Trophy className="w-3 h-3 text-amber-400" /> Level
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                value={quest.requirements.level}
                onChange={(e) =>
                  updateRequirements({
                    level: parseInt(e.target.value) || 1,
                  })
                }
                className="w-full bg-slate-800 border border-slate-700  pl-2 pr-6 py-1.5 text-sm text-slate-200 focus:ring-1 focus:ring-amber-500/30 focus:outline-none focus:border-amber-500/50 transition-colors"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none text-xs">
                Lvl
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-slate-400 flex items-center gap-1.5">
              <Heart className="w-3 h-3 text-red-400" /> Energy
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                value={quest.requirements.energy}
                onChange={(e) =>
                  updateRequirements({
                    energy: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full bg-slate-800 border border-slate-700  pl-2 pr-7 py-1.5 text-sm text-slate-200 focus:ring-1 focus:ring-red-500/30 focus:outline-none focus:border-red-500/50 transition-colors"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none text-xs">
                pts
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-slate-400 flex items-center gap-1.5">
              <Coins className="w-3 h-3 text-yellow-400" /> Money
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                value={quest.requirements.money}
                onChange={(e) =>
                  updateRequirements({
                    money: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full bg-slate-800 border border-slate-700  pl-2 pr-7 py-1.5 text-sm text-slate-200 focus:ring-1 focus:ring-yellow-500/30 focus:outline-none focus:border-yellow-500/50 transition-colors"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none text-xs">
                $
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Time of Day Requirements */}
      <div className="p-3 bg-slate-800/30  border border-slate-700/30">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-medium text-slate-200">
            Time Availability
          </h3>
        </div>

        <p className="text-xs text-slate-400 mb-3">
          Select when this quest will be available to players
        </p>

        <div className="flex flex-wrap gap-2">
          {TIME_OF_DAY_CONFIG.map((time) => {
            const Icon = time.icon;
            const isSelected = quest.requirements.timeOfDay.includes(time.id);

            return (
              <button
                key={time.id}
                onClick={() => {
                  const timeOfDay = isSelected
                    ? quest.requirements.timeOfDay.filter((t) => t !== time.id)
                    : [...quest.requirements.timeOfDay, time.id];
                  updateRequirements({ timeOfDay });
                }}
                className={`px-3 py-1.5  text-xs flex items-center gap-1.5 transition-all ${
                  isSelected
                    ? `bg-${time.color}-500/20 text-${time.color}-300 border border-${time.color}-500/30 shadow-sm`
                    : "bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700/50"
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 ${
                    isSelected ? `text-${time.color}-300` : "text-slate-400"
                  }`}
                />
                {time.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Required Items */}
      <div className="p-3 bg-slate-800/30  border border-slate-700/30">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-medium text-slate-200">
              Required Items
            </h3>
          </div>
          <button
            onClick={onAddItem}
            className="text-xs px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300  flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add Item
          </button>
        </div>

        <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar pr-1">
          {quest.requirements.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-4 bg-slate-800/50  text-slate-400 border border-dashed border-slate-700/50">
              <Package className="w-8 h-8 mb-2 text-slate-600" />
              <p className="text-xs text-center">No required items yet</p>
              <button
                onClick={onAddItem}
                className="mt-2 text-xs px-2 py-1 text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                + Add your first item
              </button>
            </div>
          ) : (
            quest.requirements.items.map((item, index) => {
              const itemDetails = getItemDetails(item.id);
              return (
                <div
                  key={`${item.id}-${index}`}
                  className="flex items-center justify-between p-2.5 bg-slate-800/50  hover:bg-slate-800 border border-slate-700/30 hover:border-emerald-500/20 transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 flex items-center justify-center bg-slate-700  border border-slate-600">
                      <span className="text-lg">{itemDetails?.emoji}</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-200">
                        {itemDetails?.name || "Unknown Item"}
                      </div>
                      <div className="text-xs text-slate-400">
                        {itemDetails?.type}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center bg-slate-700  overflow-hidden border border-slate-600">
                      <button
                        onClick={() => {
                          const newItems = [...quest.requirements.items];
                          newItems[index] = {
                            ...newItems[index],
                            amount: Math.max(
                              1,
                              (newItems[index].amount || 1) - 1
                            ),
                          };
                          updateRequirements({ items: newItems });
                        }}
                        className="px-1.5 py-1 text-slate-300 hover:bg-slate-600 transition-colors"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={item.amount}
                        onChange={(e) => {
                          const newItems = [...quest.requirements.items];
                          newItems[index] = {
                            ...newItems[index],
                            amount: parseInt(e.target.value) || 1,
                          };
                          updateRequirements({ items: newItems });
                        }}
                        className="w-12 bg-slate-700 border-x border-slate-600 px-1 py-0.5 text-xs text-center text-slate-200 focus:outline-none"
                      />
                      <button
                        onClick={() => {
                          const newItems = [...quest.requirements.items];
                          newItems[index] = {
                            ...newItems[index],
                            amount: (newItems[index].amount || 1) + 1,
                          };
                          updateRequirements({ items: newItems });
                        }}
                        className="px-1.5 py-1 text-slate-300 hover:bg-slate-600 transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => {
                        const newItems = quest.requirements.items.filter(
                          (_, i) => i !== index
                        );
                        updateRequirements({ items: newItems });
                      }}
                      className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10  transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
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
