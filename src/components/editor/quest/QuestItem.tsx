import { motion } from "framer-motion";
import { Edit3, Scroll, Trash2, X } from "lucide-react";
import { Quest } from "../../../types";

interface QuestItemProps {
  quest: Quest;
  isEditing: boolean;
  onToggleEdit: () => void;
  onRemove: () => void;
  children?: React.ReactNode;
}

export function QuestItem({
  quest,
  isEditing,
  onToggleEdit,
  onRemove,
  children,
}: QuestItemProps) {
  return (
    <div
      key={quest.id}
      className={`mb-1 border overflow-hidden shadow-md transition-all duration-200 ${
        isEditing
          ? "bg-gradient-to-br from-slate-800/95 via-slate-850/95 to-slate-900/98 border-blue-500/30 shadow-lg ring-1 ring-blue-500/10"
          : "bg-gradient-to-r from-slate-800/70 to-slate-800/80 hover:from-slate-800/80 hover:to-slate-800/90 border-slate-700/50 hover:border-slate-600/70"
      }`}
    >
      <div
        className="p-2.5 flex items-center justify-between cursor-pointer"
        onClick={onToggleEdit}
        role="button"
        tabIndex={0}
        aria-expanded={isEditing}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            onToggleEdit();
            e.preventDefault();
          }
        }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className={`p-1.5 flex items-center justify-center ${
              isEditing
                ? "bg-gradient-to-br from-blue-500/30 to-indigo-500/20 text-blue-300 shadow-sm"
                : "bg-slate-700/80 text-slate-300"
            }`}
          >
            <Scroll className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3
              className={`text-sm font-medium ${
                isEditing ? "text-blue-50" : "text-slate-100"
              }`}
            >
              {quest.title || "Untitled Quest"}
            </h3>
            {quest.status && (
              <div className="text-[11px] flex items-center gap-1.5 mt-0.5">
                <span
                  className={`inline-block w-2 h-2  ${
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
              onToggleEdit();
            }}
            className={`p-1.5 transition-all duration-200 ${
              isEditing
                ? "text-blue-300 hover:bg-blue-500/20 hover:text-blue-200"
                : "text-slate-400 hover:bg-slate-700/80 hover:text-slate-200"
            }`}
            title={isEditing ? "Close" : "Edit"}
            aria-label={isEditing ? "Close quest editor" : "Edit quest"}
          >
            {isEditing ? (
              <X className="w-3.5 h-3.5" />
            ) : (
              <Edit3 className="w-3.5 h-3.5" />
            )}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="p-1.5 text-slate-400 hover:bg-red-500/20 hover:text-red-300 transition-all duration-200"
            title="Delete quest"
            aria-label="Delete quest"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Quest Details */}
      {isEditing && (
        <div>
          <div className="p-3 bg-gradient-to-b from-slate-900/90 to-slate-900/95 backdrop-blur-sm">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
