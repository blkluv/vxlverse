import { AlignLeft, BookOpen, Type } from "lucide-react";
import { Quest } from "../../../types";
import { Input } from "../../UI/input";
import { Textarea } from "../../UI/textarea";

interface QuestStoryProps {
  quest: Quest;
  updateQuest: (questId: string, updates: Partial<Quest>) => void;
}

export function QuestStory({ quest, updateQuest }: QuestStoryProps) {
  return (
    <div className="space-y-4">
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
          onChange={(e) => updateQuest(quest.id, { title: e.target.value })}
          className="w-full px-3 py-1.5 bg-slate-800/30 border border-slate-700/80 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/40 transition-colors"
        />
      </div>
      <div>
        <label
          htmlFor="quest-description"
          className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5"
        >
          <AlignLeft className="w-3 h-3 text-teal-400" /> Description
        </label>
        <Textarea
          id="quest-description"
          value={quest.description}
          onChange={(e) =>
            updateQuest(quest.id, {
              description: e.target.value,
            })
          }
          className="w-full px-3 py-1.5 bg-slate-800/90 border border-slate-700/80 text-xs text-slate-100 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/40 transition-colors"
          rows={2}
        />
      </div>
      <div>
        <label
          htmlFor="quest-backstory"
          className="text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5"
        >
          <BookOpen className="w-3 h-3 text-purple-400" /> Backstory
        </label>
        <Textarea
          id="quest-backstory"
          value={quest.backstory}
          onChange={(e) =>
            updateQuest(quest.id, {
              backstory: e.target.value,
            })
          }
          className="w-full px-3 py-1.5 bg-slate-800/90 border border-slate-700/80 text-xs text-slate-100 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/40 transition-colors"
          rows={3}
        />
      </div>
    </div>
  );
}
