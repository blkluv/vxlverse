import { Award, Coins, Package, Plus } from "lucide-react";
import { Quest } from "../../../types";
import { Input } from "../../UI/input";
import { ItemCard } from "./ItemCard";
import { AnimatePresence } from "framer-motion";

interface QuestRewardsProps {
  quest: Quest;
  updateQuest: (questId: string, updates: Partial<Quest>) => void;
  onAddItem: () => void;
  onIncrementItem: (itemId: string) => void;
  onRemoveItem: (itemId: string) => void;
}

export function QuestRewards({
  quest,
  updateQuest,
  onAddItem,
  onIncrementItem,
  onRemoveItem,
}: QuestRewardsProps) {
  return (
    <div className="mt-5 border-t border-slate-700/40 pt-4">
      <h3 className="text-xs font-semibold text-slate-200 mb-3 flex items-center gap-1.5">
        <Award className="w-3.5 h-3.5 text-green-400" />
        Quest Rewards
      </h3>

      <div className="grid grid-cols-3 gap-3">
        {/* Reward XP */}
        <div>
          <label
            htmlFor="quest-xp"
            className="text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5"
          >
            <Award className="w-3 h-3 text-purple-400" /> XP
          </label>
          <Input
            id="quest-xp"
            type="number"
            min="0"
            value={quest.rewards.xp}
            onChange={(e) =>
              updateQuest(quest.id, {
                rewards: {
                  ...quest.rewards,
                  xp: parseInt(e.target.value) || 0,
                },
              })
            }
            className="w-full px-3 py-1.5 bg-slate-800/30 border border-slate-700/80 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/40 transition-colors"
          />
        </div>

        {/* Reward Money */}
        <div>
          <label
            htmlFor="quest-reward-money"
            className="text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5"
          >
            <Coins className="w-3 h-3 text-amber-400" /> Money
          </label>
          <Input
            id="quest-reward-money"
            type="number"
            min="0"
            value={quest.rewards.money}
            onChange={(e) =>
              updateQuest(quest.id, {
                rewards: {
                  ...quest.rewards,
                  money: parseInt(e.target.value) || 0,
                },
              })
            }
            className="w-full px-3 py-1.5 bg-slate-800/30 border border-slate-700/80 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/40 transition-colors"
          />
        </div>

        {/* Reward Energy */}
        <div>
          <label
            htmlFor="quest-reward-energy"
            className="text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-3 h-3 text-blue-400"
            >
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>{" "}
            Energy
          </label>
          <Input
            id="quest-reward-energy"
            type="number"
            min="0"
            value={quest.rewards.energy}
            onChange={(e) =>
              updateQuest(quest.id, {
                rewards: {
                  ...quest.rewards,
                  energy: parseInt(e.target.value) || 0,
                },
              })
            }
            className="w-full px-3 py-1.5 bg-slate-800/30 border border-slate-700/80 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/40 transition-colors"
          />
        </div>

        {/* Reward Items */}
        <div className="col-span-3 mt-2">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <Package className="w-3 h-3 text-emerald-400" /> Reward Items
            </label>
            <button
              onClick={onAddItem}
              className="text-[10px] px-2 py-1 flex items-center gap-1 text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 transition-all "
            >
              <Plus className="w-3 h-3" /> Add Item
            </button>
          </div>

          <div className="space-y-1.5 max-h-40 overflow-y-auto custom-scrollbar pr-1">
            {quest.rewards.items?.length ? (
              quest.rewards.items.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onIncrement={() => onIncrementItem(item.id)}
                  onRemove={() => onRemoveItem(item.id)}
                />
              ))
            ) : (
              <div className="text-xs text-slate-400 italic p-2 bg-slate-800/30 border border-slate-700/50 ">
                No reward items
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
