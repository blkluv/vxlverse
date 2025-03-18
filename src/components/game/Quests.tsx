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
    description: "Clear the road of bandits that have been troubling travelers.",
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
      <div className="fixed left-0 top-0 w-screen md:items-end items-start h-screen z-50 flex pointer-events-auto">
        <div
          className="overflow-hidden animate-fadeIn pointer-events-auto"
          style={{
            borderStyle: "solid",
            borderWidth: "2px",
            borderColor: "#4A4A4A",
            backgroundColor: "#2A2A2A",
            imageRendering: "pixelated",
            boxShadow: "2px 2px 0px 0px #000000",
            outline: "1px solid black",
          }}
        >
          <div
            style={{
              backgroundColor: "#2A2A2A",
              borderBottom: "2px solid #4A4A4A",
              padding: "4px 8px",
            }}
          >
            <h4
              style={{
                color: "#7FE4FF",
                fontSize: "11px",
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Available Quests
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
                    borderBottom: "2px solid #4A4A4A",
                    backgroundColor: meetsRequirement ? "transparent" : "rgba(0,0,0,0.3)",
                    opacity: meetsRequirement ? 1 : 0.7,
                    cursor: meetsRequirement ? "pointer" : "not-allowed",
                    transition: "background-color 0.2s",
                    imageRendering: "pixelated",
                  }}
                  onMouseOver={(e) => {
                    if (meetsRequirement) {
                      e.currentTarget.style.backgroundColor = "#3A3A3A";
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
                          color: meetsRequirement ? "#7FE4FF" : "#4A4A4A",
                        }}
                      >
                        {quest.title}
                      </h5>
                      <p
                        style={{
                          color: "#7FE4FF",
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
                        backgroundColor: meetsRequirement ? "#d97706" : "#b91c1c",
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
                        color: "#FFD700",
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
                        color: "#7FE4FF",
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
