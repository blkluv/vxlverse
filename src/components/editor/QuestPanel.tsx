import { Quest } from "../../types";
import { QuestPanel as QuestPanelComponent } from "./quest";

interface QuestPanelProps {
  object: {
    quests?: Quest[];
  };
  onChange: (updates: Partial<{ quests?: Quest[] }>) => void;
}

export function QuestPanel(props: QuestPanelProps) {
  return <QuestPanelComponent {...props} />;
}
