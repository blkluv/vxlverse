import { Portal } from "../Portal";
import { useGameStore } from "../../stores/gameStore";

// Mock data for quests - replace with actual data from your game store
const availableQuests = [
  {
    id: "q1",
    title: "The Lost Artifact",
    description: "Find the ancient artifact hidden in the forest cave.",
    requirements: { level: 5 },
    rewards: { money: 100, xp: 200 },
  },
  {
    id: "q2",
    title: "Defeat the Bandits",
    description:
      "Clear the road of bandits that have been troubling travelers.",
    requirements: { level: 3 },
    rewards: { money: 75, xp: 150 },
  },
];
// Portal-based interaction modal
export function Quests() {
  const store = useGameStore();
  if (!store.activeNpc) return;
  return (
    <Portal>
      <div className="fixed left-0 top-0 w-screen md:items-end items-start   h-screen z-50 flex  pointer-events-none">
        <div
          className="overflow-hidden animate-fadeIn"
          style={{
            borderStyle: "solid",
            borderWidth: "3px",
            borderColor: "#92400e #78350f #78350f #92400e",
            backgroundColor: "#292524",
            imageRendering: "pixelated",
          }}
        >
          <div
            style={{
              backgroundColor: "#b45309",
              borderBottom: "2px solid #92400e",
              padding: "4px 8px",
            }}
          >
            <h4
              style={{
                color: "#fef3c7",
                fontSize: "11px",
                fontFamily: "monospace",
                fontWeight: "bold",
                textShadow: "1px 1px 0 #000",
              }}
            >
              AVAILABLE QUESTS
            </h4>
          </div>
          <div className="max-h-48 overflow-y-auto" style={{ padding: "2px" }}>
            {availableQuests.map((quest) => {
              // Check if player meets level requirement
              const meetsRequirement = true;

              return (
                <button
                  key={quest.id}
                  onClick={() => {}}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "6px 8px",
                    borderBottom: "2px solid #78350f",
                    backgroundColor: meetsRequirement
                      ? "transparent"
                      : "rgba(0,0,0,0.3)",
                    opacity: meetsRequirement ? 1 : 0.7,
                    cursor: meetsRequirement ? "pointer" : "not-allowed",
                    transition: "background-color 0.2s",
                    fontFamily: "monospace",
                    imageRendering: "pixelated",
                  }}
                  onMouseOver={(e) => {
                    if (meetsRequirement) {
                      e.currentTarget.style.backgroundColor = "#92400e";
                    }
                  }}
                  onMouseOut={(e) => {
                    if (meetsRequirement) {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <div>
                      <h5
                        style={{
                          fontSize: "11px",
                          fontWeight: "bold",
                          color: meetsRequirement ? "#fef3c7" : "#9ca3af",
                          textShadow: "1px 1px 0 #000",
                        }}
                      >
                        {quest.title}
                      </h5>
                      <p
                        style={{
                          color: "#9ca3af",
                          fontSize: "10px",
                          marginTop: "2px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: "150px",
                        }}
                      >
                        {quest.description}
                      </p>
                    </div>
                    <div
                      style={{
                        fontSize: "10px",
                        borderRadius: "4px",
                        padding: "2px 4px",
                        color: "white",
                        fontWeight: "bold",
                        whiteSpace: "nowrap",
                        backgroundColor: meetsRequirement
                          ? "#d97706"
                          : "#b91c1c",
                        textShadow: "1px 1px 0 #000",
                      }}
                    >
                      Lvl {quest.requirements?.level || 1}
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginTop: "6px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        fontSize: "10px",
                        color: "#fef3c7",
                      }}
                    >
                      <span style={{ marginRight: "2px" }}>💰</span>
                      {quest.rewards?.money || 0}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        fontSize: "10px",
                        color: "#bfdbfe",
                      }}
                    >
                      <span style={{ marginRight: "2px" }}>✨</span>
                      {quest.rewards?.xp || 0} XP
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </Portal>
  );
}
