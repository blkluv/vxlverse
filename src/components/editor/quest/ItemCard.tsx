import { Plus, Trash2 } from "lucide-react";
import { GAME_ITEMS, Item } from "../../../types";

export interface QuestItem {
  id: string;
  name: string;
  amount: number;
  quantity?: number;
}

interface ItemCardProps {
  item: QuestItem;
  onIncrement: () => void;
  onRemove: () => void;
}

export function ItemCard({ item, onIncrement, onRemove }: ItemCardProps) {
  const gameItem = GAME_ITEMS.find((gi) => gi.id === item.id);
  if (!gameItem) return null;
  
  return (
    <div className="flex items-center justify-between p-2 bg-gradient-to-r from-slate-800/90 via-slate-800/70 to-slate-800/90 border border-slate-700/70 shadow-md hover:shadow-lg hover:border-slate-600/80 hover:from-slate-800/95 hover:to-slate-800/95 transition-all duration-200">
      <div className="flex items-center gap-2.5">
        <div className="text-xl flex items-center justify-center w-9 h-9 bg-gradient-to-br from-slate-700/60 to-slate-800/60 border border-slate-600/40 shadow-inner">
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
            <span className="text-slate-500 text-[10px] px-1.5 py-0.5 bg-slate-800/80 border border-slate-700/50">
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
          className="p-1.5 text-slate-400 hover:text-blue-300 hover:bg-blue-500/10 transition-all rounded-sm"
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
          className="p-1.5 text-slate-400 hover:bg-red-500/20 hover:text-red-300 transition-all rounded-sm"
          title="Remove item"
          aria-label="Remove item"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
