import { Trash2 } from "lucide-react";
import { GAME_ITEMS } from "../../../types";
import { motion } from "framer-motion";

export interface QuestItem {
  id: string;
  name: string;
  amount: number;
  quantity?: number;
}

interface ItemCardProps {
  item: QuestItem;
  onRemove: () => void;
}

export function ItemCard({ item, onRemove }: ItemCardProps) {
  const gameItem = GAME_ITEMS.find((gi) => gi.id === item.id);
  if (!gameItem) return null;

  return (
    <motion.div
      className="flex items-center justify-between p-2 bg-gradient-to-r from-slate-800/90 via-slate-800/70 to-slate-800/90 border border-slate-700/70 shadow-md hover:shadow-lg hover:border-slate-600/80 hover:from-slate-800/95 hover:to-slate-800/95 transition-all duration-200 sm"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.2 }}
      layout
    >
      <div className="flex items-center gap-2.5">
        <motion.div
          className="text-xl flex items-center justify-center w-9 h-9 bg-gradient-to-br from-slate-700/60 to-slate-800/60 border border-slate-600/40 shadow-inner"
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          {gameItem.emoji}
        </motion.div>
        <div className="min-w-0 flex-1">
          <div className="text-xs font-medium text-slate-100 truncate group-hover:text-white">
            {gameItem.name}
          </div>
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <span className="text-slate-500 text-[10px] truncate max-w-[180px]">
              {gameItem.description}
            </span>
          </div>
        </div>
      </div>
      <div className="flex-shrink-0 ml-2">
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="p-1.5 text-slate-400 hover:bg-red-500/20 hover:text-red-300 transition-all sm"
          title="Remove item"
          aria-label="Remove item"
          whileHover={{ scale: 1.2, color: "#f87171" }}
          whileTap={{ scale: 0.9 }}
        >
          <Trash2 className="w-3 h-3" />
        </motion.button>
      </div>
    </motion.div>
  );
}
